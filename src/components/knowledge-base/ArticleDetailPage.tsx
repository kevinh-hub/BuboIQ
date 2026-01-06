import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Shield, CheckCircle, AlertTriangle, RotateCcw, User, Calendar, ExternalLink, ThumbsUp, ThumbsDown, Edit, Eye, Trash2, FileText, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { TierGuard } from '../TierGuard';
import { FeedbackModal } from './FeedbackModal';

interface ArticleDetailPageProps {
  articleId: string;
  user: any;
  onBack: () => void;
  onNavigate: (page: string, options?: any) => void;
}

interface FixStep {
  id: string;
  type: 'precheck' | 'fix' | 'verify';
  title: string;
  description: string;
  commands?: string[];
  riskLevel: 'low' | 'medium' | 'high';
  estimatedTime: number;
  rollbackPlan?: string;
  automatable: boolean;
  successRate: number;
}

const mockArticle = {
  id: '1',
  title: 'Windows Update Service Not Starting',
  problemSignature: 'Windows Update Engine Failed to Initialize',
  confidence: 'high' as const,
  lastVerified: new Date('2024-09-20'),
  builtFromIssues: 47,
  status: 'published' as const,
  os: ['Windows 10', 'Windows 11'],
  vendor: 'Microsoft',
  deviceClass: 'Desktop',
  medianTimeToFix: 8,
  successRate: 94,
  tier: 'starter' as const,
  description: 'Resolves issues where Windows Update service fails to start, preventing system updates from installing properly.',
  evidenceSources: [
    'Ticket #1847: Windows Update stuck on "Checking for updates"',
    'Ticket #1923: Error 0x80070422 when starting Windows Update',
    'Ticket #2156: Windows Update service disabled unexpectedly'
  ],
  lastReviewedBy: 'Sarah Chen',
  lastReviewDate: new Date('2024-09-19'),
  steps: [
    {
      id: 'precheck-1',
      type: 'precheck' as const,
      title: 'Check Windows Update Service Status',
      description: 'Verify the current state of the Windows Update service and dependent services.',
      commands: ['Get-Service -Name wuauserv', 'Get-Service -Name BITS', 'Get-Service -Name cryptsvc'],
      riskLevel: 'low' as const,
      estimatedTime: 2,
      automatable: true,
      successRate: 100
    },
    {
      id: 'precheck-2',
      type: 'precheck' as const,
      title: 'Verify User Permissions',
      description: 'Ensure the current user has administrative privileges required for service management.',
      commands: ['whoami /priv | findstr SeServiceLogonRight'],
      riskLevel: 'low' as const,
      estimatedTime: 1,
      automatable: true,
      successRate: 100
    },
    {
      id: 'fix-1',
      type: 'fix' as const,
      title: 'Restart Windows Update Service',
      description: 'Stop and restart the Windows Update service and its dependencies in the correct order.',
      commands: [
        'net stop wuauserv',
        'net stop cryptSvc',
        'net stop bits',
        'net stop msiserver',
        'net start msiserver',
        'net start cryptSvc',
        'net start bits',
        'net start wuauserv'
      ],
      riskLevel: 'medium' as const,
      estimatedTime: 3,
      rollbackPlan: 'If services fail to start, reboot the system to restore default service states.',
      automatable: true,
      successRate: 87
    },
    {
      id: 'fix-2',
      type: 'fix' as const,
      title: 'Clear Windows Update Cache',
      description: 'Remove corrupted update cache files that may be preventing the service from functioning.',
      commands: [
        'ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old',
        'ren C:\\Windows\\System32\\catroot2 catroot2.old'
      ],
      riskLevel: 'medium' as const,
      estimatedTime: 2,
      rollbackPlan: 'Restore original folders: ren SoftwareDistribution.old SoftwareDistribution && ren catroot2.old catroot2',
      automatable: true,
      successRate: 92
    },
    {
      id: 'verify-1',
      type: 'verify' as const,
      title: 'Test Windows Update Functionality',
      description: 'Verify that Windows Update can successfully check for and download updates.',
      commands: ['UsoClient.exe StartInteractiveScan'],
      riskLevel: 'low' as const,
      estimatedTime: 5,
      automatable: false,
      successRate: 94
    }
  ] as FixStep[]
};

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articleId,
  user,
  onBack,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState('solution');
  const [showRollback, setShowRollback] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [executingStep, setExecutingStep] = useState<string | null>(null);

  const article = mockArticle; // In real app, fetch by articleId

  const canAccessFeature = (requiredTier: string) => {
    const tierLevels = { starter: 1, pro: 2, team: 3 };
    const userLevel = tierLevels[user?.tier || 'starter'];
    const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels];
    return userLevel >= requiredLevel;
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
      medium: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30',
      high: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
    };
    
    return (
      <Badge className={variants[risk as keyof typeof variants]}>
        {risk === 'low' && <CheckCircle className="w-3 h-3 mr-1" />}
        {risk === 'medium' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {risk === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
        {risk} risk
      </Badge>
    );
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'precheck': return <Shield className="w-5 h-5 text-electric-blue" />;
      case 'fix': return <Zap className="w-5 h-5 text-iq-neon-green" />;
      case 'verify': return <CheckCircle className="w-5 h-5 text-signal-yellow" />;
      default: return <FileText className="w-5 h-5 text-mist-gray" />;
    }
  };

  const handleExecuteStep = async (stepId: string) => {
    setExecutingStep(stepId);
    // Simulate execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExecutingStep(null);
    setShowFeedbackModal(true);
  };

  const formatTime = (minutes: number) => {
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            className="bubo-btn-ghost"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        <div className="bubo-glass rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="font-space-grotesk text-3xl text-pure-white mb-3">
                {article.title}
              </h1>
              <p className="text-mist-gray text-lg mb-4">{article.description}</p>
              <p className="text-sm text-mist-gray mb-4">
                <strong>Problem Pattern:</strong> {article.problemSignature}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <Badge className={`${
                article.confidence === 'high' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' :
                article.confidence === 'medium' ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' :
                'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
              }`}>
                {article.confidence} confidence
              </Badge>
              
              <div className="text-right text-sm text-mist-gray">
                <p>Success Rate: {article.successRate}%</p>
                <p>Median Time: {formatTime(article.medianTimeToFix)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-iq-neon-green mb-1">{article.builtFromIssues}</div>
              <div className="text-sm text-mist-gray">Issues Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-electric-blue mb-1">{article.successRate}%</div>
              <div className="text-sm text-mist-gray">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-signal-yellow mb-1">{formatTime(article.medianTimeToFix)}</div>
              <div className="text-sm text-mist-gray">Avg. Fix Time</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-gray/20">
            <div className="flex items-center gap-4 text-sm text-mist-gray">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Last reviewed by {article.lastReviewedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.lastReviewDate.toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {article.os.map((os, index) => (
                <Badge key={index} className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                  {os}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-dark/50 border border-slate-gray/30 rounded-xl p-1">
          <TabsTrigger 
            value="solution" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <Zap className="w-4 h-4 mr-2" />
            Solution Steps
          </TabsTrigger>
          <TabsTrigger 
            value="evidence" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <FileText className="w-4 h-4 mr-2" />
            Evidence Sources
          </TabsTrigger>
          <TabsTrigger 
            value="audit" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            <Eye className="w-4 h-4 mr-2" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solution" className="space-y-6">
          {/* Prechecks Section */}
          <div>
            <h2 className="text-xl font-semibold text-pure-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-electric-blue" />
              Pre-Flight Checks
            </h2>
            <div className="space-y-4">
              {article.steps.filter(step => step.type === 'precheck').map((step, index) => (
                <Card key={step.id} className="bubo-glass p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-electric-blue/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-electric-blue font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-pure-white mb-2">{step.title}</h3>
                          <p className="text-mist-gray">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(step.riskLevel)}
                          <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(step.estimatedTime)}
                          </Badge>
                        </div>
                      </div>

                      {step.commands && (
                        <div className="bg-dark-midnight/50 rounded-lg p-4 mb-4">
                          <p className="text-xs text-mist-gray mb-2 font-mono">Commands:</p>
                          {step.commands.map((command, idx) => (
                            <div key={idx} className="font-mono text-sm text-iq-neon-green mb-1">
                              {command}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <TierGuard tier="pro" user={user} feature="Automated Prechecks">
                          <Button
                            onClick={() => handleExecuteStep(step.id)}
                            disabled={executingStep === step.id || !canAccessFeature('pro')}
                            className="bubo-btn-secondary"
                          >
                            {executingStep === step.id ? (
                              <div className="w-4 h-4 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                              <Play className="w-4 h-4 mr-2" />
                            )}
                            {step.automatable ? 'Run Check' : 'Manual Check'}
                          </Button>
                        </TierGuard>
                        
                        <div className="text-sm text-mist-gray">
                          Success Rate: {step.successRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-gray/20" />

          {/* Fix Steps Section */}
          <div>
            <h2 className="text-xl font-semibold text-pure-white mb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-iq-neon-green" />
              Fix Steps
            </h2>
            <div className="space-y-4">
              {article.steps.filter(step => step.type === 'fix').map((step, index) => (
                <Card key={step.id} className="bubo-glass p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-iq-neon-green/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-iq-neon-green font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-pure-white mb-2">{step.title}</h3>
                          <p className="text-mist-gray">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(step.riskLevel)}
                          <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(step.estimatedTime)}
                          </Badge>
                        </div>
                      </div>

                      {step.commands && (
                        <div className="bg-dark-midnight/50 rounded-lg p-4 mb-4">
                          <p className="text-xs text-mist-gray mb-2 font-mono">Commands:</p>
                          {step.commands.map((command, idx) => (
                            <div key={idx} className="font-mono text-sm text-iq-neon-green mb-1">
                              {command}
                            </div>
                          ))}
                        </div>
                      )}

                      {step.rollbackPlan && (
                        <div className="mb-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRollback(showRollback === step.id ? null : step.id)}
                            className="text-signal-yellow hover:text-signal-yellow/80"
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {showRollback === step.id ? 'Hide' : 'Show'} Rollback Plan
                          </Button>
                          
                          {showRollback === step.id && (
                            <div className="mt-2 p-3 bg-signal-yellow/10 border border-signal-yellow/30 rounded-lg">
                              <p className="text-sm text-signal-yellow">{step.rollbackPlan}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleExecuteStep(step.id)}
                          disabled={executingStep === step.id}
                          className="bubo-btn-secondary"
                        >
                          {executingStep === step.id ? (
                            <div className="w-4 h-4 border-2 border-iq-neon-green border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          Execute Step
                        </Button>
                        
                        <TierGuard tier="team" user={user} feature="Automated Fix Execution">
                          <Button
                            onClick={() => handleExecuteStep(step.id)}
                            disabled={executingStep === step.id || !canAccessFeature('team')}
                            className="bubo-btn-neon-primary"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Auto-Execute
                          </Button>
                        </TierGuard>
                        
                        <div className="text-sm text-mist-gray">
                          Success Rate: {step.successRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-slate-gray/20" />

          {/* Verification Section */}
          <div>
            <h2 className="text-xl font-semibold text-pure-white mb-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-signal-yellow" />
              Verification Steps
            </h2>
            <div className="space-y-4">
              {article.steps.filter(step => step.type === 'verify').map((step, index) => (
                <Card key={step.id} className="bubo-glass p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-signal-yellow/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-signal-yellow font-bold text-sm">{index + 1}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-medium text-pure-white mb-2">{step.title}</h3>
                          <p className="text-mist-gray">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRiskBadge(step.riskLevel)}
                          <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(step.estimatedTime)}
                          </Badge>
                        </div>
                      </div>

                      {step.commands && (
                        <div className="bg-dark-midnight/50 rounded-lg p-4 mb-4">
                          <p className="text-xs text-mist-gray mb-2 font-mono">Commands:</p>
                          {step.commands.map((command, idx) => (
                            <div key={idx} className="font-mono text-sm text-iq-neon-green mb-1">
                              {command}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => handleExecuteStep(step.id)}
                          disabled={executingStep === step.id}
                          className="bubo-btn-secondary"
                        >
                          {executingStep === step.id ? (
                            <div className="w-4 h-4 border-2 border-signal-yellow border-t-transparent rounded-full animate-spin mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {step.automatable ? 'Run Verification' : 'Manual Verification'}
                        </Button>
                        
                        <div className="text-sm text-mist-gray">
                          Success Rate: {step.successRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-4">
          <Card className="bubo-glass p-6">
            <h3 className="text-lg font-semibold text-pure-white mb-4">Evidence Sources</h3>
            <div className="space-y-3">
              {article.evidenceSources.map((source, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-dark/50 rounded-lg">
                  <FileText className="w-4 h-4 text-iq-neon-green" />
                  <span className="text-pure-white">{source}</span>
                  <Button size="sm" variant="ghost" className="ml-auto">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card className="bubo-glass p-6">
            <h3 className="text-lg font-semibold text-pure-white mb-4">Audit Trail</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-dark/50 rounded-lg">
                <div>
                  <p className="text-pure-white">Article published</p>
                  <p className="text-sm text-mist-gray">by {article.lastReviewedBy}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-mist-gray">{article.lastReviewDate.toLocaleDateString()}</p>
                  <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                    Published
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        articleTitle={article.title}
        stepExecuted="Example fix step"
      />
    </div>
  );
};