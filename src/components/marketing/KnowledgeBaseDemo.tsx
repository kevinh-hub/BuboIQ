import React, { useState } from 'react';
import { Brain, ArrowLeft, Database, Zap, Shield, BarChart3, Eye, Play, CheckCircle, Users, Clock, Target, FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface KnowledgeBaseDemoProps {
  onBack: () => void;
}

export const KnowledgeBaseDemo: React.FC<KnowledgeBaseDemoProps> = ({ onBack }) => {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [animationPhase, setAnimationPhase] = useState(0);

  const demoSections = [
    {
      id: 'overview',
      title: 'Knowledge Base Home',
      icon: <Brain className="w-5 h-5" />,
      description: 'Search and browse self-building solutions'
    },
    {
      id: 'fix-cards',
      title: 'Fix Cards',
      icon: <Zap className="w-5 h-5" />,
      description: 'Compact solution cards with confidence indicators'
    },
    {
      id: 'article-detail',
      title: 'Article Detail',
      icon: <FileText className="w-5 h-5" />,
      description: 'Structured fix steps with automation'
    },
    {
      id: 'reviewer-console',
      title: 'Reviewer Console',
      icon: <Shield className="w-5 h-5" />,
      description: 'Review and approve draft articles'
    },
    {
      id: 'metrics',
      title: 'Analytics Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Impact metrics and performance tracking'
    },
    {
      id: 'schema',
      title: 'Backend Architecture',
      icon: <Database className="w-5 h-5" />,
      description: 'Supabase schema and data pipeline'
    }
  ];

  const renderOverviewDemo = () => (
    <div className="space-y-6">
      <div className="bubo-glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h2 className="font-space-grotesk text-2xl text-pure-white mb-1">
                <span className="text-pure-white">BUBO</span>
                <span className="text-iq-neon-green">IQ</span> Knowledge Base
              </h2>
              <p className="text-mist-gray">Auto-building fixes from solved issues</p>
            </div>
          </div>
          
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
            47 solutions
          </Badge>
        </div>

        {/* Search Demo */}
        <div className="relative mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mist-gray">
              <div className="w-5 h-5 border-2 border-mist-gray rounded-full"></div>
              <div className="absolute top-3 left-3 w-2 h-2 border-b-2 border-r-2 border-mist-gray rotate-45"></div>
            </div>
            <div className="pl-12 pr-4 py-4 bg-surface-dark/80 border border-iq-neon-green/50 text-pure-white rounded-xl backdrop-blur-sm bubo-glow-green">
              <span className="text-mist-gray">Windows Update Service Not Starting...</span>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  3 found
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Article Cards Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bubo-glass p-4 hover:bubo-glow-green transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-pure-white mb-1">Windows Update Service Not Starting</h3>
                <p className="text-sm text-mist-gray">Windows Update Engine Failed to Initialize</p>
              </div>
              <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30 text-xs">
                Starter
              </Badge>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                High confidence
              </Badge>
              <Badge className="bg-surface-dark/50 text-cloud-white border-slate-gray/30 text-xs">
                <Users className="w-3 h-3 mr-1" />
                47 issues
              </Badge>
            </div>

            <div className="bg-surface-dark/50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-iq-neon-green" />
                  </div>
                  <div className="text-sm">
                    <p className="text-pure-white font-medium">Quick Fix Available</p>
                    <p className="text-mist-gray text-xs">Est. 8min</p>
                  </div>
                </div>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  high confidence
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bubo-btn-secondary flex-1 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View Steps
                </Button>
                <Button size="sm" className="bubo-btn-ghost text-xs px-2">
                  <Shield className="w-3 h-3" />
                </Button>
                <Button size="sm" className="bubo-btn-neon-primary text-xs px-2">
                  <Zap className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-mist-gray">
              <span>Last verified: Sep 20, 2024</span>
              <span>94% success rate</span>
            </div>
          </Card>

          <Card className="bubo-glass p-4 opacity-60">
            <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center">
                <div className="w-8 h-8 text-iq-neon-green mx-auto mb-2 animate-pulse">🔒</div>
                <p className="text-iq-neon-green font-medium">Pro Tier Required</p>
              </div>
            </div>
            
            <div className="relative">
              <h3 className="font-semibold text-pure-white mb-1">Network Printer Connection Issues</h3>
              <p className="text-sm text-mist-gray">Print Spooler Service Hang Pattern</p>
              <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs mt-2">
                Pro
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderFixCardsDemo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-pure-white">Fix Cards - Compact Solution Display</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compact Version */}
        <Card className="bubo-glass p-6">
          <h4 className="font-medium text-pure-white mb-4">Compact Version (in Issues page)</h4>
          <div className="bg-surface-dark/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-iq-neon-green" />
                </div>
                <div className="text-sm">
                  <p className="text-pure-white font-medium">Quick Fix Available</p>
                  <p className="text-mist-gray">Est. 8min</p>
                </div>
              </div>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                high confidence
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="bubo-btn-secondary flex-1 text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View Steps
              </Button>
              <Button size="sm" className="bubo-btn-ghost text-xs px-3">
                <Shield className="w-3 h-3" />
              </Button>
              <Button size="sm" className="bubo-btn-neon-primary text-xs px-3">
                <Zap className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Full Version */}
        <Card className="bubo-glass p-6">
          <h4 className="font-medium text-pure-white mb-4">Full Version (standalone)</h4>
          <div className="bg-surface-dark/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-iq-neon-green/10 to-electric-blue/10 blur-xl" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-pure-white mb-2">Windows Update Service Fix</h3>
                  <div className="flex items-center gap-4 text-sm text-mist-gray">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Median fix time: 8min</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-12 h-12 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                </div>
              </div>

              <div className="mb-4">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  High Confidence
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button className="bubo-btn-secondary flex items-center gap-2 flex-1">
                  <Eye className="w-4 h-4" />
                  View Fix Steps
                </Button>
                <Button className="bubo-btn-ghost flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Run Prechecks
                </Button>
                <Button className="bubo-btn-neon-primary flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Run Fix
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Confidence Orb Animation */}
      <Card className="bubo-glass p-6">
        <h4 className="font-medium text-pure-white mb-4">Interactive Confidence Orb</h4>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center mb-2 bubo-animate-pulse-glow">
              <CheckCircle className="w-8 h-8 text-iq-neon-green" />
            </div>
            <p className="text-sm text-iq-neon-green">High (94%)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-signal-yellow bg-signal-yellow/20 flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-signal-yellow" />
            </div>
            <p className="text-sm text-signal-yellow">Medium (73%)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-2 border-crimson-danger bg-crimson-danger/20 flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-crimson-danger" />
            </div>
            <p className="text-sm text-crimson-danger">Low (45%)</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderArticleDetailDemo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-pure-white">Article Detail - Structured Fix Steps</h3>
      
      <Card className="bubo-glass p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="font-space-grotesk text-2xl text-pure-white mb-3">
              Windows Update Service Not Starting
            </h2>
            <p className="text-mist-gray mb-4">Resolves issues where Windows Update service fails to start, preventing system updates from installing properly.</p>
            <p className="text-sm text-mist-gray">
              <strong>Problem Pattern:</strong> Windows Update Engine Failed to Initialize
            </p>
          </div>
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
            high confidence
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-iq-neon-green mb-1">47</div>
            <div className="text-sm text-mist-gray">Issues Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-electric-blue mb-1">94%</div>
            <div className="text-sm text-mist-gray">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-signal-yellow mb-1">8min</div>
            <div className="text-sm text-mist-gray">Avg. Fix Time</div>
          </div>
        </div>

        {/* Fix Steps Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-pure-white flex items-center gap-3">
            <Zap className="w-5 h-5 text-iq-neon-green" />
            Fix Steps
          </h3>
          
          <Card className="bg-surface-dark/50 p-4 border border-slate-gray/30">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-iq-neon-green/20 flex items-center justify-center flex-shrink-0">
                <span className="text-iq-neon-green font-bold text-sm">1</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-pure-white mb-2">Restart Windows Update Service</h4>
                    <p className="text-mist-gray text-sm">Stop and restart the Windows Update service and its dependencies in the correct order.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs">
                      medium risk
                    </Badge>
                    <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      3 minutes
                    </Badge>
                  </div>
                </div>

                <div className="bg-dark-midnight/50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-mist-gray mb-2 font-mono">Commands:</p>
                  <div className="font-mono text-sm text-iq-neon-green space-y-1">
                    <div>net stop wuauserv</div>
                    <div>net stop cryptSvc</div>
                    <div>net start cryptSvc</div>
                    <div>net start wuauserv</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button className="bubo-btn-secondary">
                    <Play className="w-4 h-4 mr-2" />
                    Execute Step
                  </Button>
                  <Button className="bubo-btn-neon-primary">
                    <Zap className="w-4 h-4 mr-2" />
                    Auto-Execute
                  </Button>
                  <div className="text-sm text-mist-gray">
                    Success Rate: 87%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );

  const renderReviewerConsoleDemo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-pure-white">Reviewer Console - Quality Assurance</h3>
      
      <Card className="bubo-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h2 className="font-space-grotesk text-xl text-pure-white mb-1">Reviewer Console</h2>
              <p className="text-mist-gray">Review and manage draft knowledge articles</p>
            </div>
          </div>
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
            4 articles
          </Badge>
        </div>

        {/* Filters Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6 p-4 bg-surface-dark/50 rounded-lg">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray">🔍</div>
            <div className="pl-10 pr-3 py-2 bg-surface-dark/50 border border-slate-gray/30 rounded text-mist-gray text-sm">
              Search articles...
            </div>
          </div>
          <div className="px-3 py-2 bg-surface-dark/50 border border-slate-gray/30 rounded text-pure-white text-sm">
            All Statuses
          </div>
          <div className="px-3 py-2 bg-surface-dark/50 border border-slate-gray/30 rounded text-pure-white text-sm">
            All Priorities
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-mist-gray">Min Confidence:</span>
            <div className="flex-1 bg-slate-gray/30 rounded-full h-2 relative">
              <div className="absolute left-[70%] top-0 w-2 h-2 bg-iq-neon-green rounded-full"></div>
            </div>
            <span className="text-sm text-iq-neon-green font-mono">70%</span>
          </div>
        </div>

        {/* Draft Articles Table */}
        <div className="space-y-3">
          <div className="grid grid-cols-8 gap-4 px-4 py-2 text-sm font-medium text-mist-gray border-b border-slate-gray/20">
            <div>📋</div>
            <div className="col-span-2">Article</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Confidence</div>
            <div>Evidence</div>
            <div>Actions</div>
          </div>

          <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-surface-dark/30 rounded-lg hover:bg-surface-dark/50 transition-colors">
            <div>☑️</div>
            <div className="col-span-2">
              <h4 className="font-medium text-pure-white">Outlook Email Sync Issues Resolution</h4>
              <p className="text-sm text-mist-gray">Exchange Sync Failure Pattern</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  23 issues
                </Badge>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  Auto-ready
                </Badge>
              </div>
            </div>
            <div>
              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                <Eye className="w-3 h-3 mr-1" />
                In Review
              </Badge>
            </div>
            <div>
              <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
                High
              </Badge>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-lg font-bold text-signal-yellow">87%</div>
                <div className="w-16 h-2 bg-surface-dark rounded-full overflow-hidden">
                  <div className="h-full bg-signal-yellow transition-all duration-300" style={{ width: '87%' }}></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-pure-white">23</div>
              <div className="text-xs text-mist-gray">sources</div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" className="bubo-btn-ghost text-xs px-2">
                <Eye className="w-3 h-3" />
              </Button>
              <Button size="sm" className="bubo-btn-secondary text-xs px-2">
                ✏️
              </Button>
              <Button size="sm" className="bubo-btn-neon-primary text-xs px-2">
                <CheckCircle className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderMetricsDemo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-pure-white">Analytics Dashboard - Impact Metrics</h3>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Deflection Rate', value: '60.5%', change: '+5.4%', icon: <Target className="w-6 h-6" />, desc: 'Issues resolved via Knowledge Base' },
          { title: 'Avg. Time Saved', value: '33min', change: '+8min', icon: <Clock className="w-6 h-6" />, desc: 'Per issue vs manual resolution' },
          { title: 'Article Accuracy', value: '94.2%', change: '+2.1%', icon: <CheckCircle className="w-6 h-6" />, desc: 'Success rate of published solutions' },
          { title: 'Knowledge Growth', value: '28', change: '+6', icon: <Brain className="w-6 h-6" />, desc: 'New articles this month' }
        ].map((kpi, index) => (
          <Card key={index} className="bubo-glass p-4 hover:bubo-glow-green transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-iq-neon-green/20 flex items-center justify-center text-iq-neon-green">
                {kpi.icon}
              </div>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                📈 {kpi.change}
              </Badge>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-pure-white mb-1">{kpi.value}</div>
              <div className="text-sm text-pure-white font-medium">{kpi.title}</div>
            </div>
            <div className="text-xs text-mist-gray">{kpi.desc}</div>
          </Card>
        ))}
      </div>

      {/* Charts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bubo-glass p-6">
          <h4 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-iq-neon-green" />
            Issue Deflection Rate
          </h4>
          <div className="h-32 bg-surface-dark/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-iq-neon-green/10 to-transparent animate-pulse"></div>
            <div className="relative flex items-end gap-2 h-16">
              {[45, 52, 48, 58, 55, 60].map((height, i) => (
                <div 
                  key={i} 
                  className="w-6 bg-gradient-to-t from-iq-neon-green/60 to-iq-neon-green rounded-t-sm" 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-iq-neon-green font-bold">60.5%</div>
          </div>
        </Card>

        <Card className="bubo-glass p-6">
          <h4 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-electric-blue" />
            Top Issue Categories
          </h4>
          <div className="space-y-3">
            {[
              { name: 'Windows Updates', percent: 30, color: 'bg-iq-neon-green' },
              { name: 'Printer Issues', percent: 25, color: 'bg-electric-blue' },
              { name: 'Network Problems', percent: 20, color: 'bg-signal-yellow' },
              { name: 'Software Crashes', percent: 15, color: 'bg-prediction-purple' },
              { name: 'Other', percent: 10, color: 'bg-mist-gray' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-pure-white">{item.name}</span>
                </div>
                <span className="text-sm text-mist-gray">{item.percent}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSchemaDemo = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-pure-white">Backend Architecture - Supabase Schema</h3>
      
      {/* Schema Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {
            name: 'kb_problem_signature',
            desc: 'AI-identified patterns from resolved issues',
            tier: 'all',
            fields: ['id', 'org_id', 'signature_hash', 'pattern_vector', 'confidence_score']
          },
          {
            name: 'kb_article',
            desc: 'Self-building knowledge articles with fix steps',
            tier: 'all',
            fields: ['id', 'signature_id', 'fix_steps', 'success_rate', 'tier_requirement']
          },
          {
            name: 'kb_evidence',
            desc: 'Source tickets and data supporting articles',
            tier: 'pro',
            fields: ['id', 'article_id', 'ticket_id', 'evidence_data', 'confidence_weight']
          },
          {
            name: 'kb_feedback',
            desc: 'User feedback on article effectiveness',
            tier: 'all',
            fields: ['id', 'article_id', 'feedback_type', 'rating', 'time_to_complete']
          }
        ].map((table, i) => (
          <Card key={i} className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-iq-neon-green/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-iq-neon-green" />
                </div>
                <div>
                  <h4 className="font-semibold text-pure-white">{table.name}</h4>
                  <p className="text-sm text-mist-gray">{table.desc}</p>
                </div>
              </div>
              <Badge className={
                table.tier === 'all' ? 'bg-slate-gray/20 text-cloud-white border-slate-gray/30' :
                table.tier === 'pro' ? 'bg-electric-blue/20 text-electric-blue border-electric-blue/30' :
                'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30'
              }>
                {table.tier === 'all' ? '👥 All Tiers' : table.tier === 'pro' ? '🛡️ Pro' : '⚡ Team'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {table.fields.map((field, j) => (
                <div key={j} className="flex items-center gap-3 p-2 bg-surface-dark/50 rounded-lg">
                  <div className="w-3 h-3 text-iq-neon-green">🔑</div>
                  <span className="font-mono text-sm text-iq-neon-green">{field}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Data Pipeline */}
      <Card className="bubo-glass p-6">
        <h4 className="text-lg font-semibold text-pure-white mb-6">Self-Building Data Pipeline</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            { step: 1, title: 'Issues Closed', icon: '📋', color: 'iq-neon-green' },
            { step: 2, title: 'Evidence Ingest', icon: '🔍', color: 'electric-blue' },
            { step: 3, title: 'Pattern Cluster', icon: '🧩', color: 'signal-yellow' },
            { step: 4, title: 'Draft Article', icon: '📝', color: 'prediction-purple' },
            { step: 5, title: 'Review Process', icon: '🛡️', color: 'cyan-accent' },
            { step: 6, title: 'Published KB', icon: '🚀', color: 'iq-neon-green' }
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-surface-dark/50 flex items-center justify-center mx-auto mb-2 border-2 border-iq-neon-green/30">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <p className="text-sm text-pure-white font-medium">{item.title}</p>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-iq-neon-green flex items-center justify-center text-dark-midnight font-bold text-xs">
                {item.step}
              </div>
              {i < 5 && (
                <div className="absolute top-8 -right-4 text-electric-blue text-xl">→</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDemo = () => {
    switch (activeDemo) {
      case 'overview': return renderOverviewDemo();
      case 'fix-cards': return renderFixCardsDemo();
      case 'article-detail': return renderArticleDetailDemo();
      case 'reviewer-console': return renderReviewerConsoleDemo();
      case 'metrics': return renderMetricsDemo();
      case 'schema': return renderSchemaDemo();
      default: return renderOverviewDemo();
    }
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg">
      {/* Background effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-15 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={onBack} className="bubo-btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="font-space-grotesk text-4xl text-pure-white mb-4">
              <span className="text-pure-white">BUBO</span>
              <span className="text-iq-neon-green">IQ</span> Knowledge Base
            </h1>
            <p className="text-xl text-mist-gray max-w-3xl mx-auto">
              Self-building solutions that learn from every resolved issue, creating an AI-powered knowledge base that grows smarter over time.
            </p>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                onClick={() => setActiveDemo(section.id)}
                className={`${
                  activeDemo === section.id ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'
                } flex items-center gap-2`}
              >
                {section.icon}
                {section.title}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-mist-gray">
              {demoSections.find(s => s.id === activeDemo)?.description}
            </p>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-7xl mx-auto">
          {renderDemo()}
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-space-grotesk text-pure-white text-center mb-8">
            Production-Ready Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: 'AI-Powered Learning',
                desc: 'Automatically analyzes fixed issues to build complete solution libraries'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Multi-Tier Security',
                desc: 'Row-level security with organization isolation and tier-based access control'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Automated Execution',
                desc: 'One-click fix execution with pre-checks, rollback plans, and safety validations'
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: 'Issue Deflection',
                desc: 'Proactively resolve problems before they become tickets, reducing workload'
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'Impact Analytics',
                desc: 'Track deflection rates, time savings, and knowledge base effectiveness'
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: 'Scalable Architecture',
                desc: 'Built on Supabase with vector embeddings, real-time sync, and edge functions'
              }
            ].map((feature, i) => (
              <Card key={i} className="bubo-glass p-6 text-center hover:bubo-glow-green transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center mx-auto mb-4 text-iq-neon-green">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-pure-white mb-2">{feature.title}</h3>
                <p className="text-sm text-mist-gray">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};