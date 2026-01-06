# BuboIQ Agent - System Requirements

## 📋 Overview

This document outlines the complete system requirements for running the BuboIQ Endpoint Agent on managed devices.

---

## 🖥️ Operating System Requirements

### Windows

| Version | Architecture | Status | Notes |
|---------|-------------|--------|-------|
| **Windows 11** | x64, ARM64 | ✅ Fully Supported | Recommended |
| **Windows 10** (21H2+) | x64, ARM64 | ✅ Fully Supported | Minimum version 21H2 |
| **Windows 10** (20H2 and earlier) | x64 | ⚠️ Limited Support | Security updates only |
| **Windows Server 2022** | x64 | ✅ Fully Supported | |
| **Windows Server 2019** | x64 | ✅ Fully Supported | |
| **Windows Server 2016** | x64 | ⚠️ Limited Support | End of support soon |
| **Windows 8.1** | x64 | ❌ Not Supported | End of life |
| **Windows 7** | x64 | ❌ Not Supported | End of life |

**Minimum Windows Build:**
- Windows 10: Build 19042 (20H2) or later
- Windows 11: All builds supported

**Required Windows Components:**
- .NET Framework 4.8 or later (installed automatically if missing)
- Windows Management Instrumentation (WMI)
- Windows Update service
- Windows Defender (for security posture)

---

### macOS

| Version | Architecture | Status | Notes |
|---------|-------------|--------|-------|
| **macOS 15 Sequoia** | Apple Silicon, Intel | ✅ Fully Supported | Latest |
| **macOS 14 Sonoma** | Apple Silicon, Intel | ✅ Fully Supported | Recommended |
| **macOS 13 Ventura** | Apple Silicon, Intel | ✅ Fully Supported | |
| **macOS 12 Monterey** | Apple Silicon, Intel | ✅ Fully Supported | |
| **macOS 11 Big Sur** | Apple Silicon, Intel | ⚠️ Limited Support | Minimum supported |
| **macOS 10.15 Catalina** | Intel | ⚠️ Limited Support | Security updates only |
| **macOS 10.14 and earlier** | Intel | ❌ Not Supported | End of life |

**Minimum macOS Version:** 11.0 (Big Sur)

**Required macOS Components:**
- System Integrity Protection (SIP) enabled
- Gatekeeper enabled
- XProtect up to date

**Required Permissions:**
- Full Disk Access (for complete inventory)
- Accessibility (for remote support features)
- Network Extension (for network discovery on Pro/Team tiers)

---

### Linux

| Distribution | Version | Architecture | Status | Notes |
|--------------|---------|-------------|--------|-------|
| **Ubuntu** | 22.04 LTS, 24.04 LTS | x64, ARM64 | ✅ Fully Supported | Recommended |
| **Ubuntu** | 20.04 LTS | x64, ARM64 | ✅ Fully Supported | |
| **Debian** | 12 (Bookworm) | x64, ARM64 | ✅ Fully Supported | |
| **Debian** | 11 (Bullseye) | x64, ARM64 | ✅ Fully Supported | |
| **RHEL / Rocky / Alma** | 9.x | x64, ARM64 | ✅ Fully Supported | |
| **RHEL / Rocky / Alma** | 8.x | x64, ARM64 | ✅ Fully Supported | |
| **Fedora** | 38, 39, 40 | x64, ARM64 | ✅ Fully Supported | |
| **CentOS Stream** | 9 | x64, ARM64 | ✅ Fully Supported | |
| **CentOS** | 7 | x64 | ⚠️ Limited Support | End of life June 2024 |
| **openSUSE Leap** | 15.4, 15.5 | x64, ARM64 | ✅ Fully Supported | |
| **Arch Linux** | Rolling | x64, ARM64 | ⚠️ Community Support | |

**Minimum Kernel Version:** 5.4 or later

**Required Linux Components:**
- systemd (version 240 or later)
- dbus
- udev
- NetworkManager or systemd-networkd

**Package Dependencies:**
- `ca-certificates` (for TLS)
- `openssl` or `gnutls` (version 1.1.1 or later)
- `curl` or `wget` (for auto-updates)

---

## 💾 Hardware Requirements

### Minimum Requirements

| Component | Requirement | Notes |
|-----------|------------|-------|
| **CPU** | 1 GHz single-core | Supports x64, ARM64 |
| **RAM** | 512 MB available | Agent uses ~50 MB |
| **Disk Space** | 100 MB free | For agent + logs + cache |
| **Network** | Internet connection | HTTPS outbound (port 443) |

### Recommended Requirements

| Component | Requirement | Notes |
|-----------|------------|-------|
| **CPU** | 2 GHz dual-core or better | For network discovery |
| **RAM** | 2 GB available | Better performance |
| **Disk Space** | 500 MB free | For extended logs |
| **Network** | Broadband connection | 5+ Mbps recommended |

### Pro/Team Additional Requirements

For organizations using **Pro** or **Team** tier with Network Discovery:

| Component | Requirement | Notes |
|-----------|------------|-------|
| **CPU** | 2 GHz quad-core | Active scanning workload |
| **RAM** | 4 GB available | Network discovery cache |
| **Network** | Low-latency connection | < 100ms to API |
| **Permissions** | Network admin rights | For SNMP, WMI access |

---

## 🌐 Network Requirements

### Required Outbound Connections

| Destination | Port | Protocol | Purpose |
|------------|------|----------|---------|
| `api.buboiq.com` | 443 | HTTPS | API communication |
| `updates.buboiq.com` | 443 | HTTPS | Agent auto-updates |
| `telemetry.buboiq.com` | 443 | HTTPS | Health signals |
| `*.cloudfront.net` | 443 | HTTPS | CDN for assets |

**Firewall Rules:**
```bash
# Allow outbound HTTPS to BuboIQ domains
Allow TCP 443 to api.buboiq.com
Allow TCP 443 to updates.buboiq.com
Allow TCP 443 to telemetry.buboiq.com
```

**Proxy Support:**
- HTTP/HTTPS proxies supported
- SOCKS5 proxy supported
- Authenticated proxies supported (Basic, NTLM, Kerberos)
- PAC (Proxy Auto-Config) file support

**No Inbound Connections Required:**
- Agent initiates all connections
- No ports need to be opened on endpoint
- Works behind NAT/firewalls

### Bandwidth Requirements

| Activity | Bandwidth | Frequency | Notes |
|----------|-----------|-----------|-------|
| **Initial enrollment** | ~500 KB | One-time | Device registration |
| **Inventory sync** | 10-50 KB | Every 5 minutes | Delta updates |
| **Health signals** | 1-2 KB | Every 30 seconds | Real-time metrics |
| **Software inventory** | 50-200 KB | Daily | Full software list |
| **Auto-updates** | 10-20 MB | As needed | Binary updates |

**Daily Total:** ~50-100 MB/day typical usage

**Peak Bandwidth:** ~500 KB/s during initial setup or major updates

---

## 🔐 Security Requirements

### TLS/SSL Requirements

| Requirement | Specification |
|------------|--------------|
| **Minimum TLS Version** | TLS 1.3 |
| **Supported Cipher Suites** | `TLS_AES_256_GCM_SHA384`<br>`TLS_CHACHA20_POLY1305_SHA256`<br>`TLS_AES_128_GCM_SHA256` |
| **Certificate Validation** | Full chain validation required |
| **Certificate Pinning** | Optional (enterprise feature) |

### Required System Features

**Windows:**
- Windows Defender enabled (or equivalent AV)
- Windows Firewall enabled
- User Account Control (UAC) enabled
- DPAPI available (for credential storage)

**macOS:**
- System Integrity Protection (SIP) enabled
- Gatekeeper enabled
- FileVault recommended (for disk encryption)
- Keychain Services available

**Linux:**
- SELinux or AppArmor recommended
- Firewall enabled (iptables/nftables/firewalld)
- Secure Boot recommended
- Encrypted storage recommended

---

## 👤 User Permissions

### Installation Requirements

| Platform | Required Privilege | Notes |
|----------|-------------------|-------|
| **Windows** | Administrator | Installer must run elevated |
| **macOS** | Administrator (sudo) | Requires admin password |
| **Linux** | Root (sudo) | Package installation requires root |

### Runtime Permissions

**Windows Service Account:**
- Runs as `NT SERVICE\BuboIQAgent`
- Limited local service privileges
- No interactive logon rights

**macOS LaunchDaemon:**
- Runs as `_buboiq` system user
- No login shell
- Restricted home directory

**Linux systemd Service:**
- Runs as `buboiq` system user
- No login shell (`/bin/false`)
- Restricted home directory

---

## 📊 Performance Impact

### Resource Utilization (Typical)

| Metric | Idle | Active | Peak |
|--------|------|--------|------|
| **CPU Usage** | < 1% | 1-2% | 5-10% (during discovery) |
| **RAM Usage** | 40-50 MB | 50-80 MB | 150 MB (Pro/Team discovery) |
| **Disk I/O** | Minimal | Low | Moderate (during sync) |
| **Network I/O** | 1 KB/min | 10 KB/min | 500 KB/min (updates) |

### Battery Impact (Laptops)

- **Windows/macOS:** < 1% battery drain per hour
- **Sleep/Hibernate:** Agent pauses operations automatically
- **Low Power Mode:** Reduced sync frequency (10 min → 30 min)

---

## 🔄 Update Requirements

### Auto-Update System

**Update Channels:**
- **Stable** (default): Production-ready releases
- **Beta**: Early access to new features
- **Long-Term Support (LTS)**: Extended support releases

**Update Frequency:**
- **Security patches:** As needed (immediate)
- **Feature updates:** Monthly
- **Major versions:** Quarterly

**Update Size:** 10-20 MB per update

**Rollback Protection:** Automatic rollback on failure

**Maintenance Windows:**
```yaml
default_schedule:
  time: "02:00 AM"
  timezone: "Local"
  days: ["Sunday"]
  skip_business_hours: true
```

---

## 🧩 Software Dependencies

### Windows Dependencies

| Component | Version | Auto-Install |
|-----------|---------|-------------|
| .NET Framework | 4.8+ | Yes |
| Visual C++ Redistributable | 2015-2022 | Yes |
| Windows Management Framework | 5.1+ | Usually included |

### macOS Dependencies

| Component | Version | Auto-Install |
|-----------|---------|-------------|
| Xcode Command Line Tools | Latest | No (prompts user) |
| OpenSSL | 1.1.1+ | Yes (via Homebrew if needed) |

### Linux Dependencies

**Debian/Ubuntu:**
```bash
apt-get install -y ca-certificates openssl libssl3 curl systemd
```

**RHEL/Rocky/Alma:**
```bash
yum install -y ca-certificates openssl openssl-libs curl systemd
```

**Arch:**
```bash
pacman -S ca-certificates openssl curl systemd
```

---

## 🏢 Enterprise Requirements

### Active Directory Integration

**Windows Domain Environments:**
- Group Policy deployment supported
- SCCM/Intune deployment supported
- Silent installation available
- Centralized configuration via GPO

**Required AD Schema Version:** Windows Server 2012 or later

### MDM Integration

**Supported MDM Platforms:**
- Microsoft Intune
- Jamf Pro (macOS)
- VMware Workspace ONE
- ManageEngine Desktop Central
- Kandji (macOS)

### Network Discovery Requirements (Pro/Team)

**Additional Permissions:**
- SNMP read access to network devices
- WMI access to Windows machines
- SSH access to Linux servers
- Network admin credentials (encrypted storage)

**Network Access:**
- Broadcast/multicast for mDNS discovery
- ICMP echo (ping) for active scanning
- TCP ports 22, 135, 161, 5900 for protocol probes

---

## 🔍 Compatibility Matrix

### Virtualization Platforms

| Platform | Version | Status | Notes |
|----------|---------|--------|-------|
| **VMware ESXi** | 7.0+ | ✅ Fully Supported | VMware Tools recommended |
| **Microsoft Hyper-V** | 2019+ | ✅ Fully Supported | Integration Services required |
| **Proxmox VE** | 7.0+ | ✅ Fully Supported | QEMU Guest Agent recommended |
| **KVM/QEMU** | Latest | ✅ Fully Supported | virtio drivers recommended |
| **VirtualBox** | 6.1+ | ⚠️ Limited Support | For testing only |
| **Parallels Desktop** | 18+ | ✅ Fully Supported | macOS guests |

### Cloud Platforms

| Platform | Status | Notes |
|----------|--------|-------|
| **AWS EC2** | ✅ Fully Supported | All instance types |
| **Azure VMs** | ✅ Fully Supported | All VM sizes |
| **Google Cloud Compute** | ✅ Fully Supported | All machine types |
| **DigitalOcean Droplets** | ✅ Fully Supported | |
| **Linode** | ✅ Fully Supported | |
| **Vultr** | ✅ Fully Supported | |

### Container Environments

| Platform | Status | Notes |
|----------|--------|-------|
| **Docker** | ⚠️ Not Recommended | Use host monitoring instead |
| **Kubernetes Nodes** | ✅ Supported | Install on node, not pod |
| **LXC/LXD** | ✅ Supported | Privileged containers only |

---

## 📱 BYOD & Mobile Devices

### Supported Device Types

| Device Type | Platform | Status | Notes |
|------------|----------|--------|-------|
| **Corporate Laptops** | Windows/macOS/Linux | ✅ Full Support | Primary use case |
| **Corporate Desktops** | Windows/macOS/Linux | ✅ Full Support | |
| **Servers** | Windows Server/Linux | ✅ Full Support | |
| **Workstations** | Windows/Linux | ✅ Full Support | Engineering/CAD |
| **BYOD Laptops** | Windows/macOS | ⚠️ Limited Privacy Mode | Redaction enabled |
| **Mobile Devices** | iOS/Android | ❌ Not Supported | Use MDM instead |
| **Tablets** | Windows | ✅ Supported | x64/ARM64 tablets |
| **Tablets** | iPad/Android | ❌ Not Supported | |

### BYOD Privacy Features

When BYOD mode is enabled:
- Personal file paths redacted
- Browser history excluded
- Personal software inventory limited
- User-level data collection disabled
- Only system-level metrics collected

---

## 🌍 Geographic & Compliance

### Data Residency

**Supported Regions:**
- United States (primary)
- European Union (GDPR compliant)
- United Kingdom
- Canada
- Australia

**Data Storage:**
- All device data encrypted at rest
- Regional data centers available (Team tier)
- Data transfer encryption (TLS 1.3)

### Compliance Certifications

- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **SOC 2 Type II** (Security, Availability, Confidentiality)
- **ISO 27001** (Information Security Management)
- **HIPAA** (Healthcare data - Team tier with BAA)

---

## 🧪 Testing & Validation

### Pre-Deployment Testing

**Recommended Test Plan:**
1. **Pilot Group:** 5-10 devices across platforms
2. **Duration:** 1-2 weeks minimum
3. **Test Cases:**
   - Installation and enrollment
   - Inventory accuracy
   - Health monitoring
   - Network impact
   - Auto-updates
   - Uninstallation

### Performance Validation

**Metrics to Monitor:**
- CPU usage (should be < 2% average)
- Memory usage (should be < 100 MB)
- Network bandwidth (should be < 50 MB/day)
- Disk I/O (should be minimal)
- Battery impact (laptops: < 1%/hour)

---

## 📞 Support & Troubleshooting

### System Compatibility Check

**Pre-Installation Validator:**
```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri https://updates.buboiq.com/check-compatibility.ps1 | Invoke-Expression

# macOS/Linux (bash)
curl -fsSL https://updates.buboiq.com/check-compatibility.sh | bash
```

### Minimum Supported Configurations

**Absolutely Minimum (Not Recommended):**
- 1 GHz CPU, 512 MB RAM, 100 MB disk
- Windows 10 21H2 / macOS 11 / Ubuntu 20.04
- Stable internet connection (1 Mbps+)

**Production Recommended:**
- 2 GHz dual-core CPU, 4 GB RAM, 500 MB disk
- Windows 11 / macOS 14 / Ubuntu 24.04 LTS
- Broadband connection (10+ Mbps)

**Enterprise Optimal:**
- 3 GHz quad-core CPU, 8 GB RAM, 1 GB disk
- Latest OS versions
- High-speed connection (50+ Mbps)

---

## ✅ Quick Reference Checklist

Before installing BuboIQ Agent, verify:

- [ ] **OS Version:** Windows 10 21H2+ / macOS 11+ / Linux kernel 5.4+
- [ ] **Architecture:** x64 or ARM64
- [ ] **Disk Space:** 100 MB free minimum
- [ ] **RAM:** 512 MB available minimum
- [ ] **Network:** HTTPS outbound (port 443) allowed
- [ ] **Permissions:** Administrator/sudo access for installation
- [ ] **Firewall:** Allow `api.buboiq.com` and `updates.buboiq.com`
- [ ] **Security:** Antivirus allows BuboIQ Agent
- [ ] **Updates:** OS fully patched and up to date

---

## 📚 Additional Resources

- **Installation Guide:** `/agent/deployments/[platform]/INSTALL.md`
- **Troubleshooting:** `/agent/TROUBLESHOOTING.md`
- **API Documentation:** `/agent/API_Integration.md`
- **Security:** `/agent/SECURITY.md`
- **Production Handoff:** `/agent/PRODUCTION_HANDOFF.md`

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-25 | Initial system requirements document |

**Document Status:** ✅ Complete

**Last Updated:** December 25, 2024

---

**Questions about system requirements?**  
📧 Contact: support@buboiq.com  
📖 Documentation: https://docs.buboiq.com/agent/requirements
