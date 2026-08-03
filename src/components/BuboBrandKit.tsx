import React, { useState, useRef, useEffect } from 'react';
import { Eye, Zap, Target, Shield, Brain, Cpu, Search, Bell, Settings, ChevronRight, Copy, Check, Download, Palette, Type, Layout, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface ColorSwatch {
  name: string;
  value: string;
  description: string;
  usage: string;
}

interface TypographyScale {
  name: string;
  class: string;
  size: string;
  weight: string;
  usage: string;
}

interface ComponentDemo {
  name: string;
  category: string;
  element: React.ReactNode;
  code: string;
}

const BuboBrandKit: React.FC = () => {
  const [activeSection, setActiveSection] = useState('colors');
  const [copiedColor, setCopiedColor] = useState<string>('');
  const [owlGlow, setOwlGlow] = useState(false);
  const owlRef = useRef<HTMLDivElement>(null);

  // Color Palette
  const colorPalette: ColorSwatch[] = [
    {
      name: 'Dark Midnight',
      value: '#0E1726',
      description: 'Primary background color for deep, immersive interfaces',
      usage: 'Backgrounds, containers, panels'
    },
    {
      name: 'IQ Neon Green',
      value: '#00FF85',
      description: 'Primary accent for AI intelligence indicators and CTAs',
      usage: 'Primary buttons, active states, success indicators'
    },
    {
      name: 'Cyan Accent',
      value: '#00FFC6',
      description: 'Secondary accent for highlights and neural connections',
      usage: 'Secondary highlights, hover states, links'
    },
    {
      name: 'Signal Yellow',
      value: '#FFD400',
      description: 'Alert color for warnings and important notifications',
      usage: 'Alerts, warnings, attention-grabbing elements'
    },
    {
      name: 'Pure White',
      value: '#FFFFFF',
      description: 'High contrast text and critical interface elements',
      usage: 'Primary text, icons, borders'
    },
    {
      name: 'Nocturne Indigo',
      value: '#0B1021',
      description: 'Deep background for ultimate contrast and depth',
      usage: 'Modal backgrounds, overlays'
    }
  ];

  // Typography Scale
  const typographyScale: TypographyScale[] = [
    { name: 'Display Large', class: 'text-6xl font-bold', size: '3.75rem', weight: '700', usage: 'Hero headlines, landing page titles' },
    { name: 'Display Medium', class: 'text-4xl font-bold', size: '2.25rem', weight: '700', usage: 'Section headers, dashboard titles' },
    { name: 'Display Small', class: 'text-3xl font-semibold', size: '1.875rem', weight: '600', usage: 'Card headers, modal titles' },
    { name: 'Heading Large', class: 'text-2xl font-semibold', size: '1.5rem', weight: '600', usage: 'Component headers, feature titles' },
    { name: 'Heading Medium', class: 'text-xl font-medium', size: '1.25rem', weight: '500', usage: 'Subsection headers' },
    { name: 'Heading Small', class: 'text-lg font-medium', size: '1.125rem', weight: '500', usage: 'List headers, form labels' },
    { name: 'Body Large', class: 'text-base', size: '1rem', weight: '400', usage: 'Primary body text, descriptions' },
    { name: 'Body Medium', class: 'text-sm', size: '0.875rem', weight: '400', usage: 'Secondary text, captions' },
    { name: 'Body Small', class: 'text-xs', size: '0.75rem', weight: '400', usage: 'Labels, metadata' },
    { name: 'Code', class: 'text-sm font-mono', size: '0.875rem', weight: '400', usage: 'Technical text, IDs, timestamps' }
  ];

  // Component Demos
  const componentDemos: ComponentDemo[] = [
    {
      name: 'Primary Button',
      category: 'buttons',
      element: (
        <Button className="bg-[#00FF85] hover:bg-[#00E676] text-[#0E1726] font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(0,255,133,0.3)] transition-all duration-300 transform hover:scale-105">
          Initialize AI Scan
        </Button>
      ),
      code: `<Button className="bg-[#00FF85] hover:bg-[#00E676] text-[#0E1726] font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(0,255,133,0.3)] transition-all duration-300 transform hover:scale-105">
  Initialize AI Scan
</Button>`
    },
    {
      name: 'Glass Card',
      category: 'cards',
      element: (
        <Card className="bg-[#0E1726]/70 border border-[#00FF85]/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,255,133,0.1)] hover:border-[#00FF85]/40 transition-all duration-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#00FF85]/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-[#00FF85]" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Neural Analysis</h3>
              <p className="text-gray-400 text-sm">Active intelligence monitoring</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Confidence Level</span>
              <span className="text-[#00FF85]">94.2%</span>
            </div>
            <Progress value={94} className="h-2 bg-gray-700" />
          </div>
        </Card>
      ),
      code: `<Card className="bg-[#0E1726]/70 border border-[#00FF85]/20 rounded-2xl p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,255,133,0.1)] hover:border-[#00FF85]/40 transition-all duration-500">
  {/* Card content */}
</Card>`
    },
    {
      name: 'Neon Input',
      category: 'inputs',
      element: (
        <div className="relative">
          <Input 
            placeholder="Search intelligence data..." 
            className="bg-[#0E1726]/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:border-[#00FF85] focus:ring-2 focus:ring-[#00FF85]/20 focus:shadow-[0_0_15px_rgba(0,255,133,0.2)] transition-all duration-300" 
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      ),
      code: `<Input 
  placeholder="Search intelligence data..." 
  className="bg-[#0E1726]/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:border-[#00FF85] focus:ring-2 focus:ring-[#00FF85]/20 focus:shadow-[0_0_15px_rgba(0,255,133,0.2)] transition-all duration-300" 
/>`
    },
    {
      name: 'Status Badge',
      category: 'badges',
      element: (
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 px-3 py-1 rounded-full">
            Active
          </Badge>
          <Badge className="bg-[#FFD400]/20 text-[#FFD400] border border-[#FFD400]/30 px-3 py-1 rounded-full">
            Warning
          </Badge>
          <Badge className="bg-[#00FFC6]/20 text-[#00FFC6] border border-[#00FFC6]/30 px-3 py-1 rounded-full">
            Processing
          </Badge>
        </div>
      ),
      code: `<Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 px-3 py-1 rounded-full">
  Active
</Badge>`
    },
    {
      name: 'Owl Eye Logo',
      category: 'icons',
      element: (
        <div 
          ref={owlRef}
          className={`w-16 h-16 relative cursor-pointer transition-all duration-500 ${owlGlow ? 'animate-pulse' : ''}`}
          onClick={() => setOwlGlow(!owlGlow)}
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00FFC6] opacity-20 ${owlGlow ? 'animate-ping' : ''}`} />
          <div className="absolute inset-2 rounded-full bg-[#0E1726] border border-[#00FF85]/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Eye className={`w-8 h-8 text-[#00FF85] ${owlGlow ? 'drop-shadow-[0_0_10px_rgba(0,255,133,0.8)]' : ''}`} />
          </div>
        </div>
      ),
      code: `<div className="w-16 h-16 relative">
  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00FFC6] opacity-20" />
  <div className="absolute inset-2 rounded-full bg-[#0E1726] border border-[#00FF85]/30" />
  <div className="absolute inset-0 flex items-center justify-center">
    <Eye className="w-8 h-8 text-[#00FF85]" />
  </div>
</div>`
    }
  ];

  const copyToClipboard = (text: string, type: string = 'color') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedColor(text);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopiedColor(''), 2000);
    });
  };

  const exportDesignTokens = () => {
    const tokens = {
      colors: colorPalette.reduce((acc, color) => {
        acc[color.name.toLowerCase().replace(/\s+/g, '-')] = color.value;
        return acc;
      }, {} as Record<string, string>),
      typography: typographyScale.reduce((acc, type) => {
        acc[type.name.toLowerCase().replace(/\s+/g, '-')] = {
          size: type.size,
          weight: type.weight,
          class: type.class
        };
        return acc;
      }, {} as Record<string, any>)
    };
    
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'buboiq-design-tokens.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Design tokens exported!');
  };

  const navigationItems = [
    { id: 'colors', label: 'Color Palette', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'components', label: 'Components', icon: Layout },
    { id: 'guidelines', label: 'Brand Guidelines', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1726] via-[#0B1021] to-[#000000] text-white">
      {/* Neural Network Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(0, 255, 133, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 198, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 212, 0, 0.03) 0%, transparent 50%)
          `
        }} />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-800/50 bg-[#0E1726]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00FFC6] opacity-20 animate-pulse" />
                <div className="absolute inset-1 rounded-full bg-[#0E1726] border border-[#00FF85]/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.6)]" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00FF85] to-[#00FFC6] bg-clip-text text-transparent">
                  BuboIQ Brand Kit
                </h1>
                <p className="text-gray-400">Cinematic AI Intelligence Design System</p>
              </div>
            </div>
            <Button 
              onClick={exportDesignTokens}
              className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 hover:border-[#00FF85]/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Tokens
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 shrink-0">
            <nav className="sticky top-8 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] shadow-[0_0_15px_rgba(0,255,133,0.1)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {activeSection === item.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Color Palette Section */}
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Color Palette</h2>
                  <p className="text-gray-400">Primary colors for the BuboIQ AI intelligence platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {colorPalette.map((color) => (
                    <Card 
                      key={color.name}
                      className="bg-[#0E1726]/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#00FF85]/30 transition-all duration-300 group"
                    >
                      <div className="space-y-4">
                        <div 
                          className="w-full h-24 rounded-xl border border-gray-600/50 relative overflow-hidden cursor-pointer"
                          style={{ backgroundColor: color.value }}
                          onClick={() => copyToClipboard(color.value)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {copiedColor === color.value ? (
                              <Check className="w-4 h-4 text-white" />
                            ) : (
                              <Copy className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{color.name}</h3>
                            <code className="text-sm text-gray-400 font-mono">{color.value}</code>
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{color.description}</p>
                          <Badge className="bg-gray-700/50 text-gray-300 text-xs">
                            {color.usage}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Typography Section */}
            {activeSection === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Typography Scale</h2>
                  <p className="text-gray-400">Hierarchical text styles for consistent communication</p>
                </div>

                <div className="space-y-4">
                  {typographyScale.map((type) => (
                    <Card 
                      key={type.name}
                      className="bg-[#0E1726]/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl hover:border-[#00FF85]/30 transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                        <div>
                          <div className={`${type.class} text-white mb-2`}>
                            The quick brown fox jumps over the lazy dog
                          </div>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span>Size: {type.size}</span>
                            <span>Weight: {type.weight}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-white">{type.name}</h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(type.class, 'CSS class')}
                              className="text-gray-400 hover:text-[#00FF85]"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-400">{type.usage}</p>
                          <code className="text-xs text-[#00FFC6] font-mono block bg-gray-800/50 p-2 rounded">
                            {type.class}
                          </code>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Components Section */}
            {activeSection === 'components' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Component Library</h2>
                  <p className="text-gray-400">Reusable UI components with BuboIQ styling</p>
                </div>

                <div className="space-y-8">
                  {['buttons', 'cards', 'inputs', 'badges', 'icons'].map((category) => {
                    const categoryComponents = componentDemos.filter(comp => comp.category === category);
                    if (categoryComponents.length === 0) return null;

                    return (
                      <div key={category} className="space-y-4">
                        <h3 className="text-xl font-semibold text-white capitalize">
                          {category}
                        </h3>
                        <div className="grid gap-6">
                          {categoryComponents.map((component) => (
                            <Card 
                              key={component.name}
                              className="bg-[#0E1726]/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl"
                            >
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-white">{component.name}</h4>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(component.code, 'Component code')}
                                    className="text-gray-400 hover:text-[#00FF85]"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <div className="flex items-center justify-center p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/30">
                                    {component.element}
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Code</label>
                                    <pre className="text-xs text-[#00FFC6] font-mono bg-gray-900/50 p-4 rounded-xl border border-gray-700/30 overflow-x-auto">
                                      <code>{component.code}</code>
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brand Guidelines Section */}
            {activeSection === 'guidelines' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Brand Guidelines</h2>
                  <p className="text-gray-400">Essential principles for maintaining brand consistency</p>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      title: 'Visual Identity',
                      content: [
                        'Use the owl-eye logo as the primary brand symbol',
                        'Apply glassmorphism effects for depth and premium feel',
                        'Maintain high contrast with dark backgrounds',
                        'Use neon green (#00FF85) sparingly for maximum impact'
                      ]
                    },
                    {
                      title: 'Typography',
                      content: [
                        'Space Grotesk for headings and brand elements',
                        'Inter for body text and UI components',
                        'JetBrains Mono for technical and code elements',
                        'Maintain readable contrast ratios (4.5:1 minimum)'
                      ]
                    },
                    {
                      title: 'Animation Principles',
                      content: [
                        'Use spring physics for natural movement',
                        'Apply glow effects to interactive elements',
                        'Implement subtle hover transformations (scale 1.05)',
                        'Respect reduced motion preferences'
                      ]
                    },
                    {
                      title: 'Component Usage',
                      content: [
                        'Primary buttons for main CTAs only',
                        'Glass cards for content containers',
                        'Neural network patterns for backgrounds',
                        'Confidence ribbons for AI metrics'
                      ]
                    }
                  ].map((guideline) => (
                    <Card 
                      key={guideline.title}
                      className="bg-[#0E1726]/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">{guideline.title}</h3>
                      <ul className="space-y-3">
                        {guideline.content.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00FF85] mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
                </div>

                {/* Interactive Demo */}
                <Card className="bg-gradient-to-br from-[#00FF85]/5 to-[#00FFC6]/5 border border-[#00FF85]/20 rounded-2xl p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-semibold text-white mb-4">Interactive Brand Elements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 mx-auto relative cursor-pointer" onClick={() => setOwlGlow(!owlGlow)}>
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00FFC6] opacity-20 ${owlGlow ? 'animate-ping' : ''}`} />
                        <div className="absolute inset-2 rounded-full bg-[#0E1726] border border-[#00FF85]/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Eye className={`w-10 h-10 text-[#00FF85] ${owlGlow ? 'drop-shadow-[0_0_15px_rgba(0,255,133,0.8)]' : ''}`} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Click the owl eye</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00FF85] to-[#00FFC6] rounded-full transition-all duration-1000"
                          style={{ width: '75%' }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">Animated progress bars</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-pulse" />
                        <div className="w-3 h-3 bg-[#00FFC6] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-3 h-3 bg-[#FFD400] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <p className="text-sm text-gray-400">Status indicators</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuboBrandKit;