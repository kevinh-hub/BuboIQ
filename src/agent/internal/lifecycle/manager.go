package lifecycle

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/buboiq/agent/internal/collector"
	"github.com/buboiq/agent/internal/config"
	"github.com/buboiq/agent/internal/discovery"
	"github.com/buboiq/agent/internal/health"
	"github.com/buboiq/agent/internal/remote"
	"github.com/buboiq/agent/internal/transport"
	"github.com/buboiq/agent/internal/updater"
)

// Manager orchestrates the complete agent lifecycle
type Manager struct {
	config      *config.Config
	collector   *collector.Collector
	health      *health.Monitor
	discovery   *discovery.Scanner
	remote      *remote.Handler
	transport   *transport.Client
	updater     *updater.Manager
	
	// Lifecycle state
	state       State
	stateMutex  sync.RWMutex
	
	// Event channels
	stateChanges chan StateChange
	errors      chan error
	
	// Control channels
	shutdown    chan struct{}
	done        chan struct{}
	
	// Background workers
	workers     sync.WaitGroup
}

// State represents the current agent state
type State string

const (
	StateInitializing State = "initializing"
	StateEnrolling    State = "enrolling"
	StateRunning      State = "running"
	StateUpdating     State = "updating"
	StateStopping     State = "stopping"
	StateStopped      State = "stopped"
	StateError        State = "error"
)

// StateChange represents a state transition event
type StateChange struct {
	From      State
	To        State
	Timestamp time.Time
	Reason    string
	Error     error
}

// NewManager creates a new lifecycle manager
func NewManager(cfg *config.Config) (*Manager, error) {
	return &Manager{
		config:       cfg,
		state:        StateInitializing,
		stateChanges: make(chan StateChange, 10),
		errors:       make(chan error, 10),
		shutdown:     make(chan struct{}),
		done:         make(chan struct{}),
	}, nil
}

// Start begins the agent lifecycle
func (m *Manager) Start(ctx context.Context) error {
	log.Println("🚀 Starting BuboIQ Agent lifecycle manager...")
	
	// Initialize components
	if err := m.initializeComponents(); err != nil {
		m.changeState(StateError, fmt.Sprintf("Component initialization failed: %v", err), err)
		return err
	}
	
	// Start enrollment if needed
	if !m.config.IsEnrolled() {
		m.changeState(StateEnrolling, "Starting enrollment process", nil)
		if err := m.enroll(ctx); err != nil {
			m.changeState(StateError, fmt.Sprintf("Enrollment failed: %v", err), err)
			return err
		}
	}
	
	// Start all components
	if err := m.startComponents(ctx); err != nil {
		m.changeState(StateError, fmt.Sprintf("Component startup failed: %v", err), err)
		return err
	}
	
	// Start background workers
	m.startWorkers(ctx)
	
	// Transition to running state
	m.changeState(StateRunning, "Agent fully operational", nil)
	
	// Run main event loop
	return m.run(ctx)
}

// Stop gracefully shuts down the agent
func (m *Manager) Stop(ctx context.Context) error {
	m.changeState(StateStopping, "Shutdown requested", nil)
	
	// Signal shutdown
	close(m.shutdown)
	
	// Wait for workers to finish with timeout
	workersDone := make(chan struct{})
	go func() {
		m.workers.Wait()
		close(workersDone)
	}()
	
	select {
	case <-workersDone:
		log.Println("✅ All workers stopped gracefully")
	case <-time.After(30 * time.Second):
		log.Println("⚠️  Timeout waiting for workers to stop")
	}
	
	// Stop components
	if err := m.stopComponents(ctx); err != nil {
		log.Printf("⚠️  Error stopping components: %v", err)
	}
	
	m.changeState(StateStopped, "Agent stopped", nil)
	close(m.done)
	
	return nil
}

// GetState returns the current agent state
func (m *Manager) GetState() State {
	m.stateMutex.RLock()
	defer m.stateMutex.RUnlock()
	return m.state
}

// GetStateChanges returns a channel for state change events
func (m *Manager) GetStateChanges() <-chan StateChange {
	return m.stateChanges
}

// initializeComponents creates and configures all agent components
func (m *Manager) initializeComponents() error {
	var err error
	
	// Initialize transport client
	m.transport, err = transport.NewClient(&transport.Config{
		BaseURL:     m.config.Server.URL,
		OrgID:       m.config.Organization.ID,
		DeviceID:    m.config.Device.ID,
		APIKey:      m.config.Auth.APIKey,
		TLSConfig:   m.config.Security.TLS,
		Timeout:     30 * time.Second,
		RetryConfig: m.config.Transport.Retry,
	})
	if err != nil {
		return fmt.Errorf("failed to create transport client: %w", err)
	}
	
	// Initialize collector
	m.collector, err = collector.NewCollector(&collector.Config{
		EnableSoftwareInventory: m.config.Privacy.CollectSoftware,
		EnableNetworkDiscovery:  m.config.Discovery.Enabled,
		ScanInterval:           m.config.Collection.Interval,
		DeltaEnabled:           m.config.Collection.DeltaEnabled,
	})
	if err != nil {
		return fmt.Errorf("failed to create collector: %w", err)
	}
	
	// Initialize health monitor
	m.health, err = health.NewMonitor(&health.Config{
		MetricsInterval:   m.config.Health.MetricsInterval,
		AlertThresholds:   m.config.Health.Thresholds,
		EnablePredictive:  m.config.Health.EnablePredictive,
	})
	if err != nil {
		return fmt.Errorf("failed to create health monitor: %w", err)
	}
	
	// Initialize discovery scanner (if enabled)
	if m.config.Discovery.Enabled {
		m.discovery, err = discovery.NewScanner(&discovery.Config{
			ScanInterval: m.config.Discovery.ScanInterval,
			ScanProfiles: m.config.Discovery.Profiles,
			Credentials:  m.config.Discovery.Credentials,
		})
		if err != nil {
			return fmt.Errorf("failed to create discovery scanner: %w", err)
		}
	}
	
	// Initialize remote handler
	m.remote, err = remote.NewHandler(&remote.Config{
		Enabled:         m.config.Remote.Enabled,
		RequireConsent:  m.config.Remote.RequireConsent,
		SessionTimeout:  m.config.Remote.SessionTimeout,
		RecordSessions:  m.config.Remote.RecordSessions,
	})
	if err != nil {
		return fmt.Errorf("failed to create remote handler: %w", err)
	}
	
	// Initialize updater
	m.updater, err = updater.NewManager(&updater.Config{
		CheckInterval:  m.config.Updates.CheckInterval,
		Channel:        m.config.Updates.Channel,
		AutoUpdate:     m.config.Updates.AutoUpdate,
		BackupEnabled:  m.config.Updates.BackupEnabled,
	})
	if err != nil {
		return fmt.Errorf("failed to create updater: %w", err)
	}
	
	log.Println("✅ All components initialized successfully")
	return nil
}

// enroll performs device enrollment if not already enrolled
func (m *Manager) enroll(ctx context.Context) error {
	log.Println("🔐 Starting device enrollment...")
	
	enrollmentCode := m.config.Organization.EnrollmentCode
	if enrollmentCode == "" {
		return fmt.Errorf("no enrollment code provided")
	}
	
	// Create enrollment client
	enrollClient := transport.NewEnrollmentClient(m.config.Server.URL)
	
	// Get device information
	deviceInfo, err := collector.GetDeviceInfo()
	if err != nil {
		return fmt.Errorf("failed to get device info: %w", err)
	}
	
	// Perform enrollment
	enrollResponse, err := enrollClient.EnrollDevice(ctx, &transport.EnrollmentRequest{
		Code:         enrollmentCode,
		DeviceInfo:   deviceInfo,
		AgentVersion: m.config.Agent.Version,
	})
	if err != nil {
		return fmt.Errorf("enrollment failed: %w", err)
	}
	
	// Update configuration with enrollment response
	m.config.Organization.ID = enrollResponse.OrgID
	m.config.Organization.Name = enrollResponse.OrgName
	m.config.Device.ID = enrollResponse.DeviceID
	m.config.Auth.APIKey = enrollResponse.APIKey
	m.config.Security.TLS = enrollResponse.TLSConfig
	
	// Mark as enrolled
	m.config.SetEnrolled(true)
	
	// Save updated configuration
	if err := m.config.Save(); err != nil {
		log.Printf("⚠️  Failed to save enrollment config: %v", err)
	}
	
	log.Printf("✅ Device enrolled successfully as %s", m.config.Device.ID)
	return nil
}

// startComponents starts all initialized components
func (m *Manager) startComponents(ctx context.Context) error {
	log.Println("🔧 Starting agent components...")
	
	// Start health monitor first
	if err := m.health.Start(ctx); err != nil {
		return fmt.Errorf("failed to start health monitor: %w", err)
	}
	
	// Start collector
	if err := m.collector.Start(ctx); err != nil {
		return fmt.Errorf("failed to start collector: %w", err)
	}
	
	// Start discovery scanner (if enabled)
	if m.discovery != nil {
		if err := m.discovery.Start(ctx); err != nil {
			return fmt.Errorf("failed to start discovery scanner: %w", err)
		}
	}
	
	// Start remote handler
	if err := m.remote.Start(ctx); err != nil {
		return fmt.Errorf("failed to start remote handler: %w", err)
	}
	
	// Start transport client
	if err := m.transport.Start(ctx); err != nil {
		return fmt.Errorf("failed to start transport client: %w", err)
	}
	
	// Start updater
	if err := m.updater.Start(ctx); err != nil {
		return fmt.Errorf("failed to start updater: %w", err)
	}
	
	log.Println("✅ All components started successfully")
	return nil
}

// startWorkers starts background worker goroutines
func (m *Manager) startWorkers(ctx context.Context) {
	log.Println("👷 Starting background workers...")
	
	// Inventory sync worker
	m.workers.Add(1)
	go m.inventorySyncWorker(ctx)
	
	// Health telemetry worker
	m.workers.Add(1)
	go m.healthTelemetryWorker(ctx)
	
	// Command polling worker
	m.workers.Add(1)
	go m.commandPollingWorker(ctx)
	
	// Update check worker
	m.workers.Add(1)
	go m.updateCheckWorker(ctx)
	
	// Discovery worker (if enabled)
	if m.discovery != nil {
		m.workers.Add(1)
		go m.discoveryWorker(ctx)
	}
	
	log.Println("✅ All background workers started")
}

// inventorySyncWorker handles periodic inventory synchronization
func (m *Manager) inventorySyncWorker(ctx context.Context) {
	defer m.workers.Done()
	
	// Perform initial sync immediately
	m.performInventorySync(ctx)
	
	// Set up periodic sync
	ticker := time.NewTicker(m.config.Collection.Interval)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-m.shutdown:
			return
		case <-ticker.C:
			m.performInventorySync(ctx)
		}
	}
}

// healthTelemetryWorker handles periodic health telemetry
func (m *Manager) healthTelemetryWorker(ctx context.Context) {
	defer m.workers.Done()
	
	ticker := time.NewTicker(m.config.Health.MetricsInterval)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-m.shutdown:
			return
		case <-ticker.C:
			m.performHealthTelemetry(ctx)
		}
	}
}

// commandPollingWorker handles remote command polling
func (m *Manager) commandPollingWorker(ctx context.Context) {
	defer m.workers.Done()
	
	ticker := time.NewTicker(1 * time.Minute) // Poll every minute
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-m.shutdown:
			return
		case <-ticker.C:
			m.pollRemoteCommands(ctx)
		}
	}
}

// updateCheckWorker handles periodic update checks
func (m *Manager) updateCheckWorker(ctx context.Context) {
	defer m.workers.Done()
	
	// Initial check after 30 minutes
	initialTimer := time.NewTimer(30 * time.Minute)
	defer initialTimer.Stop()
	
	// Then check every 4 hours
	ticker := time.NewTicker(4 * time.Hour)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-m.shutdown:
			return
		case <-initialTimer.C:
			m.checkForUpdates(ctx)
		case <-ticker.C:
			m.checkForUpdates(ctx)
		}
	}
}

// discoveryWorker handles network discovery tasks
func (m *Manager) discoveryWorker(ctx context.Context) {
	defer m.workers.Done()
	
	ticker := time.NewTicker(m.config.Discovery.ScanInterval)
	defer ticker.Stop()
	
	for {
		select {
		case <-ctx.Done():
			return
		case <-m.shutdown:
			return
		case <-ticker.C:
			m.performDiscoveryScan(ctx)
		}
	}
}

// performInventorySync collects and sends device inventory
func (m *Manager) performInventorySync(ctx context.Context) {
	inventory, err := m.collector.CollectInventory(ctx)
	if err != nil {
		log.Printf("❌ Failed to collect inventory: %v", err)
		return
	}
	
	// Get current health metrics
	healthMetrics, err := m.health.CollectMetrics(ctx)
	if err != nil {
		log.Printf("⚠️  Failed to collect health metrics: %v", err)
	}
	
	// Get discovery data (if available)
	var discoveryData *discovery.ScanResults
	if m.discovery != nil {
		discoveryData, err = m.discovery.GetResults(ctx)
		if err != nil {
			log.Printf("⚠️  Failed to collect discovery data: %v", err)
		}
	}
	
	// Send to server
	payload := &transport.DevicePayload{
		OrgID:         m.config.Organization.ID,
		Device:        inventory,
		Health:        healthMetrics,
		Discovery:     discoveryData,
		AgentVersion:  m.config.Agent.Version,
		Timestamp:     time.Now(),
	}
	
	if err := m.transport.SendDeviceData(ctx, payload); err != nil {
		log.Printf("❌ Failed to send device data: %v", err)
		return
	}
	
	log.Println("✅ Inventory sync completed successfully")
}

// performHealthTelemetry sends health signals
func (m *Manager) performHealthTelemetry(ctx context.Context) {
	metrics, err := m.health.CollectMetrics(ctx)
	if err != nil {
		log.Printf("❌ Failed to collect health metrics: %v", err)
		return
	}
	
	// Check for alerts
	alerts := m.health.GetActiveAlerts()
	for _, alert := range alerts {
		signal := &transport.Signal{
			Type:        "health_alert",
			Severity:    alert.Severity,
			Title:       alert.Title,
			Description: alert.Description,
			Metadata: map[string]interface{}{
				"metric":    alert.Metric,
				"value":     alert.Value,
				"threshold": alert.Threshold,
			},
			Timestamp: time.Now(),
			DeviceID:  m.config.Device.ID,
		}
		
		if err := m.transport.SendSignal(ctx, signal); err != nil {
			log.Printf("❌ Failed to send health signal: %v", err)
		}
	}
}

// pollRemoteCommands checks for and processes remote commands
func (m *Manager) pollRemoteCommands(ctx context.Context) {
	commands, err := m.transport.GetPendingCommands(ctx)
	if err != nil {
		log.Printf("❌ Failed to poll commands: %v", err)
		return
	}
	
	if len(commands) == 0 {
		return
	}
	
	log.Printf("📝 Processing %d remote commands", len(commands))
	
	for _, command := range commands {
		// Acknowledge command receipt
		if err := m.transport.AcknowledgeCommand(ctx, command.ID); err != nil {
			log.Printf("⚠️  Failed to acknowledge command %s: %v", command.ID, err)
		}
		
		// Process command
		response := m.remote.ProcessCommand(ctx, &command)
		
		// Send response
		if err := m.transport.SendCommandResponse(ctx, response); err != nil {
			log.Printf("❌ Failed to send command response: %v", err)
		}
	}
}

// checkForUpdates checks for and processes agent updates
func (m *Manager) checkForUpdates(ctx context.Context) {
	updateInfo, err := m.transport.CheckForUpdates(ctx, m.config.Agent.Version)
	if err != nil {
		log.Printf("❌ Failed to check for updates: %v", err)
		return
	}
	
	if updateInfo == nil {
		log.Println("✅ Agent is up to date")
		return
	}
	
	log.Printf("🔄 Update available: %s", updateInfo.Version)
	
	if m.config.Updates.AutoUpdate {
		m.changeState(StateUpdating, fmt.Sprintf("Updating to version %s", updateInfo.Version), nil)
		
		if err := m.updater.PerformUpdate(ctx, updateInfo); err != nil {
			log.Printf("❌ Update failed: %v", err)
			m.changeState(StateError, fmt.Sprintf("Update failed: %v", err), err)
		} else {
			log.Printf("✅ Update to %s completed successfully", updateInfo.Version)
			// The agent will restart after update
		}
	} else {
		log.Printf("📢 Update %s available but auto-update is disabled", updateInfo.Version)
	}
}

// performDiscoveryScan runs network discovery
func (m *Manager) performDiscoveryScan(ctx context.Context) {
	if m.discovery == nil {
		return
	}
	
	results, err := m.discovery.PerformScan(ctx)
	if err != nil {
		log.Printf("❌ Discovery scan failed: %v", err)
		return
	}
	
	if len(results.Devices) > 0 {
		log.Printf("🔍 Discovery found %d devices", len(results.Devices))
		
		// Send discovery signal
		signal := &transport.Signal{
			Type:        "discovery_complete",
			Severity:    "info",
			Title:       "Network Discovery Complete",
			Description: fmt.Sprintf("Found %d devices on the network", len(results.Devices)),
			Metadata: map[string]interface{}{
				"devices_found": len(results.Devices),
				"scan_duration": results.Duration,
			},
			Timestamp: time.Now(),
			DeviceID:  m.config.Device.ID,
		}
		
		if err := m.transport.SendSignal(ctx, signal); err != nil {
			log.Printf("❌ Failed to send discovery signal: %v", err)
		}
	}
}

// run executes the main event loop
func (m *Manager) run(ctx context.Context) error {
	log.Println("🏃 Agent lifecycle manager running...")
	
	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-m.shutdown:
			return nil
		case stateChange := <-m.stateChanges:
			log.Printf("🔄 State changed: %s -> %s (%s)", stateChange.From, stateChange.To, stateChange.Reason)
			if stateChange.Error != nil {
				log.Printf("❌ State change error: %v", stateChange.Error)
			}
		case err := <-m.errors:
			log.Printf("❌ Background error: %v", err)
			// Could implement error recovery logic here
		}
	}
}

// changeState transitions the agent to a new state
func (m *Manager) changeState(newState State, reason string, err error) {
	m.stateMutex.Lock()
	oldState := m.state
	m.state = newState
	m.stateMutex.Unlock()
	
	stateChange := StateChange{
		From:      oldState,
		To:        newState,
		Timestamp: time.Now(),
		Reason:    reason,
		Error:     err,
	}
	
	select {
	case m.stateChanges <- stateChange:
	default:
		// Channel full, drop state change
	}
}

// stopComponents gracefully stops all components
func (m *Manager) stopComponents(ctx context.Context) error {
	log.Println("🛑 Stopping agent components...")
	
	// Stop in reverse order
	if m.updater != nil {
		if err := m.updater.Stop(ctx); err != nil {
			log.Printf("⚠️  Updater stop error: %v", err)
		}
	}
	
	if m.transport != nil {
		if err := m.transport.Stop(ctx); err != nil {
			log.Printf("⚠️  Transport stop error: %v", err)
		}
	}
	
	if m.remote != nil {
		if err := m.remote.Stop(ctx); err != nil {
			log.Printf("⚠️  Remote handler stop error: %v", err)
		}
	}
	
	if m.discovery != nil {
		if err := m.discovery.Stop(ctx); err != nil {
			log.Printf("⚠️  Discovery scanner stop error: %v", err)
		}
	}
	
	if m.collector != nil {
		if err := m.collector.Stop(ctx); err != nil {
			log.Printf("⚠️  Collector stop error: %v", err)
		}
	}
	
	if m.health != nil {
		if err := m.health.Stop(ctx); err != nil {
			log.Printf("⚠️  Health monitor stop error: %v", err)
		}
	}
	
	log.Println("✅ All components stopped")
	return nil
}