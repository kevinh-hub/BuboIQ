package collector

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"runtime"
	"sync"
	"time"

	"github.com/buboiq/agent/pkg/platform"
)

// Config holds collector configuration
type Config struct {
	EnableSoftwareInventory bool
	EnableNetworkDiscovery  bool
	ScanInterval           time.Duration
	DeltaEnabled           bool
}

// Collector manages device inventory collection
type Collector struct {
	config    *Config
	mu        sync.RWMutex
	lastHash  string
	stopCh    chan struct{}
	wg        sync.WaitGroup
}

// DeviceInventory represents complete device information
type DeviceInventory struct {
	// Basic device information
	Hostname     string               `json:"hostname"`
	Platform     string               `json:"platform"`
	OS           OSInfo               `json:"os"`
	Identifiers  DeviceIdentifiers    `json:"identifiers"`
	
	// Hardware information
	Hardware     HardwareInfo         `json:"hardware"`
	Storage      []StorageDevice      `json:"storage"`
	Network      NetworkInfo          `json:"network"`
	
	// Software information (optional)
	Software     []SoftwarePackage    `json:"software,omitempty"`
	
	// Metadata
	CollectedAt  time.Time            `json:"collected_at"`
	AgentVersion string               `json:"agent_version"`
	Hash         string               `json:"hash"`
	DeltaOf      string               `json:"delta_of,omitempty"`
}

// OSInfo contains operating system details
type OSInfo struct {
	Name         string `json:"name"`
	Version      string `json:"version"`
	Build        string `json:"build,omitempty"`
	Architecture string `json:"architecture"`
	Kernel       string `json:"kernel,omitempty"`
}

// DeviceIdentifiers contains unique device identifiers
type DeviceIdentifiers struct {
	Serial       string   `json:"serial,omitempty"`
	UUID         string   `json:"uuid,omitempty"`
	MACs         []string `json:"macs"`
	Hostname     string   `json:"hostname"`
	MachineID    string   `json:"machine_id,omitempty"`
}

// HardwareInfo contains hardware specifications
type HardwareInfo struct {
	CPU          CPUInfo     `json:"cpu"`
	Memory       MemoryInfo  `json:"memory"`
	GPU          []GPUInfo   `json:"gpu,omitempty"`
	Motherboard  BoardInfo   `json:"motherboard,omitempty"`
	BIOS         BIOSInfo    `json:"bios,omitempty"`
	Battery      *BatteryInfo `json:"battery,omitempty"`
}

// CPUInfo contains CPU details
type CPUInfo struct {
	Model        string  `json:"model"`
	Vendor       string  `json:"vendor"`
	Cores        int     `json:"cores"`
	Threads      int     `json:"threads"`
	BaseSpeed    float64 `json:"base_speed_ghz"`
	MaxSpeed     float64 `json:"max_speed_ghz,omitempty"`
	Architecture string  `json:"architecture"`
	Features     []string `json:"features,omitempty"`
}

// MemoryInfo contains memory details
type MemoryInfo struct {
	TotalMB      uint64        `json:"total_mb"`
	AvailableMB  uint64        `json:"available_mb"`
	UsedMB       uint64        `json:"used_mb"`
	Modules      []MemoryModule `json:"modules,omitempty"`
}

// MemoryModule represents a memory stick
type MemoryModule struct {
	Size         uint64 `json:"size_mb"`
	Type         string `json:"type"`
	Speed        int    `json:"speed_mhz,omitempty"`
	Manufacturer string `json:"manufacturer,omitempty"`
	PartNumber   string `json:"part_number,omitempty"`
}

// GPUInfo contains graphics card details
type GPUInfo struct {
	Name         string `json:"name"`
	Vendor       string `json:"vendor"`
	Memory       uint64 `json:"memory_mb,omitempty"`
	Driver       string `json:"driver,omitempty"`
	DriverDate   string `json:"driver_date,omitempty"`
}

// BoardInfo contains motherboard details
type BoardInfo struct {
	Manufacturer string `json:"manufacturer,omitempty"`
	Product      string `json:"product,omitempty"`
	Version      string `json:"version,omitempty"`
	Serial       string `json:"serial,omitempty"`
}

// BIOSInfo contains BIOS/UEFI details
type BIOSInfo struct {
	Vendor       string `json:"vendor,omitempty"`
	Version      string `json:"version,omitempty"`
	Date         string `json:"date,omitempty"`
	UEFI         bool   `json:"uefi"`
}

// BatteryInfo contains battery details
type BatteryInfo struct {
	Present      bool    `json:"present"`
	Percentage   float64 `json:"percentage,omitempty"`
	Status       string  `json:"status,omitempty"`
	Technology   string  `json:"technology,omitempty"`
	Capacity     int     `json:"capacity_mwh,omitempty"`
	Voltage      float64 `json:"voltage,omitempty"`
}

// StorageDevice represents a storage device
type StorageDevice struct {
	Name         string `json:"name"`
	Model        string `json:"model,omitempty"`
	Type         string `json:"type"` // SSD, HDD, NVMe, etc.
	SizeGB       uint64 `json:"size_gb"`
	FreeGB       uint64 `json:"free_gb"`
	FileSystem   string `json:"filesystem,omitempty"`
	MountPoint   string `json:"mount_point,omitempty"`
	Serial       string `json:"serial,omitempty"`
	Health       string `json:"health,omitempty"`
}

// NetworkInfo contains network configuration
type NetworkInfo struct {
	PrimaryIP    string           `json:"primary_ip"`
	Hostname     string           `json:"hostname"`
	Domain       string           `json:"domain,omitempty"`
	Adapters     []NetworkAdapter `json:"adapters"`
	Routes       []Route          `json:"routes,omitempty"`
	DNS          []string         `json:"dns,omitempty"`
}

// NetworkAdapter represents a network interface
type NetworkAdapter struct {
	Name         string   `json:"name"`
	Type         string   `json:"type"` // ethernet, wifi, loopback, etc.
	MAC          string   `json:"mac"`
	IPs          []string `json:"ips"`
	Speed        uint64   `json:"speed_mbps,omitempty"`
	Status       string   `json:"status"` // up, down, unknown
	WiFi         *WiFiInfo `json:"wifi,omitempty"`
}

// WiFiInfo contains WiFi-specific information
type WiFiInfo struct {
	SSID         string `json:"ssid,omitempty"`
	BSSID        string `json:"bssid,omitempty"`
	Security     string `json:"security,omitempty"`
	Signal       int    `json:"signal_dbm,omitempty"`
	Channel      int    `json:"channel,omitempty"`
	Frequency    int    `json:"frequency_mhz,omitempty"`
}

// Route represents a network route
type Route struct {
	Destination  string `json:"destination"`
	Gateway      string `json:"gateway"`
	Interface    string `json:"interface"`
	Metric       int    `json:"metric,omitempty"`
}

// SoftwarePackage represents installed software
type SoftwarePackage struct {
	Name         string    `json:"name"`
	Version      string    `json:"version"`
	Vendor       string    `json:"vendor,omitempty"`
	Category     string    `json:"category,omitempty"`
	InstallDate  *time.Time `json:"install_date,omitempty"`
	Size         uint64    `json:"size_bytes,omitempty"`
	Signed       *bool     `json:"signed,omitempty"`
	Source       string    `json:"source,omitempty"` // package manager, installer, etc.
}

// NewCollector creates a new device collector
func NewCollector(cfg *Config) (*Collector, error) {
	return &Collector{
		config: cfg,
		stopCh: make(chan struct{}),
	}, nil
}

// Start begins the collector
func (c *Collector) Start(ctx context.Context) error {
	log.Println("📊 Starting device collector...")
	
	// Perform initial collection
	_, err := c.CollectInventory(ctx)
	if err != nil {
		log.Printf("⚠️  Initial inventory collection failed: %v", err)
	}
	
	return nil
}

// Stop stops the collector
func (c *Collector) Stop(ctx context.Context) error {
	log.Println("⏹️  Stopping device collector...")
	close(c.stopCh)
	c.wg.Wait()
	return nil
}

// CollectInventory performs a complete device inventory collection
func (c *Collector) CollectInventory(ctx context.Context) (*DeviceInventory, error) {
	log.Println("🔍 Collecting device inventory...")
	
	start := time.Now()
	defer func() {
		log.Printf("📊 Inventory collection completed in %v", time.Since(start))
	}()

	inventory := &DeviceInventory{
		CollectedAt: time.Now(),
	}

	// Collect basic device info
	if err := c.collectBasicInfo(inventory); err != nil {
		return nil, fmt.Errorf("failed to collect basic info: %w", err)
	}

	// Collect hardware info
	if err := c.collectHardwareInfo(inventory); err != nil {
		log.Printf("⚠️  Failed to collect hardware info: %v", err)
	}

	// Collect storage info
	if err := c.collectStorageInfo(inventory); err != nil {
		log.Printf("⚠️  Failed to collect storage info: %v", err)
	}

	// Collect network info
	if err := c.collectNetworkInfo(inventory); err != nil {
		log.Printf("⚠️  Failed to collect network info: %v", err)
	}

	// Collect software inventory (if enabled)
	if c.config.EnableSoftwareInventory {
		if err := c.collectSoftwareInfo(inventory); err != nil {
			log.Printf("⚠️  Failed to collect software info: %v", err)
		}
	}

	// Calculate hash and check for changes
	if err := c.calculateHash(inventory); err != nil {
		return nil, fmt.Errorf("failed to calculate hash: %w", err)
	}

	// Set delta reference if enabled
	if c.config.DeltaEnabled && c.lastHash != "" && c.lastHash != inventory.Hash {
		inventory.DeltaOf = c.lastHash
	}

	c.mu.Lock()
	c.lastHash = inventory.Hash
	c.mu.Unlock()

	return inventory, nil
}

// collectBasicInfo collects basic device information
func (c *Collector) collectBasicInfo(inventory *DeviceInventory) error {
	// Get hostname
	hostname, err := platform.GetHostname()
	if err != nil {
		return fmt.Errorf("failed to get hostname: %w", err)
	}
	inventory.Hostname = hostname

	// Get platform
	inventory.Platform = runtime.GOOS

	// Get OS info
	osInfo, err := platform.GetOSInfo()
	if err != nil {
		return fmt.Errorf("failed to get OS info: %w", err)
	}
	inventory.OS = OSInfo{
		Name:         osInfo.Name,
		Version:      osInfo.Version,
		Build:        osInfo.Build,
		Architecture: runtime.GOARCH,
		Kernel:       osInfo.Kernel,
	}

	// Get device identifiers
	identifiers, err := platform.GetDeviceIdentifiers()
	if err != nil {
		return fmt.Errorf("failed to get device identifiers: %w", err)
	}
	inventory.Identifiers = DeviceIdentifiers{
		Serial:    identifiers.Serial,
		UUID:      identifiers.UUID,
		MACs:      identifiers.MACs,
		Hostname:  hostname,
		MachineID: identifiers.MachineID,
	}

	return nil
}

// collectHardwareInfo collects hardware information
func (c *Collector) collectHardwareInfo(inventory *DeviceInventory) error {
	// Get CPU info
	cpuInfo, err := platform.GetCPUInfo()
	if err != nil {
		return fmt.Errorf("failed to get CPU info: %w", err)
	}
	
	inventory.Hardware.CPU = CPUInfo{
		Model:        cpuInfo.Model,
		Vendor:       cpuInfo.Vendor,
		Cores:        cpuInfo.Cores,
		Threads:      cpuInfo.Threads,
		BaseSpeed:    cpuInfo.BaseSpeed,
		MaxSpeed:     cpuInfo.MaxSpeed,
		Architecture: cpuInfo.Architecture,
		Features:     cpuInfo.Features,
	}

	// Get memory info
	memInfo, err := platform.GetMemoryInfo()
	if err != nil {
		return fmt.Errorf("failed to get memory info: %w", err)
	}
	
	inventory.Hardware.Memory = MemoryInfo{
		TotalMB:     memInfo.TotalMB,
		AvailableMB: memInfo.AvailableMB,
		UsedMB:      memInfo.UsedMB,
	}

	// Convert memory modules
	for _, module := range memInfo.Modules {
		inventory.Hardware.Memory.Modules = append(inventory.Hardware.Memory.Modules, MemoryModule{
			Size:         module.Size,
			Type:         module.Type,
			Speed:        module.Speed,
			Manufacturer: module.Manufacturer,
			PartNumber:   module.PartNumber,
		})
	}

	// Get GPU info
	gpuInfo, err := platform.GetGPUInfo()
	if err == nil {
		for _, gpu := range gpuInfo {
			inventory.Hardware.GPU = append(inventory.Hardware.GPU, GPUInfo{
				Name:       gpu.Name,
				Vendor:     gpu.Vendor,
				Memory:     gpu.Memory,
				Driver:     gpu.Driver,
				DriverDate: gpu.DriverDate,
			})
		}
	}

	// Get motherboard info
	boardInfo, err := platform.GetBoardInfo()
	if err == nil {
		inventory.Hardware.Motherboard = BoardInfo{
			Manufacturer: boardInfo.Manufacturer,
			Product:      boardInfo.Product,
			Version:      boardInfo.Version,
			Serial:       boardInfo.Serial,
		}
	}

	// Get BIOS info
	biosInfo, err := platform.GetBIOSInfo()
	if err == nil {
		inventory.Hardware.BIOS = BIOSInfo{
			Vendor:  biosInfo.Vendor,
			Version: biosInfo.Version,
			Date:    biosInfo.Date,
			UEFI:    biosInfo.UEFI,
		}
	}

	// Get battery info (for laptops/mobile devices)
	batteryInfo, err := platform.GetBatteryInfo()
	if err == nil && batteryInfo.Present {
		inventory.Hardware.Battery = &BatteryInfo{
			Present:    batteryInfo.Present,
			Percentage: batteryInfo.Percentage,
			Status:     batteryInfo.Status,
			Technology: batteryInfo.Technology,
			Capacity:   batteryInfo.Capacity,
			Voltage:    batteryInfo.Voltage,
		}
	}

	return nil
}

// collectStorageInfo collects storage device information
func (c *Collector) collectStorageInfo(inventory *DeviceInventory) error {
	storageDevices, err := platform.GetStorageInfo()
	if err != nil {
		return fmt.Errorf("failed to get storage info: %w", err)
	}

	for _, device := range storageDevices {
		inventory.Storage = append(inventory.Storage, StorageDevice{
			Name:       device.Name,
			Model:      device.Model,
			Type:       device.Type,
			SizeGB:     device.SizeGB,
			FreeGB:     device.FreeGB,
			FileSystem: device.FileSystem,
			MountPoint: device.MountPoint,
			Serial:     device.Serial,
			Health:     device.Health,
		})
	}

	return nil
}

// collectNetworkInfo collects network configuration
func (c *Collector) collectNetworkInfo(inventory *DeviceInventory) error {
	networkInfo, err := platform.GetNetworkInfo()
	if err != nil {
		return fmt.Errorf("failed to get network info: %w", err)
	}

	inventory.Network = NetworkInfo{
		PrimaryIP: networkInfo.PrimaryIP,
		Hostname:  networkInfo.Hostname,
		Domain:    networkInfo.Domain,
		DNS:       networkInfo.DNS,
	}

	// Convert network adapters
	for _, adapter := range networkInfo.Adapters {
		netAdapter := NetworkAdapter{
			Name:   adapter.Name,
			Type:   adapter.Type,
			MAC:    adapter.MAC,
			IPs:    adapter.IPs,
			Speed:  adapter.Speed,
			Status: adapter.Status,
		}

		// Convert WiFi info if present
		if adapter.WiFi != nil {
			netAdapter.WiFi = &WiFiInfo{
				SSID:      adapter.WiFi.SSID,
				BSSID:     adapter.WiFi.BSSID,
				Security:  adapter.WiFi.Security,
				Signal:    adapter.WiFi.Signal,
				Channel:   adapter.WiFi.Channel,
				Frequency: adapter.WiFi.Frequency,
			}
		}

		inventory.Network.Adapters = append(inventory.Network.Adapters, netAdapter)
	}

	// Convert routes
	for _, route := range networkInfo.Routes {
		inventory.Network.Routes = append(inventory.Network.Routes, Route{
			Destination: route.Destination,
			Gateway:     route.Gateway,
			Interface:   route.Interface,
			Metric:      route.Metric,
		})
	}

	return nil
}

// collectSoftwareInfo collects installed software inventory
func (c *Collector) collectSoftwareInfo(inventory *DeviceInventory) error {
	log.Println("📦 Collecting software inventory...")
	
	software, err := platform.GetInstalledSoftware()
	if err != nil {
		return fmt.Errorf("failed to get installed software: %w", err)
	}

	for _, pkg := range software {
		softwarePkg := SoftwarePackage{
			Name:     pkg.Name,
			Version:  pkg.Version,
			Vendor:   pkg.Vendor,
			Category: pkg.Category,
			Size:     pkg.Size,
			Source:   pkg.Source,
		}

		// Convert install date
		if pkg.InstallDate != nil {
			softwarePkg.InstallDate = pkg.InstallDate
		}

		// Convert signed status
		if pkg.Signed != nil {
			softwarePkg.Signed = pkg.Signed
		}

		inventory.Software = append(inventory.Software, softwarePkg)
	}

	log.Printf("📦 Found %d installed software packages", len(inventory.Software))
	return nil
}

// calculateHash calculates a hash of the inventory for change detection
func (c *Collector) calculateHash(inventory *DeviceInventory) error {
	// Create a copy without hash and timestamp for hashing
	hashData := *inventory
	hashData.Hash = ""
	hashData.CollectedAt = time.Time{}
	hashData.DeltaOf = ""

	// Marshal to JSON for consistent hashing
	data, err := json.Marshal(hashData)
	if err != nil {
		return fmt.Errorf("failed to marshal inventory for hashing: %w", err)
	}

	// Calculate SHA256 hash
	hash := sha256.Sum256(data)
	inventory.Hash = hex.EncodeToString(hash[:])

	return nil
}