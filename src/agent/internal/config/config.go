package config

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

// Config holds the complete agent configuration
type Config struct {
	// Core configuration
	Agent        Agent        `yaml:"agent"`
	Organization Organization `yaml:"organization"`
	Device       Device       `yaml:"device"`
	Server       Server       `yaml:"server"`
	Auth         Auth         `yaml:"auth"`
	
	// Feature configuration
	Collection Collection `yaml:"collection"`
	Health     Health     `yaml:"health"`
	Discovery  Discovery  `yaml:"discovery"`
	Remote     Remote     `yaml:"remote"`
	Updates    Updates    `yaml:"updates"`
	
	// Security and privacy
	Security Security `yaml:"security"`
	Privacy  Privacy  `yaml:"privacy"`
	
	// Transport and networking
	Transport Transport `yaml:"transport"`
	Logging   Logging   `yaml:"logging"`
	
	// Internal state
	configPath string
	enrolled   bool
}

// Agent holds agent-specific configuration
type Agent struct {
	Version     string `yaml:"version"`
	BuildDate   string `yaml:"build_date"`
	Commit      string `yaml:"commit"`
	Environment string `yaml:"environment"` // development, staging, production
}

// Organization holds organization information
type Organization struct {
	ID                string `yaml:"id"`
	Name              string `yaml:"name"`
	EnrollmentCode    string `yaml:"enrollment_code"`
	Tier              string `yaml:"tier"` // starter, pro, team
}

// Device holds device-specific information
type Device struct {
	ID          string            `yaml:"id"`
	Name        string            `yaml:"name"`
	Type        string            `yaml:"type"` // workstation, server, laptop, mobile
	Location    string            `yaml:"location"`
	Owner       string            `yaml:"owner"`
	Department  string            `yaml:"department"`
	Tags        []string          `yaml:"tags"`
	Metadata    map[string]string `yaml:"metadata"`
}

// Server holds server connection information
type Server struct {
	URL                string        `yaml:"url"`
	Timeout            time.Duration `yaml:"timeout"`
	HealthCheckURL     string        `yaml:"health_check_url"`
	HealthCheckInterval time.Duration `yaml:"health_check_interval"`
}

// Auth holds authentication configuration
type Auth struct {
	APIKey           string    `yaml:"api_key"`
	RefreshToken     string    `yaml:"refresh_token,omitempty"`
	TokenExpiry      time.Time `yaml:"token_expiry,omitempty"`
	CertificatePath  string    `yaml:"certificate_path,omitempty"`
	PrivateKeyPath   string    `yaml:"private_key_path,omitempty"`
	MutualTLS        bool      `yaml:"mutual_tls"`
}

// Collection holds data collection configuration
type Collection struct {
	Interval            time.Duration `yaml:"interval"`
	DeltaEnabled        bool          `yaml:"delta_enabled"`
	CompressionEnabled  bool          `yaml:"compression_enabled"`
	BatchSize           int           `yaml:"batch_size"`
	MaxRetries          int           `yaml:"max_retries"`
	BackoffMultiplier   float64       `yaml:"backoff_multiplier"`
}

// Health holds health monitoring configuration
type Health struct {
	MetricsInterval    time.Duration `yaml:"metrics_interval"`
	EnablePredictive   bool          `yaml:"enable_predictive"`
	Thresholds         *Thresholds   `yaml:"thresholds"`
	AlertCooldown      time.Duration `yaml:"alert_cooldown"`
	HistoryRetention   time.Duration `yaml:"history_retention"`
}

// Thresholds holds alert threshold configuration
type Thresholds struct {
	CPUPercent     float64 `yaml:"cpu_percent"`
	MemoryPercent  float64 `yaml:"memory_percent"`
	DiskPercent    float64 `yaml:"disk_percent"`
	TempCelsius    float64 `yaml:"temp_celsius"`
	BatteryPercent float64 `yaml:"battery_percent"`
	NetworkLatency float64 `yaml:"network_latency_ms"`
}

// Discovery holds network discovery configuration
type Discovery struct {
	Enabled          bool                     `yaml:"enabled"`
	ScanInterval     time.Duration            `yaml:"scan_interval"`
	Profiles         map[string]ScanProfile   `yaml:"profiles"`
	Credentials      map[string]Credential    `yaml:"credentials"`
	MaxConcurrency   int                      `yaml:"max_concurrency"`
	TimeoutPerHost   time.Duration            `yaml:"timeout_per_host"`
	PortRanges       []string                 `yaml:"port_ranges"`
}

// ScanProfile defines a discovery scan profile
type ScanProfile struct {
	Name        string                 `yaml:"name"`
	Type        string                 `yaml:"type"` // ping, nmap, snmp, wmi, ssh, mdns
	Parameters  map[string]interface{} `yaml:"parameters"`
	Enabled     bool                   `yaml:"enabled"`
	Description string                 `yaml:"description"`
}

// Credential holds encrypted credential information
type Credential struct {
	Type        string                 `yaml:"type"` // snmpv3, windows_wmi, ssh_key, ssh_password
	Label       string                 `yaml:"label"`
	Username    string                 `yaml:"username,omitempty"`
	Domain      string                 `yaml:"domain,omitempty"`
	Scope       []string               `yaml:"scope"` // IP ranges or hostnames
	Parameters  map[string]interface{} `yaml:"parameters"`
	CreatedAt   time.Time              `yaml:"created_at"`
	ExpiresAt   *time.Time             `yaml:"expires_at,omitempty"`
}

// Remote holds remote access configuration
type Remote struct {
	Enabled           bool          `yaml:"enabled"`
	RequireConsent    bool          `yaml:"require_consent"`
	SessionTimeout    time.Duration `yaml:"session_timeout"`
	RecordSessions    bool          `yaml:"record_sessions"`
	AllowedProviders  []string      `yaml:"allowed_providers"` // rustdesk, teamviewer, vnc, ssh
	MaxConcurrentSessions int       `yaml:"max_concurrent_sessions"`
	ConsentTimeout    time.Duration `yaml:"consent_timeout"`
}

// Updates holds auto-update configuration
type Updates struct {
	Enabled       bool          `yaml:"enabled"`
	Channel       string        `yaml:"channel"` // stable, beta, alpha
	CheckInterval time.Duration `yaml:"check_interval"`
	AutoUpdate    bool          `yaml:"auto_update"`
	BackupEnabled bool          `yaml:"backup_enabled"`
	MaintenanceWindow *MaintenanceWindow `yaml:"maintenance_window,omitempty"`
}

// MaintenanceWindow defines when updates can be applied
type MaintenanceWindow struct {
	StartHour int      `yaml:"start_hour"` // 0-23
	EndHour   int      `yaml:"end_hour"`   // 0-23
	Days      []string `yaml:"days"`       // monday, tuesday, etc.
	Timezone  string   `yaml:"timezone"`   // America/New_York, etc.
}

// Security holds security configuration
type Security struct {
	TLS            *TLSConfig `yaml:"tls"`
	CertPinning    bool       `yaml:"cert_pinning"`
	AllowedDomains []string   `yaml:"allowed_domains"`
	ProxySettings  *ProxyConfig `yaml:"proxy,omitempty"`
	EncryptionKey  string     `yaml:"encryption_key,omitempty"`
}

// TLSConfig holds TLS configuration
type TLSConfig struct {
	MinVersion         string   `yaml:"min_version"` // 1.2, 1.3
	CipherSuites       []string `yaml:"cipher_suites,omitempty"`
	VerifyCertificates bool     `yaml:"verify_certificates"`
	ServerName         string   `yaml:"server_name,omitempty"`
	Pins               []string `yaml:"pins,omitempty"` // SHA256 hashes
}

// ProxyConfig holds proxy configuration
type ProxyConfig struct {
	Type     string `yaml:"type"` // http, socks5
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username,omitempty"`
	Password string `yaml:"password,omitempty"`
	NoProxy  []string `yaml:"no_proxy,omitempty"`
}

// Privacy holds privacy and data collection settings
type Privacy struct {
	CollectSoftware    bool   `yaml:"collect_software"`
	BYODRedaction      string `yaml:"byod_redaction"` // none, limited, strict
	DataRetentionDays  int    `yaml:"data_retention_days"`
	AnonymousMetrics   bool   `yaml:"anonymous_metrics"`
	CrashReporting     bool   `yaml:"crash_reporting"`
	PersonalDataFilter bool   `yaml:"personal_data_filter"`
}

// Transport holds network transport configuration
type Transport struct {
	MaxIdleConns        int           `yaml:"max_idle_conns"`
	IdleConnTimeout     time.Duration `yaml:"idle_conn_timeout"`
	TLSHandshakeTimeout time.Duration `yaml:"tls_handshake_timeout"`
	ResponseHeaderTimeout time.Duration `yaml:"response_header_timeout"`
	Retry               *RetryConfig  `yaml:"retry"`
}

// RetryConfig holds retry configuration
type RetryConfig struct {
	MaxRetries   int           `yaml:"max_retries"`
	InitialDelay time.Duration `yaml:"initial_delay"`
	MaxDelay     time.Duration `yaml:"max_delay"`
	Multiplier   float64       `yaml:"multiplier"`
}

// Logging holds logging configuration
type Logging struct {
	Level        string `yaml:"level"` // debug, info, warn, error
	Format       string `yaml:"format"` // json, text
	File         string `yaml:"file,omitempty"`
	MaxSize      int    `yaml:"max_size"` // MB
	MaxBackups   int    `yaml:"max_backups"`
	MaxAge       int    `yaml:"max_age"` // days
	Compress     bool   `yaml:"compress"`
	SyslogURL    string `yaml:"syslog_url,omitempty"`
}

// EnrollmentCode represents a parsed enrollment code
type EnrollmentCode struct {
	Organization string
	Year         int
	Identifier   string
	Checksum     string
	ServerURL    string
}

// Load loads configuration from file
func Load(configPath string) (*Config, error) {
	data, err := ioutil.ReadFile(configPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Return default configuration
			return NewDefaultConfig(configPath), nil
		}
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}
	
	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}
	
	config.configPath = configPath
	config.enrolled = config.Organization.ID != "" && config.Auth.APIKey != ""
	
	return &config, nil
}

// NewDefaultConfig creates a default configuration
func NewDefaultConfig(configPath string) *Config {
	return &Config{
		Agent: Agent{
			Version:     "1.0.0",
			Environment: "production",
		},
		Server: Server{
			URL:                 "https://api.buboiq.com",
			Timeout:             30 * time.Second,
			HealthCheckURL:      "/health",
			HealthCheckInterval: 5 * time.Minute,
		},
		Collection: Collection{
			Interval:           5 * time.Minute,
			DeltaEnabled:       true,
			CompressionEnabled: true,
			BatchSize:          100,
			MaxRetries:         3,
			BackoffMultiplier:  2.0,
		},
		Health: Health{
			MetricsInterval:  30 * time.Second,
			EnablePredictive: false,
			Thresholds: &Thresholds{
				CPUPercent:     80.0,
				MemoryPercent:  85.0,
				DiskPercent:    90.0,
				TempCelsius:    80.0,
				BatteryPercent: 20.0,
				NetworkLatency: 1000.0,
			},
			AlertCooldown:    5 * time.Minute,
			HistoryRetention: 24 * time.Hour,
		},
		Discovery: Discovery{
			Enabled:        false, // Requires Pro tier
			ScanInterval:   1 * time.Hour,
			Profiles:       make(map[string]ScanProfile),
			Credentials:    make(map[string]Credential),
			MaxConcurrency: 10,
			TimeoutPerHost: 30 * time.Second,
			PortRanges:     []string{"22", "80", "443", "3389", "5900"},
		},
		Remote: Remote{
			Enabled:              true,
			RequireConsent:       true,
			SessionTimeout:       30 * time.Minute,
			RecordSessions:       false,
			AllowedProviders:     []string{"rustdesk", "ssh"},
			MaxConcurrentSessions: 1,
			ConsentTimeout:       2 * time.Minute,
		},
		Updates: Updates{
			Enabled:       true,
			Channel:       "stable",
			CheckInterval: 4 * time.Hour,
			AutoUpdate:    true,
			BackupEnabled: true,
		},
		Security: Security{
			TLS: &TLSConfig{
				MinVersion:         "1.3",
				VerifyCertificates: true,
			},
			CertPinning:    false,
			AllowedDomains: []string{"buboiq.com", "*.buboiq.com"},
		},
		Privacy: Privacy{
			CollectSoftware:    true,
			BYODRedaction:      "limited",
			DataRetentionDays:  90,
			AnonymousMetrics:   true,
			CrashReporting:     true,
			PersonalDataFilter: true,
		},
		Transport: Transport{
			MaxIdleConns:          10,
			IdleConnTimeout:       90 * time.Second,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 30 * time.Second,
			Retry: &RetryConfig{
				MaxRetries:   3,
				InitialDelay: 1 * time.Second,
				MaxDelay:     30 * time.Second,
				Multiplier:   2.0,
			},
		},
		Logging: Logging{
			Level:      "info",
			Format:     "text",
			MaxSize:    10, // 10MB
			MaxBackups: 5,
			MaxAge:     30, // 30 days
			Compress:   true,
		},
		configPath: configPath,
		enrolled:   false,
	}
}

// Save saves the configuration to file
func (c *Config) Save() error {
	if c.configPath == "" {
		return fmt.Errorf("no config path set")
	}
	
	// Ensure directory exists
	dir := filepath.Dir(c.configPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}
	
	data, err := yaml.Marshal(c)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}
	
	return ioutil.WriteFile(c.configPath, data, 0644)
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.Server.URL == "" {
		return fmt.Errorf("server URL is required")
	}
	
	if c.enrolled {
		if c.Organization.ID == "" {
			return fmt.Errorf("organization ID is required when enrolled")
		}
		if c.Device.ID == "" {
			return fmt.Errorf("device ID is required when enrolled")
		}
		if c.Auth.APIKey == "" {
			return fmt.Errorf("API key is required when enrolled")
		}
	}
	
	// Validate collection interval
	if c.Collection.Interval < 1*time.Minute {
		return fmt.Errorf("collection interval must be at least 1 minute")
	}
	
	// Validate health thresholds
	if c.Health.Thresholds != nil {
		t := c.Health.Thresholds
		if t.CPUPercent <= 0 || t.CPUPercent > 100 {
			return fmt.Errorf("CPU threshold must be between 0 and 100")
		}
		if t.MemoryPercent <= 0 || t.MemoryPercent > 100 {
			return fmt.Errorf("memory threshold must be between 0 and 100")
		}
		if t.DiskPercent <= 0 || t.DiskPercent > 100 {
			return fmt.Errorf("disk threshold must be between 0 and 100")
		}
	}
	
	// Validate TLS configuration
	if c.Security.TLS != nil {
		if c.Security.TLS.MinVersion != "1.2" && c.Security.TLS.MinVersion != "1.3" {
			return fmt.Errorf("TLS min version must be 1.2 or 1.3")
		}
	}
	
	return nil
}

// IsEnrolled returns true if the agent is enrolled
func (c *Config) IsEnrolled() bool {
	return c.enrolled
}

// SetEnrolled sets the enrollment status
func (c *Config) SetEnrolled(enrolled bool) {
	c.enrolled = enrolled
}

// GetTLSConfig returns a *tls.Config based on the security settings
func (c *Config) GetTLSConfig() *tls.Config {
	if c.Security.TLS == nil {
		return &tls.Config{
			MinVersion: tls.VersionTLS13,
		}
	}
	
	tlsConfig := &tls.Config{
		InsecureSkipVerify: !c.Security.TLS.VerifyCertificates,
		ServerName:         c.Security.TLS.ServerName,
	}
	
	// Set minimum TLS version
	switch c.Security.TLS.MinVersion {
	case "1.2":
		tlsConfig.MinVersion = tls.VersionTLS12
	case "1.3":
		tlsConfig.MinVersion = tls.VersionTLS13
	default:
		tlsConfig.MinVersion = tls.VersionTLS13
	}
	
	// Set cipher suites (TLS 1.2 only)
	if len(c.Security.TLS.CipherSuites) > 0 && tlsConfig.MinVersion == tls.VersionTLS12 {
		tlsConfig.CipherSuites = parseCipherSuites(c.Security.TLS.CipherSuites)
	}
	
	return tlsConfig
}

// ParseEnrollmentCode parses an enrollment code
func ParseEnrollmentCode(code string) (*EnrollmentCode, error) {
	// Format: ORG-YYYY-XXXXXX-CHECKSUM or ORG-YYYY-XXXXXX-CHECKSUM@server.com
	parts := strings.Split(code, "@")
	
	enrollmentPart := parts[0]
	serverURL := "https://api.buboiq.com" // default
	
	if len(parts) == 2 {
		serverURL = "https://" + parts[1]
	}
	
	// Parse enrollment part
	re := regexp.MustCompile(`^([A-Z0-9]{2,8})-(\d{4})-([A-Z0-9]{6})-([A-Z0-9]{6})$`)
	matches := re.FindStringSubmatch(enrollmentPart)
	
	if len(matches) != 5 {
		return nil, fmt.Errorf("invalid enrollment code format")
	}
	
	year, err := strconv.Atoi(matches[2])
	if err != nil {
		return nil, fmt.Errorf("invalid year in enrollment code")
	}
	
	return &EnrollmentCode{
		Organization: matches[1],
		Year:         year,
		Identifier:   matches[3],
		Checksum:     matches[4],
		ServerURL:    serverURL,
	}, nil
}

// parseCipherSuites converts cipher suite names to IDs
func parseCipherSuites(suites []string) []uint16 {
	var result []uint16
	
	suiteMap := map[string]uint16{
		"TLS_AES_256_GCM_SHA384":                   tls.TLS_AES_256_GCM_SHA384,
		"TLS_CHACHA20_POLY1305_SHA256":            tls.TLS_CHACHA20_POLY1305_SHA256,
		"TLS_AES_128_GCM_SHA256":                  tls.TLS_AES_128_GCM_SHA256,
		"TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384":   tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
		"TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305":    tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256,
		"TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384": tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
		"TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305":  tls.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256,
	}
	
	for _, suite := range suites {
		if id, ok := suiteMap[suite]; ok {
			result = append(result, id)
		}
	}
	
	return result
}

// ToJSON converts the config to JSON for API calls
func (c *Config) ToJSON() ([]byte, error) {
	return json.Marshal(c)
}

// FromJSON loads config from JSON
func (c *Config) FromJSON(data []byte) error {
	return json.Unmarshal(data, c)
}

// GetConfigDir returns the directory containing the config file
func (c *Config) GetConfigDir() string {
	if c.configPath == "" {
		return ""
	}
	return filepath.Dir(c.configPath)
}

// GetLogDir returns the directory for log files
func (c *Config) GetLogDir() string {
	if c.Logging.File == "" {
		return filepath.Join(c.GetConfigDir(), "logs")
	}
	return filepath.Dir(c.Logging.File)
}

// GetCacheDir returns the directory for cache files
func (c *Config) GetCacheDir() string {
	return filepath.Join(c.GetConfigDir(), "cache")
}

// GetBackupDir returns the directory for backup files
func (c *Config) GetBackupDir() string {
	return filepath.Join(c.GetConfigDir(), "backups")
}