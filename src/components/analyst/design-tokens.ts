/**
 * BuboIQ Analyst v1 - Design Tokens
 * Production-ready design system tokens for developer handoff
 */

export const AnalystTokens = {
  // Color Palette
  colors: {
    // Backgrounds
    'bg-950': '#050607',
    'bg-900': '#0A0B0D',
    'bg-850': '#0E1014',
    'panel-glass': 'rgba(15, 18, 22, 0.82)',
    
    // Borders & Dividers
    'border': '#1F242D',
    'divider': '#14181F',
    
    // Text
    'text-100': '#EAEFF5',
    'text-300': '#C7D0DA',
    'text-400': '#AAB4C0',
    'text-600': '#7A8694',
    
    // Brand Colors
    'accent': '#00FF85',
    'info': '#3EA0FF',
    'warn': '#F6C14A',
    'danger': '#FF6B6B',
    'success': '#55D187',
  },
  
  // Border Radius
  radius: {
    xs: '6px',
    sm: '10px',
    md: '16px',
    xl: '20px',
    modal: '32px',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  // Elevation (shadows)
  elevation: {
    tiny: '0 1px 2px rgba(0, 0, 0, 0.5)',
    card: '0 8px 24px rgba(0, 0, 0, 0.5)',
    modal: '0 16px 48px rgba(0, 0, 0, 0.5)',
  },
  
  // Typography
  typography: {
    h1: {
      fontSize: '36px',
      lineHeight: '44px',
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h2: {
      fontSize: '28px',
      lineHeight: '36px',
      fontFamily: 'Space Grotesk',
      fontWeight: 700,
    },
    h3: {
      fontSize: '22px',
      lineHeight: '30px',
      fontFamily: 'Space Grotesk',
      fontWeight: 600,
    },
    body: {
      fontSize: '16px',
      lineHeight: '24px',
      fontFamily: 'Inter',
      fontWeight: 400,
    },
    small: {
      fontSize: '14px',
      lineHeight: '20px',
      fontFamily: 'Inter',
      fontWeight: 400,
    },
    mono: {
      fontSize: '13px',
      lineHeight: '18px',
      fontFamily: 'JetBrains Mono',
      fontWeight: 400,
    },
  },
  
  // Status Colors
  status: {
    observing: '#3EA0FF',
    approvalRequired: '#F6C14A',
    autoApproveActive: '#00FF85',
  },
} as const;

// CSS Variables export for Tailwind integration
export const cssVariables = `
:root {
  /* Analyst Color Tokens */
  --analyst-bg-950: #050607;
  --analyst-bg-900: #0A0B0D;
  --analyst-bg-850: #0E1014;
  --analyst-panel-glass: rgba(15, 18, 22, 0.82);
  --analyst-border: #1F242D;
  --analyst-divider: #14181F;
  --analyst-text-100: #EAEFF5;
  --analyst-text-300: #C7D0DA;
  --analyst-text-400: #AAB4C0;
  --analyst-text-600: #7A8694;
  --analyst-accent: #00FF85;
  --analyst-info: #3EA0FF;
  --analyst-warn: #F6C14A;
  --analyst-danger: #FF6B6B;
  --analyst-success: #55D187;
  
  /* Radius */
  --analyst-radius-xs: 6px;
  --analyst-radius-sm: 10px;
  --analyst-radius-md: 16px;
  --analyst-radius-xl: 20px;
  --analyst-radius-modal: 32px;
  
  /* Elevation */
  --analyst-elevation-tiny: 0 1px 2px rgba(0, 0, 0, 0.5);
  --analyst-elevation-card: 0 8px 24px rgba(0, 0, 0, 0.5);
  --analyst-elevation-modal: 0 16px 48px rgba(0, 0, 0, 0.5);
}
`;
