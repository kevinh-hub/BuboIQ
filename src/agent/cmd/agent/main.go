package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/buboiq/agent/internal/collector"
	"github.com/buboiq/agent/internal/config"
	"github.com/buboiq/agent/internal/discovery"
	"github.com/buboiq/agent/internal/health"
	"github.com/buboiq/agent/internal/remote"
	"github.com/buboiq/agent/internal/transport"
	"github.com/buboiq/agent/pkg/platform"
)

const (
	// AgentVersion is the current version of the agent
	AgentVersion = "1.0.0"
	
	// DefaultConfigPath is the default configuration file location
	DefaultConfigPath = "/etc/buboiq/agent.yaml"
	
	// WindowsConfigPath is the Windows configuration file location
	WindowsConfigPath = "C:\\ProgramData\\BuboIQ\\agent.yaml"
	
	// macOSConfigPath is the macOS configuration file location
	macOSConfigPath = "/Library/Application Support/BuboIQ/agent.yaml"
)

type Agent struct {
	config    *config.Config
	collector *collector.Collector
	health    *health.Monitor
	discovery *discovery.Scanner
	remote    *remote.Handler
	transport *transport.Client
	
	// Service management
	serviceName string
	stopCh      chan struct{}
	done        chan struct{}
}

func main() {
	var (
		configPath = flag.String("config", getDefaultConfigPath(), "Path to configuration file")
		version    = flag.Bool("version", false, "Show version information")
		service    = flag.String("service", "", "Service management: install, uninstall, start, stop")
		enroll     = flag.String("enroll", "", "Enrollment code for initial setup")
		logLevel   = flag.String("log-level", "info", "Log level: debug, info, warn, error")
	)
	flag.Parse()

	// Show version and exit
	if *version {
		fmt.Printf("BuboIQ Agent %s\n", AgentVersion)
		fmt.Printf("Platform: %s/%s\n", platform.GetOS(), platform.GetArch())
		os.Exit(0)
	}

	// Handle service management commands
	if *service != "" {
		if err := handleServiceCommand(*service, *configPath); err != nil {
			log.Fatalf("Service command failed: %v", err)
		}
		return
	}

	// Handle enrollment
	if *enroll != "" {
		if err := handleEnrollment(*enroll, *configPath); err != nil {
			log.Fatalf("Enrollment failed: %v", err)
		}
		fmt.Println("✅ Device enrolled successfully!")
		return
	}

	// Initialize and run agent
	agent, err := NewAgent(*configPath, *logLevel)
	if err != nil {
		log.Fatalf("Failed to create agent: %v", err)
	}

	if err := agent.Run(); err != nil {
		log.Fatalf("Agent failed: %v", err)
	}
}

// NewAgent creates a new agent instance
func NewAgent(configPath, logLevel string) (*Agent, error) {
	// Load configuration
	cfg, err := config.Load(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %w", err)
	}

	// Validate configuration
	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid configuration: %w", err)
	}

	// Initialize transport client
	transportClient, err := transport.NewClient(&transport.Config{
		BaseURL:     cfg.Server.URL,
		OrgID:       cfg.Organization.ID,
		DeviceID:    cfg.Device.ID,
		APIKey:      cfg.Auth.APIKey,
		TLSConfig:   cfg.Security.TLS,
		Timeout:     30 * time.Second,
		RetryConfig: cfg.Transport.Retry,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create transport client: %w", err)
	}

	// Initialize collectors
	deviceCollector, err := collector.NewCollector(&collector.Config{
		EnableSoftwareInventory: cfg.Privacy.CollectSoftware,
		EnableNetworkDiscovery:  cfg.Discovery.Enabled,
		ScanInterval:           cfg.Collection.Interval,
		DeltaEnabled:           cfg.Collection.DeltaEnabled,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create collector: %w", err)
	}

	// Initialize health monitor
	healthMonitor, err := health.NewMonitor(&health.Config{
		MetricsInterval: cfg.Health.MetricsInterval,
		AlertThresholds: cfg.Health.Thresholds,
		EnablePredictive: cfg.Health.EnablePredictive,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create health monitor: %w", err)
	}

	// Initialize discovery scanner (if enabled)
	var discoveryScanner *discovery.Scanner
	if cfg.Discovery.Enabled {
		discoveryScanner, err = discovery.NewScanner(&discovery.Config{
			ScanInterval: cfg.Discovery.ScanInterval,
			ScanProfiles: cfg.Discovery.Profiles,
			Credentials:  cfg.Discovery.Credentials,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create discovery scanner: %w", err)
		}
	}

	// Initialize remote handler
	remoteHandler, err := remote.NewHandler(&remote.Config{
		Enabled:         cfg.Remote.Enabled,
		RequireConsent:  cfg.Remote.RequireConsent,
		SessionTimeout:  cfg.Remote.SessionTimeout,
		RecordSessions:  cfg.Remote.RecordSessions,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create remote handler: %w", err)
	}

	return &Agent{
		config:      cfg,
		collector:   deviceCollector,
		health:      healthMonitor,
		discovery:   discoveryScanner,
		remote:      remoteHandler,
		transport:   transportClient,
		serviceName: "BuboIQAgent",
		stopCh:      make(chan struct{}),
		done:        make(chan struct{}),
	}, nil
}

// Run starts the agent and blocks until stopped
func (a *Agent) Run() error {
	log.Printf("🦉 Starting BuboIQ Agent %s", AgentVersion)
	log.Printf("Organization: %s", a.config.Organization.Name)
	log.Printf("Device ID: %s", a.config.Device.ID)

	// Create root context
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Start components
	if err := a.startComponents(ctx); err != nil {
		return fmt.Errorf("failed to start components: %w", err)
	}

	// Setup signal handling
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	// Main event loop
	log.Println("✅ BuboIQ Agent started successfully")
	
	select {
	case sig := <-sigCh:
		log.Printf("📡 Received signal %v, shutting down...", sig)
		cancel()
		
	case <-a.stopCh:
		log.Println("📡 Stop requested, shutting down...")
		cancel()
	}

	// Graceful shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer shutdownCancel()

	if err := a.shutdown(shutdownCtx); err != nil {
		log.Printf("❌ Shutdown error: %v", err)
		return err
	}

	log.Println("✅ BuboIQ Agent stopped successfully")
	close(a.done)
	return nil
}

// startComponents initializes and starts all agent components
func (a *Agent) startComponents(ctx context.Context) error {
	// Start health monitor
	if err := a.health.Start(ctx); err != nil {
		return fmt.Errorf("failed to start health monitor: %w", err)
	}

	// Start collector
	if err := a.collector.Start(ctx); err != nil {
		return fmt.Errorf("failed to start collector: %w", err)
	}

	// Start discovery scanner (if enabled)
	if a.discovery != nil {
		if err := a.discovery.Start(ctx); err != nil {
			return fmt.Errorf("failed to start discovery scanner: %w", err)
		}
	}

	// Start remote handler
	if err := a.remote.Start(ctx); err != nil {
		return fmt.Errorf("failed to start remote handler: %w", err)
	}

	// Start transport client and begin sync
	if err := a.transport.Start(ctx); err != nil {
		return fmt.Errorf("failed to start transport client: %w", err)
	}

	// Setup data flow between components
	a.setupDataFlow(ctx)

	return nil
}

// setupDataFlow configures data flow between components
func (a *Agent) setupDataFlow(ctx context.Context) {
	go func() {
		ticker := time.NewTicker(a.config.Collection.Interval)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				a.performSync(ctx)
			}
		}
	}()
}

// performSync collects and sends data to the BuboIQ server
func (a *Agent) performSync(ctx context.Context) {
	log.Println("🔄 Starting sync cycle...")

	// Collect device inventory
	inventory, err := a.collector.CollectInventory(ctx)
	if err != nil {
		log.Printf("❌ Failed to collect inventory: %v", err)
		return
	}

	// Collect health metrics
	healthMetrics, err := a.health.CollectMetrics(ctx)
	if err != nil {
		log.Printf("❌ Failed to collect health metrics: %v", err)
		return
	}

	// Collect discovery data (if enabled)
	var discoveryData *discovery.ScanResults
	if a.discovery != nil {
		discoveryData, err = a.discovery.GetResults(ctx)
		if err != nil {
			log.Printf("⚠️  Failed to collect discovery data: %v", err)
		}
	}

	// Send data to server
	payload := &transport.DevicePayload{
		OrgID:         a.config.Organization.ID,
		Device:        inventory,
		Health:        healthMetrics,
		Discovery:     discoveryData,
		AgentVersion:  AgentVersion,
		Timestamp:     time.Now(),
	}

	if err := a.transport.SendDeviceData(ctx, payload); err != nil {
		log.Printf("❌ Failed to send device data: %v", err)
		return
	}

	// Check for remote commands
	commands, err := a.transport.GetPendingCommands(ctx)
	if err != nil {
		log.Printf("⚠️  Failed to check for commands: %v", err)
	} else if len(commands) > 0 {
		log.Printf("📝 Processing %d remote commands", len(commands))
		a.remote.ProcessCommands(ctx, commands)
	}

	log.Println("✅ Sync cycle completed")
}

// shutdown gracefully stops all components
func (a *Agent) shutdown(ctx context.Context) error {
	log.Println("🛑 Shutting down components...")

	// Stop components in reverse order
	if a.transport != nil {
		if err := a.transport.Stop(ctx); err != nil {
			log.Printf("⚠️  Transport shutdown error: %v", err)
		}
	}

	if a.remote != nil {
		if err := a.remote.Stop(ctx); err != nil {
			log.Printf("⚠️  Remote handler shutdown error: %v", err)
		}
	}

	if a.discovery != nil {
		if err := a.discovery.Stop(ctx); err != nil {
			log.Printf("⚠️  Discovery scanner shutdown error: %v", err)
		}
	}

	if a.collector != nil {
		if err := a.collector.Stop(ctx); err != nil {
			log.Printf("⚠️  Collector shutdown error: %v", err)
		}
	}

	if a.health != nil {
		if err := a.health.Stop(ctx); err != nil {
			log.Printf("⚠️  Health monitor shutdown error: %v", err)
		}
	}

	return nil
}

// Stop requests the agent to stop
func (a *Agent) Stop() {
	close(a.stopCh)
	<-a.done
}

// getDefaultConfigPath returns the platform-specific default config path
func getDefaultConfigPath() string {
	switch platform.GetOS() {
	case "windows":
		return WindowsConfigPath
	case "darwin":
		return macOSConfigPath
	default:
		return DefaultConfigPath
	}
}

// handleServiceCommand handles service management commands
func handleServiceCommand(command, configPath string) error {
	svc, err := platform.NewService(&platform.ServiceConfig{
		Name:        "BuboIQAgent",
		DisplayName: "BuboIQ Endpoint Agent",
		Description: "BuboIQ intelligent IT support monitoring agent",
		Executable:  os.Args[0],
		Arguments:   []string{"-config", configPath},
	})
	if err != nil {
		return fmt.Errorf("failed to create service: %w", err)
	}

	switch command {
	case "install":
		return svc.Install()
	case "uninstall":
		return svc.Uninstall()
	case "start":
		return svc.Start()
	case "stop":
		return svc.Stop()
	default:
		return fmt.Errorf("unknown service command: %s", command)
	}
}

// handleEnrollment handles device enrollment with an organization
func handleEnrollment(enrollmentCode, configPath string) error {
	log.Printf("🔐 Enrolling device with code: %s", enrollmentCode)

	// Parse enrollment code
	enrollment, err := config.ParseEnrollmentCode(enrollmentCode)
	if err != nil {
		return fmt.Errorf("invalid enrollment code: %w", err)
	}

	// Generate device ID and credentials
	deviceInfo, err := platform.GetDeviceInfo()
	if err != nil {
		return fmt.Errorf("failed to get device info: %w", err)
	}

	// Create enrollment client
	enrollClient := transport.NewEnrollmentClient(enrollment.ServerURL)

	// Perform enrollment
	enrollResponse, err := enrollClient.EnrollDevice(context.Background(), &transport.EnrollmentRequest{
		Code:         enrollmentCode,
		DeviceInfo:   deviceInfo,
		AgentVersion: AgentVersion,
	})
	if err != nil {
		return fmt.Errorf("enrollment failed: %w", err)
	}

	// Create configuration
	cfg := &config.Config{
		Organization: config.Organization{
			ID:   enrollResponse.OrgID,
			Name: enrollResponse.OrgName,
		},
		Device: config.Device{
			ID:   enrollResponse.DeviceID,
			Name: deviceInfo.Hostname,
		},
		Server: config.Server{
			URL: enrollment.ServerURL,
		},
		Auth: config.Auth{
			APIKey: enrollResponse.APIKey,
		},
		Security: config.Security{
			TLS: enrollResponse.TLSConfig,
		},
		Collection: config.Collection{
			Interval:     5 * time.Minute,
			DeltaEnabled: true,
		},
		Privacy: config.Privacy{
			CollectSoftware: true,
			BYODRedaction:   "limited",
		},
		Remote: config.Remote{
			Enabled:        true,
			RequireConsent: true,
			SessionTimeout: 30 * time.Minute,
		},
	}

	// Ensure config directory exists
	configDir := filepath.Dir(configPath)
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	// Save configuration
	if err := cfg.Save(configPath); err != nil {
		return fmt.Errorf("failed to save configuration: %w", err)
	}

	log.Printf("✅ Configuration saved to: %s", configPath)
	return nil
}