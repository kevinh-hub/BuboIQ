import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, BookOpen, Eye, Clock, Zap, Target, TrendingUp, Users, CheckCircle, AlertTriangle, Edit } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArticleDetailView } from './ArticleDetailView';
import { ReviewerConsole } from './ReviewerConsole';
import { KnowledgeBaseMetrics } from './KnowledgeBaseMetrics';
import { KnowledgeBaseFlow } from './KnowledgeBaseFlow';
import { FeedbackModal } from './FeedbackModal';
import { sampleArticles, KnowledgeArticle } from './sampleArticles';

interface KnowledgeBaseDashboardProps {
  user: any;
  onNavigate: (page: string, options?: any) => void;
}

interface ConfidenceOrbProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const ConfidenceOrb: React.FC<ConfidenceOrbProps> = ({ confidence, size = 'md', animated = true }) => {
  const getOrbColor = (conf: number) => {
    if (conf >= 80) return 'text-iq-neon-green';
    if (conf >= 60) return 'text-signal-yellow';
    return 'text-crimson-danger';
  };

  const getGlowColor = (conf: number) => {
    if (conf >= 80) return 'shadow-[0_0_20px_rgba(0,255,133,0.4)]';
    if (conf >= 60) return 'shadow-[0_0_20px_rgba(255,212,0,0.4)]';
    return 'shadow-[0_0_20px_rgba(239,68,68,0.4)]';
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div 
        className={`
          ${sizeClasses[size]} rounded-full ${getOrbColor(confidence)} ${getGlowColor(confidence)}
          ${animated ? 'bubo-animate-breathe' : ''}
          border-2 border-current/30 bg-current/20 backdrop-blur-sm
          flex items-center justify-center
        `}
      >
        <div className={`w-2 h-2 rounded-full bg-current ${animated ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
};

export const KnowledgeBaseDashboard: React.FC<KnowledgeBaseDashboardProps> = ({ user, onNavigate }) => {
  const [currentView, setCurrentView] = useState<'main' | 'article' | 'reviewer' | 'metrics' | 'flow'>('main');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('published');
  const [showFeedback, setShowFeedback] = useState(false);

  // Filter articles based on search and filters
  const filteredArticles = sampleArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.problem.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         article.category.toLowerCase() === selectedFilter.toLowerCase();
    
    const matchesTab = activeTab === 'published' ? article.status === 'published' :
                      activeTab === 'draft' ? article.status === 'draft' :
                      article.status === 'deprecated';
    
    return matchesSearch && matchesFilter && matchesTab;
  });

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bubo-glass rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/10 to-iq-neon-green/10" />
        <div className="absolute top-4 right-4">
          <div className="flex space-x-2">
            <ConfidenceOrb confidence={87} size="lg" />
            <ConfidenceOrb confidence={73} size="md" />
            <ConfidenceOrb confidence={92} size="sm" />
          </div>
        </div>
        
        <div className="relative z-10">
          <h1 className="font-space-grotesk text-4xl font-bold text-pure-white mb-4">
            Smart Knowledge Base
          </h1>
          <p className="text-xl text-mist-gray mb-8 max-w-3xl">
            Your AI-powered solution library that learns from every problem solved. 
            Ask questions in plain English and get step-by-step fixes instantly.
          </p>
          
          {/* Large Cinematic Search Bar */}
          <div className="relative max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/20 to-iq-neon-green/20 rounded-2xl blur-xl" />
            <div className="relative flex items-center">
              <Search className="absolute left-6 w-6 h-6 text-mist-gray z-10" />
              <Input
                type="text"
                placeholder="Ask anything... like 'Fix Windows printing when jobs are stuck'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 pr-32 py-6 text-lg bg-surface-dark/80 border-prediction-purple/30 
                         focus:border-iq-neon-green/50 focus:shadow-[0_0_30px_rgba(0,255,133,0.2)]
                         rounded-2xl backdrop-blur-sm"
              />
              <Button className="absolute right-2 bubo-btn-neon-primary px-6 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentView('flow')}
            className="bubo-btn-secondary"
          >
            <Eye className="w-4 h-4 mr-2" />
            How It Works
          </Button>
          <Button 
            onClick={() => setCurrentView('metrics')}
            className="bubo-btn-secondary"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View Metrics
          </Button>
          <Button 
            onClick={() => setCurrentView('reviewer')}
            className="bubo-btn-secondary"
          >
            <Edit className="w-4 h-4 mr-2" />
            Review Console
          </Button>
        </div>
        
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-48 bubo-glass border-prediction-purple/30">
            <Filter className="w-4 h-4 mr-2 text-prediction-purple" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bubo-glass border-prediction-purple/30">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="email">Email Issues</SelectItem>
            <SelectItem value="hardware">Hardware Problems</SelectItem>
            <SelectItem value="network">Network Issues</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="software">Software Problems</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Article Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bubo-glass border-prediction-purple/20">
          <TabsTrigger value="published" className="data-[state=active]:bg-prediction-purple/20">
            <BookOpen className="w-4 h-4 mr-2" />
            Published Articles
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-signal-yellow/20">
            <Edit className="w-4 h-4 mr-2" />
            Draft Articles
          </TabsTrigger>
          <TabsTrigger value="deprecated" className="data-[state=active]:bg-mist-gray/20">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Deprecated
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id}
                className={`
                  bubo-glass p-6 cursor-pointer transition-all duration-300 hover:scale-105
                  border-prediction-purple/20 hover:border-prediction-purple/40
                  hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]
                  ${article.status === 'draft' ? 'opacity-75' : ''}
                  ${article.status === 'deprecated' ? 'opacity-50 grayscale' : ''}
                `}
                onClick={() => {
                  setSelectedArticle(article);
                  setCurrentView('article');
                }}
              >
                {/* Article Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ConfidenceOrb confidence={article.confidence} />
                    <div>
                      <h3 className="font-space-grotesk font-semibold text-pure-white">
                        {article.title}
                      </h3>
                      <p className="text-sm text-prediction-purple">
                        Built from {article.casesCount} solved issues
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={`
                      ${article.status === 'published' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' : ''}
                      ${article.status === 'draft' ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' : ''}
                      ${article.status === 'deprecated' ? 'bg-mist-gray/20 text-mist-gray border-mist-gray/30' : ''}
                    `}
                  >
                    {article.status}
                  </Badge>
                </div>

                {/* Problem Description */}
                <p className="text-mist-gray mb-4 line-clamp-2">
                  {article.problem}
                </p>

                {/* Article Metadata */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-cyan-accent">
                      <Clock className="w-4 h-4 mr-1" />
                      {article.estimatedTime}
                    </div>
                    <div className="flex items-center text-electric-blue">
                      <Target className="w-4 h-4 mr-1" />
                      {article.difficulty}
                    </div>
                  </div>
                  <div className="text-mist-gray">
                    Updated {article.lastVerified.toLocaleDateString()}
                  </div>
                </div>

                {/* Status Indicator */}
                {article.status === 'deprecated' && (
                  <div className="mt-3 flex items-center text-crimson-danger text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    No longer recommended
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-mist-gray mx-auto mb-4" />
              <h3 className="font-space-grotesk text-xl text-pure-white mb-2">
                No articles found
              </h3>
              <p className="text-mist-gray">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'article':
        return selectedArticle ? (
          <ArticleDetailView 
            article={selectedArticle}
            onBack={() => setCurrentView('main')}
            onFeedback={() => setShowFeedback(true)}
            user={user}
          />
        ) : null;
      case 'reviewer':
        return (
          <ReviewerConsole 
            onBack={() => setCurrentView('main')}
            user={user}
          />
        );
      case 'metrics':
        return (
          <KnowledgeBaseMetrics 
            onBack={() => setCurrentView('main')}
          />
        );
      case 'flow':
        return (
          <KnowledgeBaseFlow 
            onBack={() => setCurrentView('main')}
          />
        );
      default:
        return renderMainView();
    }
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-prediction-purple/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-iq-neon-green/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="bubo-circuit-pattern opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {renderCurrentView()}
      </div>

      {/* Feedback Modal */}
      {showFeedback && selectedArticle && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          articleId={selectedArticle.id}
          articleTitle={selectedArticle.title}
        />
      )}
    </div>
  );
};