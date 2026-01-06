import React, { useState, useEffect } from 'react';
import { ArrowLeft, Brain, Database, Zap, Shield, BarChart3, Eye, Play, CheckCircle, Users, Clock, Target, FileText, Search, Filter, Settings, Code, Globe, Layers, GitBranch, Server, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface ComprehensiveKnowledgeBaseDemoProps {
  onBack: () => void;
}

export const ComprehensiveKnowledgeBaseDemo: React.FC<ComprehensiveKnowledgeBaseDemoProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-cycle through demo phases
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const demoSections = [
    {
      id: 'overview',
      title: 'Knowledge Base Home',
      icon: <Brain className="w-5 h-5" />,
      description: 'Cinematic search with hybrid BM25 + pgvector embeddings'
    },
    {
      id: 'article-detail',
      title: 'Article Detail Flow',
      icon: <FileText className="w-5 h-5" />,
      description: 'Structured Prechecks → Fix → Verify with automation'
    },
    {
      id: 'reviewer-console',
      title: 'Reviewer Console',
      icon: <Shield className="w-5 h-5" />,
      description: 'Draft management with diff view and bulk actions'
    },
    {
      id: 'metrics',
      title: 'Analytics Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Holographic KPI cards with neon-glow charts'
    },
    {
      id: 'schema',
      title: 'Supabase Schema & RLS',
      icon: <Database className="w-5 h-5" />,
      description: 'ERD visualization with security overlays'
    },
    {
      id: 'api-docs',
      title: 'API & Edge Functions',
      icon: <Code className="w-5 h-5" />,
      description: 'Developer documentation panels'
    },
    {
      id: 'pipeline',
      title: 'Data Pipeline Flow',
      icon: <GitBranch className="w-5 h-5" />,
      description: 'Animated self-building process visualization'
    },
    {
      id: 'marketing',
      title: 'Marketing Visuals',
      icon: <Globe className="w-5 h-5" />,
      description: 'Export-ready hero shots and demo assets'
    }
  ];

  const renderKnowledgeBaseHome = () => (
    <div className="space-y-8">
      {/* Hero Header */}
      <Card className="bubo-glass-bright rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-iq-neon-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center bubo-animate-pulse-glow">
                <Brain className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div>
                <h1 className="font-space-grotesk text-3xl text-pure-white mb-2 bubo-neon-text-green">
                  <span className="text-pure-white">BUBO</span>
                  <span className="text-iq-neon-green">IQ</span> Knowledge Base
                </h1>
                <p className="text-mist-gray text-lg">Self-building solutions from resolved issues</p>
              </div>
            </div>
            
            <div className="text-right">
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-lg px-4 py-2 mb-2">
                🚀 94% Deflection Rate
              </Badge>
              <p className="text-sm text-mist-gray">47 active solutions</p>
            </div>
          </div>

          {/* Cinematic Search Bar */}
          <div className="relative mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-iq-neon-green/20 via-electric-blue/20 to-iq-neon-green/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-500" />
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-iq-neon-green" />
                <div className="pl-16 pr-6 py-6 bg-surface-dark/90 border-2 border-iq-neon-green/50 text-pure-white rounded-2xl backdrop-blur-sm text-lg">
                  <span className="text-mist-gray">Windows Update Service Not Starting...</span>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                      BM25 + Vector
                    </Badge>
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      3 solutions
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Search Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Windows Updates', 'Printer Issues', 'Network Connectivity', 'VPN Problems'].map((suggestion, i) => (
                <Badge 
                  key={i} 
                  className="bg-surface-dark/60 text-cloud-white border-slate-gray/30 hover:border-iq-neon-green/50 cursor-pointer transition-all duration-300"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-mist-gray" />
              <span className="text-mist-gray font-medium">Smart Filters:</span>
            </div>
            
            <div className="flex gap-3">
              <Button className="bubo-btn-ghost text-sm">
                <Shield className="w-4 h-4 mr-2" />
                OS: Windows 11
              </Button>
              <Button className="bubo-btn-ghost text-sm">
                <Users className="w-4 h-4 mr-2" />
                Confidence: High
              </Button>
              <Button className="bubo-btn-ghost text-sm">
                <Target className="w-4 h-4 mr-2" />
                Tier: All Access
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* High Confidence Article */}
        <Card className="bubo-glass hover:bubo-glow-green transition-all duration-500 p-8 relative overflow-hidden group">
          <div className="absolute top-4 right-4 w-24 h-24 bg-iq-neon-green/10 rounded-full blur-xl group-hover:blur-lg transition-all duration-500" />
          
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-space-grotesk text-pure-white mb-3 group-hover:text-iq-neon-green transition-colors">
                  Windows Update Service Not Starting
                </h3>
                <p className="text-mist-gray mb-4">Windows Update Engine Failed to Initialize Pattern</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    High Confidence (94%)
                  </Badge>
                  <Badge className="bg-surface-dark/60 text-cloud-white border-slate-gray/30">
                    <Users className="w-4 h-4 mr-1" />
                    47 issues resolved
                  </Badge>
                </div>
              </div>
              
              {/* Confidence Orb */}
              <div className="w-16 h-16 rounded-full border-3 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center bubo-animate-pulse-glow">
                <CheckCircle className="w-8 h-8 text-iq-neon-green" />
              </div>
            </div>

            {/* Embedded Fix Card */}
            <div className="bg-surface-dark/60 rounded-xl p-6 mb-6 border border-iq-neon-green/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-iq-neon-green" />
                  </div>
                  <div>
                    <p className="text-pure-white font-semibold">Quick Fix Available</p>
                    <p className="text-mist-gray text-sm">Estimated time: 8 minutes</p>
                  </div>
                </div>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                  Ready to Deploy
                </Badge>
              </div>
              
              <div className="flex gap-3">
                <Button className="bubo-btn-secondary flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Steps
                </Button>
                <Button className="bubo-btn-ghost">
                  <Shield className="w-4 h-4 mr-2" />
                  Prechecks
                </Button>
                <Button className="bubo-btn-neon-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Auto-Run
                </Button>
              </div>
            </div>

            {/* Article Metadata */}
            <div className="flex items-center justify-between text-sm text-mist-gray border-t border-slate-gray/20 pt-4">
              <div className="flex items-center gap-4">
                <span>✅ Last verified: Sep 20, 2024</span>
                <span>⚡ Median fix: 8min</span>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                  Windows 10/11
                </Badge>
                <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30 text-xs">
                  Starter Tier
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Tier-Locked Article */}
        <Card className="bubo-glass p-8 relative overflow-hidden opacity-70">
          <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 border-2 border-iq-neon-green flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Lock className="w-8 h-8 text-iq-neon-green" />
              </div>
              <h3 className="text-lg font-space-grotesk text-iq-neon-green mb-2">Pro Tier Required</h3>
              <p className="text-mist-gray text-sm mb-4">Expert network troubleshooting solutions</p>
              <Button className="bubo-btn-neon-primary">
                Upgrade to Pro
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <h3 className="text-xl font-space-grotesk text-pure-white mb-3">
              Expert Network Printer Diagnostics
            </h3>
            <p className="text-mist-gray mb-4">Print Spooler Service Hang Pattern Analysis</p>
            
            <div className="flex items-center gap-4 mb-6">
              <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                <Clock className="w-4 h-4 mr-2" />
                Medium Confidence (78%)
              </Badge>
              <Badge className="bg-surface-dark/60 text-cloud-white border-slate-gray/30">
                <Users className="w-4 h-4 mr-1" />
                23 issues resolved
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Tabs */}
      <Card className="bubo-glass p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-space-grotesk text-pure-white">Knowledge Base Status</h2>
          <Button className="bubo-btn-ghost">
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
            <div className="text-3xl font-space-grotesk text-iq-neon-green mb-2">28</div>
            <div className="text-pure-white font-medium mb-1">Published Solutions</div>
            <div className="text-sm text-mist-gray">Ready for deployment</div>
          </div>
          
          <div className="text-center p-6 bg-signal-yellow/10 border border-signal-yellow/30 rounded-xl">
            <div className="text-3xl font-space-grotesk text-signal-yellow mb-2">12</div>
            <div className="text-pure-white font-medium mb-1">In Review</div>
            <div className="text-sm text-mist-gray">Awaiting approval</div>
          </div>
          
          <div className="text-center p-6 bg-mist-gray/10 border border-mist-gray/30 rounded-xl">
            <div className="text-3xl font-space-grotesk text-mist-gray mb-2">7</div>
            <div className="text-pure-white font-medium mb-1">Deprecated</div>
            <div className="text-sm text-mist-gray">Outdated solutions</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSupabaseSchema = () => (
    <div className="space-y-8">
      <Card className="bubo-glass-bright rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-blue/20 to-iq-neon-green/20 flex items-center justify-center">
            <Database className="w-8 h-8 text-electric-blue" />
          </div>
          <div>
            <h1 className="font-space-grotesk text-3xl text-pure-white mb-2">
              Supabase Architecture
            </h1>
            <p className="text-mist-gray text-lg">Production schema with Row-Level Security</p>
          </div>
        </div>
      </Card>

      {/* Schema Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* kb_problem_signature Table */}
        <Card className="bubo-glass p-8 hover:bubo-glow-blue transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-electric-blue/20 flex items-center justify-center">
                <Database className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">kb_problem_signature</h3>
                <p className="text-mist-gray text-sm">AI-identified patterns from resolved issues</p>
              </div>
            </div>
            <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
              <Users className="w-3 h-3 mr-1" />
              All Tiers
            </Badge>
          </div>

          {/* Fields */}
          <div className="space-y-3 mb-6">
            {[
              { name: 'id', type: 'UUID', isPrimary: true, desc: 'Unique signature identifier' },
              { name: 'org_id', type: 'UUID', isForeign: true, desc: 'Organization scope' },
              { name: 'signature_hash', type: 'TEXT', desc: 'MD5 hash of problem pattern' },
              { name: 'features', type: 'JSONB', desc: 'Extracted problem features' },
              { name: 'incidents_count', type: 'INTEGER', desc: 'Number of matching issues' },
              { name: 'success_rate', type: 'NUMERIC(5,2)', desc: 'Fix success percentage' },
              { name: 'embedding', type: 'VECTOR(1536)', desc: 'OpenAI embeddings for search' }
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-dark/40 rounded-lg border border-slate-gray/20">
                <div className={`w-4 h-4 ${field.isPrimary ? 'text-iq-neon-green' : field.isForeign ? 'text-electric-blue' : 'text-mist-gray'}`}>
                  {field.isPrimary ? '🔑' : field.isForeign ? '🔗' : '📄'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-iq-neon-green">{field.name}</span>
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-mist-gray">{field.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RLS Policies */}
          <div className="border-t border-slate-gray/20 pt-6">
            <h4 className="font-semibold text-pure-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-electric-blue" />
              Row-Level Security
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                    SELECT
                  </Badge>
                  <span className="text-sm font-medium text-pure-white">org_isolation</span>
                </div>
                <code className="text-xs font-mono text-electric-blue">
                  {`org_id = auth.jwt() ->> 'org_id'::UUID`}
                </code>
              </div>
              <div className="p-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                    INSERT
                  </Badge>
                  <span className="text-sm font-medium text-pure-white">org_scoped_insert</span>
                </div>
                <code className="text-xs font-mono text-iq-neon-green">
                  {`org_id = auth.jwt() ->> 'org_id'::UUID`}
                </code>
              </div>
            </div>
          </div>
        </Card>

        {/* kb_article Table */}
        <Card className="bubo-glass p-8 hover:bubo-glow-green transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-iq-neon-green" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">kb_article</h3>
                <p className="text-mist-gray text-sm">Self-building knowledge articles</p>
              </div>
            </div>
            <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
              <Users className="w-3 h-3 mr-1" />
              All Tiers
            </Badge>
          </div>

          {/* Fields */}
          <div className="space-y-3 mb-6">
            {[
              { name: 'id', type: 'UUID', isPrimary: true, desc: 'Unique article identifier' },
              { name: 'signature_id', type: 'UUID', isForeign: true, desc: 'Related problem signature' },
              { name: 'title', type: 'TEXT', desc: 'Article title' },
              { name: 'content_md', type: 'TEXT', desc: 'Markdown content' },
              { name: 'steps', type: 'JSONB', desc: 'Structured fix steps' },
              { name: 'scope', type: 'TEXT[]', desc: 'OS/vendor compatibility' },
              { name: 'status', type: 'article_status', desc: 'draft, published, deprecated' },
              { name: 'confidence', type: 'NUMERIC(3,2)', desc: 'Success confidence (0-1)' }
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-dark/40 rounded-lg border border-slate-gray/20">
                <div className={`w-4 h-4 ${field.isPrimary ? 'text-iq-neon-green' : field.isForeign ? 'text-electric-blue' : 'text-mist-gray'}`}>
                  {field.isPrimary ? '🔑' : field.isForeign ? '🔗' : '📄'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-iq-neon-green">{field.name}</span>
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                      {field.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-mist-gray">{field.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tier-based Access */}
          <div className="border-t border-slate-gray/20 pt-6">
            <h4 className="font-semibold text-pure-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-iq-neon-green" />
              Tier-based Access Control
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-slate-gray/10 border border-slate-gray/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30 text-xs">
                    Starter
                  </Badge>
                  <span className="text-sm text-pure-white">Basic articles only</span>
                </div>
              </div>
              <div className="p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                    Pro
                  </Badge>
                  <span className="text-sm text-pure-white">Expert troubleshooting + Evidence</span>
                </div>
              </div>
              <div className="p-4 bg-prediction-purple/10 border border-prediction-purple/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 text-xs">
                    Team
                  </Badge>
                  <span className="text-sm text-pure-white">Full automation + Custom workflows</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* kb_evidence Table */}
        <Card className="bubo-glass p-8 hover:bubo-glow-amber transition-all duration-500 relative">
          <div className="absolute top-4 right-4">
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
              Pro Tier Required
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-warning/20 flex items-center justify-center">
              <Search className="w-6 h-6 text-amber-warning" />
            </div>
            <div>
              <h3 className="text-xl font-space-grotesk text-pure-white">kb_evidence</h3>
              <p className="text-mist-gray text-sm">Source tickets and resolution data</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'id', type: 'UUID', isPrimary: true },
              { name: 'ticket_id', type: 'UUID', isForeign: true },
              { name: 'device_id', type: 'UUID', isForeign: true },
              { name: 'resolution_success', type: 'BOOLEAN' },
              { name: 'steps_used', type: 'JSONB' },
              { name: 'notes', type: 'TEXT' }
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-dark/40 rounded-lg border border-slate-gray/20">
                <div className={`w-4 h-4 ${field.isPrimary ? 'text-iq-neon-green' : field.isForeign ? 'text-electric-blue' : 'text-mist-gray'}`}>
                  {field.isPrimary ? '🔑' : field.isForeign ? '🔗' : '📄'}
                </div>
                <span className="font-mono text-sm text-iq-neon-green">{field.name}</span>
                <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30 text-xs">
                  {field.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* kb_feedback Table */}
        <Card className="bubo-glass p-8 hover:bubo-glow-green transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h3 className="text-xl font-space-grotesk text-pure-white">kb_feedback</h3>
              <p className="text-mist-gray text-sm">User feedback on article effectiveness</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'id', type: 'UUID', isPrimary: true },
              { name: 'article_id', type: 'UUID', isForeign: true },
              { name: 'user_id', type: 'UUID', isForeign: true },
              { name: 'was_helpful', type: 'BOOLEAN' },
              { name: 'auto_run_success', type: 'BOOLEAN' },
              { name: 'comment', type: 'TEXT' }
            ].map((field, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface-dark/40 rounded-lg border border-slate-gray/20">
                <div className={`w-4 h-4 ${field.isPrimary ? 'text-iq-neon-green' : field.isForeign ? 'text-electric-blue' : 'text-mist-gray'}`}>
                  {field.isPrimary ? '🔑' : field.isForeign ? '🔗' : '📄'}
                </div>
                <span className="font-mono text-sm text-iq-neon-green">{field.name}</span>
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  {field.type}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Relationships Visualization */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6 flex items-center gap-3">
          <GitBranch className="w-6 h-6 text-electric-blue" />
          Table Relationships
        </h2>
        
        <div className="flex items-center justify-center p-8 bg-surface-dark/20 rounded-xl">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-electric-blue/20 flex items-center justify-center mb-2">
                  <Database className="w-8 h-8 text-electric-blue" />
                </div>
                <p className="text-sm text-electric-blue font-medium">problem_signature</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-px bg-iq-neon-green"></div>
                <div className="w-0 h-0 border-l-[8px] border-l-iq-neon-green border-y-[4px] border-y-transparent"></div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-iq-neon-green/20 flex items-center justify-center mb-2">
                  <FileText className="w-8 h-8 text-iq-neon-green" />
                </div>
                <p className="text-sm text-iq-neon-green font-medium">article</p>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-px bg-iq-neon-green"></div>
                <div className="w-0 h-0 border-l-[8px] border-l-iq-neon-green border-y-[4px] border-y-transparent"></div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl bg-iq-neon-green/20 flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-iq-neon-green" />
                </div>
                <p className="text-sm text-iq-neon-green font-medium">feedback</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="w-px h-8 bg-amber-warning mx-auto"></div>
                <div className="w-16 h-16 rounded-xl bg-amber-warning/20 flex items-center justify-center mb-2">
                  <Search className="w-8 h-8 text-amber-warning" />
                </div>
                <p className="text-sm text-amber-warning font-medium">evidence</p>
                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs mt-1">
                  Pro Only
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAPIDocumentation = () => (
    <div className="space-y-8">
      <Card className="bubo-glass-bright rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-prediction-purple/20 to-electric-blue/20 flex items-center justify-center">
            <Code className="w-8 h-8 text-prediction-purple" />
          </div>
          <div>
            <h1 className="font-space-grotesk text-3xl text-pure-white mb-2">
              API & Edge Functions
            </h1>
            <p className="text-mist-gray text-lg">Holographic developer documentation panels</p>
          </div>
        </div>
      </Card>

      {/* Edge Functions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ingest_resolution Function */}
        <Card className="bubo-glass p-8 hover:bubo-glow-green transition-all duration-500 bubo-holographic">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
                <Server className="w-6 h-6 text-iq-neon-green" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">ingest_resolution()</h3>
                <p className="text-mist-gray text-sm">Ingests resolution, updates signature</p>
              </div>
            </div>
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              POST
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-midnight/60 rounded-lg p-4 border border-iq-neon-green/20">
              <p className="text-xs text-mist-gray mb-2 font-mono">TypeScript Function:</p>
              <pre className="text-sm text-iq-neon-green font-mono overflow-x-auto">
{`export async function ingestResolution(
  ticketId: string,
  resolution: ResolutionData,
  deviceContext: DeviceInfo
) {
  // Extract problem signature
  const signature = await extractSignature(resolution);
  
  // Update or create signature
  const { data } = await supabase
    .from('kb_problem_signature')
    .upsert({
      signature_hash: signature.hash,
      features: signature.features,
      incidents_count: signature.count + 1,
      embedding: await generateEmbedding(signature.text)
    });

  // Store evidence
  await storeEvidence(ticketId, signature.id, resolution);
  
  return { signatureId: data.id };
}`}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">Parameters</h4>
                <div className="space-y-2 text-xs">
                  <div><code className="text-electric-blue">ticketId</code> <span className="text-mist-gray">string</span></div>
                  <div><code className="text-electric-blue">resolution</code> <span className="text-mist-gray">ResolutionData</span></div>
                  <div><code className="text-electric-blue">deviceContext</code> <span className="text-mist-gray">DeviceInfo</span></div>
                </div>
              </div>
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">Returns</h4>
                <div className="text-xs">
                  <code className="text-iq-neon-green">{`{ signatureId: string }`}</code>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* kb_search Function */}
        <Card className="bubo-glass p-8 hover:bubo-glow-blue transition-all duration-500 bubo-holographic">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-electric-blue/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">kb_search()</h3>
                <p className="text-mist-gray text-sm">BM25 + pgvector hybrid search</p>
              </div>
            </div>
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
              GET
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-midnight/60 rounded-lg p-4 border border-electric-blue/20">
              <p className="text-xs text-mist-gray mb-2 font-mono">SQL + Vector Search:</p>
              <pre className="text-sm text-electric-blue font-mono overflow-x-auto">
{`-- Hybrid search combining BM25 and vector similarity
WITH text_search AS (
  SELECT *, 
    ts_rank(to_tsvector('english', title || ' ' || description), 
             plainto_tsquery('english', $1)) as bm25_score
  FROM kb_article 
  WHERE to_tsvector('english', title || ' ' || description) 
        @@ plainto_tsquery('english', $1)
),
vector_search AS (
  SELECT *, 
    1 - (embedding <=> $2) as similarity_score
  FROM kb_article
  ORDER BY embedding <=> $2
  LIMIT 20
)
SELECT * FROM (
  SELECT *, 
    (bm25_score * 0.7 + similarity_score * 0.3) as hybrid_score
  FROM text_search t
  FULL OUTER JOIN vector_search v ON t.id = v.id
) ranked
ORDER BY hybrid_score DESC;`}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">Search Types</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-electric-blue">BM25:</span> <span className="text-mist-gray">Keyword relevance</span></div>
                  <div><span className="text-electric-blue">Vector:</span> <span className="text-mist-gray">Semantic similarity</span></div>
                  <div><span className="text-electric-blue">Hybrid:</span> <span className="text-mist-gray">Combined scoring</span></div>
                </div>
              </div>
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">Performance</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-iq-neon-green">Latency:</span> <span className="text-mist-gray">&lt;100ms</span></div>
                  <div><span className="text-iq-neon-green">Accuracy:</span> <span className="text-mist-gray">94.2%</span></div>
                  <div><span className="text-iq-neon-green">Relevance:</span> <span className="text-mist-gray">0.89 NDCG</span></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* cluster_signatures Function */}
        <Card className="bubo-glass p-8 hover:bubo-glow-amber transition-all duration-500 bubo-holographic">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-warning/20 flex items-center justify-center">
                <Layers className="w-6 h-6 text-amber-warning" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">cluster_signatures()</h3>
                <p className="text-mist-gray text-sm">Refresh counts, trigger auto-draft</p>
              </div>
            </div>
            <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
              CRON
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-midnight/60 rounded-lg p-4 border border-amber-warning/20">
              <p className="text-xs text-mist-gray mb-2 font-mono">Clustering Algorithm:</p>
              <pre className="text-sm text-amber-warning font-mono overflow-x-auto">
{`export async function clusterSignatures() {
  // Use DBSCAN clustering on embeddings
  const signatures = await supabase
    .from('kb_problem_signature')
    .select('id, embedding, incidents_count')
    .gte('incidents_count', 5); // Minimum threshold

  const clusters = await runDBSCAN(
    signatures.map(s => s.embedding),
    { eps: 0.3, minPts: 3 }
  );

  // Update cluster assignments
  for (const cluster of clusters) {
    if (cluster.size >= 10) { // Auto-draft threshold
      await triggerAutoDraft(cluster.signatureIds);
    }
  }
}`}
              </pre>
            </div>

            <div className="bg-surface-dark/40 rounded-lg p-4">
              <h4 className="text-sm font-medium text-pure-white mb-2">Clustering Parameters</h4>
              <div className="space-y-2 text-xs">
                <div><code className="text-amber-warning">eps: 0.3</code> <span className="text-mist-gray">Similarity threshold</span></div>
                <div><code className="text-amber-warning">minPts: 3</code> <span className="text-mist-gray">Minimum cluster size</span></div>
                <div><code className="text-amber-warning">threshold: 10</code> <span className="text-mist-gray">Auto-draft trigger</span></div>
              </div>
            </div>
          </div>
        </Card>

        {/* draft_article Function */}
        <Card className="bubo-glass p-8 hover:bubo-glow-green transition-all duration-500 bubo-holographic">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-prediction-purple/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-prediction-purple" />
              </div>
              <div>
                <h3 className="text-xl font-space-grotesk text-pure-white">draft_article()</h3>
                <p className="text-mist-gray text-sm">Auto-create draft with AI</p>
              </div>
            </div>
            <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30">
              AI
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="bg-dark-midnight/60 rounded-lg p-4 border border-prediction-purple/20">
              <p className="text-xs text-mist-gray mb-2 font-mono">GPT-4 Integration:</p>
              <pre className="text-sm text-prediction-purple font-mono overflow-x-auto">
{`const draftContent = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{
    role: "system",
    content: \`Create a knowledge base article from these resolved issues:
    
    Structure: Prechecks → Fix Steps → Verification
    Format: Each step needs risk level, time estimate, rollback plan
    Evidence: \${evidenceList}
    Pattern: \${problemSignature}\`
  }],
  functions: [{
    name: "create_structured_article",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string" },
        prechecks: { type: "array" },
        fix_steps: { type: "array" },
        verification: { type: "array" },
        confidence: { type: "number" }
      }
    }
  }]
});`}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">AI Features</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-prediction-purple">GPT-4:</span> <span className="text-mist-gray">Content generation</span></div>
                  <div><span className="text-prediction-purple">Functions:</span> <span className="text-mist-gray">Structured output</span></div>
                  <div><span className="text-prediction-purple">Context:</span> <span className="text-mist-gray">8K token window</span></div>
                </div>
              </div>
              <div className="bg-surface-dark/40 rounded-lg p-4">
                <h4 className="text-sm font-medium text-pure-white mb-2">Quality Metrics</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-iq-neon-green">Accuracy:</span> <span className="text-mist-gray">91.3%</span></div>
                  <div><span className="text-iq-neon-green">Completeness:</span> <span className="text-mist-gray">87.6%</span></div>
                  <div><span className="text-iq-neon-green">Relevance:</span> <span className="text-mist-gray">93.1%</span></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* API Endpoints Overview */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6 text-iq-neon-green" />
          REST API Endpoints
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { method: 'GET', endpoint: '/api/kb/search', desc: 'Search articles', bgClass: 'bg-electric-blue/10', borderClass: 'border-electric-blue/30', badgeClass: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30', textClass: 'text-electric-blue' },
            { method: 'POST', endpoint: '/api/kb/ingest', desc: 'Ingest resolution', bgClass: 'bg-iq-neon-green/10', borderClass: 'border-iq-neon-green/30', badgeClass: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30', textClass: 'text-iq-neon-green' },
            { method: 'PUT', endpoint: '/api/kb/feedback', desc: 'Submit feedback', bgClass: 'bg-signal-yellow/10', borderClass: 'border-signal-yellow/30', badgeClass: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30', textClass: 'text-signal-yellow' },
            { method: 'POST', endpoint: '/api/kb/publish', desc: 'Publish article', bgClass: 'bg-prediction-purple/10', borderClass: 'border-prediction-purple/30', badgeClass: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30', textClass: 'text-prediction-purple' }
          ].map((api, i) => (
            <div key={i} className={`p-4 ${api.bgClass} ${api.borderClass} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${api.badgeClass} text-xs`}>
                  {api.method}
                </Badge>
              </div>
              <code className={`text-sm font-mono ${api.textClass} block mb-2`}>
                {api.endpoint}
              </code>
              <p className="text-xs text-mist-gray">{api.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDataPipeline = () => (
    <div className="space-y-8">
      <Card className="bubo-glass-bright rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center bubo-animate-pulse-glow">
            <GitBranch className="w-8 h-8 text-iq-neon-green" />
          </div>
          <div>
            <h1 className="font-space-grotesk text-3xl text-pure-white mb-2 bubo-neon-text-green">
              Self-Building Data Pipeline
            </h1>
            <p className="text-mist-gray text-lg">Animated neon-arrow process visualization</p>
          </div>
        </div>
      </Card>

      {/* Animated Pipeline Flow */}
      <Card className="bubo-glass p-8 relative overflow-hidden">
        <div className="absolute inset-0 bubo-scanning-line opacity-30" />
        
        <div className="relative">
          <h2 className="text-xl font-space-grotesk text-pure-white mb-8 text-center">
            Issues → Evidence → Signatures → Drafts → Review → Published → Feedback → Metrics
          </h2>

          {/* Pipeline Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
            {[
              {
                step: 1,
                title: 'Issues Closed',
                icon: '🎫',
                desc: 'Fix patterns identified',
                borderClass: 'border-iq-neon-green',
                bgClass: 'bg-iq-neon-green/20',
                textClass: 'text-iq-neon-green',
                active: animationPhase === 0
              },
              {
                step: 2,
                title: 'Evidence Ingest',
                icon: '🔍',
                desc: 'Vector embeddings generated',
                borderClass: 'border-electric-blue',
                bgClass: 'bg-electric-blue/20',
                textClass: 'text-electric-blue',
                active: animationPhase === 1
              },
              {
                step: 3,
                title: 'Signature Cluster',
                icon: '🧩',
                desc: 'Similar issues grouped',
                borderClass: 'border-signal-yellow',
                bgClass: 'bg-signal-yellow/20',
                textClass: 'text-signal-yellow',
                active: animationPhase === 2
              },
              {
                step: 4,
                title: 'Draft Article',
                icon: '📝',
                desc: 'AI-generated solutions',
                borderClass: 'border-prediction-purple',
                bgClass: 'bg-prediction-purple/20',
                textClass: 'text-prediction-purple',
                active: animationPhase === 3
              }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                  item.active 
                    ? `${item.borderClass} ${item.bgClass} bubo-animate-pulse-glow` 
                    : `border-slate-gray/30 bg-surface-dark/30`
                }`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className={`font-space-grotesk font-semibold mb-2 transition-colors duration-500 ${
                  item.active ? item.textClass : 'text-pure-white'
                }`}>
                  {item.title}
                </h3>
                <p className="text-sm text-mist-gray">{item.desc}</p>
                
                {/* Animated Arrow */}
                {i < 3 && (
                  <div className="absolute top-10 -right-4 hidden lg:block">
                    <div className={`flex items-center transition-all duration-500 ${
                      item.active ? 'text-iq-neon-green' : 'text-slate-gray'
                    }`}>
                      <div className="w-8 h-px bg-current"></div>
                      <div className="w-0 h-0 border-l-[8px] border-l-current border-y-[4px] border-y-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {[
              {
                step: 5,
                title: 'Review Process',
                icon: '🛡️',
                desc: 'Human quality assurance',
                borderClass: 'border-cyan-accent',
                bgClass: 'bg-cyan-accent/20',
                textClass: 'text-cyan-accent',
                active: animationPhase === 4
              },
              {
                step: 6,
                title: 'Published KB',
                icon: '🚀',
                desc: 'Live knowledge available',
                borderClass: 'border-iq-neon-green',
                bgClass: 'bg-iq-neon-green/20',
                textClass: 'text-iq-neon-green',
                active: animationPhase === 5
              },
              {
                step: 7,
                title: 'Feedback Loop',
                icon: '💬',
                desc: 'User success tracking',
                borderClass: 'border-electric-blue',
                bgClass: 'bg-electric-blue/20',
                textClass: 'text-electric-blue',
                active: animationPhase === 6 || animationPhase === 0
              },
              {
                step: 8,
                title: 'Metrics & Insights',
                icon: '📊',
                desc: 'Performance analytics',
                borderClass: 'border-prediction-purple',
                bgClass: 'bg-prediction-purple/20',
                textClass: 'text-prediction-purple',
                active: false
              }
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${
                  item.active 
                    ? `${item.borderClass} ${item.bgClass} bubo-animate-pulse-glow` 
                    : `border-slate-gray/30 bg-surface-dark/30`
                }`}>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className={`font-space-grotesk font-semibold mb-2 transition-colors duration-500 ${
                  item.active ? item.textClass : 'text-pure-white'
                }`}>
                  {item.title}
                </h3>
                <p className="text-sm text-mist-gray">{item.desc}</p>
                
                {/* Curved return arrow for feedback */}
                {i === 2 && (
                  <div className="absolute top-10 -left-12 hidden lg:block">
                    <svg width="48" height="24" viewBox="0 0 48 24" className={`transition-all duration-500 ${
                      item.active ? 'text-electric-blue' : 'text-slate-gray'
                    }`}>
                      <path 
                        d="M 4 20 Q 24 4 44 20" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Continuous Improvement Loop */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6 text-center">
          Continuous Improvement Loop
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 border-2 border-iq-neon-green flex items-center justify-center mx-auto mb-4 bubo-animate-breathe">
              <Users className="w-8 h-8 text-iq-neon-green" />
            </div>
            <h3 className="font-space-grotesk text-lg text-iq-neon-green mb-3">Feedback Collection</h3>
            <p className="text-mist-gray text-sm">User success/failure feedback updates confidence scores and triggers article improvements automatically</p>
          </div>
          
          <div className="text-center p-6 bg-electric-blue/10 border border-electric-blue/30 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-electric-blue/20 border-2 border-electric-blue flex items-center justify-center mx-auto mb-4 bubo-animate-breathe" style={{ animationDelay: '0.5s' }}>
              <BarChart3 className="w-8 h-8 text-electric-blue" />
            </div>
            <h3 className="font-space-grotesk text-lg text-electric-blue mb-3">Metrics Analysis</h3>
            <p className="text-mist-gray text-sm">Deflection rates, time savings, and success patterns inform future article creation priorities</p>
          </div>
          
          <div className="text-center p-6 bg-prediction-purple/10 border border-prediction-purple/30 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-prediction-purple/20 border-2 border-prediction-purple flex items-center justify-center mx-auto mb-4 bubo-animate-breathe" style={{ animationDelay: '1s' }}>
              <Brain className="w-8 h-8 text-prediction-purple" />
            </div>
            <h3 className="font-space-grotesk text-lg text-prediction-purple mb-3">AI Learning</h3>
            <p className="text-mist-gray text-sm">Machine learning models continuously improve problem pattern recognition and solution accuracy</p>
          </div>
        </div>
      </Card>

      {/* Real-time Stats */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6 text-center">
          Live Pipeline Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Issues Processed', value: '1,247', change: '+23 today', bgClass: 'bg-iq-neon-green/10', borderClass: 'border-iq-neon-green/30', textClass: 'text-iq-neon-green', hoverClass: 'hover:bg-iq-neon-green/15' },
            { label: 'Active Signatures', value: '156', change: '+7 this week', bgClass: 'bg-electric-blue/10', borderClass: 'border-electric-blue/30', textClass: 'text-electric-blue', hoverClass: 'hover:bg-electric-blue/15' },
            { label: 'Drafts Created', value: '34', change: '+5 pending', bgClass: 'bg-signal-yellow/10', borderClass: 'border-signal-yellow/30', textClass: 'text-signal-yellow', hoverClass: 'hover:bg-signal-yellow/15' },
            { label: 'Articles Published', value: '89', change: '94% accuracy', bgClass: 'bg-prediction-purple/10', borderClass: 'border-prediction-purple/30', textClass: 'text-prediction-purple', hoverClass: 'hover:bg-prediction-purple/15' }
          ].map((stat, i) => (
            <div key={i} className={`text-center p-6 ${stat.bgClass} ${stat.borderClass} rounded-xl ${stat.hoverClass} transition-all duration-300`}>
              <div className={`text-3xl font-space-grotesk ${stat.textClass} mb-2`}>
                {stat.value}
              </div>
              <div className="text-pure-white font-medium mb-1">{stat.label}</div>
              <div className="text-xs text-mist-gray">{stat.change}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderMarketingVisuals = () => (
    <div className="space-y-8">
      <Card className="bubo-glass-bright rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
            <Globe className="w-8 h-8 text-iq-neon-green" />
          </div>
          <div>
            <h1 className="font-space-grotesk text-3xl text-pure-white mb-2">
              Marketing-Ready Visuals
            </h1>
            <p className="text-mist-gray text-lg">Export-ready hero shots and demo assets for BuboIQ.com</p>
          </div>
        </div>
      </Card>

      {/* Hero Screenshot */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6">Hero Screenshot: Knowledge Base Dashboard</h2>
        
        <div className="relative bg-dark-midnight rounded-2xl p-8 border-2 border-iq-neon-green/30 overflow-hidden">
          <div className="absolute inset-0 bubo-neural-bg opacity-50" />
          <div className="absolute top-4 right-4 w-32 h-32 bg-iq-neon-green/10 rounded-full blur-2xl animate-pulse" />
          
          <div className="relative">
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-iq-neon-green" />
                </div>
                <div>
                  <h1 className="font-space-grotesk text-2xl text-pure-white bubo-neon-text-green">
                    <span className="text-pure-white">BUBO</span>
                    <span className="text-iq-neon-green">IQ</span> Knowledge Base
                  </h1>
                  <p className="text-mist-gray">Self-building solutions from resolved issues</p>
                </div>
              </div>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-lg px-4 py-2">
                🚀 94% Deflection Rate
              </Badge>
            </div>

            {/* Mock Search Bar */}
            <div className="relative mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-iq-neon-green/20 via-electric-blue/20 to-iq-neon-green/20 rounded-xl blur-lg" />
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-iq-neon-green" />
                  <div className="pl-12 pr-4 py-4 bg-surface-dark/90 border border-iq-neon-green/50 text-pure-white rounded-xl backdrop-blur-sm">
                    <span className="text-mist-gray">Windows Update Service Not Starting...</span>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-sm">
                        3 solutions found
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Solution Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface-dark/60 rounded-xl p-6 border border-iq-neon-green/20 hover:border-iq-neon-green/40 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-pure-white mb-2">Windows Update Service Fix</h3>
                    <p className="text-mist-gray text-sm">Windows Update Engine Failed to Initialize</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-iq-neon-green" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                    High Confidence
                  </Badge>
                  <Badge className="bg-surface-dark/60 text-cloud-white border-slate-gray/30">
                    47 issues
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button className="bubo-btn-secondary flex-1 text-sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button className="bubo-btn-neon-primary text-sm">
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                </div>
              </div>
              
              <div className="bg-surface-dark/30 rounded-xl p-6 border border-slate-gray/30 opacity-60 relative">
                <div className="absolute inset-0 bg-dark-midnight/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-iq-neon-green mx-auto mb-2" />
                    <p className="text-iq-neon-green font-medium">Pro Tier Required</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-pure-white mb-2">Expert Network Diagnostics</h3>
                <p className="text-mist-gray text-sm">Complex troubleshooting solutions</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button className="bubo-btn-neon-primary">
            📸 Export PNG (1920x1080)
          </Button>
        </div>
      </Card>

      {/* Fix Card in Action */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6">Fix Card in Action: TierGuard Lock State</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-dark-midnight rounded-2xl p-6 border border-iq-neon-green/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-24 h-24 bg-iq-neon-green/10 rounded-full blur-xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-space-grotesk text-pure-white">Issue #1847</h3>
                <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                  Critical
                </Badge>
              </div>
              
              <div className="bg-surface-dark/60 rounded-xl p-6 border border-electric-blue/20 relative">
                {/* TierGuard Overlay */}
                <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 border-2 border-iq-neon-green flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Lock className="w-8 h-8 text-iq-neon-green" />
                    </div>
                    <h3 className="text-lg font-space-grotesk text-iq-neon-green mb-2">Unlock with Pro</h3>
                    <p className="text-mist-gray text-sm mb-4">Powerful automation features require Pro tier</p>
                    <Button className="bubo-btn-neon-primary">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <h4 className="font-semibold text-pure-white mb-3">Expert Network Printer Fix</h4>
                  <p className="text-mist-gray text-sm mb-4">Automated resolution with pre-checks and rollback</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                      Medium Confidence
                    </Badge>
                    <Badge className="bg-surface-dark/60 text-cloud-white border-slate-gray/30">
                      23 issues
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="bubo-btn-secondary flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Steps
                    </Button>
                    <Button className="bubo-btn-ghost" disabled>
                      <Shield className="w-4 h-4 mr-2" />
                      Prechecks
                    </Button>
                    <Button className="bubo-btn-neon-primary" disabled>
                      <Zap className="w-4 h-4 mr-2" />
                      Auto-Run
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button className="bubo-btn-neon-primary">
            📸 Export PNG (800x600)
          </Button>
        </div>
      </Card>

      {/* Metrics Panel */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6">Metrics Panel: "90% Deflection Rate" Holographic Chart</h2>
        
        <div className="bg-dark-midnight rounded-2xl p-8 border border-iq-neon-green/30 relative overflow-hidden">
          <div className="absolute inset-0 bubo-holographic opacity-20" />
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="text-6xl font-space-grotesk text-iq-neon-green mb-4 bubo-neon-text-green">
                90%
              </div>
              <h3 className="text-2xl font-space-grotesk text-pure-white mb-2">Deflection Rate</h3>
              <p className="text-mist-gray">Issues resolved without human intervention</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
                <div className="text-3xl font-space-grotesk text-iq-neon-green mb-2">47</div>
                <div className="text-pure-white font-medium mb-1">Active Solutions</div>
                <div className="text-sm text-mist-gray">Ready to deploy</div>
              </div>
              
              <div className="text-center p-6 bg-electric-blue/10 border border-electric-blue/30 rounded-xl">
                <div className="text-3xl font-space-grotesk text-electric-blue mb-2">33min</div>
                <div className="text-pure-white font-medium mb-1">Time Saved</div>
                <div className="text-sm text-mist-gray">Per resolved issue</div>
              </div>
              
              <div className="text-center p-6 bg-prediction-purple/10 border border-prediction-purple/30 rounded-xl">
                <div className="text-3xl font-space-grotesk text-prediction-purple mb-2">94%</div>
                <div className="text-pure-white font-medium mb-1">Success Rate</div>
                <div className="text-sm text-mist-gray">First-attempt resolution</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button className="bubo-btn-neon-primary">
            📊 Export Chart SVG
          </Button>
        </div>
      </Card>

      {/* Animated Orb Sequence */}
      <Card className="bubo-glass p-8">
        <h2 className="text-xl font-space-grotesk text-pure-white mb-6 text-center">
          Animated Orb Sequence: Confidence State Transitions
        </h2>
        
        <div className="flex items-center justify-center space-x-12 py-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-2 border-slate-gray bg-slate-gray/20 flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-slate-gray" />
            </div>
            <p className="text-slate-gray font-medium">Dormant</p>
            <p className="text-xs text-mist-gray">No data</p>
          </div>
          
          <div className="text-iq-neon-green text-2xl">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-2 border-signal-yellow bg-signal-yellow/20 flex items-center justify-center mb-4 animate-pulse">
              <FileText className="w-10 h-10 text-signal-yellow" />
            </div>
            <p className="text-signal-yellow font-medium">Draft</p>
            <p className="text-xs text-mist-gray">In review</p>
          </div>
          
          <div className="text-iq-neon-green text-2xl">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/20 flex items-center justify-center mb-4 bubo-animate-pulse-glow">
              <CheckCircle className="w-10 h-10 text-iq-neon-green" />
            </div>
            <p className="text-iq-neon-green font-medium">Published</p>
            <p className="text-xs text-mist-gray">Live & active</p>
          </div>
          
          <div className="text-iq-neon-green text-2xl">→</div>
          
          <div className="text-center">
            <div className="w-20 h-20 rounded-full border-2 border-iq-neon-green bg-iq-neon-green/30 flex items-center justify-center mb-4 bubo-animate-breathe">
              <Shield className="w-10 h-10 text-iq-neon-green" />
            </div>
            <p className="text-iq-neon-green font-medium">Verified</p>
            <p className="text-xs text-mist-gray">High confidence</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button className="bubo-btn-neon-primary">
            🎬 Export Animation GIF
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'overview': return renderKnowledgeBaseHome();
      case 'article-detail': return <div className="text-center p-12 text-mist-gray">Article Detail Flow - Coming up next</div>;
      case 'reviewer-console': return <div className="text-center p-12 text-mist-gray">Reviewer Console - In development</div>;
      case 'metrics': return <div className="text-center p-12 text-mist-gray">Analytics Dashboard - Preview ready</div>;
      case 'schema': return renderSupabaseSchema();
      case 'api-docs': return renderAPIDocumentation();
      case 'pipeline': return renderDataPipeline();
      case 'marketing': return renderMarketingVisuals();
      default: return renderKnowledgeBaseHome();
    }
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg">
      {/* Background Effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
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
            <h1 className="font-space-grotesk text-5xl text-pure-white mb-4 bubo-neon-text-green">
              <span className="text-pure-white">BUBO</span>
              <span className="text-iq-neon-green">IQ</span> Knowledge Base
            </h1>
            <p className="text-xl text-mist-gray max-w-4xl mx-auto">
              Complete production-ready self-building knowledge base with cinematic UI, 
              full schema visualization, API documentation, and marketing assets
            </p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {demoSections.map((section) => (
              <Button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`${
                  activeSection === section.id ? 'bubo-btn-neon-primary' : 'bubo-btn-secondary'
                } flex items-center gap-2 text-sm`}
              >
                {section.icon}
                {section.title}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-mist-gray">
              {demoSections.find(s => s.id === activeSection)?.description}
            </p>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-7xl mx-auto">
          {renderCurrentSection()}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm text-mist-gray mb-2">
            <span>Demo Progress</span>
            <span>{demoSections.findIndex(s => s.id === activeSection) + 1} of {demoSections.length}</span>
          </div>
          <Progress 
            value={((demoSections.findIndex(s => s.id === activeSection) + 1) / demoSections.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Export Tools */}
        <div className="mt-12 text-center">
          <Card className="bubo-glass p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-space-grotesk text-pure-white mb-4">Export Tools</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="bubo-btn-secondary">
                📸 Export Screenshots
              </Button>
              <Button className="bubo-btn-secondary">
                📊 Export Schema SVG
              </Button>
              <Button className="bubo-btn-secondary">
                🎬 Export Animations
              </Button>
              <Button className="bubo-btn-neon-primary">
                🚀 Generate Marketing Kit
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};