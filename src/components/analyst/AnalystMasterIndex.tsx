/**
 * BuboIQ Analyst v1 - Master Index
 * 
 * Production-ready design system and complete application UI for AI-driven IT support intelligence.
 * 
 * This file provides access to:
 * - Design Tokens Page (colors, typography, spacing, radius, shadows)
 * - Component Library (primitives + specialized components)
 * - All 13 Production Screens (with loading, empty, error states)
 * - Interactive Prototype (wired navigation between screens)
 * - Developer Handoff Materials
 * 
 * Usage:
 * ```tsx
 * import { AnalystPages } from './components/analyst/AnalystMasterIndex';
 * 
 * // Render design tokens
 * <AnalystPages.DesignTokens />
 * 
 * // Render component library
 * <AnalystPages.ComponentLibrary />
 * 
 * // Render interactive prototype
 * <AnalystPages.Prototype />
 * 
 * // Render individual screens
 * <AnalystPages.Screens.AgentConsole />
 * <AnalystPages.Screens.IssueDetail />
 * // ... etc
 * ```
 */

// Design System
export { DesignTokensPage } from './DesignTokensPage';
export { ComponentLibraryPage } from './ComponentLibraryPage';

// Production Components
export * from './production';

// Screens
export { ProductionScreens } from './screens/ProductionScreens';
export { AdditionalScreens } from './screens/AdditionalScreens';
export { FinalScreens } from './screens/FinalScreens';

// Prototype
export { InteractivePrototype } from './InteractivePrototype';

// Handoff Materials
export { HandoffPage } from './HandoffPage';

// Existing screens
export { AgentConsole } from './screens/AgentConsole';
export { IssueDetail } from './screens/IssueDetail';
export { KBDraftEditor } from './screens/KBDraftEditor';

// All-in-one convenience export
import { DesignTokensPage } from './DesignTokensPage';
import { ComponentLibraryPage } from './ComponentLibraryPage';
import { InteractivePrototype } from './InteractivePrototype';
import { HandoffPage } from './HandoffPage';
import { ProductionScreens } from './screens/ProductionScreens';
import { AdditionalScreens } from './screens/AdditionalScreens';
import { FinalScreens } from './screens/FinalScreens';

export const AnalystPages = {
  DesignTokens: DesignTokensPage,
  ComponentLibrary: ComponentLibraryPage,
  Prototype: InteractivePrototype,
  Handoff: HandoffPage,
  Screens: {
    // Core (1-4)
    AgentConsole: ProductionScreens.AgentConsole,
    IssueDetail: ProductionScreens.IssueDetail,
    KBDraftEditor: ProductionScreens.KBDraftEditor,
    ApprovalDialog: AdditionalScreens.ApprovalDialog,
    
    // Configuration (5-7)
    PolicySettings: AdditionalScreens.PolicySettings,
    DeviceJobs: AdditionalScreens.DeviceJobs,
    WebhooksSecrets: FinalScreens.WebhooksSecrets,
    
    // Monitoring (8-11)
    TracesLineage: AdditionalScreens.TracesLineage,
    AlertsTelemetry: AdditionalScreens.AlertsTelemetry,
    AuditLog: FinalScreens.AuditLog,
    RateLimits: FinalScreens.RateLimits,
    
    // Admin (12-13)
    OrgOnboarding: FinalScreens.OrgOnboarding,
    RunbookKillSwitch: FinalScreens.RunbookKillSwitch,
  },
};

/**
 * Quick Start Examples
 * 
 * 1. View Design Tokens:
 * ```tsx
 * import { AnalystPages } from './components/analyst/AnalystMasterIndex';
 * <AnalystPages.DesignTokens />
 * ```
 * 
 * 2. View Component Library:
 * ```tsx
 * import { AnalystPages } from './components/analyst/AnalystMasterIndex';
 * <AnalystPages.ComponentLibrary />
 * ```
 * 
 * 3. Launch Interactive Prototype:
 * ```tsx
 * import { AnalystPages } from './components/analyst/AnalystMasterIndex';
 * <AnalystPages.Prototype />
 * ```
 * 
 * 4. Use Individual Components:
 * ```tsx
 * import { ConfidenceOrb, ActionItem } from './components/analyst/production';
 * 
 * <ConfidenceOrb value={0.87} size={96} />
 * <ActionItem
 *   actionType="restart_service"
 *   payload={{ device: 'DEV-001' }}
 *   hints={['Rollback required']}
 *   onApprove={() => {}}
 *   onReject={() => {}}
 * />
 * ```
 * 
 * 5. Access Design Tokens in Code:
 * ```tsx
 * // Use Tailwind classes
 * className="bg-bg-900 text-text-100 border-[color:rgb(var(--border-analyst))]"
 * 
 * // Use CSS variables
 * style={{ backgroundColor: 'rgb(var(--bg-900))' }}
 * 
 * // Use panel utility
 * className="panel p-6"
 * ```
 */

export default AnalystPages;
