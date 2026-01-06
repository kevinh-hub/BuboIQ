# BuboIQ Agent Windows Installer (NSIS Script)
# This creates a production-ready Windows installer with proper service registration

!define PRODUCT_NAME "BuboIQ Agent"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "BuboIQ, Inc."
!define PRODUCT_WEB_SITE "https://buboiq.com"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\buboiq-agent.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

# Modern UI
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh"
!include "WinMessages.nsh"
!include "ServiceLib.nsh"

# Installer settings
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "BuboIQ-Agent-Setup-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES64\BuboIQ\Agent"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

# Request administrator privileges
RequestExecutionLevel admin

# Modern UI Configuration
!define MUI_ABORTWARNING
!define MUI_ICON "buboiq.ico"
!define MUI_UNICON "buboiq.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "wizard.bmp"

# Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
Page custom EnrollmentPage EnrollmentPageLeave
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

# Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

# Languages
!insertmacro MUI_LANGUAGE "English"

# Variables
Var EnrollmentCode
Var OrgName
Var EnableSoftwareInventory
Var Dialog
Var EnrollmentCodeText
Var OrgNameLabel
Var SoftwareInventoryCheckbox

# Version Information
VIProductVersion "${PRODUCT_VERSION}.0"
VIAddVersionKey ProductName "${PRODUCT_NAME}"
VIAddVersionKey ProductVersion "${PRODUCT_VERSION}"
VIAddVersionKey CompanyName "${PRODUCT_PUBLISHER}"
VIAddVersionKey FileDescription "${PRODUCT_NAME} Installer"
VIAddVersionKey FileVersion "${PRODUCT_VERSION}"
VIAddVersionKey LegalCopyright "© 2024 ${PRODUCT_PUBLISHER}"

# Custom Enrollment Page
Function EnrollmentPage
  !insertmacro MUI_HEADER_TEXT "Organization Enrollment" "Enter your organization's enrollment code"
  
  nsDialogs::Create 1018
  Pop $Dialog
  
  ${If} $Dialog == error
    Abort
  ${EndIf}
  
  # Organization enrollment section
  ${NSD_CreateLabel} 0 0 100% 12u "Enter the enrollment code provided by your IT administrator:"
  Pop $0
  
  ${NSD_CreateText} 0 15u 100% 12u "$EnrollmentCode"
  Pop $EnrollmentCodeText
  
  # Organization name display
  ${NSD_CreateLabel} 0 35u 100% 12u "Organization: Detecting..."
  Pop $OrgNameLabel
  
  # Privacy settings
  ${NSD_CreateGroupBox} 0 55u 100% 40u "Privacy Settings"
  Pop $0
  
  ${NSD_CreateCheckbox} 10u 70u 80% 12u "Enable software inventory collection"
  Pop $SoftwareInventoryCheckbox
  ${NSD_Check} $SoftwareInventoryCheckbox
  
  ${NSD_CreateLabel} 10u 85u 80% 12u "Software inventory helps with license management and security."
  Pop $0
  
  # Help text
  ${NSD_CreateLabel} 0 105u 100% 24u "Having trouble? Contact your IT team or visit support.buboiq.com for assistance."
  Pop $0
  
  # Set focus to enrollment code field
  ${NSD_SetFocus} $EnrollmentCodeText
  
  nsDialogs::Show
FunctionEnd

Function EnrollmentPageLeave
  ${NSD_GetText} $EnrollmentCodeText $EnrollmentCode
  ${NSD_GetState} $SoftwareInventoryCheckbox $EnableSoftwareInventory
  
  # Validate enrollment code
  ${If} $EnrollmentCode == ""
    MessageBox MB_ICONEXCLAMATION "Please enter an enrollment code."
    Abort
  ${EndIf}
  
  # TODO: Validate enrollment code with server
  # For now, extract organization name from code
  StrCpy $OrgName "Your Organization"
FunctionEnd

# Main installation section
Section "BuboIQ Agent" SEC01
  # Set output path
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  # Copy agent files
  File "buboiq-agent.exe"
  File "LICENSE.txt"
  File "README.txt"
  
  # Create configuration directory
  CreateDirectory "$PROGRAMDATA\BuboIQ"
  
  # Generate configuration file
  Call GenerateConfig
  
  # Install Windows service
  DetailPrint "Installing BuboIQ Agent service..."
  nsExec::ExecToLog '"$INSTDIR\buboiq-agent.exe" -service install -config "$PROGRAMDATA\BuboIQ\agent.yaml"'
  Pop $0
  ${If} $0 != 0
    DetailPrint "Warning: Service installation may have failed (exit code $0)"
  ${EndIf}
  
  # Start the service
  DetailPrint "Starting BuboIQ Agent service..."
  nsExec::ExecToLog '"$INSTDIR\buboiq-agent.exe" -service start'
  Pop $0
  ${If} $0 != 0
    DetailPrint "Warning: Service start may have failed (exit code $0)"
  ${EndIf}
  
  # Create shortcuts
  CreateDirectory "$SMPROGRAMS\BuboIQ Agent"
  CreateShortCut "$SMPROGRAMS\BuboIQ Agent\BuboIQ Agent Settings.lnk" "$INSTDIR\buboiq-agent.exe" "-gui"
  CreateShortCut "$SMPROGRAMS\BuboIQ Agent\Uninstall.lnk" "$INSTDIR\uninst.exe"
  
  # Registry entries
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\buboiq-agent.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\buboiq-agent.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  # Estimate installed size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

# Generate configuration file
Function GenerateConfig
  DetailPrint "Generating configuration file..."
  
  # Create YAML configuration
  FileOpen $9 "$PROGRAMDATA\BuboIQ\agent.yaml" w
  
  # Write configuration
  FileWrite $9 "# BuboIQ Agent Configuration$\r$\n"
  FileWrite $9 "# Generated during installation$\r$\n$\r$\n"
  
  FileWrite $9 "organization:$\r$\n"
  FileWrite $9 "  name: $\"$OrgName$\"$\r$\n"
  FileWrite $9 "  enrollment_code: $\"$EnrollmentCode$\"$\r$\n$\r$\n"
  
  FileWrite $9 "server:$\r$\n"
  FileWrite $9 "  url: $\"https://api.buboiq.com$\"$\r$\n$\r$\n"
  
  FileWrite $9 "collection:$\r$\n"
  FileWrite $9 "  interval: 5m$\r$\n"
  FileWrite $9 "  delta_enabled: true$\r$\n$\r$\n"
  
  FileWrite $9 "privacy:$\r$\n"
  ${If} $EnableSoftwareInventory == ${BST_CHECKED}
    FileWrite $9 "  collect_software: true$\r$\n"
  ${Else}
    FileWrite $9 "  collect_software: false$\r$\n"
  ${EndIf}
  FileWrite $9 "  byod_redaction: limited$\r$\n$\r$\n"
  
  FileWrite $9 "remote:$\r$\n"
  FileWrite $9 "  enabled: true$\r$\n"
  FileWrite $9 "  require_consent: true$\r$\n"
  FileWrite $9 "  session_timeout: 30m$\r$\n$\r$\n"
  
  FileWrite $9 "security:$\r$\n"
  FileWrite $9 "  tls:$\r$\n"
  FileWrite $9 "    min_version: $\"1.3$\"$\r$\n"
  FileWrite $9 "    verify_certificates: true$\r$\n$\r$\n"
  
  FileWrite $9 "logging:$\r$\n"
  FileWrite $9 "  level: info$\r$\n"
  FileWrite $9 "  file: $\"C:\\ProgramData\\BuboIQ\\agent.log$\"$\r$\n"
  
  FileClose $9
  
  # Set appropriate permissions on config file
  AccessControl::GrantOnFile "$PROGRAMDATA\BuboIQ\agent.yaml" "(BU)" "FullAccess"
  AccessControl::GrantOnFile "$PROGRAMDATA\BuboIQ\agent.yaml" "(S-1-5-18)" "FullAccess"  # SYSTEM
  AccessControl::GrantOnFile "$PROGRAMDATA\BuboIQ\agent.yaml" "(S-1-5-32-544)" "FullAccess"  # Administrators
FunctionEnd

# Uninstaller section
Section Uninstall
  # Stop and remove service
  DetailPrint "Stopping BuboIQ Agent service..."
  nsExec::ExecToLog '"$INSTDIR\buboiq-agent.exe" -service stop'
  
  DetailPrint "Removing BuboIQ Agent service..."
  nsExec::ExecToLog '"$INSTDIR\buboiq-agent.exe" -service uninstall'
  
  # Remove files
  Delete "$INSTDIR\buboiq-agent.exe"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\README.txt"
  Delete "$INSTDIR\uninst.exe"
  
  # Remove shortcuts
  Delete "$SMPROGRAMS\BuboIQ Agent\BuboIQ Agent Settings.lnk"
  Delete "$SMPROGRAMS\BuboIQ Agent\Uninstall.lnk"
  RMDir "$SMPROGRAMS\BuboIQ Agent"
  
  # Remove installation directory
  RMDir "$INSTDIR"
  
  # Clean up configuration (with user confirmation)
  MessageBox MB_YESNO|MB_ICONQUESTION "Remove configuration and log files?" IDNO skip_config_cleanup
    RMDir /r "$PROGRAMDATA\BuboIQ"
  skip_config_cleanup:
  
  # Remove registry entries
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  SetAutoClose true
SectionEnd

# Helper Functions
Function .onInit
  # Check if already installed
  ReadRegStr $R0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  StrCmp $R0 "" done
  
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
    "BuboIQ Agent is already installed. $\n$\nClick OK to remove the previous version or Cancel to cancel this installation." \
    IDOK uninst
  Abort
  
  uninst:
    ClearErrors
    ExecWait '$R0 /S _?=$INSTDIR'
    
    IfErrors no_remove_uninstaller done
    no_remove_uninstaller:
  
  done:
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) was successfully removed from your computer."
FunctionEnd