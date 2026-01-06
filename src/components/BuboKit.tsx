import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  Brain,
  Zap,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Users,
  Settings,
  Sparkles,
  Network,
  Database,
  Server,
  Globe,
  Terminal,
  Camera,
  FileText,
  Code,
  TrendingUp,
  Download
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const BuboKit: React.FC = () => {
  const [switchStates, setSwitchStates] = useState({
    noiseCompression: false,
    liveMode: true,
    aiEnabled: true,
    autoAnalysis: true
  });

  const [confidence, setConfidence] = useState(87);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const buttonVariants = [
    { type: 'primary', className: 'bubo-btn-primary', label: 'Primary Action' },
    { type: 'secondary', className: 'bubo-btn-secondary', label: 'Secondary Action' },
    { type: 'ghost', className: 'bubo-btn-ghost', label: 'Ghost Action' }
  ];

  const severityTypes = [
    { type: 'critical', color: 'text-crimson-danger border-crimson-danger/50 bg-crimson-danger/10', label: 'Critical Alert' },
    { type: 'high', color: 'text-amber-warning border-amber-warning/50 bg-amber-warning/10', label: 'High Priority' },
    { type: 'medium', color: 'text-signal-blue border-signal-blue/50 bg-signal-blue/10', label: 'Medium Impact' },
    { type: 'low', color: 'text-iq-green border-iq-green/50 bg-iq-green/10', label: 'Low Risk' },
    { type: 'info', color: 'text-mist-gray border-mist-gray/50 bg-mist-gray/10', label: 'Information' }
  ];

  const correlationTypes = [
    { type: 'causal', color: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30', label: 'Causal Link' },
    { type: 'temporal', color: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30', label: 'Time Pattern' },
    { type: 'pattern', color: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30', label: 'AI Pattern' },
    { type: 'anomaly', color: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30', label: 'Anomaly' }
  ];

  const evidenceTypes = [
    { type: 'logs', icon: FileText, color: 'text-signal-blue', bg: 'bg-signal-blue/20' },
    { type: 'metrics', icon: Activity, color: 'text-iq-green', bg: 'bg-iq-green/20' },
    { type: 'screenshot', icon: Camera, color: 'text-amber-warning', bg: 'bg-amber-warning/20' },
    { type: 'code', icon: Code, color: 'text-prediction-purple', bg: 'bg-prediction-purple/20' },
    { type: 'config', icon: Terminal, color: 'text-mist-gray', bg: 'bg-mist-gray/20' },
    { type: 'network', icon: Network, color: 'text-glow-cyan', bg: 'bg-glow-cyan/20' }
  ];

  const messageTypes = [
    { type: 'error', className: 'bubo-error-message', content: 'Connection to database failed. Retrying...' },
    { type: 'success', className: 'bubo-success-message', content: 'AI analysis completed successfully!' },
    { type: 'warning', className: 'bubo-warning-message', content: 'Disk space approaching 80% capacity.' },
    { type: 'debug', className: 'bubo-debug-panel', content: '{"timestamp": "2024-01-15T14:23:15Z", "level": "debug", "message": "Processing signal correlation batch"}' }
  ];

  return (
    <div className="min-h-screen bg-nocturne-indigo bubo-neural-bg p-8 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-iq-green to-glow-cyan rounded-2xl flex items-center justify-center bubo-glow-green shadow-2xl">
          <Eye className="w-8 h-8 text-nocturne-indigo" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-iq-green via-glow-cyan to-prediction-purple bg-clip-text text-transparent">
          BuboIQ Design System
        </h1>
        <p className="text-mist-gray text-lg max-w-2xl mx-auto">
          Cinematic AI-first UI components for the intelligence platform
        </p>
      </motion.div>

      <Tabs defaultValue="components" className="space-y-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="animations">Animations</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-8">
          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Action Buttons</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {buttonVariants.map((variant) => (
                <motion.div
                  key={variant.type}
                  whileHover={{ scale: 1.02 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-medium text-iq-green">{variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}</h3>
                  <Button className={variant.className}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {variant.label}
                  </Button>
                  <code className="block text-xs bg-slate-gray/30 p-3 rounded-lg text-mist-gray">
                    className="{variant.className}"
                  </code>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Switches and Controls */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Interactive Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(switchStates).map(([key, value]) => (
                <Card key={key} className="p-4 bg-card/50 border-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setSwitchStates(prev => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Progress Indicators */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Progress & Confidence</h2>
            <div className="space-y-6">
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>AI Confidence Level</span>
                    <span className="text-iq-green font-semibold">{confidence}%</span>
                  </div>
                  <Progress value={confidence} className="h-3" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setConfidence(Math.max(0, confidence - 10))}>
                      Decrease
                    </Button>
                    <Button size="sm" onClick={() => setConfidence(Math.min(100, confidence + 10))}>
                      Increase
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 border-border/50">
                <h3 className="font-semibold mb-4">Confidence Ribbon</h3>
                <div className="bubo-confidence-ribbon mb-4" />
                <code className="text-xs bg-slate-gray/30 p-3 rounded-lg block text-mist-gray">
                  className="bubo-confidence-ribbon"
                </code>
              </Card>
            </div>
          </section>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Card Variations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Signal Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bubo-signal-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-warning/20 border border-amber-warning/50">
                    <AlertTriangle className="w-5 h-5 text-amber-warning" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Signal Card</h3>
                    <p className="text-sm text-mist-gray">
                      Perfect for displaying real-time alerts and signals with severity indicators.
                    </p>
                    <code className="text-xs">bubo-signal-card</code>
                  </div>
                </div>
              </motion.div>

              {/* Prediction Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bubo-prediction-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-prediction-purple/20">
                    <Brain className="w-5 h-5 text-prediction-purple" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Prediction Card</h3>
                    <p className="text-sm text-mist-gray">
                      AI-generated insights and predictions with purple gradient styling.
                    </p>
                    <code className="text-xs">bubo-prediction-card</code>
                  </div>
                </div>
              </motion.div>

              {/* Focus Queue Item */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bubo-focus-queue-item p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-warning/20">
                    <Clock className="w-5 h-5 text-amber-warning" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Focus Queue Item</h3>
                    <p className="text-sm text-mist-gray">
                      Priority items that require immediate attention with amber left border.
                    </p>
                    <code className="text-xs">bubo-focus-queue-item</code>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </TabsContent>

        {/* Indicators Tab */}
        <TabsContent value="indicators" className="space-y-8">
          {/* Severity Badges */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Severity Indicators</h2>
            <div className="flex flex-wrap gap-3">
              {severityTypes.map((severity) => (
                <Badge
                  key={severity.type}
                  variant="outline"
                  className={`px-4 py-2 ${severity.color} border`}
                >
                  {severity.label}
                </Badge>
              ))}
            </div>
          </section>

          {/* Correlation Chips */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Correlation Chips</h2>
            <div className="flex flex-wrap gap-3">
              {correlationTypes.map((correlation) => (
                <motion.div
                  key={correlation.type}
                  whileHover={{ scale: 1.05 }}
                  className={`bubo-correlation-chip ${correlation.color}`}
                >
                  {correlation.label} • 87%
                </motion.div>
              ))}
            </div>
          </section>

          {/* Evidence Type Icons */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Evidence Types</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {evidenceTypes.map((evidence) => {
                const Icon = evidence.icon;
                return (
                  <motion.div
                    key={evidence.type}
                    whileHover={{ scale: 1.1 }}
                    className={`p-4 rounded-xl ${evidence.bg} border border-current/30 text-center cursor-pointer`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${evidence.color}`} />
                    <p className={`text-xs capitalize ${evidence.color}`}>
                      {evidence.type}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Status Messages</h2>
            <div className="space-y-4">
              {messageTypes.map((message) => (
                <div
                  key={message.type}
                  className={message.className}
                >
                  <pre className={message.type === 'debug' ? 'text-xs font-mono' : 'text-sm'}>
                    {message.content}
                  </pre>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Animations Tab */}
        <TabsContent value="animations" className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Animation Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pulse Glow */}
              <Card className="p-6 bg-card/50 border-border/50 bubo-animate-pulse-glow">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-iq-green mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Pulse Glow</h3>
                  <p className="text-sm text-mist-gray">bubo-animate-pulse-glow</p>
                </div>
              </Card>

              {/* Float Animation */}
              <Card className="p-6 bg-card/50 border-border/50 bubo-animate-float">
                <div className="text-center">
                  <Eye className="w-8 h-8 text-signal-blue mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Float Effect</h3>
                  <p className="text-sm text-mist-gray">bubo-animate-float</p>
                </div>
              </Card>

              {/* AI Thinking */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="text-center">
                  <motion.div
                    animate={isAnalyzing ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 2, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
                  >
                    <Brain className="w-8 h-8 text-prediction-purple mx-auto mb-3" />
                  </motion.div>
                  <h3 className="font-semibold mb-2">AI Thinking</h3>
                  <Button
                    size="sm"
                    onClick={() => setIsAnalyzing(!isAnalyzing)}
                    className="text-xs"
                  >
                    {isAnalyzing ? 'Stop' : 'Start'} Analysis
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-6">BuboIQ Color Palette</h2>
            
            {/* Primary Colors */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Primary Palette</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Nocturne Indigo', class: 'bg-nocturne-indigo', hex: '#0B1021' },
                    { name: 'IQ Green', class: 'bg-iq-green', hex: '#2ECC71' },
                    { name: 'Signal Blue', class: 'bg-signal-blue', hex: '#3B82F6' },
                    { name: 'Cloud White', class: 'bg-cloud-white', hex: '#F3F4F6' }
                  ].map((color) => (
                    <Card key={color.name} className="p-4 bg-card/50 border-border/50">
                      <div className={`w-full h-16 rounded-lg ${color.class} mb-3`} />
                      <h4 className="font-medium text-sm">{color.name}</h4>
                      <p className="text-xs text-mist-gray font-mono">{color.hex}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Status Colors</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Crimson Danger', class: 'bg-crimson-danger', hex: '#EF4444' },
                    { name: 'Amber Warning', class: 'bg-amber-warning', hex: '#F59E0B' },
                    { name: 'Glow Cyan', class: 'bg-glow-cyan', hex: '#06D6A0' },
                    { name: 'Prediction Purple', class: 'bg-prediction-purple', hex: '#8B5CF6' }
                  ].map((color) => (
                    <Card key={color.name} className="p-4 bg-card/50 border-border/50">
                      <div className={`w-full h-16 rounded-lg ${color.class} mb-3`} />
                      <h4 className="font-medium text-sm">{color.name}</h4>
                      <p className="text-xs text-mist-gray font-mono">{color.hex}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Neutrals</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Slate Gray', class: 'bg-slate-gray', hex: '#374151' },
                    { name: 'Mist Gray', class: 'bg-mist-gray', hex: '#9CA3AF' },
                    { name: 'Neural Black', class: 'bg-neural-black', hex: '#000000' }
                  ].map((color) => (
                    <Card key={color.name} className="p-4 bg-card/50 border-border/50">
                      <div className={`w-full h-16 rounded-lg ${color.class} mb-3 ${color.name === 'Neural Black' ? 'border border-mist-gray/30' : ''}`} />
                      <h4 className="font-medium text-sm">{color.name}</h4>
                      <p className="text-xs text-mist-gray font-mono">{color.hex}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-12 border-t border-mist-gray/20"
      >
        <p className="text-sm text-mist-gray">
          BuboIQ Design System • Built for AI-first intelligence platforms
        </p>
      </motion.div>
    </div>
  );
};

export default BuboKit;