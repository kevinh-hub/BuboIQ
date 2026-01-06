/**
 * BuboIQ Live Demo System
 * 
 * Production-ready demo experience for marketing site.
 * Complete observe → reason → approve → execute flow in sandboxed environment.
 * 
 * @module demo
 * @version 1.0.0
 */

// Main orchestrator - use this to launch the demo
export { DemoOrchestrator } from './DemoOrchestrator';

// Full Journey Demo - Complete workflow experience (NEW - Phase 5)
export { FullJourneyDemo } from './FullJourneyDemo';

// Individual components (for flexibility)
export { DemoLauncher } from './DemoLauncher';
export { LiveDemoConsole } from './LiveDemoConsole';
export { LeadCaptureModal } from './LeadCaptureModal';

// Marketing sections
export { DemoHeroSection } from './DemoHeroSection';
export { HowItWorksSection } from './HowItWorksSection';
export { ValuePropositionSection } from './ValuePropositionSection';

// Design tokens export
export { DemoTokensExport } from './DemoTokensExport';

/**
 * Quick Start Usage:
 * 
 * ```tsx
 * import { DemoOrchestrator } from './components/demo';
 * 
 * function App() {
 *   const [showDemo, setShowDemo] = useState(false);
 *   
 *   return (
 *     <>
 *       <button onClick={() => setShowDemo(true)}>
 *         Start Live Demo
 *       </button>
 *       
 *       {showDemo && (
 *         <DemoOrchestrator onClose={() => setShowDemo(false)} />
 *       )}
 *     </>
 *   );
 * }
 * ```
 * 
 * Marketing Page Integration:
 * 
 * ```tsx
 * import { DemoHeroSection, HowItWorksSection, ValuePropositionSection } from './components/demo';
 * 
 * function HomePage() {
 *   return (
 *     <>
 *       <DemoHeroSection onStartDemo={() => setShowDemo(true)} />
 *       <ValuePropositionSection />
 *       <HowItWorksSection />
 *     </>
 *   );
 * }
 * ```
 */
