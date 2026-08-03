import React, { useState, useEffect, lazy, Suspense, startTransition } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/sonner';
import FontLoader from './components/FontLoader';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NetworkOfflineBanner } from './components/NetworkOfflineBanner';
import { RouteLoadingOverlay } from './components/RouteLoadingOverlay';
import { NotFoundPage } from './components/NotFoundPage';

// FORCE CACHE CLEAR - VERSION 529 RESTORED
export const VERSION_529_TIMESTAMP = Date.now();
export const DEMO_INDEX_CREATED = "demo-barrel-export-fixed";
export const ORB_ADDED_TO_PAGES = "home-why-howitworks-pricing-complete";
export const AUTH_SYSTEM_RESTORED = "v2-kevin-super-admin-complete";
console.log('🔄 VERSION 529 RESTORED AT:', VERSION_529_TIMESTAMP);
console.log('✅ DEMO INDEX EXPORT CREATED');
console.log('✨ DEVICE NETWORK ORB ADDED TO: Home, Why, How It Works, Pricing');
console.log('🔐 AUTH PATCH COMPLETE: Kevin is now Super Admin (kevinh@buboiq.com)');
console.log('✅ Auto-creation enabled in backend /supabase/functions/server/auth.ts');
console.log('✅ Role-based checks: user.role === super_admin ONLY');

// Test backend connectivity
(async () => {
  try {
    const { projectId, publicAnonKey } = await import('./utils/supabase/info');
    const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/health`;
    console.log('🔍 Testing backend connectivity:', healthUrl);
    const response = await fetch(healthUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is ONLINE:', data);
    } else {
      console.error('❌ Backend returned error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Backend is OFFLINE or unreachable:', error.message);
    console.error('⚠️ CRITICAL: The Supabase Edge Function needs to be deployed!');
    console.error('📝 Deploy command: supabase functions deploy make-server-55e8c5b2 --project-ref xwcgpmqgqysxeovbrbxg');
  }
})();

// Eagerly load critical components
import { MarketingNavigation } from './components/marketing/MarketingNavigation';
import { MarketingFooter } from './components/marketing/MarketingFooter';
import { HomePage } from './components/marketing/HomePage';
import { LoginPage } from './components/marketing/LoginPage';
import { AppRouter } from './components/app/AppRouter';

// Lazy load heavy marketing pages
const FeaturesPage = lazy(() => import('./components/marketing/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const PricingPageMSP = lazy(() => import('./components/marketing/PricingPageMSP').then(m => ({ default: m.PricingPageMSP })));
const SmallBusinessPage = lazy(() => import('./components/marketing/SmallBusinessPage').then(m => ({ default: m.SmallBusinessPage })));
const StripePricingPageV2 = lazy(() => import('./components/marketing/StripePricingPageV2').then(m => ({ default: m.StripePricingPageV2 })));
const StripeSuccessPage = lazy(() => import('./components/marketing/StripeSuccessPage').then(m => ({ default: m.StripeSuccessPage })));
const AboutPage = lazy(() => import('./components/marketing/AboutPage').then(m => ({ default: m.AboutPage })));
const LegalPage = lazy(() => import('./components/marketing/LegalPage').then(m => ({ default: m.LegalPage })));
const FAQPage = lazy(() => import('./components/marketing/FAQPage').then(m => ({ default: m.FAQPage })));
const WhyPage = lazy(() => import('./components/marketing/WhyPage').then(m => ({ default: m.WhyPage })));
const HowItWorksPage = lazy(() => import('./components/marketing/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const PlatformDemo = lazy(() => import('./components/marketing/PlatformDemo').then(m => ({ default: m.PlatformDemo })));

// Lazy load vertical pages
const HealthcarePage = lazy(() => import('./components/marketing/verticals/HealthcarePage').then(m => ({ default: m.HealthcarePage })));
const FinancePage = lazy(() => import('./components/marketing/verticals/FinancePage').then(m => ({ default: m.FinancePage })));
const ManufacturingPage = lazy(() => import('./components/marketing/verticals/ManufacturingPage').then(m => ({ default: m.ManufacturingPage })));
const LegalVerticalPage = lazy(() => import('./components/marketing/verticals/LegalPage').then(m => ({ default: m.LegalPage })));
const SLEDPage = lazy(() => import('./components/marketing/verticals/SLEDPage').then(m => ({ default: m.SLEDPage })));

import { useAuth } from './context/AuthContext';
import { UpgradeModal } from './components/marketing/UpgradeModal';
import { ComingSoonModal } from './components/marketing/ComingSoonModal';
import { TrialExpirationHandler } from './components/TrialExpirationHandler';
import { TierRestrictedError } from './utils/supabase/client';
import { isBillingEnabled } from './utils/feature-flags';
import { toast } from 'sonner';

// Import Full Journey Demo System
import { FullJourneyDemo } from './components/demo/FullJourneyDemo';

type PageType = 'home' | 'features' | 'pricing' | 'small-business' | 'stripe-pricing' | 'success' | 'about' | 'legal' | 'login' | 'why' | 'how-it-works' | 'healthcare' | 'finance' | 'manufacturing' | 'legal-vertical' | 'sled' | 'faq' | '404' | 'dashboard';

function AppContent() {
  const { user, signIn, signOut, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [showPlatformDemo, setShowPlatformDemo] = useState(false);
  const [showFullJourneyDemo, setShowFullJourneyDemo] = useState(false);

  const [legalType, setLegalType] = useState<'privacy' | 'terms'>('privacy');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [upgradeContext, setUpgradeContext] = useState<{
    feature?: string;
    requiredTier?: string;
  }>({});

  // Determine if we should show the AppRouter (Dashboard environment)
  // Show AppRouter if:
  // 1. User is logged in AND explicitly asked for 'dashboard'
  // 2. User is logged in AND is on 'login' page (auto-redirect)
  const showAppEnvironment = Boolean(user && (currentPage === 'dashboard' || currentPage === 'login'));

  // Handle initial URL routing for marketing pages
  useEffect(() => {
    const path = window.location.pathname;
    
    // If user is logged in, always show dashboard unless on a specific marketing page
    if (user && !loading) {
      // Only stay on marketing pages if explicitly there
      if (currentPage !== 'pricing' && currentPage !== 'features' && currentPage !== 'about' && currentPage !== 'legal') {
        console.log('App.tsx: User is logged in, redirecting to dashboard from:', currentPage);
        setCurrentPage('dashboard');
      }
      return;
    }
    
    // Handle URL-based routing for non-authenticated users
    if (path === '/login') {
      setCurrentPage('login');
    } else if (path === '/pricing') {
      setCurrentPage('pricing');
    } else if (path === '/features') {
      setCurrentPage('features');
    } else if (path === '/dashboard' || path === '/app') {
      // If not logged in, redirect to login
      if (!user) {
        setCurrentPage('login');
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, [user, loading, currentPage]);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('=== App.tsx: User state changed ===');
    console.log('User:', user);
    console.log('App.tsx: User is authenticated, rendering AppRouter for app role:', user?.role);
    console.log('Loading:', loading);
  }, [user, loading]);

  // Global error handler for SVG errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Problem parsing d=')) {
        console.error('SVG Path Error caught and suppressed:', event.message);
        event.preventDefault(); // Prevent the error from crashing the app
        return false;
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Google Analytics initialization
  useEffect(() => {
    // Create and append Google Analytics script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-H0TC87LSSH';
    document.head.appendChild(gtagScript);

    // Initialize gtag function and configuration
    const gtagConfigScript = document.createElement('script');
    gtagConfigScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-H0TC87LSSH');
    `;
    document.head.appendChild(gtagConfigScript);

    // Make gtag available globally for page tracking
    (window as any).gtag = (window as any).gtag || function() {
      ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
    };
  }, []);

  // Global error handler for tier-restricted API calls
  useEffect(() => {
    const handleGlobalError = (event: any) => {
      if (event.detail?.error instanceof TierRestrictedError) {
        const error = event.detail.error as TierRestrictedError;
        
        toast.error('Feature Restricted', {
          description: error.message
        });

        setUpgradeContext({
          feature: event.detail.feature,
          requiredTier: error.requiredTier
        });
        setShowUpgradeModal(true);
      }
    };

    window.addEventListener('tier-restricted', handleGlobalError);
    return () => window.removeEventListener('tier-restricted', handleGlobalError);
  }, []);

  // Secret keyboard shortcuts (simplified)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + S for direct signup
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        setCurrentPage('pricing');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showInteractiveShowcase = (planId?: string) => {
    startTransition(() => {
      setShowPlatformDemo(true);
    });
    
    // Track showcase launch in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'try_it_now', {
        source: currentPage,
        preselected_plan: planId || '',
        user_tier: user?.tier || 'anonymous'
      });
    }
  };

  const closePlatformDemo = () => {
    startTransition(() => {
      setShowPlatformDemo(false);
    });
  };

  const showFullJourneyDemoExperience = () => {
    startTransition(() => {
      setShowFullJourneyDemo(true);
    });
    
    // Track full journey demo launch
    if ((window as any).gtag) {
      (window as any).gtag('event', 'full_journey_demo_started', {
        source: currentPage,
        user_tier: user?.tier || 'anonymous'
      });
    }
  };

  const closeFullJourneyDemo = () => {
    startTransition(() => {
      setShowFullJourneyDemo(false);
    });
  };



  const navigateToPage = (page: PageType, options?: { legalType?: 'privacy' | 'terms' }) => {
    // Scroll to top immediately when navigating
    window.scrollTo(0, 0);
    
    // Use startTransition for lazy-loaded page navigation to prevent suspension errors
    startTransition(() => {
      setCurrentPage(page);
      if (options?.legalType) {
        setLegalType(options.legalType);
      }
    });
    
    // Track page views in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', 'G-H0TC87LSSH', {
        page_title: page.charAt(0).toUpperCase() + page.slice(1),
        page_location: window.location.href,
        custom_map: {
          user_tier: user?.tier || 'anonymous',
          user_role: user?.role || 'anonymous'
        }
      });
    }
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    try {
      console.log('App.tsx: handleLoginSuccess called for:', email);
      const userData = await signIn(email, password);
      console.log('App.tsx: signIn completed, user:', userData);
      
      // Route based on role
      console.log('App.tsx: Regular user detected, will show dashboard');
      // Explicitly navigate to dashboard to trigger AppRouter render
      navigateToPage('dashboard');
      
    } catch (error) {
      // Error handling is done in the auth context with toasts
      console.error('App.tsx: Login failed:', error);
      // Rethrow to let LoginPage handle it if needed
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('home');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpgrade = (tier: string) => {
    // Check if billing is enabled
    if (!isBillingEnabled()) {
      setShowUpgradeModal(false);
      setUpgradeContext({});
      setShowComingSoon(true);
      return;
    }

    // Track upgrade intent
    if ((window as any).gtag) {
      (window as any).gtag('event', 'upgrade_intent', {
        source: 'tier_guard',
        target_tier: tier,
        current_tier: user?.tier || 'none',
        feature: upgradeContext.feature || 'unknown'
      });
    }

    // Redirect to Stripe pricing page for immediate payment
    setShowUpgradeModal(false);
    setUpgradeContext({});
    navigateToPage('stripe-pricing');
  };

  // Show loading state while auth is initializing
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-dark-midnight bubo-neural-bg flex items-center justify-center">
        <FontLoader />
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-slate-gray border-t-iq-neon-green rounded-full animate-spin mx-auto" />
          <p className="text-mist-gray">Loading BuboIQ...</p>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    // Handle legacy super-admin route redirection
    if (window.location.pathname.startsWith('/super-admin')) {
      console.log('App.tsx: Redirecting legacy /super-admin route to home/dashboard');
      // We don't use navigateToPage here because we want to clear the URL
      window.history.replaceState(null, '', '/');
      // If user is logged in, they will see dashboard. If not, home.
    }

    // Determine if we should show the AppRouter (Dashboard environment)
    // Show AppRouter if:
    // 1. User is logged in AND explicitly asked for 'dashboard'
    // 2. User is logged in AND is on 'login' page (auto-redirect)
    // 3. User is logged in AND we are defaulting (e.g. initial load) - this is tricky.
    // Let's say if user logs in, we set currentPage to 'dashboard'.
    
    // If authenticated and on dashboard/login, show app router
    if (showAppEnvironment) {
      console.log('App.tsx: User is authenticated and on app page, rendering AppRouter');
      return (
        <AppRouter 
          user={user} 
          onLogout={handleLogout}
          onNavigateToMarketing={(page) => {
            // Navigate to marketing page
            navigateToPage(page as PageType);
          }}
        />
      );
    }

    // For marketing pages that should have footer (login excluded for focused experience)
    const pagesWithFooter = ['home', 'features', 'why', 'how-it-works', 'pricing', 'small-business', 'about', 'legal', 'healthcare', 'finance', 'manufacturing', 'legal-vertical', 'sled', 'faq'];
    const shouldShowFooter = pagesWithFooter.includes(currentPage);

    // Render the page content
    let pageContent;
    switch (currentPage) {
      case 'home':
        pageContent = <HomePage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} onStartLiveDemo={showFullJourneyDemoExperience} />;
        break;
      case 'features':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <FeaturesPage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} />
          </Suspense>
        );
        break;
      case 'why':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <WhyPage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} />
          </Suspense>
        );
        break;
      case 'how-it-works':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <HowItWorksPage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} />
          </Suspense>
        );
        break;
      case 'pricing':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <PricingPageMSP onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'small-business':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <SmallBusinessPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'stripe-pricing':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <StripePricingPageV2 onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'success':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <StripeSuccessPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'about':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <AboutPage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} />
          </Suspense>
        );
        break;
      case 'legal':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <LegalPage type={legalType} onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'healthcare':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <HealthcarePage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'finance':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <FinancePage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'manufacturing':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <ManufacturingPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'legal-vertical':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <LegalVerticalPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'sled':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <SLEDPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case 'login':
        pageContent = <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigateToPage} />;
        break;
      case 'faq':
        pageContent = (
          <Suspense fallback={<RouteLoadingOverlay />}>
            <FAQPage onNavigate={navigateToPage} />
          </Suspense>
        );
        break;
      case '404':
        pageContent = <NotFoundPage onNavigateHome={() => navigateToPage('home')} />;
        break;
      default:
        pageContent = <HomePage onNavigate={navigateToPage} onTryItNow={showInteractiveShowcase} />;
        break;
    }

    // Wrap with footer if needed
    if (shouldShowFooter) {
      return (
        <>
          {pageContent}
          <MarketingFooter onNavigate={navigateToPage} />
        </>
      );
    }

    return pageContent;
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg">
      <FontLoader />
      
      {/* Network Status Banner */}
      <NetworkOfflineBanner />
      
      {/* Background effects - only show for non-authenticated pages */}
      {/* Subtle ambient effects that sit BEHIND the Orb System */}
      {!showAppEnvironment && (
        <>
          <div className="fixed inset-0 bubo-circuit-pattern opacity-5 pointer-events-none z-[1]" />
          <div className="fixed inset-0 bubo-particles opacity-10 pointer-events-none z-[1]" />
        </>
      )}
      
      {/* Navigation - only show for marketing pages */}
      {!showAppEnvironment && (
        <MarketingNavigation 
          currentPage={currentPage}
          onNavigate={navigateToPage}
          onTryItNow={showInteractiveShowcase}
          user={user}
        />
      )}
      


      {/* Main Content */}
      <main className={showAppEnvironment ? "" : "relative z-10"}>
        {renderCurrentPage()}
      </main>
      
      {/* Platform Demo Modal */}
      {showPlatformDemo && (
        <PlatformDemo 
          onClose={closePlatformDemo}
          onNavigate={(page) => {
            setShowPlatformDemo(false);
            navigateToPage(page as PageType);
          }}
        />
      )}

      {/* Full Journey Demo - Complete Workflow Experience */}
      {showFullJourneyDemo && (
        <FullJourneyDemo onClose={closeFullJourneyDemo} />
      )}

      {/* Upgrade Modal for tier restrictions */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setUpgradeContext({});
        }}
        feature={upgradeContext.feature}
        requiredTier={upgradeContext.requiredTier as 'pro' | 'team'}
        currentTier={user?.tier || 'starter'}
        onUpgrade={handleUpgrade}
      />

      {/* Trial Expiration Handler */}
      <TrialExpirationHandler onNavigate={navigateToPage} />

      {/* Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={showComingSoon}
        onClose={() => setShowComingSoon(false)}
      />
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}