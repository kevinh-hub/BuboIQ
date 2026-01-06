import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

export function DemoTokensExport() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const cssVariables = `:root {
  /* Colors - RGB format for alpha-value support */
  --bg-950: 5 6 7;
  --bg-900: 10 11 13;
  --bg-850: 14 16 20;
  --panel-glass: 15 18 22;
  --border: 31 36 45;
  --divider: 20 24 31;
  --text-100: 234 239 245;
  --text-300: 199 208 218;
  --text-400: 170 180 192;
  --text-600: 122 134 148;
  --accent: 0 255 133;
  --info: 62 160 255;
  --warn: 246 193 74;
  --danger: 255 107 107;
  --success: 85 209 135;
  
  /* Typography */
  --font-space-grotesk: 'Space Grotesk', 'Inter', sans-serif;
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-jetbrains-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;
  
  /* Border Radius */
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-xl: 20px;
  --radius-modal: 32px;
  
  /* Elevation */
  --shadow-card: 0 8px 24px rgba(0,0,0,0.35);
  --shadow-modal: 0 16px 48px rgba(0,0,0,0.5);
  
  /* Type Scale */
  --text-h1: 36px;
  --text-h1-lh: 44px;
  --text-h2: 28px;
  --text-h2-lh: 36px;
  --text-h3: 22px;
  --text-h3-lh: 30px;
  --text-body: 16px;
  --text-body-lh: 24px;
  --text-small: 14px;
  --text-small-lh: 20px;
  --text-mono: 13px;
  --text-mono-lh: 18px;
}`;

  const tailwindConfig = `// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          950: 'rgb(var(--bg-950) / <alpha-value>)',
          900: 'rgb(var(--bg-900) / <alpha-value>)',
          850: 'rgb(var(--bg-850) / <alpha-value>)',
        },
        text: {
          100: 'rgb(var(--text-100) / <alpha-value>)',
          300: 'rgb(var(--text-300) / <alpha-value>)',
          400: 'rgb(var(--text-400) / <alpha-value>)',
          600: 'rgb(var(--text-600) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'Inter', 'sans-serif'],
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '20px',
        '2xl': '32px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.35)',
        modal: '0 16px 48px rgba(0,0,0,0.5)',
      },
    },
  },
}`;

  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-space-grotesk mb-4">
          <span className="text-white">BUBO</span>
          <span className="text-accent">IQ</span>
          <span className="text-text-400 ml-3">Design Tokens</span>
        </h1>
        <p className="text-text-400 mb-12">
          Production-ready design system for AI-driven IT support intelligence
        </p>

        {/* CSS Variables */}
        <section className="mb-12">
          <h2 className="text-2xl font-space-grotesk text-white mb-6">CSS Variables</h2>
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-space-grotesk text-white">:root variables</h3>
              <button
                onClick={() => copyToClipboard(cssVariables, 'css')}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {copiedItem === 'css' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy CSS
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto bg-bg-850 p-4 rounded-xl max-h-96">
              {cssVariables}
            </pre>
          </div>
        </section>

        {/* Tailwind Config */}
        <section>
          <h2 className="text-2xl font-space-grotesk text-white mb-6">Tailwind Configuration</h2>
          <div className="panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-space-grotesk text-white">tailwind.config.ts</h3>
              <button
                onClick={() => copyToClipboard(tailwindConfig, 'tailwind')}
                className="px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                {copiedItem === 'tailwind' ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Config
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto bg-bg-850 p-4 rounded-xl max-h-96">
              {tailwindConfig}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
