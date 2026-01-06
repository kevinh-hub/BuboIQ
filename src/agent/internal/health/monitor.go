package health

import (
	"context"
	"log"
	"runtime"
	"sync"
	"time"

	"github.com/buboiq/agent/pkg/platform"
)

// Config holds health monitor configuration
type Config struct {
	MetricsInterval   time.Duration
	AlertThresholds   *Thresholds
	EnablePredictive  bool
}

// Thresholds defines alert thresholds for various metrics
type Thresholds struct {
	CPUPercent     float64 `json:"cpu_percent"`
	MemoryPercent  float64 `json:"memory_percent"`
	DiskPercent    float64 `json:"disk_percent"`
	TempCelsius    float64 `json:"temp_celsius"`
	BatteryPercent float64 `json:"battery_percent"`
}

// Monitor manages device health monitoring
type Monitor struct {
	config    *Config
	mu        sync.RWMutex
	metrics   *Metrics
	alerts    []Alert
	stopCh    chan struct{}
	wg        sync.WaitGroup
}

// Metrics represents current device health metrics
type Metrics struct {
	// System metrics
	CPU          CPUMetrics    `json:"cpu"`
	Memory       MemoryMetrics `json:"memory"`
	Disk         []DiskMetrics `json:"disk"`
	Network      NetworkMetrics `json:"network"`
	
	// Hardware metrics
	Temperature  []TempSensor  `json:"temperature,omitempty"`
	Battery      *BatteryMetrics `json:"battery,omitempty"`
	
	// System state
	Uptime       time.Duration `json:"uptime"`
	LoadAverage  []float64     `json:"load_average"`
	ProcessCount int           `json:"process_count"`
	
	// Health scores
	OverallHealth int          `json:"overall_health"`
	ComponentHealth map[string]int `json:"component_health"`
	
	// Metadata
	CollectedAt  time.Time     `json:"collected_at"`
	AgentUptime  time.Duration `json:"agent_uptime"`
}

// CPUMetrics contains CPU usage information
type CPUMetrics struct {
	UsagePercent    float64   `json:"usage_percent"`
	CoreUsage       []float64 `json:"core_usage"`
	UserPercent     float64   `json:"user_percent"`
	SystemPercent   float64   `json:"system_percent"`
	IdlePercent     float64   `json:"idle_percent"`
	IOWaitPercent   float64   `json:"iowait_percent"`
	FrequencyMHz    float64   `json:"frequency_mhz"`
	ThrottledPercent float64  `json:"throttled_percent,omitempty"`
}

// MemoryMetrics contains memory usage information
type MemoryMetrics struct {
	TotalMB      uint64  `json:"total_mb"`
	UsedMB       uint64  `json:"used_mb"`
	FreeMB       uint64  `json:"free_mb"`
	AvailableMB  uint64  `json:"available_mb"`
	CachedMB     uint64  `json:"cached_mb"`
	BuffersMB    uint64  `json:"buffers_mb"`
	UsagePercent float64 `json:"usage_percent"`
	
	// Swap information
	SwapTotalMB   uint64  `json:"swap_total_mb"`
	SwapUsedMB    uint64  `json:"swap_used_mb"`
	SwapPercent   float64 `json:"swap_percent"`
}

// DiskMetrics contains disk usage information
type DiskMetrics struct {
	Device       string  `json:"device"`
	MountPoint   string  `json:"mount_point"`
	FileSystem   string  `json:"filesystem"`
	TotalGB      uint64  `json:"total_gb"`
	UsedGB       uint64  `json:"used_gb"`
	FreeGB       uint64  `json:"free_gb"`
	UsagePercent float64 `json:"usage_percent"`
	
	// I/O metrics
	ReadBytesPerSec  uint64 `json:"read_bytes_per_sec"`
	WriteBytesPerSec uint64 `json:"write_bytes_per_sec"`
	ReadOpsPerSec    uint64 `json:"read_ops_per_sec"`
	WriteOpsPerSec   uint64 `json:"write_ops_per_sec"`
	IOUtilPercent    float64 `json:"io_util_percent"`
}

// NetworkMetrics contains network usage information
type NetworkMetrics struct {
	Interfaces       []NetworkInterface `json:"interfaces"`
	TotalBytesRx     uint64            `json:"total_bytes_rx"`
	TotalBytesTx     uint64            `json:"total_bytes_tx"`
	TotalPacketsRx   uint64            `json:"total_packets_rx"`
	TotalPacketsTx   uint64            `json:"total_packets_tx"`
	ConnectionCount  int               `json:"connection_count"`
	ActiveConnections int              `json:"active_connections"`
}

// NetworkInterface represents network interface metrics
type NetworkInterface struct {
	Name          string  `json:"name"`
	BytesRx       uint64  `json:"bytes_rx"`
	BytesTx       uint64  `json:"bytes_tx"`
	PacketsRx     uint64  `json:"packets_rx"`
	PacketsTx     uint64  `json:"packets_tx"`
	ErrorsRx      uint64  `json:"errors_rx"`
	ErrorsTx      uint64  `json:"errors_tx"`
	DroppedRx     uint64  `json:"dropped_rx"`
	DroppedTx     uint64  `json:"dropped_tx"`
	SpeedMbps     uint64  `json:"speed_mbps"`
	UtilPercent   float64 `json:"util_percent"`
}

// TempSensor represents a temperature sensor reading
type TempSensor struct {
	Name        string  `json:"name"`
	Label       string  `json:"label"`
	TempCelsius float64 `json:"temp_celsius"`
	TempFahrenheit float64 `json:"temp_fahrenheit"`
	Critical    float64 `json:"critical,omitempty"`
	High        float64 `json:"high,omitempty"`
}

// BatteryMetrics contains battery information
type BatteryMetrics struct {
	Present        bool    `json:"present"`
	Percentage     float64 `json:"percentage"`
	Status         string  `json:"status"` // charging, discharging, full, unknown
	TimeRemaining  *time.Duration `json:"time_remaining,omitempty"`
	PowerWatts     float64 `json:"power_watts,omitempty"`
	VoltageVolts   float64 `json:"voltage_volts,omitempty"`
	CycleCount     int     `json:"cycle_count,omitempty"`
	Health         string  `json:"health,omitempty"` // good, fair, poor, unknown
}

// Alert represents a health alert
type Alert struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Severity    string                 `json:"severity"` // info, warning, error, critical
	Title       string                 `json:"title"`
	Description string                 `json:"description"`
	Metric      string                 `json:"metric"`
	Value       float64                `json:"value"`
	Threshold   float64                `json:"threshold"`
	Metadata    map[string]interface{} `json:"metadata"`
	CreatedAt   time.Time              `json:"created_at"`
	ResolvedAt  *time.Time             `json:"resolved_at,omitempty"`
}

// NewMonitor creates a new health monitor
func NewMonitor(cfg *Config) (*Monitor, error) {
	// Set default thresholds
	if cfg.AlertThresholds == nil {
		cfg.AlertThresholds = &Thresholds{
			CPUPercent:     80.0,
			MemoryPercent:  85.0,
			DiskPercent:    90.0,
			TempCelsius:    80.0,
			BatteryPercent: 20.0,
		}
	}

	// Set default metrics interval
	if cfg.MetricsInterval == 0 {
		cfg.MetricsInterval = 30 * time.Second
	}

	return &Monitor{
		config: cfg,
		stopCh: make(chan struct{}),
	}, nil
}

// Start begins health monitoring
func (m *Monitor) Start(ctx context.Context) error {
	log.Println("💓 Starting health monitor...")
	
	// Collect initial metrics
	_, err := m.CollectMetrics(ctx)
	if err != nil {
		log.Printf("⚠️  Initial metrics collection failed: %v", err)
	}
	
	// Start monitoring goroutine
	m.wg.Add(1)
	go m.monitorLoop(ctx)
	
	log.Println("✅ Health monitor started")
	return nil
}

// Stop stops the health monitor
func (m *Monitor) Stop(ctx context.Context) error {
	log.Println("⏹️  Stopping health monitor...")
	close(m.stopCh)
	m.wg.Wait()
	return nil
}

// CollectMetrics collects current device health metrics
func (m *Monitor) CollectMetrics(ctx context.Context) (*Metrics, error) {
	start := time.Now()
	
	metrics := &Metrics{
		CollectedAt:     time.Now(),
		ComponentHealth: make(map[string]int),
	}

	// Collect CPU metrics
	if err := m.collectCPUMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect CPU metrics: %v", err)
		metrics.ComponentHealth["cpu"] = 0
	} else {
		metrics.ComponentHealth["cpu"] = m.calculateCPUHealth(&metrics.CPU)
	}

	// Collect memory metrics
	if err := m.collectMemoryMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect memory metrics: %v", err)
		metrics.ComponentHealth["memory"] = 0
	} else {
		metrics.ComponentHealth["memory"] = m.calculateMemoryHealth(&metrics.Memory)
	}

	// Collect disk metrics
	if err := m.collectDiskMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect disk metrics: %v", err)
		metrics.ComponentHealth["disk"] = 0
	} else {
		metrics.ComponentHealth["disk"] = m.calculateDiskHealth(metrics.Disk)
	}

	// Collect network metrics
	if err := m.collectNetworkMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect network metrics: %v", err)
		metrics.ComponentHealth["network"] = 0
	} else {
		metrics.ComponentHealth["network"] = m.calculateNetworkHealth(&metrics.Network)
	}

	// Collect temperature metrics
	if err := m.collectTemperatureMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect temperature metrics: %v", err)
	}

	// Collect battery metrics (if present)
	if err := m.collectBatteryMetrics(metrics); err != nil {
		// Battery collection failure is not critical for desktops
	} else if metrics.Battery != nil {
		metrics.ComponentHealth["battery"] = m.calculateBatteryHealth(metrics.Battery)
	}

	// Collect system metrics
	if err := m.collectSystemMetrics(metrics); err != nil {
		log.Printf("⚠️  Failed to collect system metrics: %v", err)
	}

	// Calculate overall health score
	metrics.OverallHealth = m.calculateOverallHealth(metrics.ComponentHealth)

	// Check for alerts
	m.checkAlerts(metrics)

	// Store metrics
	m.mu.Lock()
	m.metrics = metrics
	m.mu.Unlock()

	log.Printf("💓 Health metrics collected in %v (health: %d%%)", time.Since(start), metrics.OverallHealth)
	return metrics, nil
}

// monitorLoop runs the continuous health monitoring
func (m *Monitor) monitorLoop(ctx context.Context) {
	defer m.wg.Done()
	
	ticker := time.NewTicker(m.config.MetricsInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-m.stopCh:
			return
		case <-ticker.C:
			_, err := m.CollectMetrics(ctx)
			if err != nil {
				log.Printf("❌ Health metrics collection failed: %v", err)
			}
		}
	}
}

// collectCPUMetrics collects CPU usage metrics
func (m *Monitor) collectCPUMetrics(metrics *Metrics) error {
	cpuInfo, err := platform.GetCPUUsage()
	if err != nil {
		return err
	}

	metrics.CPU = CPUMetrics{
		UsagePercent:  cpuInfo.UsagePercent,
		CoreUsage:     cpuInfo.CoreUsage,
		UserPercent:   cpuInfo.UserPercent,
		SystemPercent: cpuInfo.SystemPercent,
		IdlePercent:   cpuInfo.IdlePercent,
		IOWaitPercent: cpuInfo.IOWaitPercent,
		FrequencyMHz:  cpuInfo.FrequencyMHz,
	}

	return nil
}

// collectMemoryMetrics collects memory usage metrics
func (m *Monitor) collectMemoryMetrics(metrics *Metrics) error {
	memInfo, err := platform.GetMemoryUsage()
	if err != nil {
		return err
	}

	metrics.Memory = MemoryMetrics{
		TotalMB:      memInfo.TotalMB,
		UsedMB:       memInfo.UsedMB,
		FreeMB:       memInfo.FreeMB,
		AvailableMB:  memInfo.AvailableMB,
		CachedMB:     memInfo.CachedMB,
		BuffersMB:    memInfo.BuffersMB,
		UsagePercent: float64(memInfo.UsedMB) / float64(memInfo.TotalMB) * 100,
		SwapTotalMB:  memInfo.SwapTotalMB,
		SwapUsedMB:   memInfo.SwapUsedMB,
		SwapPercent:  float64(memInfo.SwapUsedMB) / float64(memInfo.SwapTotalMB) * 100,
	}

	return nil
}

// collectDiskMetrics collects disk usage metrics
func (m *Monitor) collectDiskMetrics(metrics *Metrics) error {
	diskInfo, err := platform.GetDiskUsage()
	if err != nil {
		return err
	}

	for _, disk := range diskInfo {
		diskMetric := DiskMetrics{
			Device:       disk.Device,
			MountPoint:   disk.MountPoint,
			FileSystem:   disk.FileSystem,
			TotalGB:      disk.TotalGB,
			UsedGB:       disk.UsedGB,
			FreeGB:       disk.FreeGB,
			UsagePercent: float64(disk.UsedGB) / float64(disk.TotalGB) * 100,
		}
		
		// Get I/O stats if available
		if ioStats, err := platform.GetDiskIOStats(disk.Device); err == nil {
			diskMetric.ReadBytesPerSec = ioStats.ReadBytesPerSec
			diskMetric.WriteBytesPerSec = ioStats.WriteBytesPerSec
			diskMetric.ReadOpsPerSec = ioStats.ReadOpsPerSec
			diskMetric.WriteOpsPerSec = ioStats.WriteOpsPerSec
			diskMetric.IOUtilPercent = ioStats.UtilPercent
		}
		
		metrics.Disk = append(metrics.Disk, diskMetric)
	}

	return nil
}

// collectNetworkMetrics collects network usage metrics
func (m *Monitor) collectNetworkMetrics(metrics *Metrics) error {
	netInfo, err := platform.GetNetworkUsage()
	if err != nil {
		return err
	}

	metrics.Network = NetworkMetrics{
		TotalBytesRx:     netInfo.TotalBytesRx,
		TotalBytesTx:     netInfo.TotalBytesTx,
		TotalPacketsRx:   netInfo.TotalPacketsRx,
		TotalPacketsTx:   netInfo.TotalPacketsTx,
		ConnectionCount:  netInfo.ConnectionCount,
		ActiveConnections: netInfo.ActiveConnections,
	}

	// Convert interface metrics
	for _, iface := range netInfo.Interfaces {
		metrics.Network.Interfaces = append(metrics.Network.Interfaces, NetworkInterface{
			Name:        iface.Name,
			BytesRx:     iface.BytesRx,
			BytesTx:     iface.BytesTx,
			PacketsRx:   iface.PacketsRx,
			PacketsTx:   iface.PacketsTx,
			ErrorsRx:    iface.ErrorsRx,
			ErrorsTx:    iface.ErrorsTx,
			DroppedRx:   iface.DroppedRx,
			DroppedTx:   iface.DroppedTx,
			SpeedMbps:   iface.SpeedMbps,
			UtilPercent: iface.UtilPercent,
		})
	}

	return nil
}

// collectTemperatureMetrics collects temperature sensor data
func (m *Monitor) collectTemperatureMetrics(metrics *Metrics) error {
	tempInfo, err := platform.GetTemperature()
	if err != nil {
		return err // Temperature sensors may not be available on all systems
	}

	for _, sensor := range tempInfo {
		metrics.Temperature = append(metrics.Temperature, TempSensor{
			Name:           sensor.Name,
			Label:          sensor.Label,
			TempCelsius:    sensor.TempCelsius,
			TempFahrenheit: sensor.TempCelsius*9/5 + 32,
			Critical:       sensor.Critical,
			High:           sensor.High,
		})
	}

	return nil
}

// collectBatteryMetrics collects battery information
func (m *Monitor) collectBatteryMetrics(metrics *Metrics) error {
	batteryInfo, err := platform.GetBatteryUsage()
	if err != nil {
		return err // Battery may not be present
	}

	if batteryInfo.Present {
		metrics.Battery = &BatteryMetrics{
			Present:      batteryInfo.Present,
			Percentage:   batteryInfo.Percentage,
			Status:       batteryInfo.Status,
			PowerWatts:   batteryInfo.PowerWatts,
			VoltageVolts: batteryInfo.VoltageVolts,
			CycleCount:   batteryInfo.CycleCount,
			Health:       batteryInfo.Health,
		}

		if batteryInfo.TimeRemaining > 0 {
			metrics.Battery.TimeRemaining = &batteryInfo.TimeRemaining
		}
	}

	return nil
}

// collectSystemMetrics collects general system metrics
func (m *Monitor) collectSystemMetrics(metrics *Metrics) error {
	// Get uptime
	uptime, err := platform.GetUptime()
	if err == nil {
		metrics.Uptime = uptime
	}

	// Get load average
	loadAvg, err := platform.GetLoadAverage()
	if err == nil {
		metrics.LoadAverage = loadAvg
	}

	// Get process count
	procCount, err := platform.GetProcessCount()
	if err == nil {
		metrics.ProcessCount = procCount
	}

	// Calculate agent uptime
	// This would typically be tracked from agent start time
	metrics.AgentUptime = time.Since(time.Now().Add(-1 * time.Hour)) // Placeholder

	return nil
}

// Health calculation methods
func (m *Monitor) calculateCPUHealth(cpu *CPUMetrics) int {
	if cpu.UsagePercent > 90 {
		return 20
	} else if cpu.UsagePercent > 80 {
		return 50
	} else if cpu.UsagePercent > 60 {
		return 75
	}
	return 100
}

func (m *Monitor) calculateMemoryHealth(memory *MemoryMetrics) int {
	if memory.UsagePercent > 95 {
		return 10
	} else if memory.UsagePercent > 85 {
		return 40
	} else if memory.UsagePercent > 70 {
		return 70
	}
	return 100
}

func (m *Monitor) calculateDiskHealth(disks []DiskMetrics) int {
	if len(disks) == 0 {
		return 0
	}

	minHealth := 100
	for _, disk := range disks {
		health := 100
		if disk.UsagePercent > 95 {
			health = 10
		} else if disk.UsagePercent > 90 {
			health = 30
		} else if disk.UsagePercent > 80 {
			health = 60
		}
		
		if health < minHealth {
			minHealth = health
		}
	}
	
	return minHealth
}

func (m *Monitor) calculateNetworkHealth(network *NetworkMetrics) int {
	// Simple network health based on error rates
	totalErrors := uint64(0)
	totalPackets := network.TotalPacketsRx + network.TotalPacketsTx
	
	for _, iface := range network.Interfaces {
		totalErrors += iface.ErrorsRx + iface.ErrorsTx
	}
	
	if totalPackets == 0 {
		return 100
	}
	
	errorRate := float64(totalErrors) / float64(totalPackets) * 100
	if errorRate > 5 {
		return 30
	} else if errorRate > 1 {
		return 70
	}
	
	return 100
}

func (m *Monitor) calculateBatteryHealth(battery *BatteryMetrics) int {
	if !battery.Present {
		return 100 // N/A for devices without battery
	}
	
	if battery.Percentage < 10 {
		return 20
	} else if battery.Percentage < 20 {
		return 50
	}
	
	// Consider battery health if available
	switch battery.Health {
	case "poor":
		return 30
	case "fair":
		return 60
	case "good":
		return 100
	default:
		return 100
	}
}

func (m *Monitor) calculateOverallHealth(componentHealth map[string]int) int {
	if len(componentHealth) == 0 {
		return 0
	}
	
	total := 0
	count := 0
	
	for _, health := range componentHealth {
		total += health
		count++
	}
	
	return total / count
}

// checkAlerts checks metrics against thresholds and generates alerts
func (m *Monitor) checkAlerts(metrics *Metrics) {
	// CPU usage alert
	if metrics.CPU.UsagePercent > m.config.AlertThresholds.CPUPercent {
		m.addAlert("cpu_high", "warning", "High CPU Usage", 
			fmt.Sprintf("CPU usage is %.1f%%, above threshold of %.1f%%", 
				metrics.CPU.UsagePercent, m.config.AlertThresholds.CPUPercent),
			"cpu_usage", metrics.CPU.UsagePercent, m.config.AlertThresholds.CPUPercent)
	}

	// Memory usage alert
	if metrics.Memory.UsagePercent > m.config.AlertThresholds.MemoryPercent {
		m.addAlert("memory_high", "warning", "High Memory Usage",
			fmt.Sprintf("Memory usage is %.1f%%, above threshold of %.1f%%",
				metrics.Memory.UsagePercent, m.config.AlertThresholds.MemoryPercent),
			"memory_usage", metrics.Memory.UsagePercent, m.config.AlertThresholds.MemoryPercent)
	}

	// Disk usage alerts
	for _, disk := range metrics.Disk {
		if disk.UsagePercent > m.config.AlertThresholds.DiskPercent {
			m.addAlert("disk_high", "warning", "High Disk Usage",
				fmt.Sprintf("Disk %s usage is %.1f%%, above threshold of %.1f%%",
					disk.Device, disk.UsagePercent, m.config.AlertThresholds.DiskPercent),
				"disk_usage", disk.UsagePercent, m.config.AlertThresholds.DiskPercent)
		}
	}

	// Temperature alerts
	for _, temp := range metrics.Temperature {
		if temp.TempCelsius > m.config.AlertThresholds.TempCelsius {
			m.addAlert("temp_high", "error", "High Temperature",
				fmt.Sprintf("Temperature sensor %s is %.1f°C, above threshold of %.1f°C",
					temp.Name, temp.TempCelsius, m.config.AlertThresholds.TempCelsius),
				"temperature", temp.TempCelsius, m.config.AlertThresholds.TempCelsius)
		}
	}

	// Battery alerts
	if metrics.Battery != nil && metrics.Battery.Present {
		if metrics.Battery.Percentage < m.config.AlertThresholds.BatteryPercent {
			m.addAlert("battery_low", "warning", "Low Battery",
				fmt.Sprintf("Battery level is %.1f%%, below threshold of %.1f%%",
					metrics.Battery.Percentage, m.config.AlertThresholds.BatteryPercent),
				"battery_level", metrics.Battery.Percentage, m.config.AlertThresholds.BatteryPercent)
		}
	}
}

// addAlert creates and stores a new alert
func (m *Monitor) addAlert(alertType, severity, title, description, metric string, value, threshold float64) {
	alert := Alert{
		ID:          fmt.Sprintf("%s_%d", alertType, time.Now().Unix()),
		Type:        alertType,
		Severity:    severity,
		Title:       title,
		Description: description,
		Metric:      metric,
		Value:       value,
		Threshold:   threshold,
		CreatedAt:   time.Now(),
	}

	m.mu.Lock()
	m.alerts = append(m.alerts, alert)
	m.mu.Unlock()

	log.Printf("🚨 Health alert: %s - %s", alert.Title, alert.Description)
}

// GetCurrentMetrics returns the current health metrics
func (m *Monitor) GetCurrentMetrics() *Metrics {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.metrics
}

// GetActiveAlerts returns currently active alerts
func (m *Monitor) GetActiveAlerts() []Alert {
	m.mu.RLock()
	defer m.mu.RUnlock()
	
	var activeAlerts []Alert
	for _, alert := range m.alerts {
		if alert.ResolvedAt == nil {
			activeAlerts = append(activeAlerts, alert)
		}
	}
	
	return activeAlerts
}