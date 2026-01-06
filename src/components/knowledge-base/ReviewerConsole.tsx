import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Edit, CheckCircle, AlertTriangle, Clock, Trash2, Filter, Search, Users, FileText, Zap, Shield, Target, Sliders } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { TierGuard } from '../TierGuard';

interface ReviewerConsoleProps {
  user: any;
  onBack: () => void;
  onNavigate: (page: string, options?: any) => void;
}

interface DraftArticle {
  id: string;
  title: string;
  problemSignature: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  confidence: number;
  evidenceCount: number;
  createdDate: Date;
  lastModified: Date;
  reviewer?: string;
  builtFromIssues: number;
  automationRecommendation: 'low' | 'medium' | 'high';
  riskAssessment: 'low' | 'medium' | 'high';
  priority: 'low' | 'normal' | 'high' | 'critical';
}

const mockDrafts: DraftArticle[] = [
  {
    id: 'draft-1',
    title: 'Outlook Email Sync Issues Resolution',
    problemSignature: 'Exchange Sync Failure Pattern',
    status: 'review',
    confidence: 87,
    evidenceCount: 23,
    createdDate: new Date('2024-09-22'),
    lastModified: new Date('2024-09-23'),
    builtFromIssues: 23,
    automationRecommendation: 'high',
    riskAssessment: 'medium',
    priority: 'high'
  },
  {
    id: 'draft-2',
    title: 'VPN Connection Timeout Fix',
    problemSignature: 'VPN Authentication Timeout',
    status: 'draft',
    confidence: 72,
    evidenceCount: 15,
    createdDate: new Date('2024-09-21'),
    lastModified: new Date('2024-09-22'),
    builtFromIssues: 15,
    automationRecommendation: 'medium',
    riskAssessment: 'low',
    priority: 'normal'
  },
  {
    id: 'draft-3',
    title: 'Adobe Creative Suite Licensing Error',
    problemSignature: 'Adobe License Server Communication Error',
    status: 'approved',
    confidence: 94,
    evidenceCount: 31,
    createdDate: new Date('2024-09-20'),
    lastModified: new Date('2024-09-23'),
    reviewer: 'Sarah Chen',
    builtFromIssues: 31,
    automationRecommendation: 'high',
    riskAssessment: 'low',
    priority: 'critical'
  },
  {
    id: 'draft-4',
    title: 'Windows Defender Real-time Protection Disabled',
    problemSignature: 'Windows Defender Service Registration Failure',
    status: 'rejected',
    confidence: 45,
    evidenceCount: 8,
    createdDate: new Date('2024-09-19'),
    lastModified: new Date('2024-09-22'),
    reviewer: 'Mike Rodriguez',
    builtFromIssues: 8,
    automationRecommendation: 'low',
    riskAssessment: 'high',
    priority: 'low'
  }
];

export const ReviewerConsole: React.FC<ReviewerConsoleProps> = ({
  user,
  onBack,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState([70]);
  const [filteredDrafts, setFilteredDrafts] = useState<DraftArticle[]>(mockDrafts);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [showDiffView, setShowDiffView] = useState<string | null>(null);

  useEffect(() => {
    let filtered = mockDrafts.filter(draft => {
      const matchesSearch = searchQuery === '' || 
        draft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        draft.problemSignature.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || draft.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || draft.priority === priorityFilter;
      const matchesConfidence = draft.confidence >= confidenceThreshold[0];
      
      return matchesSearch && matchesStatus && matchesPriority && matchesConfidence;
    });

    // Sort by priority and confidence
    filtered.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });

    setFilteredDrafts(filtered);
  }, [searchQuery, statusFilter, priorityFilter, confidenceThreshold]);

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-slate-gray/20 text-cloud-white border-slate-gray/30',
      review: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30',
      approved: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
      rejected: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
    };
    
    const icons = {
      draft: <FileText className="w-3 h-3 mr-1" />,
      review: <Eye className="w-3 h-3 mr-1" />,
      approved: <CheckCircle className="w-3 h-3 mr-1" />,
      rejected: <AlertTriangle className="w-3 h-3 mr-1" />
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30',
      high: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
      normal: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
      low: 'bg-mist-gray/20 text-mist-gray border-mist-gray/30'
    };
    
    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {priority}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-iq-neon-green';
    if (confidence >= 70) return 'text-signal-yellow';
    return 'text-crimson-danger';
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for drafts:`, selectedDrafts);
    setSelectedDrafts([]);
  };

  const handleToggleSelection = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId) 
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };

  const canAccessFeature = (requiredTier: string) => {
    const tierLevels = { starter: 1, pro: 2, team: 3 };
    const userLevel = tierLevels[user?.tier || 'starter'];
    const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels];
    return userLevel >= requiredLevel;
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} className="bubo-btn-ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-2xl text-pure-white mb-1">
                Reviewer Console
              </h1>
              <p className="text-mist-gray">Review and manage draft knowledge articles</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              {filteredDrafts.length} articles
            </Badge>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bubo-glass p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1C1C1E]/50 border-slate-gray/30"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#1C1C1E]/50 border-slate-gray/30">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="bg-[#1C1C1E]/50 border-slate-gray/30">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-mist-gray" />
            <span className="text-sm text-mist-gray">Min Confidence:</span>
            <div className="flex-1">
              <Slider
                value={confidenceThreshold}
                onValueChange={setConfidenceThreshold}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
            <span className="text-sm text-iq-neon-green font-mono w-8">
              {confidenceThreshold[0]}%
            </span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedDrafts.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-lg">
            <span className="text-iq-neon-green font-medium">
              {selectedDrafts.length} articles selected
            </span>
            
            <div className="flex items-center gap-2 ml-auto">
              <TierGuard tier="pro" user={user} feature="Bulk Article Actions">
                <Button
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  className="bubo-btn-neon-primary"
                  disabled={!canAccessFeature('pro')}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve All
                </Button>
              </TierGuard>
              
              <Button
                size="sm"
                onClick={() => handleBulkAction('reject')}
                className="bubo-btn-secondary"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Reject All
              </Button>
              
              <Button
                size="sm"
                onClick={() => setSelectedDrafts([])}
                className="bubo-btn-ghost"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Articles Table */}
      <Card className="bubo-glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-gray/20 hover:bg-surface-dark/30">
              <TableHead className="w-8">
                <input
                  type="checkbox"
                  checked={selectedDrafts.length === filteredDrafts.length && filteredDrafts.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDrafts(filteredDrafts.map(d => d.id));
                    } else {
                      setSelectedDrafts([]);
                    }
                  }}
                  className="w-4 h-4 rounded border-slate-gray/30 bg-surface-dark/50"
                />
              </TableHead>
              <TableHead className="text-pure-white">Article</TableHead>
              <TableHead className="text-pure-white">Status</TableHead>
              <TableHead className="text-pure-white">Priority</TableHead>
              <TableHead className="text-pure-white">Confidence</TableHead>
              <TableHead className="text-pure-white">Evidence</TableHead>
              <TableHead className="text-pure-white">Modified</TableHead>
              <TableHead className="text-pure-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrafts.map((draft) => (
              <TableRow key={draft.id} className="border-slate-gray/20 hover:bg-surface-dark/30">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedDrafts.includes(draft.id)}
                    onChange={() => handleToggleSelection(draft.id)}
                    className="w-4 h-4 rounded border-slate-gray/30 bg-surface-dark/50"
                  />
                </TableCell>
                
                <TableCell>
                  <div>
                    <h4 className="font-medium text-pure-white mb-1">{draft.title}</h4>
                    <p className="text-sm text-mist-gray">{draft.problemSignature}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {draft.builtFromIssues} issues
                      </Badge>
                      {draft.automationRecommendation === 'high' && (
                        <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-ready
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(draft.status)}
                </TableCell>
                
                <TableCell>
                  {getPriorityBadge(draft.priority)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`text-lg font-bold ${getConfidenceColor(draft.confidence)}`}>
                      {draft.confidence}%
                    </div>
                    <div className="w-16 h-2 bg-[#1C1C1E] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          draft.confidence >= 90 ? 'bg-iq-neon-green' :
                          draft.confidence >= 70 ? 'bg-signal-yellow' :
                          'bg-crimson-danger'
                        }`}
                        style={{ width: `${draft.confidence}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-center">
                    <div className="text-lg font-bold text-pure-white">{draft.evidenceCount}</div>
                    <div className="text-xs text-mist-gray">sources</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div className="text-pure-white">{draft.lastModified.toLocaleDateString()}</div>
                    <div className="text-mist-gray">{draft.reviewer || 'System'}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      onClick={() => onNavigate('article-detail', { articleId: draft.id })}
                      className="bubo-btn-ghost text-xs px-2"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => setShowDiffView(draft.id)}
                      className="bubo-btn-secondary text-xs px-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    
                    <TierGuard tier="pro" user={user} feature="Article Management">
                      <Button
                        size="sm"
                        disabled={!canAccessFeature('pro')}
                        className="bubo-btn-neon-primary text-xs px-2"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    </TierGuard>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDrafts.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-mist-gray/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-mist-gray" />
            </div>
            <h3 className="text-xl text-pure-white mb-2">No articles found</h3>
            <p className="text-mist-gray">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ?
                'Try adjusting your filters to see more results.' :
                'No draft articles available for review.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};