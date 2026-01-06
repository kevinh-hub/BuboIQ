/**
 * Feature Flags for BuboIQ
 * 
 * Toggle these to enable/disable features across the platform.
 * This provides a single source of truth for feature availability.
 */

export const FEATURE_FLAGS = {
  /**
   * Billing & Payments
   * Set to true when ready to accept payments and trials
   * 
   * When false: Shows "Coming Soon" messaging
   * When true: Full billing functionality enabled
   */
  BILLING_ENABLED: false,
} as const;

/**
 * Coming Soon Configuration
 * Customize the messaging shown when features are not yet available
 */
export const COMING_SOON_CONFIG = {
  title: "Coming Soon",
  message: "BuboIQ will be available for trial and purchase very soon. Join our waitlist to be notified when we launch!",
  ctaText: "Join Waitlist",
  ctaAction: "mailto:help@buboiq.com?subject=Early%20Access%20Waitlist&body=Hi%20BuboIQ%20Team,%0D%0A%0D%0AI'm%20interested%20in%20getting%20early%20access%20to%20BuboIQ.%20Please%20notify%20me%20when%20it's%20available.%0D%0A%0D%0AMy%20Contact%20Information:%0D%0AEmail:%20[Your%20email%20here]%0D%0ACompany:%20[Your%20company%20name]%0D%0ARole:%20[Your%20role]%0D%0A%0D%0AThank%20you!",
  
  // Alternative: Newsletter signup
  // ctaText: "Get Notified",
  // ctaAction: "https://buboiq.com/newsletter",
  
  // For debugging: Show feature flag status
  showDebugInfo: false,
} as const;

/**
 * Helper function to check if billing is enabled
 * Use this in components to conditionally show/hide billing features
 */
export const isBillingEnabled = () => FEATURE_FLAGS.BILLING_ENABLED;

/**
 * Helper function to get coming soon config
 */
export const getComingSoonConfig = () => COMING_SOON_CONFIG;
