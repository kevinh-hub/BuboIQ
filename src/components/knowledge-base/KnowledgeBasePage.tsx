import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertTriangle, Users, Brain, Zap, BarChart3, Settings, Plus, Eye, Lock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TierGuard } from '../TierGuard';
import { FixCard } from './FixCard';
import { KnowledgeBaseMetrics } from './KnowledgeBaseMetrics';

interface KnowledgeBasePageProps {
  user: any;
  onNavigate: (page: string, options?: any) => void;
}

interface Article {
  id: string;
  title: string;
  problemSignature: string;
  confidence: 'high' | 'medium' | 'low';
  lastVerified: Date;
  builtFromIssues: number;
  status: 'draft' | 'published' | 'deprecated';
  os: string[];
  vendor: string;
  deviceClass: string;
  medianTimeToFix: number;
  successRate: number;
  tier: 'starter' | 'pro' | 'team';
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Windows Update Service Not Starting',
    problemSignature: 'Windows Update Engine Failed to Initialize',
    confidence: 'high',
    lastVerified: new Date('2024-09-20'),
    builtFromIssues: 47,
    status: 'published',
    os: ['Windows 10', 'Windows 11'],
    vendor: 'Microsoft',
    deviceClass: 'Desktop',
    medianTimeToFix: 8,
    successRate: 94,
    tier: 'starter'
  },
  {
    id: '2',
    title: 'Network Printer Connection Issues',
    problemSignature: 'Print Spooler Service Hang Pattern',
    confidence: 'medium',
    lastVerified: new Date('2024-09-18'),
    builtFromIssues: 23,
    status: 'published',
    os: ['Windows 10', 'Windows 11'],
    vendor: 'Various',
    deviceClass: 'Printer',
    medianTimeToFix: 15,
    successRate: 87,
    tier: 'pro'
  },
  {
    id: '3',
    title: 'Chrome Browser Memory Leak Resolution',
    problemSignature: 'Chrome Process Memory Growth Pattern',
    confidence: 'high',
    lastVerified: new Date('2024-09-22'),
    builtFromIssues: 89,
    status: 'published',
    os: ['Windows 10', 'Windows 11', 'macOS'],
    vendor: 'Google',
    deviceClass: 'Application',
    medianTimeToFix: 3,
    successRate: 96,
    tier: 'starter'
  },
  {
    id: '4',
    title: 'Expert Domain Controller Sync Fix',
    problemSignature: 'Active Directory Replication Failure',
    confidence: 'medium',
    lastVerified: new Date('2024-09-15'),
    builtFromIssues: 12,
    status: 'draft',
    os: ['Windows Server'],
    vendor: 'Microsoft',
    deviceClass: 'Server',
    medianTimeToFix: 45,
    successRate: 91,
    tier: 'team'
  }
];

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('published');
  const [osFilter, setOsFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [showMetrics, setShowMetrics] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    let filtered = mockArticles.filter(article => {
      const matchesTab = activeTab === 'all' || article.status === activeTab;
      const matchesSearch = searchQuery === '' || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.problemSignature.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOS = osFilter === 'all' || article.os.some(os => os.includes(osFilter));
      const matchesVendor = vendorFilter === 'all' || article.vendor.toLowerCase().includes(vendorFilter.toLowerCase());
      
      return matchesTab && matchesSearch && matchesOS && matchesVendor;
    });

    // Sort by confidence and last verified
    filtered.sort((a, b) => {
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      if (confidenceOrder[a.confidence] !== confidenceOrder[b.confidence]) {
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
      }
      return b.lastVerified.getTime() - a.lastVerified.getTime();
    });

    setFilteredArticles(filtered);
  }, [searchQuery, activeTab, osFilter, vendorFilter]);

  const getConfidenceBadge = (confidence: string, className?: string) => {
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
        {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const variants = {
      starter: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
      pro: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
      team: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30'
    };
    
    return (
      <Badge className={`${variants[tier as keyof typeof variants]} text-xs`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const canAccessArticle = (article: Article) => {
    const userTierLevel = { starter: 1, pro: 2, team: 3 }[user?.tier || 'starter'];
    const articleTierLevel = { starter: 1, pro: 2, team: 3 }[article.tier];
    return userTierLevel >= articleTierLevel;
  };

  if (showMetrics) {
    return <KnowledgeBaseMetrics user={user} onBack={() => setShowMetrics(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-2xl text-pure-white mb-1">
                <span className="text-pure-white">BUBO</span>
                <span className="text-iq-neon-green">IQ</span> Knowledge Base
              </h1>
              <p className="text-mist-gray">Auto-building fixes from solved issues</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowMetrics(true)}
              className="bubo-btn-secondary flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            
            <TierGuard 
              tier="pro" 
              user={user}
              feature="Knowledge Base Management"
            >
              <Button
                onClick={() => onNavigate('reviewer-console')}
                className="bubo-btn-primary flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Reviewer Console
              </Button>
            </TierGuard>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative mb-6">
          <div className={`relative transition-all duration-300 ${searchFocused ? 'bubo-glow-green' : ''}`}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mist-gray" />
            <Input
              placeholder="Search solutions by problem, symptoms, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-12 pr-4 py-4 bg-surface-dark/80 border-slate-gray/50 text-pure-white placeholder-mist-gray rounded-xl backdrop-blur-sm focus:border-iq-neon-green/50 transition-all duration-300"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  {filteredArticles.length} found
                </Badge>
              </div>
            )}
          </div>
          
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 bg-surface-dark/95 backdrop-blur-sm border border-slate-gray/30 rounded-xl mt-2 p-4 z-10">
              <p className="text-mist-gray text-sm">
                💡 <strong>Search includes:</strong> Problem descriptions, symptoms, software names, error messages, and solution steps
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-mist-gray" />
            <span className="text-mist-gray text-sm">Filters:</span>
          </div>
          
          <Select value={osFilter} onValueChange={setOsFilter}>
            <SelectTrigger className="w-40 bg-surface-dark/50 border-slate-gray/30">
              <SelectValue placeholder="Operating System" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="Windows 10">Windows 10</SelectItem>
              <SelectItem value="Windows 11">Windows 11</SelectItem>
              <SelectItem value="macOS">macOS</SelectItem>
              <SelectItem value="Server">Windows Server</SelectItem>
            </SelectContent>
          </Select>

          <Select value={vendorFilter} onValueChange={setVendorFilter}>
            <SelectTrigger className="w-40 bg-surface-dark/50 border-slate-gray/30">
              <SelectValue placeholder="Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vendors</SelectItem>
              <SelectItem value="Microsoft">Microsoft</SelectItem>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Adobe">Adobe</SelectItem>
              <SelectItem value="Various">Various</SelectItem>
            </SelectContent>
          </Select>

          {(osFilter !== 'all' || vendorFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOsFilter('all');
                setVendorFilter('all');
              }}
              className="text-mist-gray hover:text-pure-white"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-dark/50 border border-slate-gray/30 rounded-xl p-1">
          <TabsTrigger 
            value="published" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Published Solutions
          </TabsTrigger>
          <TabsTrigger 
            value="draft" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <Clock className="w-4 h-4 mr-2" />
            In Review
          </TabsTrigger>
          <TabsTrigger 
            value="deprecated" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Outdated
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card className="bubo-glass p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-mist-gray/20 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-mist-gray" />
              </div>
              <h3 className="text-xl text-pure-white mb-2">No solutions found</h3>
              <p className="text-mist-gray mb-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <TierGuard
                  key={article.id}
                  tier={article.tier}
                  user={user}
                  feature={`${article.tier.charAt(0).toUpperCase() + article.tier.slice(1)} tier solutions`}
                  showLock={!canAccessArticle(article)}
                >
                  <Card 
                    className={`bubo-glass hover:bubo-glow-green transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                      !canAccessArticle(article) ? 'opacity-60' : ''
                    }`}
                    onClick={() => canAccessArticle(article) && onNavigate('article-detail', { articleId: article.id })}
                  >
                    {!canAccessArticle(article) && (
                      <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-iq-neon-green mx-auto mb-2 animate-pulse" />
                          <p className="text-iq-neon-green font-medium">
                            {article.tier.charAt(0).toUpperCase() + article.tier.slice(1)} Tier Required
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-pure-white mb-2 group-hover:text-iq-neon-green transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-mist-gray text-sm mb-3">{article.problemSignature}</p>
                        </div>
                        {getTierBadge(article.tier)}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {getConfidenceBadge(article.confidence)}
                        <Badge className="bg-surface-dark/50 text-cloud-white border-slate-gray/30">
                          <Users className="w-3 h-3 mr-1" />
                          {article.builtFromIssues} issues
                        </Badge>
                      </div>

                      <FixCard
                        title={article.title}
                        medianTimeToFix={article.medianTimeToFix}
                        confidence={article.confidence}
                        tier={article.tier}
                        user={user}
                        compact={true}
                        onClick={() => canAccessArticle(article) && onNavigate('article-detail', { articleId: article.id })}
                      />

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-gray/20">
                        <div className="flex items-center gap-4 text-sm text-mist-gray">
                          <span>Last verified: {article.lastVerified.toLocaleDateString()}</span>
                          <span>{article.successRate}% success rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {article.os.map((os, index) => (
                            <Badge key={index} className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                              {os}
                            </Badge>
                          ))}
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
  );
};