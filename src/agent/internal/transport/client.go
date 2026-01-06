package transport

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/buboiq/agent/internal/collector"
	"github.com/buboiq/agent/internal/discovery"
	"github.com/buboiq/agent/internal/health"
)

// Config holds transport client configuration
type Config struct {
	BaseURL     string
	OrgID       string
	DeviceID    string
	APIKey      string
	TLSConfig   *tls.Config
	Timeout     time.Duration
	RetryConfig *RetryConfig
}

// RetryConfig holds retry configuration
type RetryConfig struct {
	MaxRetries   int
	InitialDelay time.Duration
	MaxDelay     time.Duration
	Multiplier   float64
}

// Client handles communication with the BuboIQ server
type Client struct {
	config     *Config
	httpClient *http.Client
	baseURL    string
	headers    map[string]string
}

// DevicePayload represents the data sent to the server
type DevicePayload struct {
	OrgID        string                     `json:"org_id"`
	Device       *collector.DeviceInventory `json:"device"`
	Health       *health.Metrics            `json:"health,omitempty"`
	Discovery    *discovery.ScanResults     `json:"discovery,omitempty"`
	AgentVersion string                     `json:"agent_version"`
	Timestamp    time.Time                  `json:"timestamp"`
}

// Command represents a remote command from the server
type Command struct {
	ID          string                 `json:"id"`
	Type        string                 `json:"type"`
	Parameters  map[string]interface{} `json:"parameters"`
	Timeout     time.Duration          `json:"timeout"`
	CreatedAt   time.Time              `json:"created_at"`
	ExpiresAt   time.Time              `json:"expires_at"`
}

// CommandResponse represents the result of executing a command
type CommandResponse struct {
	ID        string                 `json:"id"`
	Success   bool                   `json:"success"`
	Output    string                 `json:"output,omitempty"`
	Error     string                 `json:"error,omitempty"`
	ExitCode  int                    `json:"exit_code,omitempty"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
	Duration  time.Duration          `json:"duration"`
	Timestamp time.Time              `json:"timestamp"`
}

// EnrollmentRequest represents device enrollment data
type EnrollmentRequest struct {
	Code         string                  `json:"code"`
	DeviceInfo   *DeviceInfo             `json:"device_info"`
	AgentVersion string                  `json:"agent_version"`
}

// EnrollmentResponse represents enrollment response
type EnrollmentResponse struct {
	OrgID      string     `json:"org_id"`
	OrgName    string     `json:"org_name"`
	DeviceID   string     `json:"device_id"`
	APIKey     string     `json:"api_key"`
	TLSConfig  *tls.Config `json:"tls_config,omitempty"`
}

// DeviceInfo represents basic device information for enrollment
type DeviceInfo struct {
	Hostname     string `json:"hostname"`
	Platform     string `json:"platform"`
	Architecture string `json:"architecture"`
	Serial       string `json:"serial,omitempty"`
	UUID         string `json:"uuid,omitempty"`
	MAC          string `json:"mac,omitempty"`
}

// NewClient creates a new transport client
func NewClient(cfg *Config) (*Client, error) {
	if cfg.BaseURL == "" {
		return nil, fmt.Errorf("base URL is required")
	}
	
	if cfg.OrgID == "" {
		return nil, fmt.Errorf("organization ID is required")
	}
	
	if cfg.DeviceID == "" {
		return nil, fmt.Errorf("device ID is required")
	}
	
	if cfg.APIKey == "" {
		return nil, fmt.Errorf("API key is required")
	}

	// Set default timeout
	if cfg.Timeout == 0 {
		cfg.Timeout = 30 * time.Second
	}

	// Set default retry config
	if cfg.RetryConfig == nil {
		cfg.RetryConfig = &RetryConfig{
			MaxRetries:   3,
			InitialDelay: 1 * time.Second,
			MaxDelay:     30 * time.Second,
			Multiplier:   2.0,
		}
	}

	// Create HTTP client with custom TLS config
	tlsConfig := cfg.TLSConfig
	if tlsConfig == nil {
		tlsConfig = &tls.Config{
			MinVersion: tls.VersionTLS13,
		}
	}

	httpClient := &http.Client{
		Timeout: cfg.Timeout,
		Transport: &http.Transport{
			TLSClientConfig:       tlsConfig,
			DisableCompression:    false,
			IdleConnTimeout:       90 * time.Second,
			TLSHandshakeTimeout:   10 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,
			MaxIdleConns:          10,
			MaxIdleConnsPerHost:   2,
		},
	}

	// Prepare headers
	headers := map[string]string{
		"Content-Type":    "application/json",
		"Accept":          "application/json",
		"User-Agent":      fmt.Sprintf("BuboIQ-Agent/1.0.0 (%s)", cfg.DeviceID),
		"Authorization":   fmt.Sprintf("Bearer %s", cfg.APIKey),
		"X-Org-ID":        cfg.OrgID,
		"X-Device-ID":     cfg.DeviceID,
	}

	return &Client{
		config:     cfg,
		httpClient: httpClient,
		baseURL:    cfg.BaseURL,
		headers:    headers,
	}, nil
}

// Start initializes the transport client
func (c *Client) Start(ctx context.Context) error {
	log.Println("🌐 Starting transport client...")
	
	// Test connectivity
	if err := c.testConnectivity(ctx); err != nil {
		return fmt.Errorf("connectivity test failed: %w", err)
	}
	
	log.Println("✅ Transport client started successfully")
	return nil
}

// Stop gracefully stops the transport client
func (c *Client) Stop(ctx context.Context) error {
	log.Println("🛑 Stopping transport client...")
	
	// Send final device update
	// Note: This would typically include a "going offline" signal
	
	return nil
}

// SendDeviceData sends device inventory and metrics to the server
func (c *Client) SendDeviceData(ctx context.Context, payload *DevicePayload) error {
	log.Printf("📤 Sending device data (hash: %s)", payload.Device.Hash)
	
	// Check if this is a delta update
	isDelta := payload.Device.DeltaOf != ""
	
	endpoint := "/ingest/device"
	if isDelta {
		log.Printf("📦 Sending delta update (previous: %s)", payload.Device.DeltaOf[:8])
	}

	resp, err := c.makeRequest(ctx, "POST", endpoint, payload)
	if err != nil {
		return fmt.Errorf("failed to send device data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	log.Println("✅ Device data sent successfully")
	return nil
}

// GetPendingCommands retrieves pending remote commands from the server
func (c *Client) GetPendingCommands(ctx context.Context) ([]Command, error) {
	endpoint := fmt.Sprintf("/agent/commands?device_id=%s", c.config.DeviceID)
	
	resp, err := c.makeRequest(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get pending commands: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent {
		return nil, nil // No commands pending
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	var response struct {
		Commands []Command `json:"commands"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode commands response: %w", err)
	}

	if len(response.Commands) > 0 {
		log.Printf("📝 Retrieved %d pending commands", len(response.Commands))
	}

	return response.Commands, nil
}

// SendCommandResponse sends the result of a command execution back to the server
func (c *Client) SendCommandResponse(ctx context.Context, response *CommandResponse) error {
	endpoint := fmt.Sprintf("/agent/commands/%s/response", response.ID)
	
	resp, err := c.makeRequest(ctx, "POST", endpoint, response)
	if err != nil {
		return fmt.Errorf("failed to send command response: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	log.Printf("✅ Command response sent for %s", response.ID)
	return nil
}

// AcknowledgeCommand acknowledges receipt of a command
func (c *Client) AcknowledgeCommand(ctx context.Context, commandID string) error {
	endpoint := fmt.Sprintf("/agent/commands/%s/ack", commandID)
	
	ackData := map[string]interface{}{
		"acknowledged_at": time.Now(),
		"device_id":       c.config.DeviceID,
	}
	
	resp, err := c.makeRequest(ctx, "POST", endpoint, ackData)
	if err != nil {
		return fmt.Errorf("failed to acknowledge command: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

// CheckForUpdates checks if there's a newer version of the agent available
func (c *Client) CheckForUpdates(ctx context.Context, currentVersion string) (*UpdateInfo, error) {
	endpoint := fmt.Sprintf("/agent/update?version=%s&platform=%s&arch=%s", 
		currentVersion, c.getPlatform(), c.getArchitecture())
	
	resp, err := c.makeRequest(ctx, "GET", endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to check for updates: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNoContent {
		return nil, nil // No updates available
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	var updateInfo UpdateInfo
	if err := json.NewDecoder(resp.Body).Decode(&updateInfo); err != nil {
		return nil, fmt.Errorf("failed to decode update response: %w", err)
	}

	return &updateInfo, nil
}

// SendSignal sends a real-time signal/event to the server
func (c *Client) SendSignal(ctx context.Context, signal *Signal) error {
	endpoint := "/signals"
	
	resp, err := c.makeRequest(ctx, "POST", endpoint, signal)
	if err != nil {
		return fmt.Errorf("failed to send signal: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("server error %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

// makeRequest makes an HTTP request with retry logic
func (c *Client) makeRequest(ctx context.Context, method, endpoint string, body interface{}) (*http.Response, error) {
	url := c.baseURL + endpoint
	
	var bodyReader io.Reader
	if body != nil {
		jsonData, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(jsonData)
	}

	return c.makeRequestWithRetry(ctx, method, url, bodyReader, 0)
}

// makeRequestWithRetry implements exponential backoff retry logic
func (c *Client) makeRequestWithRetry(ctx context.Context, method, url string, body io.Reader, attempt int) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, method, url, body)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Add headers
	for key, value := range c.headers {
		req.Header.Set(key, value)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		// Check if we should retry
		if attempt < c.config.RetryConfig.MaxRetries && c.shouldRetry(err) {
			delay := c.calculateDelay(attempt)
			log.Printf("🔄 Request failed, retrying in %v (attempt %d/%d): %v", 
				delay, attempt+1, c.config.RetryConfig.MaxRetries, err)
			
			timer := time.NewTimer(delay)
			defer timer.Stop()
			
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-timer.C:
				// Reset body reader if possible
				if seeker, ok := body.(io.Seeker); ok {
					seeker.Seek(0, io.SeekStart)
				}
				return c.makeRequestWithRetry(ctx, method, url, body, attempt+1)
			}
		}
		return nil, err
	}

	// Check for server errors that should trigger a retry
	if resp.StatusCode >= 500 && attempt < c.config.RetryConfig.MaxRetries {
		resp.Body.Close()
		
		delay := c.calculateDelay(attempt)
		log.Printf("🔄 Server error %d, retrying in %v (attempt %d/%d)", 
			resp.StatusCode, delay, attempt+1, c.config.RetryConfig.MaxRetries)
		
		timer := time.NewTimer(delay)
		defer timer.Stop()
		
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-timer.C:
			// Reset body reader if possible
			if seeker, ok := body.(io.Seeker); ok {
				seeker.Seek(0, io.SeekStart)
			}
			return c.makeRequestWithRetry(ctx, method, url, body, attempt+1)
		}
	}

	return resp, nil
}

// shouldRetry determines if an error is retryable
func (c *Client) shouldRetry(err error) bool {
	// Retry on network errors, timeouts, and temporary errors
	return true // Simplified for this example
}

// calculateDelay calculates the delay for exponential backoff
func (c *Client) calculateDelay(attempt int) time.Duration {
	delay := time.Duration(float64(c.config.RetryConfig.InitialDelay) * 
		pow(c.config.RetryConfig.Multiplier, float64(attempt)))
	
	if delay > c.config.RetryConfig.MaxDelay {
		delay = c.config.RetryConfig.MaxDelay
	}
	
	return delay
}

// testConnectivity tests the connection to the server
func (c *Client) testConnectivity(ctx context.Context) error {
	endpoint := "/agent/ping"
	
	pingData := map[string]interface{}{
		"device_id": c.config.DeviceID,
		"timestamp": time.Now(),
	}
	
	resp, err := c.makeRequest(ctx, "POST", endpoint, pingData)
	if err != nil {
		return fmt.Errorf("ping request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("ping failed with status %d: %s", resp.StatusCode, string(body))
	}

	log.Println("🏓 Connectivity test passed")
	return nil
}

// getPlatform returns the current platform
func (c *Client) getPlatform() string {
	// This would be implemented to return the platform string
	return "linux" // placeholder
}

// getArchitecture returns the current architecture
func (c *Client) getArchitecture() string {
	// This would be implemented to return the architecture string
	return "amd64" // placeholder
}

// pow calculates x^y for float64
func pow(x, y float64) float64 {
	result := 1.0
	for i := 0; i < int(y); i++ {
		result *= x
	}
	return result
}

// UpdateInfo represents available update information
type UpdateInfo struct {
	Version     string    `json:"version"`
	DownloadURL string    `json:"download_url"`
	Checksum    string    `json:"checksum"`
	ReleaseDate time.Time `json:"release_date"`
	Critical    bool      `json:"critical"`
	Changelog   string    `json:"changelog"`
}

// Signal represents a real-time event/signal
type Signal struct {
	Type        string                 `json:"type"`
	Severity    string                 `json:"severity"`
	Title       string                 `json:"title"`
	Description string                 `json:"description"`
	Metadata    map[string]interface{} `json:"metadata"`
	Timestamp   time.Time              `json:"timestamp"`
	DeviceID    string                 `json:"device_id"`
}