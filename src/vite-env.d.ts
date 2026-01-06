/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Stripe Price IDs
  readonly VITE_STRIPE_PRICE_STARTER?: string;
  readonly VITE_STRIPE_PRICE_PRO?: string;
  readonly VITE_STRIPE_PRICE_TEAM?: string;
  readonly VITE_STRIPE_PRICE_ADDON_SECURITY?: string;
  readonly VITE_STRIPE_PRICE_ADDON_DR?: string;
  readonly VITE_STRIPE_PRICE_ADDON_REMOTE?: string;
  readonly VITE_ANNUAL_FACTOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}