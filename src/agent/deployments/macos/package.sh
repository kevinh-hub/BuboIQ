#!/bin/bash
# BuboIQ Agent macOS Package Builder
# Creates a production-ready macOS installer package (.pkg)

set -e

# Configuration
AGENT_VERSION="1.0.0"
BUNDLE_ID="com.buboiq.agent"
PACKAGE_NAME="BuboIQ-Agent-${AGENT_VERSION}"
BUILD_DIR="./build"
PAYLOAD_DIR="${BUILD_DIR}/payload"
SCRIPTS_DIR="${BUILD_DIR}/scripts"
RESOURCES_DIR="${BUILD_DIR}/resources"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🦉 Building BuboIQ Agent for macOS${NC}"
echo -e "${BLUE}Version: ${AGENT_VERSION}${NC}"
echo

# Clean previous build
echo -e "${YELLOW}🧹 Cleaning previous build...${NC}"
rm -rf "${BUILD_DIR}"
mkdir -p "${PAYLOAD_DIR}"
mkdir -p "${SCRIPTS_DIR}"
mkdir -p "${RESOURCES_DIR}"

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"
mkdir -p "${PAYLOAD_DIR}/usr/local/bin"
mkdir -p "${PAYLOAD_DIR}/Library/LaunchDaemons"
mkdir -p "${PAYLOAD_DIR}/Library/Application Support/BuboIQ"
mkdir -p "${PAYLOAD_DIR}/Applications/Utilities"

# Copy agent binary
echo -e "${YELLOW}📦 Copying agent binary...${NC}"
if [[ ! -f "./buboiq-agent" ]]; then
    echo -e "${RED}❌ Agent binary not found. Please build the agent first.${NC}"
    exit 1
fi

cp "./buboiq-agent" "${PAYLOAD_DIR}/usr/local/bin/"
chmod +x "${PAYLOAD_DIR}/usr/local/bin/buboiq-agent"

# Create LaunchDaemon plist
echo -e "${YELLOW}⚙️  Creating LaunchDaemon configuration...${NC}"
cat > "${PAYLOAD_DIR}/Library/LaunchDaemons/com.buboiq.agent.plist" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.buboiq.agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/buboiq-agent</string>
        <string>-config</string>
        <string>/Library/Application Support/BuboIQ/agent.yaml</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
        <key>Crashed</key>
        <true/>
    </dict>
    <key>StandardOutPath</key>
    <string>/Library/Logs/BuboIQ/agent.log</string>
    <key>StandardErrorPath</key>
    <string>/Library/Logs/BuboIQ/agent-error.log</string>
    <key>UserName</key>
    <string>_buboiq</string>
    <key>GroupName</key>
    <string>_buboiq</string>
    <key>ThrottleInterval</key>
    <integer>60</integer>
</dict>
</plist>
EOF

# Create GUI application bundle
echo -e "${YELLOW}📱 Creating GUI application bundle...${NC}"
GUI_APP_DIR="${PAYLOAD_DIR}/Applications/Utilities/BuboIQ Agent.app"
mkdir -p "${GUI_APP_DIR}/Contents/MacOS"
mkdir -p "${GUI_APP_DIR}/Contents/Resources"

# Create Info.plist for GUI app
cat > "${GUI_APP_DIR}/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>BuboIQ Agent</string>
    <key>CFBundleExecutable</key>
    <string>BuboIQ Agent</string>
    <key>CFBundleIdentifier</key>
    <string>com.buboiq.agent.gui</string>
    <key>CFBundleName</key>
    <string>BuboIQ Agent</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>${AGENT_VERSION}</string>
    <key>CFBundleVersion</key>
    <string>${AGENT_VERSION}</string>
    <key>CFBundleIconFile</key>
    <string>buboiq.icns</string>
    <key>LSUIElement</key>
    <true/>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
</dict>
</plist>
EOF

# Create GUI launcher script
cat > "${GUI_APP_DIR}/Contents/MacOS/BuboIQ Agent" << 'EOF'
#!/bin/bash
# BuboIQ Agent GUI Launcher
exec /usr/local/bin/buboiq-agent -gui
EOF
chmod +x "${GUI_APP_DIR}/Contents/MacOS/BuboIQ Agent"

# Copy icon (if available)
if [[ -f "./buboiq.icns" ]]; then
    cp "./buboiq.icns" "${GUI_APP_DIR}/Contents/Resources/"
fi

# Create preinstall script
echo -e "${YELLOW}📝 Creating installation scripts...${NC}"
cat > "${SCRIPTS_DIR}/preinstall" << 'EOF'
#!/bin/bash

# Stop existing service if running
if launchctl list | grep -q "com.buboiq.agent"; then
    echo "Stopping existing BuboIQ Agent service..."
    launchctl unload /Library/LaunchDaemons/com.buboiq.agent.plist 2>/dev/null || true
fi

# Create service user account
if ! dscl . -read /Users/_buboiq &>/dev/null; then
    echo "Creating _buboiq service account..."
    
    # Find next available UID starting from 300
    local uid=300
    while dscl . -read /Users uid=$uid &>/dev/null; do
        ((uid++))
    done
    
    # Create group
    dseditgroup -o create -r "BuboIQ Agent Service" -i $uid _buboiq
    
    # Create user
    dscl . -create /Users/_buboiq UniqueID $uid
    dscl . -create /Users/_buboiq PrimaryGroupID $uid
    dscl . -create /Users/_buboiq UserShell /usr/bin/false
    dscl . -create /Users/_buboiq NFSHomeDirectory /var/empty
    dscl . -create /Users/_buboiq RealName "BuboIQ Agent Service"
    dscl . -create /Users/_buboiq Password "*"
fi

# Create log directory
mkdir -p /Library/Logs/BuboIQ
chown _buboiq:_buboiq /Library/Logs/BuboIQ

exit 0
EOF

# Create postinstall script
cat > "${SCRIPTS_DIR}/postinstall" << 'EOF'
#!/bin/bash

# Set proper ownership and permissions
chown root:wheel /usr/local/bin/buboiq-agent
chmod 755 /usr/local/bin/buboiq-agent

chown root:wheel /Library/LaunchDaemons/com.buboiq.agent.plist
chmod 644 /Library/LaunchDaemons/com.buboiq.agent.plist

chown -R _buboiq:_buboiq "/Library/Application Support/BuboIQ"
chmod 755 "/Library/Application Support/BuboIQ"

# Load and start the service
echo "Loading BuboIQ Agent service..."
launchctl load /Library/LaunchDaemons/com.buboiq.agent.plist

# Wait a moment for the service to start
sleep 2

# Check if service is running
if launchctl list | grep -q "com.buboiq.agent"; then
    echo "✅ BuboIQ Agent service started successfully"
else
    echo "⚠️  BuboIQ Agent service may not have started properly"
fi

# Open enrollment dialog if no configuration exists
if [[ ! -f "/Library/Application Support/BuboIQ/agent.yaml" ]]; then
    echo "Opening enrollment dialog..."
    # Launch enrollment GUI as the current user
    sudo -u "$USER" /usr/local/bin/buboiq-agent -enroll-gui &
fi

exit 0
EOF

# Create preremove script for uninstallation
cat > "${SCRIPTS_DIR}/preremove" << 'EOF'
#!/bin/bash

# Stop and unload service
if launchctl list | grep -q "com.buboiq.agent"; then
    echo "Stopping BuboIQ Agent service..."
    launchctl unload /Library/LaunchDaemons/com.buboiq.agent.plist
fi

exit 0
EOF

# Make scripts executable
chmod +x "${SCRIPTS_DIR}"/*

# Create package resources
echo -e "${YELLOW}📄 Creating package resources...${NC}"

# Welcome text
cat > "${RESOURCES_DIR}/welcome.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 20px; }
        .header { color: #00FF85; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .content { line-height: 1.6; }
        .feature { margin: 10px 0; }
        .icon { color: #00FF85; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="header">🦉 Welcome to BuboIQ Agent</div>
    <div class="content">
        <p>BuboIQ Agent will connect your Mac to your organization's intelligent IT support system.</p>
        
        <div class="feature"><span class="icon">•</span> Real-time device health monitoring</div>
        <div class="feature"><span class="icon">•</span> Automatic issue detection and resolution</div>
        <div class="feature"><span class="icon">•</span> Secure remote support when needed</div>
        <div class="feature"><span class="icon">•</span> Privacy-focused data collection</div>
        
        <p><strong>What happens during installation:</strong></p>
        <div class="feature"><span class="icon">•</span> Agent service will be installed and started</div>
        <div class="feature"><span class="icon">•</span> Enrollment dialog will open to connect to your organization</div>
        <div class="feature"><span class="icon">•</span> System monitoring will begin after enrollment</div>
        
        <p>All data is encrypted and only shared with your organization's IT team.</p>
    </div>
</body>
</html>
EOF

# Create license file
cat > "${RESOURCES_DIR}/license.txt" << 'EOF'
BuboIQ Agent Software License Agreement

Copyright (c) 2024 BuboIQ, Inc.

This software is proprietary and confidential. By installing this software, you agree to the terms and conditions of your organization's agreement with BuboIQ, Inc.

For complete terms and conditions, visit: https://buboiq.com/terms
EOF

# Build the package
echo -e "${YELLOW}📦 Building package...${NC}"

pkgbuild \
    --root "${PAYLOAD_DIR}" \
    --scripts "${SCRIPTS_DIR}" \
    --identifier "${BUNDLE_ID}" \
    --version "${AGENT_VERSION}" \
    --install-location "/" \
    "${BUILD_DIR}/${PACKAGE_NAME}-component.pkg"

# Create distribution XML
cat > "${BUILD_DIR}/distribution.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<installer-gui-script minSpecVersion="2">
    <title>BuboIQ Agent ${AGENT_VERSION}</title>
    <organization>com.buboiq</organization>
    <domains enable_anywhere="false" enable_currentUserHome="false" enable_localSystem="true"/>
    <options customize="never" require-scripts="false" hostArchitectures="x86_64,arm64"/>
    
    <welcome file="welcome.html"/>
    <license file="license.txt"/>
    
    <choices-outline>
        <line choice="default">
            <line choice="com.buboiq.agent"/>
        </line>
    </choices-outline>
    
    <choice id="default"/>
    <choice id="com.buboiq.agent" visible="false">
        <pkg-ref id="com.buboiq.agent"/>
    </choice>
    
    <pkg-ref id="com.buboiq.agent" version="${AGENT_VERSION}" onConclusion="none">
        ${PACKAGE_NAME}-component.pkg
    </pkg-ref>
</installer-gui-script>
EOF

# Build final distribution package
productbuild \
    --distribution "${BUILD_DIR}/distribution.xml" \
    --resources "${RESOURCES_DIR}" \
    --package-path "${BUILD_DIR}" \
    "${PACKAGE_NAME}.pkg"

# Sign the package (if developer certificate is available)
if command -v codesign &> /dev/null && security find-identity -v -p codesigning | grep -q "Developer ID"; then
    echo -e "${YELLOW}🔐 Signing package...${NC}"
    SIGNING_IDENTITY=$(security find-identity -v -p codesigning | grep "Developer ID" | head -1 | sed 's/^.*"\(.*\)"$/\1/')
    productsign --sign "$SIGNING_IDENTITY" "${PACKAGE_NAME}.pkg" "${PACKAGE_NAME}-signed.pkg"
    mv "${PACKAGE_NAME}-signed.pkg" "${PACKAGE_NAME}.pkg"
    echo -e "${GREEN}✅ Package signed with: ${SIGNING_IDENTITY}${NC}"
else
    echo -e "${YELLOW}⚠️  Package not signed (no Developer ID certificate found)${NC}"
fi

# Create disk image (.dmg)
echo -e "${YELLOW}💽 Creating disk image...${NC}"
mkdir -p "${BUILD_DIR}/dmg"
cp "${PACKAGE_NAME}.pkg" "${BUILD_DIR}/dmg/"

# Add README to DMG
cat > "${BUILD_DIR}/dmg/README.txt" << EOF
BuboIQ Agent ${AGENT_VERSION}

Installation Instructions:
1. Double-click "${PACKAGE_NAME}.pkg" to start installation
2. Follow the installer prompts
3. Enter your organization's enrollment code when prompted
4. The agent will start automatically after installation

System Requirements:
- macOS 10.15 (Catalina) or later
- Administrator privileges for installation
- Internet connection for enrollment and operation

For support, contact your IT administrator or visit:
https://support.buboiq.com

© 2024 BuboIQ, Inc.
EOF

# Create DMG
hdiutil create \
    -volname "BuboIQ Agent ${AGENT_VERSION}" \
    -srcfolder "${BUILD_DIR}/dmg" \
    -ov -format UDZO \
    "${PACKAGE_NAME}.dmg"

# Calculate checksums
echo -e "${YELLOW}🔍 Calculating checksums...${NC}"
shasum -a 256 "${PACKAGE_NAME}.pkg" > "${PACKAGE_NAME}.pkg.sha256"
shasum -a 256 "${PACKAGE_NAME}.dmg" > "${PACKAGE_NAME}.dmg.sha256"

# Display results
echo
echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo
echo -e "${BLUE}📦 Generated files:${NC}"
echo "  ${PACKAGE_NAME}.pkg ($(du -h "${PACKAGE_NAME}.pkg" | cut -f1))"
echo "  ${PACKAGE_NAME}.dmg ($(du -h "${PACKAGE_NAME}.dmg" | cut -f1))"
echo
echo -e "${BLUE}🔍 Checksums:${NC}"
cat "${PACKAGE_NAME}.pkg.sha256"
cat "${PACKAGE_NAME}.dmg.sha256"
echo
echo -e "${GREEN}🎉 Ready for distribution!${NC}"

# Cleanup build directory
rm -rf "${BUILD_DIR}"