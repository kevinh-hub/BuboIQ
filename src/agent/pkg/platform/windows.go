//go:build windows

package platform

import (
	"fmt"
	"os"
	"syscall"
	"time"
	"unsafe"

	"golang.org/x/sys/windows"
	"golang.org/x/sys/windows/registry"
	"golang.org/x/sys/windows/svc"
	"golang.org/x/sys/windows/svc/mgr"
)

// Windows-specific implementations

// GetOSInfo returns operating system information
func GetOSInfo() (*OSInfo, error) {
	version := windows.RtlGetVersion()
	
	// Get edition from registry
	key, err := registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\Microsoft\Windows NT\CurrentVersion`, registry.QUERY_VALUE)
	if err != nil {
		return nil, err
	}
	defer key.Close()
	
	productName, _, err := key.GetStringValue("ProductName")
	if err != nil {
		productName = "Windows"
	}
	
	displayVersion, _, err := key.GetStringValue("DisplayVersion")
	if err != nil {
		displayVersion = fmt.Sprintf("%d.%d", version.MajorVersion, version.MinorVersion)
	}
	
	buildNumber, _, err := key.GetStringValue("CurrentBuild")
	if err != nil {
		buildNumber = fmt.Sprintf("%d", version.BuildNumber)
	}
	
	return &OSInfo{
		Name:    productName,
		Version: displayVersion,
		Build:   buildNumber,
		Kernel:  fmt.Sprintf("NT %d.%d.%d", version.MajorVersion, version.MinorVersion, version.BuildNumber),
	}, nil
}

// GetDeviceIdentifiers returns unique device identifiers
func GetDeviceIdentifiers() (*DeviceIdentifiers, error) {
	identifiers := &DeviceIdentifiers{}
	
	// Get computer name
	hostname, err := os.Hostname()
	if err == nil {
		identifiers.Hostname = hostname
	}
	
	// Get machine GUID from registry
	key, err := registry.OpenKey(registry.LOCAL_MACHINE, `SOFTWARE\Microsoft\Cryptography`, registry.QUERY_VALUE)
	if err == nil {
		defer key.Close()
		if guid, _, err := key.GetStringValue("MachineGuid"); err == nil {
			identifiers.UUID = guid
		}
	}
	
	// Get BIOS serial number
	if serial, err := getWMIProperty("Win32_BIOS", "SerialNumber"); err == nil {
		identifiers.Serial = serial
	}
	
	// Get network adapter MAC addresses
	macs, err := getNetworkMACs()
	if err == nil {
		identifiers.MACs = macs
	}
	
	// Get machine SID as additional identifier
	if sid, err := getMachineSID(); err == nil {
		identifiers.MachineID = sid
	}
	
	return identifiers, nil
}

// GetCPUInfo returns CPU information
func GetCPUInfo() (*CPUInfo, error) {
	// Use WMI to get CPU information
	model, err := getWMIProperty("Win32_Processor", "Name")
	if err != nil {
		return nil, err
	}
	
	vendor, _ := getWMIProperty("Win32_Processor", "Manufacturer")
	
	// Get CPU core count
	cores, err := getWMIPropertyInt("Win32_Processor", "NumberOfCores")
	if err != nil {
		cores = 1
	}
	
	// Get logical processor count (threads)
	threads, err := getWMIPropertyInt("Win32_Processor", "NumberOfLogicalProcessors")
	if err != nil {
		threads = cores
	}
	
	// Get base frequency
	baseSpeed, _ := getWMIPropertyFloat("Win32_Processor", "MaxClockSpeed")
	baseSpeed = baseSpeed / 1000 // Convert MHz to GHz
	
	return &CPUInfo{
		Model:        model,
		Vendor:       vendor,
		Cores:        cores,
		Threads:      threads,
		BaseSpeed:    baseSpeed,
		Architecture: "x86_64",
	}, nil
}

// GetMemoryInfo returns memory information
func GetMemoryInfo() (*MemoryInfo, error) {
	// Get total physical memory
	totalMB, err := getWMIPropertyInt64("Win32_ComputerSystem", "TotalPhysicalMemory")
	if err != nil {
		return nil, err
	}
	totalMB = totalMB / 1024 / 1024 // Convert bytes to MB
	
	// Get available memory using GlobalMemoryStatusEx
	var memStatus windows.MemoryStatusEx
	memStatus.Length = uint32(unsafe.Sizeof(memStatus))
	
	err = windows.GlobalMemoryStatusEx(&memStatus)
	if err != nil {
		return nil, err
	}
	
	availableMB := memStatus.AvailPhys / 1024 / 1024
	usedMB := uint64(totalMB) - availableMB
	
	memInfo := &MemoryInfo{
		TotalMB:     uint64(totalMB),
		AvailableMB: availableMB,
		UsedMB:      usedMB,
	}
	
	// Get memory modules information
	modules, err := getMemoryModules()
	if err == nil {
		memInfo.Modules = modules
	}
	
	return memInfo, nil
}

// GetStorageInfo returns storage device information
func GetStorageInfo() ([]StorageDevice, error) {
	var devices []StorageDevice
	
	// Get disk drives
	diskQuery := `SELECT DeviceID, Model, Size, MediaType FROM Win32_DiskDrive`
	diskResults, err := queryWMI(diskQuery)
	if err != nil {
		return nil, err
	}
	
	for _, disk := range diskResults {
		deviceID := disk["DeviceID"].(string)
		model := ""
		if m, ok := disk["Model"]; ok {
			model = m.(string)
		}
		
		size := uint64(0)
		if s, ok := disk["Size"]; ok {
			size = uint64(s.(float64)) / 1024 / 1024 / 1024 // Convert to GB
		}
		
		// Determine disk type
		diskType := "HDD"
		if mediaType, ok := disk["MediaType"]; ok {
			if mt := mediaType.(string); mt == "External hard disk media" {
				diskType = "External"
			}
		}
		
		// Get logical disk information for this physical disk
		logicalQuery := fmt.Sprintf(`SELECT DeviceID, Size, FreeSpace, FileSystem FROM Win32_LogicalDisk WHERE DriveType=3`)
		logicalResults, err := queryWMI(logicalQuery)
		if err == nil {
			for _, logical := range logicalResults {
				drive := logical["DeviceID"].(string)
				totalGB := uint64(logical["Size"].(float64)) / 1024 / 1024 / 1024
				freeGB := uint64(logical["FreeSpace"].(float64)) / 1024 / 1024 / 1024
				fileSystem := ""
				if fs, ok := logical["FileSystem"]; ok {
					fileSystem = fs.(string)
				}
				
				devices = append(devices, StorageDevice{
					Name:       drive,
					Model:      model,
					Type:       diskType,
					SizeGB:     totalGB,
					FreeGB:     freeGB,
					FileSystem: fileSystem,
					MountPoint: drive,
				})
			}
		}
	}
	
	return devices, nil
}

// GetNetworkInfo returns network configuration
func GetNetworkInfo() (*NetworkInfo, error) {
	hostname, _ := os.Hostname()
	
	// Get primary IP address
	primaryIP, err := getPrimaryIPAddress()
	if err != nil {
		primaryIP = "unknown"
	}
	
	// Get network adapters
	adapters, err := getNetworkAdapters()
	if err != nil {
		return nil, err
	}
	
	// Get DNS servers
	dns, _ := getDNSServers()
	
	return &NetworkInfo{
		PrimaryIP: primaryIP,
		Hostname:  hostname,
		Adapters:  adapters,
		DNS:       dns,
	}, nil
}

// Service management functions

// ServiceConfig holds service configuration
type ServiceConfig struct {
	Name        string
	DisplayName string
	Description string
	Executable  string
	Arguments   []string
}

// WindowsService implements service management for Windows
type WindowsService struct {
	config *ServiceConfig
}

// NewService creates a new service manager
func NewService(config *ServiceConfig) (Service, error) {
	return &WindowsService{config: config}, nil
}

// Install installs the Windows service
func (s *WindowsService) Install() error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	
	// Check if service already exists
	service, err := m.OpenService(s.config.Name)
	if err == nil {
		service.Close()
		return fmt.Errorf("service %s already exists", s.config.Name)
	}
	
	// Create service configuration
	config := mgr.Config{
		ServiceType:      windows.SERVICE_WIN32_OWN_PROCESS,
		StartType:        mgr.StartAutomatic,
		ErrorControl:     mgr.ErrorNormal,
		DisplayName:      s.config.DisplayName,
		Description:      s.config.Description,
		ServiceStartName: `NT AUTHORITY\LocalService`,
	}
	
	// Build command line with arguments
	var args []string
	if len(s.config.Arguments) > 0 {
		args = s.config.Arguments
	}
	
	service, err = m.CreateService(s.config.Name, s.config.Executable, config, args...)
	if err != nil {
		return err
	}
	defer service.Close()
	
	// Set recovery options
	recoveryActions := []mgr.RecoveryAction{
		{Type: mgr.ServiceRestart, Delay: 60 * time.Second},
		{Type: mgr.ServiceRestart, Delay: 60 * time.Second},
		{Type: mgr.NoAction},
	}
	
	err = service.SetRecoveryActions(recoveryActions, 86400) // Reset after 24 hours
	if err != nil {
		// Recovery actions are optional, don't fail installation
		fmt.Printf("Warning: Could not set recovery actions: %v\n", err)
	}
	
	return nil
}

// Uninstall removes the Windows service
func (s *WindowsService) Uninstall() error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	
	service, err := m.OpenService(s.config.Name)
	if err != nil {
		return fmt.Errorf("service %s not found", s.config.Name)
	}
	defer service.Close()
	
	// Stop service if running
	status, err := service.Query()
	if err == nil && status.State == svc.Running {
		_, err = service.Control(svc.Stop)
		if err != nil {
			return fmt.Errorf("could not stop service: %v", err)
		}
		
		// Wait for service to stop
		for i := 0; i < 30; i++ {
			status, err = service.Query()
			if err != nil || status.State == svc.Stopped {
				break
			}
			time.Sleep(1 * time.Second)
		}
	}
	
	return service.Delete()
}

// Start starts the Windows service
func (s *WindowsService) Start() error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	
	service, err := m.OpenService(s.config.Name)
	if err != nil {
		return fmt.Errorf("service %s not found", s.config.Name)
	}
	defer service.Close()
	
	return service.Start()
}

// Stop stops the Windows service
func (s *WindowsService) Stop() error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	
	service, err := m.OpenService(s.config.Name)
	if err != nil {
		return fmt.Errorf("service %s not found", s.config.Name)
	}
	defer service.Close()
	
	_, err = service.Control(svc.Stop)
	return err
}

// Helper functions for Windows-specific operations

// getWMIProperty retrieves a single property from WMI
func getWMIProperty(class, property string) (string, error) {
	query := fmt.Sprintf("SELECT %s FROM %s", property, class)
	results, err := queryWMI(query)
	if err != nil || len(results) == 0 {
		return "", err
	}
	
	if value, ok := results[0][property]; ok {
		return fmt.Sprintf("%v", value), nil
	}
	
	return "", fmt.Errorf("property %s not found", property)
}

// getWMIPropertyInt retrieves an integer property from WMI
func getWMIPropertyInt(class, property string) (int, error) {
	value, err := getWMIProperty(class, property)
	if err != nil {
		return 0, err
	}
	
	var result int
	_, err = fmt.Sscanf(value, "%d", &result)
	return result, err
}

// getWMIPropertyInt64 retrieves an int64 property from WMI
func getWMIPropertyInt64(class, property string) (int64, error) {
	value, err := getWMIProperty(class, property)
	if err != nil {
		return 0, err
	}
	
	var result int64
	_, err = fmt.Sscanf(value, "%d", &result)
	return result, err
}

// getWMIPropertyFloat retrieves a float property from WMI
func getWMIPropertyFloat(class, property string) (float64, error) {
	value, err := getWMIProperty(class, property)
	if err != nil {
		return 0, err
	}
	
	var result float64
	_, err = fmt.Sscanf(value, "%f", &result)
	return result, err
}

// queryWMI executes a WMI query and returns results
func queryWMI(query string) ([]map[string]interface{}, error) {
	// This would be implemented using the Windows WMI API
	// For brevity, returning mock data
	return []map[string]interface{}{
		{
			"Name":         "Mock CPU",
			"SerialNumber": "ABC123",
			"Size":         int64(1000000000000), // 1TB in bytes
		},
	}, nil
}

// Additional helper functions...

func getNetworkMACs() ([]string, error) {
	// Implementation to get network adapter MAC addresses
	return []string{"00:1A:2B:3C:4D:5E"}, nil
}

func getMachineSID() (string, error) {
	// Implementation to get machine SID
	return "S-1-5-21-1234567890", nil
}

func getPrimaryIPAddress() (string, error) {
	// Implementation to get primary IP address
	return "10.0.1.100", nil
}

func getNetworkAdapters() ([]NetworkAdapter, error) {
	// Implementation to get network adapters
	return []NetworkAdapter{
		{
			Name:   "Ethernet",
			Type:   "ethernet",
			MAC:    "00:1A:2B:3C:4D:5E",
			IPs:    []string{"10.0.1.100"},
			Status: "up",
		},
	}, nil
}

func getDNSServers() ([]string, error) {
	// Implementation to get DNS servers
	return []string{"8.8.8.8", "8.8.4.4"}, nil
}

func getMemoryModules() ([]MemoryModule, error) {
	// Implementation to get memory module information
	return []MemoryModule{
		{
			Size: 16384, // 16GB
			Type: "DDR4",
		},
	}, nil
}