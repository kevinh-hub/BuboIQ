import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function DesignTokensPage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colors = [
    { name: 'bg-950', value: '#050607', rgb: '5 6 7', usage: 'Darkest background' },
    { name: 'bg-900', value: '#0A0B0D', rgb: '10 11 13', usage: 'Dark background' },
    { name: 'bg-850', value: '#0E1014', rgb: '14 16 20', usage: 'Medium dark background' },
    { name: 'panel-glass', value: 'rgba(15,18,22,0.82)', rgb: '15 18 22', usage: 'Glass panel background' },
    { name: 'border', value: '#1F242D', rgb: '31 36 45', usage: 'Border color' },
    { name: 'divider', value: '#14181F', rgb: '20 24 31', usage: 'Divider lines' },
    { name: 'text-100', value: '#EAEFF5', rgb: '234 239 245', usage: 'Brightest text' },
    { name: 'text-300', value: '#C7D0DA', rgb: '199 208 218', usage: 'Bright text' },
    { name: 'text-400', value: '#AAB4C0', rgb: '170 180 192', usage: 'Medium text' },
    { name: 'text-600', value: '#7A8694', rgb: '122 134 148', usage: 'Dim text' },
    { name: 'accent', value: '#00FF85', rgb: '0 255 133', usage: 'Neon green primary' },
    { name: 'info', value: '#3EA0FF', rgb: '62 160 255', usage: 'Blue information' },
    { name: 'warn', value: '#F6C14A', rgb: '246 193 74', usage: 'Yellow warning' },
    { name: 'danger', value: '#FF6B6B', rgb: '255 107 107', usage: 'Red danger' },
    { name: 'success', value: '#55D187', rgb: '85 209 135', usage: 'Green success' },
  ];

  const typography = [
    { name: 'H1', size: '36px', lineHeight: '44px', weight: '700', font: 'Space Grotesk' },
    { name: 'H2', size: '28px', lineHeight: '36px', weight: '700', font: 'Space Grotesk' },
    { name: 'H3', size: '22px', lineHeight: '30px', weight: '600', font: 'Space Grotesk' },
    { name: 'Body', size: '16px', lineHeight: '24px', weight: '400', font: 'Inter' },
    { name: 'Small', size: '14px', lineHeight: '20px', weight: '400', font: 'Inter' },
    { name: 'Mono', size: '13px', lineHeight: '18px', weight: '400', font: 'JetBrains Mono' },
  ];

  const spacing = [
    { name: 'xs', value: '4px' },
    { name: 'sm', value: '8px' },
    { name: 'md', value: '12px' },
    { name: 'lg', value: '16px' },
    { name: 'xl', value: '24px' },
    { name: '2xl', value: '32px' },
    { name: '3xl', value: '48px' },
  ];

  const radius = [
    { name: 'xs', value: '6px' },
    { name: 'sm', value: '10px' },
    { name: 'md', value: '16px' },
    { name: 'xl', value: '20px' },
    { name: 'modal', value: '32px' },
  ];

  const shadows = [
    { name: 'card', value: '0 8px 24px rgba(0,0,0,0.35)' },
    { name: 'modal', value: '0 16px 48px rgba(0,0,0,0.5)' },
  ];

  return (
    <div className="min-h-screen bg-bg-900 text-text-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-space-grotesk mb-4">
          <span className="text-white">BUBO</span>
          <span className="text-accent">IQ</span>
          <span className="text-text-400 ml-3">Analyst v1 Design Tokens</span>
        </h1>
        <p className="text-text-400">
          Production-ready design system tokens for AI-driven IT support intelligence
        </p>
      </div>

      {/* Colors Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Color Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="panel p-4">
              <div
                className="w-full h-20 rounded-xl mb-3"
                style={{ backgroundColor: color.value }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="font-space-grotesk text-white">{color.name}</span>
                <button
                  onClick={() => copyToClipboard(color.value, color.name)}
                  className="p-1 hover:bg-bg-850 rounded transition-colors"
                >
                  {copiedToken === color.name ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-text-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-text-400 mb-1 font-jetbrains-mono">{color.value}</p>
              <p className="text-xs text-text-400 mb-1 font-jetbrains-mono">RGB: {color.rgb}</p>
              <p className="text-xs text-text-300">{color.usage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Typography Scale</h2>
        <div className="panel p-6 space-y-6">
          {typography.map((type) => (
            <div key={type.name} className="border-b border-[color:rgb(var(--divider))] pb-6 last:border-0">
              <div className="mb-3">
                <span
                  className={`${type.font === 'Space Grotesk' ? 'font-space-grotesk' : type.font === 'Inter' ? 'font-inter' : 'font-jetbrains-mono'}`}
                  style={{
                    fontSize: type.size,
                    lineHeight: type.lineHeight,
                    fontWeight: type.weight,
                  }}
                >
                  The quick brown fox jumps over the lazy dog
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-400 font-jetbrains-mono">
                <span className="text-white">{type.name}</span>
                <span>{type.size}</span>
                <span>LH: {type.lineHeight}</span>
                <span>Weight: {type.weight}</span>
                <span>{type.font}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Spacing Scale</h2>
        <div className="panel p-6">
          <div className="space-y-4">
            {spacing.map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <div className="w-20 text-xs text-text-400 font-jetbrains-mono">{space.name}</div>
                <div className="w-24 text-xs text-text-300 font-jetbrains-mono">{space.value}</div>
                <div className="flex-1">
                  <div
                    className="bg-accent h-8 rounded"
                    style={{ width: space.value }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Border Radius Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Border Radius</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {radius.map((r) => (
            <div key={r.name} className="panel p-4">
              <div
                className="w-full h-20 bg-bg-850 border border-[color:rgb(var(--border-analyst))] mb-3"
                style={{ borderRadius: r.value }}
              />
              <p className="text-sm text-white mb-1">{r.name}</p>
              <p className="text-xs text-text-400 font-jetbrains-mono">{r.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Elevation Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Elevation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shadows.map((shadow) => (
            <div key={shadow.name} className="panel p-6">
              <div
                className="w-full h-32 bg-bg-850 rounded-xl mb-3"
                style={{ boxShadow: shadow.value }}
              />
              <p className="text-sm text-white mb-1">{shadow.name}</p>
              <p className="text-xs text-text-400 font-jetbrains-mono">{shadow.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CSS Variables Export */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">CSS Variables</h2>
        <div className="panel p-6">
          <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto">
{`:root {
  /* Colors - RGB format for alpha-value support */
  --bg-950: 5 6 7;
  --bg-900: 10 11 13;
  --bg-850: 14 16 20;
  --panel-glass: 15 18 22;
  --border-analyst: 31 36 45;
  --divider: 20 24 31;
  --text-100: 234 239 245;
  --text-300: 199 208 218;
  --text-400: 170 180 192;
  --text-600: 122 134 148;
  --accent-analyst: 0 255 133;
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
}`}
          </pre>
          <button
            onClick={() => copyToClipboard(`:root {...}`, 'css-vars')}
            className="mt-4 px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {copiedToken === 'css-vars' ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy CSS Variables
              </>
            )}
          </button>
        </div>
      </section>

      {/* Tailwind Config */}
      <section className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-space-grotesk mb-6 text-white">Tailwind Configuration</h2>
        <div className="panel p-6">
          <pre className="text-xs font-jetbrains-mono text-text-300 overflow-x-auto">
{`// tailwind.config.ts
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
        accent: 'rgb(var(--accent-analyst) / <alpha-value>)',
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
}`}
          </pre>
          <button
            onClick={() => copyToClipboard('tailwind.config.ts', 'tailwind-config')}
            className="mt-4 px-4 py-2 bg-accent text-black rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {copiedToken === 'tailwind-config' ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Tailwind Config
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
