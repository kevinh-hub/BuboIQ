# BuboIQ Agent API Endpoints

This document defines the complete REST API for the BuboIQ Endpoint Agent system, including enrollment, device management, health monitoring, and ticket integration.

## Base Configuration

```yaml
Base URL: https://api.buboiq.com
Authentication: Bearer JWT Token
Headers:
  - Authorization: Bearer <jwt_token>
  - X-Org-ID: <organization_uuid>
  - X-Device-ID: <device_uuid> (for device-specific endpoints)
  - Content-Type: application/json
  - User-Agent: BuboIQ-Agent/1.0.0
```

## Authentication & Enrollment

### Device Enrollment
```http
POST /auth/agent/enroll
Content-Type: application/json

{
  "enrollment_code": "ACME-2024-ABC123-DEF456",
  "device_info": {
    "hostname": "LAPTOP-USER-2024",
    "platform": "windows",
    "architecture": "amd64",
    "os_name": "Windows 11 Pro",
    "os_version": "22H2",
    "serial_number": "ABC123DEF456",
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "mac_addresses": ["00:1A:2B:3C:4D:5E"],
    "primary_ip": "10.0.1.156",
    "cpu_model": "Intel Core i7-12700H",
    "cpu_cores": 14,
    "memory_total_mb": 32768,
    "storage_total_gb": 1024
  },
  "agent_version": "1.0.0",
  "capabilities": ["inventory", "health", "remote", "discovery"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "org_id": "org-uuid-here",
    "org_name": "Acme Corporation",
    "org_tier": "pro",
    "device_id": "device-uuid-here",
    "api_key": "encrypted-api-key",
    "config": {
      "collection_interval": "5m",
      "health_interval": "30s",
      "discovery_enabled": true,
      "remote_enabled": true,
      "software_inventory": true
    },
    "tls_config": {
      "min_version": "1.3",
      "cert_pins": ["sha256:YLh1dUR9y6Kja30RrAn7JKnbQG/uEtLMkBgFF2Fuihg="],
      "verify_certificates": true
    },
    "endpoints": {
      "device_sync": "/agent/devices/sync",
      "health": "/agent/health",
      "commands": "/agent/commands",
      "updates": "/agent/updates"
    }
  }
}
```

### Enrollment Code Generation (Admin)
```http
POST /admin/agent/enrollment-codes
Authorization: Bearer <admin_jwt>
X-Org-ID: <org_id>

{
  "expires_in": "24h",
  "max_enrollments": 10,
  "device_restrictions": {
    "platforms": ["windows", "macos", "linux"],
    "require_approval": false
  },
  "agent_config": {
    "collection_interval": "5m",
    "software_inventory": true,
    "remote_access": true
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "enrollment_code": "ACME-2024-XYZ789-ABC123",
    "expires_at": "2024-12-01T23:59:59Z",
    "max_enrollments": 10,
    "current_enrollments": 0,
    "download_urls": {
      "windows": "https://downloads.buboiq.com/agent/windows/BuboIQ-Agent-Setup-1.0.0.exe",
      "macos": "https://downloads.buboiq.com/agent/macos/BuboIQ-Agent-1.0.0.pkg",
      "linux": "https://downloads.buboiq.com/agent/linux/buboiq-agent_1.0.0_amd64.deb"
    }
  }
}
```

## Device Management

### Device Inventory Sync
```http
POST /agent/devices/sync
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "device": {
    "hostname": "LAPTOP-USER-2024",
    "platform": "windows",
    "os": {
      "name": "Windows 11 Pro",
      "version": "22H2",
      "build": "22621.2861",
      "architecture": "amd64",
      "kernel": "NT 10.0.22621"
    },
    "identifiers": {
      "serial": "ABC123DEF456",
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "macs": ["00:1A:2B:3C:4D:5E"],
      "hostname": "LAPTOP-USER-2024",
      "machine_id": "S-1-5-21-1234567890"
    },
    "hardware": {
      "cpu": {
        "model": "Intel Core i7-12700H",
        "vendor": "Intel",
        "cores": 14,
        "threads": 20,
        "base_speed_ghz": 2.3,
        "max_speed_ghz": 4.7,
        "architecture": "x86_64"
      },
      "memory": {
        "total_mb": 32768,
        "modules": [
          {
            "size_mb": 16384,
            "type": "DDR4",
            "speed_mhz": 3200,
            "manufacturer": "Samsung"
          }
        ]
      },
      "gpu": [
        {
          "name": "NVIDIA GeForce RTX 3070",
          "vendor": "NVIDIA",
          "memory_mb": 8192,
          "driver": "531.68"
        }
      ],
      "battery": {
        "present": true,
        "percentage": 85.5,
        "status": "charging",
        "capacity_mwh": 99000
      }
    },
    "network": {
      "primary_ip": "10.0.1.156",
      "hostname": "LAPTOP-USER-2024",
      "domain": "corp.acme.com",
      "adapters": [
        {
          "name": "Ethernet",
          "type": "ethernet",
          "mac": "00:1A:2B:3C:4D:5E",
          "ips": ["10.0.1.156"],
          "speed_mbps": 1000,
          "status": "up"
        }
      ],
      "dns": ["8.8.8.8", "8.8.4.4"]
    },
    "storage": [
      {
        "name": "C:",
        "model": "Samsung SSD 970 EVO Plus",
        "type": "NVMe",
        "size_gb": 1024,
        "free_gb": 487,
        "filesystem": "NTFS",
        "health": "good"
      }
    ]
  },
  "software": [
    {
      "name": "Google Chrome",
      "version": "120.0.6099.109",
      "vendor": "Google LLC",
      "category": "Browser",
      "install_date": "2024-01-10T10:30:00Z",
      "size_bytes": 156000000,
      "signed": true,
      "source": "msi"
    }
  ],
  "events": [
    {
      "type": "system",
      "severity": "info",
      "title": "System Boot",
      "description": "System started successfully",
      "occurred_at": "2024-01-15T08:00:00Z"
    }
  ],
  "metadata": {
    "agent_version": "1.0.0",
    "collection_timestamp": "2024-01-15T10:32:00Z",
    "sync_type": "full", // or "delta"
    "delta_from": "previous-hash-if-delta",
    "hash": "current-inventory-hash"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device_id": "device-uuid-here",
    "sync_accepted": true,
    "changes_detected": true,
    "next_sync_at": "2024-01-15T10:37:00Z",
    "config_update": {
      "collection_interval": "5m",
      "software_inventory": true
    },
    "health_score": 87
  }
}
```

### Get Device Information
```http
GET /agent/devices/{device_id}
Authorization: Bearer <jwt>
X-Org-ID: <org_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": "device-uuid",
      "hostname": "LAPTOP-USER-2024",
      "status": "online",
      "health_score": 87,
      "last_seen_at": "2024-01-15T10:32:00Z",
      "agent_version": "1.0.0"
    },
    "hardware": { /* hardware details */ },
    "network": { /* network details */ },
    "software_count": 156,
    "last_events": [
      {
        "type": "health",
        "severity": "warning",
        "title": "High CPU Usage",
        "occurred_at": "2024-01-15T10:30:00Z"
      }
    ],
    "linked_tickets": [
      {
        "id": "ticket-uuid",
        "title": "Network connectivity issue",
        "status": "open",
        "created_at": "2024-01-15T09:00:00Z"
      }
    ]
  }
}
```

## Health Monitoring

### Health Metrics Submission
```http
POST /agent/health
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "metrics": {
    "cpu": {
      "usage_percent": 23.5,
      "user_percent": 18.2,
      "system_percent": 5.3,
      "idle_percent": 76.5,
      "frequency_mhz": 2800,
      "temperature_celsius": 65.2
    },
    "memory": {
      "total_mb": 32768,
      "used_mb": 19072,
      "available_mb": 13696,
      "usage_percent": 58.2,
      "cached_mb": 4096,
      "swap_total_mb": 4096,
      "swap_used_mb": 0
    },
    "disk": [
      {
        "device": "C:",
        "usage_percent": 72.1,
        "read_bytes_per_sec": 1048576,
        "write_bytes_per_sec": 524288,
        "io_util_percent": 15.3
      }
    ],
    "network": {
      "bytes_sent_per_sec": 102400,
      "bytes_received_per_sec": 204800,
      "packets_sent_per_sec": 150,
      "packets_received_per_sec": 180,
      "errors_per_sec": 0,
      "latency_ms": 12
    },
    "system": {
      "uptime_seconds": 86400,
      "load_average": [1.2, 1.1, 0.9],
      "process_count": 156,
      "thread_count": 892
    },
    "battery": {
      "present": true,
      "percentage": 85.5,
      "status": "charging",
      "time_remaining_minutes": 120
    }
  },
  "alerts": [
    {
      "id": "cpu_high_001",
      "type": "cpu_usage",
      "severity": "warning",
      "title": "High CPU Usage",
      "description": "CPU usage above 80% for 5 minutes",
      "value": 85.2,
      "threshold": 80.0,
      "created_at": "2024-01-15T10:25:00Z"
    }
  ],
  "health_score": 87,
  "collected_at": "2024-01-15T10:32:00Z"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "health_received": true,
    "score_updated": true,
    "alerts_processed": 1,
    "tickets_created": 0,
    "next_collection_at": "2024-01-15T10:32:30Z"
  }
}
```

### Health History
```http
GET /agent/devices/{device_id}/health/history?period=24h&metrics=cpu,memory
Authorization: Bearer <jwt>
X-Org-ID: <org_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device_id": "device-uuid",
    "period": "24h",
    "metrics": {
      "cpu": [
        {"timestamp": "2024-01-15T10:00:00Z", "usage_percent": 25.3},
        {"timestamp": "2024-01-15T10:30:00Z", "usage_percent": 23.5}
      ],
      "memory": [
        {"timestamp": "2024-01-15T10:00:00Z", "usage_percent": 60.1},
        {"timestamp": "2024-01-15T10:30:00Z", "usage_percent": 58.2}
      ]
    },
    "aggregates": {
      "cpu_avg": 24.4,
      "cpu_max": 45.2,
      "memory_avg": 59.1,
      "memory_max": 68.5
    }
  }
}
```

## Remote Commands

### Get Pending Commands
```http
GET /agent/commands?device_id={device_id}&status=pending
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "commands": [
      {
        "id": "cmd-uuid-001",
        "type": "rescan_inventory",
        "name": "Full Inventory Rescan",
        "parameters": {
          "include_software": true,
          "include_hardware": true,
          "force_full_scan": false
        },
        "priority": 5,
        "timeout_seconds": 300,
        "created_by": "admin-user-uuid",
        "created_at": "2024-01-15T10:30:00Z",
        "expires_at": "2024-01-15T11:00:00Z"
      },
      {
        "id": "cmd-uuid-002",
        "type": "collect_logs",
        "name": "Collect Agent Logs",
        "parameters": {
          "log_level": "debug",
          "duration_hours": 1,
          "include_system_logs": false
        },
        "priority": 3,
        "timeout_seconds": 600,
        "created_by": "tech-user-uuid",
        "created_at": "2024-01-15T10:25:00Z",
        "expires_at": "2024-01-15T11:25:00Z"
      }
    ],
    "count": 2
  }
}
```

### Acknowledge Command
```http
POST /agent/commands/{command_id}/acknowledge
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "acknowledged_at": "2024-01-15T10:32:00Z",
  "estimated_duration": 120
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "command_id": "cmd-uuid-001",
    "status": "acknowledged",
    "can_execute": true
  }
}
```

### Submit Command Response
```http
POST /agent/commands/{command_id}/response
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "status": "completed",
  "success": true,
  "started_at": "2024-01-15T10:32:05Z",
  "completed_at": "2024-01-15T10:34:22Z",
  "duration_seconds": 137,
  "output": "Inventory scan completed successfully. Found 156 software packages, 12 hardware components.",
  "result_data": {
    "software_packages": 156,
    "hardware_changes": 0,
    "new_devices_found": 0,
    "scan_duration_ms": 137000
  },
  "exit_code": 0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "command_id": "cmd-uuid-001",
    "response_received": true,
    "status_updated": true
  }
}
```

### Create Remote Command (Admin)
```http
POST /admin/agent/commands
Authorization: Bearer <admin_jwt>
X-Org-ID: <org_id>

{
  "device_ids": ["device-uuid-1", "device-uuid-2"],
  "command_type": "rescan_inventory",
  "name": "Emergency Inventory Scan",
  "parameters": {
    "include_software": true,
    "priority_scan": true,
    "notify_completion": true
  },
  "priority": 8,
  "timeout_seconds": 600,
  "scheduled_at": "2024-01-15T11:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "commands_created": 2,
    "command_ids": ["cmd-uuid-003", "cmd-uuid-004"],
    "scheduled_at": "2024-01-15T11:00:00Z",
    "status": "scheduled"
  }
}
```

## Signal & Event Streaming

### Send Real-time Signal
```http
POST /agent/signals
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "signals": [
    {
      "type": "health_alert",
      "severity": "warning",
      "title": "High CPU Usage Detected",
      "description": "CPU usage has been above 90% for 5 minutes",
      "source": "health_monitor",
      "metadata": {
        "metric": "cpu_usage",
        "current_value": 94.2,
        "threshold": 90.0,
        "duration_seconds": 300,
        "trend": "increasing"
      },
      "occurred_at": "2024-01-15T10:32:00Z",
      "correlation_id": "health-cpu-001"
    },
    {
      "type": "software_change",
      "severity": "info",
      "title": "Software Installation Detected",
      "description": "New software package installed: Google Chrome 121.0.0",
      "source": "inventory_monitor",
      "metadata": {
        "action": "installed",
        "software_name": "Google Chrome",
        "software_version": "121.0.0",
        "publisher": "Google LLC",
        "install_method": "msi"
      },
      "occurred_at": "2024-01-15T10:28:00Z"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "signals_processed": 2,
    "tickets_created": 0,
    "alerts_triggered": 1,
    "notifications_sent": 2
  }
}
```

### Event Stream (Server-Sent Events)
```http
GET /agent/events/stream?device_id={device_id}
Authorization: Bearer <jwt>
X-Org-ID: <org_id>
Accept: text/event-stream
```

**Response (200 OK - Streaming):**
```
data: {"event": "device_status", "device_id": "device-uuid", "status": "online", "timestamp": "2024-01-15T10:32:00Z"}

data: {"event": "health_alert", "device_id": "device-uuid", "alert": {"type": "cpu_high", "severity": "warning"}, "timestamp": "2024-01-15T10:33:00Z"}

data: {"event": "command_received", "device_id": "device-uuid", "command_id": "cmd-uuid-005", "type": "rescan", "timestamp": "2024-01-15T10:34:00Z"}
```

## Ticket Integration

### Create Ticket with Device Context
```http
POST /tickets
Authorization: Bearer <jwt>
X-Org-ID: <org_id>

{
  "title": "Network connectivity issue on LAPTOP-USER-2024",
  "description": "User reports intermittent network connectivity problems.\n\nDevice: LAPTOP-USER-2024\nIP Address: 10.0.1.156\nOS: Windows 11 Pro (22H2)\nHealth Score: 87%\nLast Seen: 2 minutes ago\n\nIssue Details:\nUser cannot access shared network drives intermittently.",
  "priority": "medium",
  "category": "network",
  "requester_name": "Sarah Johnson",
  "requester_email": "sarah.johnson@acme.com",
  "device_id": "device-uuid-here",
  "device_context": {
    "hostname": "LAPTOP-USER-2024",
    "ip_address": "10.0.1.156",
    "operating_system": "Windows 11 Pro (22H2)",
    "health_score": 87,
    "status": "online",
    "agent_version": "1.0.0",
    "network_adapters": [
      {
        "name": "Ethernet",
        "status": "up",
        "ip": "10.0.1.156"
      }
    ]
  },
  "auto_populated": true,
  "populated_fields": ["title", "description", "device_id", "device_context"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "ticket": {
      "id": "ticket-uuid-here",
      "title": "Network connectivity issue on LAPTOP-USER-2024",
      "status": "open",
      "priority": "medium",
      "device_id": "device-uuid-here",
      "auto_populated": true,
      "created_at": "2024-01-15T10:35:00Z"
    },
    "device_panel": {
      "hostname": "LAPTOP-USER-2024",
      "status": "online",
      "health_score": 87,
      "last_metrics": {
        "cpu_usage": 23.5,
        "memory_usage": 58.2,
        "network_latency": 12
      }
    }
  }
}
```

### Get Tickets for Device
```http
GET /devices/{device_id}/tickets?status=open,in_progress
Authorization: Bearer <jwt>
X-Org-ID: <org_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket-uuid-1",
        "title": "Network connectivity issue",
        "status": "open",
        "priority": "medium",
        "created_at": "2024-01-15T09:00:00Z",
        "assignee": "tech@acme.com",
        "relationship_type": "affected"
      },
      {
        "id": "ticket-uuid-2", 
        "title": "Software update request",
        "status": "in_progress",
        "priority": "low",
        "created_at": "2024-01-14T15:30:00Z",
        "assignee": "admin@acme.com",
        "relationship_type": "related"
      }
    ],
    "total": 2,
    "open_count": 1,
    "in_progress_count": 1
  }
}
```

## Discovery & Network Scanning

### Trigger Discovery Scan
```http
POST /agent/discovery/scan
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "scan_type": "network_discovery",
  "target_networks": ["10.0.1.0/24", "192.168.1.0/24"],
  "scan_profiles": ["ping", "nmap_light", "snmp_v2"],
  "credentials": ["snmp_public", "windows_domain"],
  "options": {
    "max_concurrent_hosts": 10,
    "timeout_per_host": 30,
    "port_ranges": ["22", "80", "443", "3389", "5900"],
    "include_offline": false
  }
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-uuid-here",
    "status": "started",
    "estimated_duration": "5-10 minutes",
    "target_count": 512,
    "stream_url": "/agent/discovery/scans/scan-uuid-here/stream"
  }
}
```

### Get Discovery Results
```http
GET /agent/discovery/scans/{scan_id}/results
Authorization: Bearer <jwt>
X-Org-ID: <org_id>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "scan_id": "scan-uuid-here",
    "status": "completed",
    "started_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:37:32Z",
    "duration_seconds": 452,
    "summary": {
      "hosts_scanned": 254,
      "hosts_found": 12,
      "new_devices": 3,
      "known_devices": 9,
      "services_found": 28
    },
    "discoveries": [
      {
        "ip_address": "10.0.1.89",
        "mac_address": "00:1B:2C:3D:4E:5F",
        "hostname": "MBP-DEV-001",
        "os_guess": "macOS",
        "vendor": "Apple",
        "device_type": "laptop",
        "open_ports": [22, 80, 443, 5900],
        "services": {
          "22": {"name": "ssh", "version": "OpenSSH 8.6"},
          "80": {"name": "http", "banner": "nginx/1.21.0"},
          "443": {"name": "https", "cert": "*.acme.com"},
          "5900": {"name": "vnc", "version": "RealVNC 6.7.2"}
        },
        "confidence": 85,
        "is_new": false,
        "device_id": "existing-device-uuid",
        "tags": ["development", "macbook"]
      },
      {
        "ip_address": "10.0.1.201", 
        "mac_address": "00:3A:4B:5C:6D:7E",
        "hostname": "PRINTER-HP-001",
        "os_guess": "Linux",
        "vendor": "Hewlett Packard",
        "device_type": "printer",
        "open_ports": [80, 443, 631, 9100],
        "services": {
          "80": {"name": "http", "banner": "HP LaserJet"},
          "631": {"name": "ipp", "version": "CUPS/2.3.3"}
        },
        "confidence": 92,
        "is_new": true,
        "merge_suggestions": [],
        "tags": ["printer", "network"]
      }
    ]
  }
}
```

## Updates & Maintenance

### Check for Updates
```http
GET /agent/updates/check?current_version=1.0.0&platform=windows&arch=amd64
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>
```

**Response (200 OK - Update Available):**
```json
{
  "success": true,
  "data": {
    "update_available": true,
    "current_version": "1.0.0",
    "latest_version": "1.0.1",
    "channel": "stable",
    "is_critical": false,
    "requires_restart": true,
    "release_info": {
      "version": "1.0.1",
      "released_at": "2024-01-14T12:00:00Z",
      "release_notes": "Bug fixes and performance improvements",
      "changelog": [
        "Fixed memory leak in health monitoring",
        "Improved network discovery performance",
        "Updated TLS certificate handling"
      ]
    },
    "download": {
      "url": "https://updates.buboiq.com/agent/1.0.1/windows/amd64/buboiq-agent-1.0.1.exe",
      "checksum_sha256": "a8f5f167f44f4964e6c998dee827110c",
      "size_bytes": 15728640,
      "signature": "base64-encoded-signature"
    },
    "rollout": {
      "percentage": 100,
      "eligible": true
    }
  }
}
```

**Response (204 No Content - No Updates):**
```json
{
  "success": true,
  "data": {
    "update_available": false,
    "current_version": "1.0.1",
    "message": "Agent is up to date"
  }
}
```

### Report Update Status
```http
POST /agent/updates/status
Authorization: Bearer <device_jwt>
X-Org-ID: <org_id>
X-Device-ID: <device_id>

{
  "update_id": "update-uuid-here",
  "version": "1.0.1",
  "status": "completed",
  "started_at": "2024-01-15T11:00:00Z",
  "completed_at": "2024-01-15T11:03:45Z",
  "success": true,
  "previous_version": "1.0.0",
  "install_log": "Update completed successfully. Agent restarted.",
  "restart_required": true,
  "restart_completed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status_recorded": true,
    "device_updated": true,
    "next_check_at": "2024-01-15T15:00:00Z"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

### Authentication Error (401)
```json
{
  "success": false,
  "error": {
    "code": "unauthorized",
    "message": "Invalid or expired token",
    "details": "JWT token has expired"
  }
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "error": {
    "code": "forbidden",
    "message": "Insufficient permissions",
    "details": "This operation requires admin privileges"
  }
}
```

### Validation Error (422)
```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "fields": {
      "device_info.hostname": "Hostname is required",
      "agent_version": "Invalid version format"
    }
  }
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "error": {
    "code": "rate_limited",
    "message": "Too many requests",
    "retry_after": 60,
    "limit": 100,
    "window": 3600
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "server_error",
    "message": "Internal server error",
    "request_id": "req-uuid-here"
  }
}
```

## Webhooks (Team Tier)

### Webhook Event Payloads

#### Device Status Change
```json
{
  "event": "device.status_changed",
  "timestamp": "2024-01-15T10:32:00Z",
  "org_id": "org-uuid",
  "data": {
    "device_id": "device-uuid",
    "hostname": "LAPTOP-USER-2024",
    "old_status": "online",
    "new_status": "offline",
    "last_seen_at": "2024-01-15T10:30:00Z"
  }
}
```

#### Ticket Created with Device Context
```json
{
  "event": "ticket.created_with_device",
  "timestamp": "2024-01-15T10:35:00Z",
  "org_id": "org-uuid",
  "data": {
    "ticket_id": "ticket-uuid",
    "device_id": "device-uuid",
    "title": "Network connectivity issue",
    "priority": "medium",
    "auto_populated": true,
    "device_context": {
      "hostname": "LAPTOP-USER-2024",
      "health_score": 87
    }
  }
}
```

#### Health Alert
```json
{
  "event": "device.health_alert",
  "timestamp": "2024-01-15T10:32:00Z", 
  "org_id": "org-uuid",
  "data": {
    "device_id": "device-uuid",
    "alert_type": "cpu_high",
    "severity": "warning",
    "value": 94.2,
    "threshold": 90.0,
    "duration_seconds": 300
  }
}
```

All webhook events are delivered with HMAC-SHA256 signature in the `X-BuboIQ-Signature` header for verification.