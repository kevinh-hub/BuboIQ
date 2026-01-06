import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertTriangle, Users, Brain, Zap, BarChart3, Settings, Plus, Eye, Lock, Target, Shield, FileText, Code, Database } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { TierGuard } from '../TierGuard';
import { FixCard } from './FixCard';
import { KnowledgeBaseMetrics } from './KnowledgeBaseMetrics';
import { SupabaseSchemaVisualization } from './SupabaseSchemaVisualization';
import { ComprehensiveKnowledgeBaseDemo } from './ComprehensiveKnowledgeBaseDemo';

interface EnhancedKnowledgeBasePageProps {
  user: any;
  onNavigate: (page: string, options?: any) => void;
}

interface Article {
  id: string;
  title: string;
  problemSignature: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number;
  lastVerified: Date;
  builtFromIssues: number;
  status: 'draft' | 'published' | 'deprecated';
  os: string[];
  vendor: string;
  deviceClass: string;
  medianTimeToFix: number;
  successRate: number;
  tier: 'starter' | 'pro' | 'team';
  automationReady: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  embedding?: number[];
  tags: string[];
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Windows Update Service Not Starting',
    problemSignature: 'Windows Update Engine Failed to Initialize',
    confidence: 'high',
    confidenceScore: 94,
    lastVerified: new Date('2024-09-20'),
    builtFromIssues: 47,
    status: 'published',
    os: ['Windows 10', 'Windows 11'],
    vendor: 'Microsoft',
    deviceClass: 'Desktop',
    medianTimeToFix: 8,
    successRate: 94,
    tier: 'starter',
    automationReady: true,
    riskLevel: 'low',
    tags: ['windows', 'updates', 'service', 'critical']
  },
  {
    id: '2',
    title: 'Expert Network Printer Diagnostics',
    problemSignature: 'Print Spooler Service Hang Pattern',
    confidence: 'medium',
    confidenceScore: 78,
    lastVerified: new Date('2024-09-18'),
    builtFromIssues: 23,
    status: 'published',
    os: ['Windows 10', 'Windows 11'],
    vendor: 'Various',
    deviceClass: 'Printer',
    medianTimeToFix: 15,
    successRate: 87,
    tier: 'pro',
    automationReady: true,
    riskLevel: 'medium',
    tags: ['printer', 'network', 'spooler', 'diagnostics']
  },
  {
    id: '3',
    title: 'Chrome Browser Memory Fix',
    problemSignature: 'Chrome Process Memory Growth Pattern',
    confidence: 'high',
    confidenceScore: 96,
    lastVerified: new Date('2024-09-22'),
    builtFromIssues: 89,
    status: 'published',
    os: ['Windows 10', 'Windows 11', 'macOS'],
    vendor: 'Google',
    deviceClass: 'Application',
    medianTimeToFix: 3,
    successRate: 96,
    tier: 'starter',
    automationReady: true,
    riskLevel: 'low',
    tags: ['chrome', 'memory', 'browser', 'performance']
  },
  {
    id: '4',
    title: 'Enterprise VPN Auto-Reconnection',
    problemSignature: 'VPN Authentication Timeout Pattern',
    confidence: 'medium',
    confidenceScore: 72,
    lastVerified: new Date('2024-09-21'),
    builtFromIssues: 15,
    status: 'draft',
    os: ['Windows 10', 'Windows 11', 'macOS'],
    vendor: 'Cisco',
    deviceClass: 'Network',
    medianTimeToFix: 12,
    successRate: 89,
    tier: 'team',
    automationReady: false,
    riskLevel: 'high',
    tags: ['vpn', 'network', 'authentication', 'enterprise']
  },
  {
    id: '5',
    title: 'Adobe Creative Suite License Recovery',
    problemSignature: 'Adobe License Server Communication Error',
    confidence: 'high',
    confidenceScore: 91,
    lastVerified: new Date('2024-09-19'),
    builtFromIssues: 31,
    status: 'published',
    os: ['Windows 10', 'Windows 11', 'macOS'],
    vendor: 'Adobe',
    deviceClass: 'Application',
    medianTimeToFix: 6,
    successRate: 93,
    tier: 'pro',
    automationReady: true,
    riskLevel: 'low',
    tags: ['adobe', 'licensing', 'creative', 'software']
  }
];

export const EnhancedKnowledgeBasePage: React.FC<EnhancedKnowledgeBasePageProps> = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('published');
  const [activeView, setActiveView] = useState('articles'); // articles, metrics, schema, demo
  const [osFilter, setOsFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Simulate hybrid search (BM25 + Vector)
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  useEffect(() => {
    let filtered = mockArticles.filter(article => {
      const matchesTab = activeTab === 'all' || article.status === activeTab;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.problemSignature.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesOS = osFilter === 'all' || article.os.some(os => os.toLowerCase().includes(osFilter.toLowerCase()));
      const matchesVendor = vendorFilter === 'all' || article.vendor.toLowerCase().includes(vendorFilter.toLowerCase());
      const matchesTier = tierFilter === 'all' || article.tier === tierFilter;
      const matchesConfidence = article.confidenceScore >= confidenceThreshold[0];
      
      return matchesTab && matchesSearch && matchesOS && matchesVendor && matchesTier && matchesConfidence;
    });

    // Sort by confidence and relevance
    filtered.sort((a, b) => {
      if (searchQuery) {
        // Boost exact matches
        const aExact = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 100 : 0;
        const bExact = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 100 : 0;
        if (aExact !== bExact) return bExact - aExact;
      }
      
      // Sort by confidence score
      if (a.confidenceScore !== b.confidenceScore) {
        return b.confidenceScore - a.confidenceScore;
      }
      
      // Sort by last verified
      return b.lastVerified.getTime() - a.lastVerified.getTime();
    });

    setFilteredArticles(filtered);
  }, [searchQuery, activeTab, osFilter, vendorFilter, tierFilter, confidenceThreshold]);

  const getConfidenceBadge = (confidence: string, score: number, className?: string) => {
    const variants = {
      high: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
      medium: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30',
      low: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
    };
    
    return (
      <Badge className={`${variants[confidence as keyof typeof variants]} ${className}`}>
        {confidence === 'high' && <CheckCircle className="w-3 h-3 mr-1" />}
        {confidence === 'medium' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {confidence === 'low' && <Clock className="w-3 h-3 mr-1" />}
        {score}% Confidence
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      starter: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
      pro: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
      team: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30'
    };
    
    const icons = {
      starter: <Users className="w-3 h-3 mr-1" />,
      pro: <Shield className="w-3 h-3 mr-1" />,
      team: <Zap className="w-3 h-3 mr-1" />
    };
    
    return (
      <Badge className={`${variants[tier as keyof typeof variants]} text-xs`}>
        {icons[tier as keyof typeof icons]}
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const canAccessArticle = (article: Article) => {
    const userTierLevel = { starter: 1, pro: 2, team: 3 }[user?.tier || 'starter'];
    const articleTierLevel = { starter: 1, pro: 2, team: 3 }[article.tier];
    return userTierLevel >= articleTierLevel;
  };

  const getStatistics = () => {
    const total = mockArticles.length;
    const published = mockArticles.filter(a => a.status === 'published').length;
    const drafts = mockArticles.filter(a => a.status === 'draft').length;
    const deprecated = mockArticles.filter(a => a.status === 'deprecated').length;
    const avgConfidence = Math.round(mockArticles.reduce((sum, a) => sum + a.confidenceScore, 0) / total);
    const automationReady = mockArticles.filter(a => a.automationReady).length;
    
    return { total, published, drafts, deprecated, avgConfidence, automationReady };
  };

  const stats = getStatistics();

  if (activeView === 'metrics') {
    return <KnowledgeBaseMetrics user={user} onBack={() => setActiveView('articles')} />;
  }

  if (activeView === 'schema') {
    return <SupabaseSchemaVisualization onClose={() => setActiveView('articles')} />;
  }

  if (activeView === 'demo') {
    return <ComprehensiveKnowledgeBaseDemo onBack={() => setActiveView('articles')} />;
  }

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10">
        {/* Enhanced Header */}
        <Card className="bubo-glass-bright rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-iq-neon-green/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-electric-blue/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
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
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-lg px-4 py-2 mb-2">
                    🚀 {Math.round((stats.published / stats.total) * 100)}% Published
                  </Badge>
                  <p className="text-sm text-mist-gray">{stats.total} total solutions</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveView('metrics')}
                    className="bubo-btn-secondary"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                  
                  <Button
                    onClick={() => setActiveView('schema')}
                    className="bubo-btn-ghost"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Schema
                  </Button>
                  
                  <Button
                    onClick={() => setActiveView('demo')}
                    className="bubo-btn-ghost"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                  
                  <TierGuard 
                    tier="pro" 
                    user={user}
                    feature="Knowledge Base Management"
                  >
                    <Button
                      onClick={() => onNavigate('reviewer-console')}
                      className="bubo-btn-neon-primary"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Reviewer Console
                    </Button>
                  </TierGuard>
                </div>
              </div>
            </div>

            {/* Enhanced Search with BM25 + Vector indicator */}
            <div className="relative mb-6">
              <div className={`relative group transition-all duration-500 ${searchFocused ? 'bubo-glow-green' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-iq-neon-green/20 via-electric-blue/20 to-iq-neon-green/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-500" />
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-iq-neon-green" />
                  <Input
                    placeholder="Hybrid search: keywords, symptoms, technology, error messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="pl-16 pr-24 py-6 bg-surface-dark/90 border-2 border-iq-neon-green/50 text-pure-white placeholder-mist-gray rounded-2xl backdrop-blur-sm text-lg focus:border-iq-neon-green/70 transition-all duration-300"
                  />
                  
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                    {isSearching && (
                      <div className="w-5 h-5 border-2 border-iq-neon-green border-t-transparent rounded-full animate-spin" />
                    )}
                    
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-sm">
                      BM25 + Vector
                    </Badge>
                    
                    {searchQuery && (
                      <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                        {filteredArticles.length} found
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Search Context Helper */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 bg-surface-dark/95 backdrop-blur-sm border border-iq-neon-green/30 rounded-xl mt-2 p-6 z-20 bubo-glass">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-pure-white mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-iq-neon-green" />
                        Keyword Search (BM25)
                      </h4>
                      <p className="text-sm text-mist-gray">Exact matches in titles, descriptions, and tags</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-pure-white mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-electric-blue" />
                        Semantic Search (Vector)
                      </h4>
                      <p className="text-sm text-mist-gray">AI-powered meaning and context understanding</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-gray/20">
                    <p className="text-sm text-mist-gray">
                      💡 <strong>Pro tip:</strong> Try describing symptoms like "computer slow after startup" or error patterns
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-mist-gray" />
                <span className="text-mist-gray font-medium">Smart Filters:</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Select value={osFilter} onValueChange={setOsFilter}>
                  <SelectTrigger className="w-44 bubo-glass border-slate-gray/30">
                    <SelectValue placeholder="Operating System" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Systems</SelectItem>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="macos">macOS</SelectItem>
                    <SelectItem value="server">Windows Server</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={vendorFilter} onValueChange={setVendorFilter}>
                  <SelectTrigger className="w-44 bubo-glass border-slate-gray/30">
                    <SelectValue placeholder="Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="microsoft">Microsoft</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="adobe">Adobe</SelectItem>
                    <SelectItem value="cisco">Cisco</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-36 bubo-glass border-slate-gray/30">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-3 px-4 py-2 bubo-glass border border-slate-gray/30 rounded-lg">
                  <span className="text-sm text-mist-gray whitespace-nowrap">Min Confidence:</span>
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    min={0}
                    step={5}
                    className="w-24"
                  />
                  <span className="text-sm font-mono text-iq-neon-green w-8 text-right">
                    {confidenceThreshold[0]}%
                  </span>
                </div>
              </div>
              
              {(osFilter !== 'all' || vendorFilter !== 'all' || tierFilter !== 'all' || confidenceThreshold[0] > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOsFilter('all');
                    setVendorFilter('all');
                    setTierFilter('all');
                    setConfidenceThreshold([0]);
                  }}
                  className="text-mist-gray hover:text-pure-white"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
                <div className="text-2xl font-space-grotesk text-iq-neon-green mb-1">{stats.published}</div>
                <div className="text-xs text-mist-gray">Published</div>
              </div>
              <div className="text-center p-4 bg-signal-yellow/10 border border-signal-yellow/30 rounded-xl">
                <div className="text-2xl font-space-grotesk text-signal-yellow mb-1">{stats.drafts}</div>
                <div className="text-xs text-mist-gray">In Review</div>
              </div>
              <div className="text-center p-4 bg-electric-blue/10 border border-electric-blue/30 rounded-xl">
                <div className="text-2xl font-space-grotesk text-electric-blue mb-1">{stats.avgConfidence}%</div>
                <div className="text-xs text-mist-gray">Avg Confidence</div>
              </div>
              <div className="text-center p-4 bg-prediction-purple/10 border border-prediction-purple/30 rounded-xl">
                <div className="text-2xl font-space-grotesk text-prediction-purple mb-1">{stats.automationReady}</div>
                <div className="text-xs text-mist-gray">Auto-Ready</div>
              </div>
              <div className="text-center p-4 bg-mist-gray/10 border border-mist-gray/30 rounded-xl">
                <div className="text-2xl font-space-grotesk text-mist-gray mb-1">{stats.deprecated}</div>
                <div className="text-xs text-mist-gray">Deprecated</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bubo-glass border border-slate-gray/30 rounded-2xl p-1">
            <TabsTrigger 
              value="published" 
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray rounded-xl"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Published Solutions ({mockArticles.filter(a => a.status === 'published').length})
            </TabsTrigger>
            <TabsTrigger 
              value="draft" 
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray rounded-xl"
            >
              <Clock className="w-4 h-4 mr-2" />
              In Review ({mockArticles.filter(a => a.status === 'draft').length})
            </TabsTrigger>
            <TabsTrigger 
              value="deprecated" 
              className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Outdated ({mockArticles.filter(a => a.status === 'deprecated').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredArticles.length === 0 ? (
              <Card className="bubo-glass p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-mist-gray/20 flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-mist-gray" />
                </div>
                <h3 className="text-2xl font-space-grotesk text-pure-white mb-4">No solutions found</h3>
                <p className="text-mist-gray mb-6 max-w-md mx-auto">
                  {searchQuery ? 
                    `No solutions match "${searchQuery}" with current filters.` :
                    `No ${activeTab} solutions available with current filters.`
                  }
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery('')}
                    className="bubo-btn-secondary"
                  >
                    Clear Search
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredArticles.map((article) => (
                  <TierGuard
                    key={article.id}
                    tier={article.tier}
                    user={user}
                    feature={`${article.tier.charAt(0).toUpperCase() + article.tier.slice(1)} tier solutions`}
                    showLock={!canAccessArticle(article)}
                  >
                    <Card 
                      className={`bubo-glass hover:bubo-glow-green transition-all duration-500 p-8 cursor-pointer group relative overflow-hidden ${
                        !canAccessArticle(article) ? 'opacity-60' : ''
                      } ${article.status === 'draft' ? 'bubo-animate-breathe opacity-70' : ''}
                      ${article.status === 'deprecated' ? 'opacity-50 border-crimson-danger/30' : ''}`}
                      onClick={() => canAccessArticle(article) && onNavigate('article-detail', { articleId: article.id })}
                    >
                      {/* Tier Lock Overlay */}
                      {!canAccessArticle(article) && (
                        <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-iq-neon-green/20 border-2 border-iq-neon-green flex items-center justify-center mx-auto mb-4 animate-pulse">
                              <Lock className="w-8 h-8 text-iq-neon-green" />
                            </div>
                            <h3 className="text-lg font-space-grotesk text-iq-neon-green mb-2">
                              {article.tier.charAt(0).toUpperCase() + article.tier.slice(1)} Tier Required
                            </h3>
                            <p className="text-mist-gray text-sm mb-4">Powerful solutions and automation</p>
                            <Button className="bubo-btn-neon-primary">
                              Upgrade Now
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Background Orb */}
                      <div className="absolute top-4 right-4 w-24 h-24 bg-iq-neon-green/10 rounded-full blur-xl group-hover:blur-lg transition-all duration-500" />
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <h3 className="text-xl font-space-grotesk text-pure-white mb-3 group-hover:text-iq-neon-green transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-mist-gray mb-4">{article.problemSignature}</p>
                            
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              {getConfidenceBadge(article.confidence, article.confidenceScore)}
                              <Badge className="bg-surface-dark/60 text-cloud-white border-slate-gray/30">
                                <Users className="w-3 h-3 mr-1" />
                                {article.builtFromIssues} issues
                              </Badge>
                              {article.automationReady && (
                                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Auto-ready
                                </Badge>
                              )}
                              {getTierBadge(article.tier)}
                            </div>
                          </div>
                          
                          {/* Confidence Orb */}
                          <div className={`w-16 h-16 rounded-full border-3 flex items-center justify-center bubo-animate-pulse-glow ${
                            article.confidence === 'high' ? 'border-iq-neon-green bg-iq-neon-green/20' :
                            article.confidence === 'medium' ? 'border-signal-yellow bg-signal-yellow/20' :
                            'border-crimson-danger bg-crimson-danger/20'
                          }`}>
                            <div className={`text-center ${
                              article.confidence === 'high' ? 'text-iq-neon-green' :
                              article.confidence === 'medium' ? 'text-signal-yellow' :
                              'text-crimson-danger'
                            }`}>
                              <div className="text-sm font-bold">{article.confidenceScore}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {article.tags.slice(0, 4).map((tag, index) => (
                            <Badge 
                              key={index} 
                              className="bg-electric-blue/10 text-electric-blue border-electric-blue/20 text-xs cursor-pointer hover:bg-electric-blue/20 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(tag);
                              }}
                            >
                              #{tag}
                            </Badge>
                          ))}
                          {article.tags.length > 4 && (
                            <Badge className="bg-mist-gray/10 text-mist-gray border-mist-gray/20 text-xs">
                              +{article.tags.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Embedded Fix Card */}
                        <FixCard
                          title={article.title}
                          medianTimeToFix={article.medianTimeToFix}
                          confidence={article.confidence}
                          tier={article.tier}
                          user={user}
                          compact={true}
                          onClick={() => canAccessArticle(article) && onNavigate('article-detail', { articleId: article.id })}
                        />

                        {/* Article Metadata */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-gray/20 text-sm">
                          <div className="flex items-center gap-4 text-mist-gray">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Last verified: {article.lastVerified.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {article.successRate}% success
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{article.medianTimeToFix}min
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            {article.os.slice(0, 2).map((os, index) => (
                              <Badge key={index} className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                                {os}
                              </Badge>
                            ))}
                            {article.os.length > 2 && (
                              <Badge className="bg-mist-gray/20 text-mist-gray border-mist-gray/30 text-xs">
                                +{article.os.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TierGuard>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};