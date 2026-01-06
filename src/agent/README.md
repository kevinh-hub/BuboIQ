# BuboIQ Endpoint Agent

Complete cross-platform endpoint agent for the BuboIQ IT support intelligence platform.

## Overview

The BuboIQ Endpoint Agent is a lightweight, secure service that runs on managed devices to provide:
- Real-time device inventory and health monitoring
- Network discovery capabilities
- Remote management and support
- Automated ticket creation with device context
- Delta-based efficient data transmission

## Architecture

```
┌─────────────────┐    HTTPS/TLS 1.3    ┌─────────────────┐
│   BuboIQ SaaS   │◄─────────────────────┤ Endpoint Agent  │
│   Dashboard     │                      │  (Go Service)   │
└─────────────────┘                      └─────────────────┘
        │                                        │
        │ Device Context Auto-Population         │ System APIs
        ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│ Ticket Creation │                      │ OS/Hardware     │
│ with Device     │                      │ Inventory       │
│ Metadata        │                      │ Collection      │
└─────────────────┘                      └─────────────────┘
```

## Platform Support

- **Windows**: Service (x64, ARM64)
- **macOS**: LaunchDaemon (Intel, Apple Silicon)
- **Linux**: systemd (x64, ARM64)

## Features

### Core Capabilities
- ✅ Hardware & software inventory
- ✅ Real-time health telemetry
- ✅ Network discovery
- ✅ Remote command execution
- ✅ Automatic updates
- ✅ Crash reporting
- ✅ Multi-tenant isolation

### Security Features
- ✅ TLS 1.3 encryption
- ✅ JWT-based authentication
- ✅ Certificate pinning
- ✅ Privilege separation
- ✅ Audit logging
- ✅ Code signing

## Quick Start

1. **Enrollment**: Get organization enrollment code from BuboIQ dashboard
2. **Download**: Get agent installer for your platform
3. **Install**: Run installer with enrollment code
4. **Monitor**: View device in BuboIQ dashboard immediately

## File Structure

```
agent/
├── cmd/
│   ├── agent/           # Main agent binary
│   ├── installer/       # Cross-platform installer
│   └── updater/         # Auto-update utility
├── internal/
│   ├── collector/       # Inventory collection
│   ├── discovery/       # Network discovery
│   ├── health/          # Health monitoring
│   ├── remote/          # Remote actions
│   ├── transport/       # API communication
│   └── security/        # Security features
├── pkg/
│   ├── api/            # API client
│   ├── config/         # Configuration
│   └── platform/       # Platform-specific code
├── deployments/
│   ├── windows/        # Windows installer/service
│   ├── macos/          # macOS pkg/LaunchDaemon
│   └── linux/          # Linux packages/systemd
└── ui/                 # Installer UI mockups
```

## Build Instructions

See individual platform documentation:
- [Windows Build](./deployments/windows/README.md)
- [macOS Build](./deployments/macos/README.md)
- [Linux Build](./deployments/linux/README.md)

## API Integration

The agent integrates with the existing BuboIQ API endpoints:
- `POST /ingest/device` - Device inventory
- `POST /signals` - Health telemetry  
- `GET /agent/commands` - Remote actions
- `GET /agent/update` - Auto-updates

## Security Model

- Agent runs as dedicated service account
- All communications encrypted with TLS 1.3
- JWT tokens scoped to organization and device
- Optional certificate pinning for enterprise
- Comprehensive audit logging

## License

Proprietary - BuboIQ, Inc.