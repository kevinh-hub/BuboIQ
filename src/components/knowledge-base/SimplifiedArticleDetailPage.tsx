import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle, ThumbsUp, ThumbsDown, User, Calendar, Star, AlertTriangle, Copy, Check, PlayCircle, Share } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';

interface SimplifiedArticleDetailPageProps {
  articleId: string;
  user: any;
  onBack: () => void;
  onNavigate: (page: string, options?: any) => void;
}

interface Solution {
  id: string;
  title: string;
  problem: string;
  solution: string;
  category: string;
  tags: string[];
  rating: number;
  helpfulCount: number;
  lastUpdated: Date;
  author: string;
  difficulty: 'Easy' | 'Medium' | 'Expert';
  estimatedTime: string;
  isPopular: boolean;
  steps: string[];
  additionalTips?: string[];
  warnings?: string[];
}

// Sample article data - in a real app, this would come from an API
const mockSolution: Solution = {
  id: '1',
  title: 'Computer running slowly after Windows update',
  problem: 'Computer is much slower than usual, especially when starting up or opening programs. This often happens right after a Windows update installs.',
  solution: 'This is usually caused by the update changing system settings or requiring a restart to complete installation properly.',
  category: 'Performance',
  tags: ['Windows', 'Slow', 'Update', 'Performance'],
  rating: 4.8,
  helpfulCount: 42,
  lastUpdated: new Date('2024-09-20'),
  author: 'IT Support Team',
  difficulty: 'Easy',
  estimatedTime: '10-15 minutes',
  isPopular: true,
  steps: [
    'Restart your computer and wait for it to fully boot up',
    'Check for additional Windows updates: Go to Settings > Update & Security > Windows Update > Check for updates',
    'If updates are available, install them and restart again',
    'Open Task Manager (Ctrl+Shift+Esc) and check the "Startup" tab - disable any programs you don\'t need at startup',
    'Run Disk Cleanup: Type "Disk Cleanup" in the Start menu, select your C: drive, check all boxes, and click OK',
    'If still slow, check Device Manager for any devices with yellow warning signs (right-click "This PC" > Properties > Device Manager)'
  ],
  additionalTips: [
    'If you have an older computer (3+ years), consider upgrading to an SSD if you\'re still using a traditional hard drive',
    'Make sure you have at least 15-20% free space on your C: drive for optimal performance',
    'Consider running Windows built-in troubleshooter: Settings > Update & Security > Troubleshoot > Additional troubleshooters > Windows Update'
  ],
  warnings: [
    'Don\'t disable Windows Update entirely - this leaves your computer vulnerable to security issues',
    'Be careful when disabling startup programs - only disable ones you recognize'
  ]
};

export const SimplifiedArticleDetailPage: React.FC<SimplifiedArticleDetailPageProps> = ({ 
  articleId, 
  user, 
  onBack, 
  onNavigate 
}) => {
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  // In a real app, fetch the article data based on articleId
  const article = mockSolution;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'Medium': return 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30';
      case 'Expert': return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    if (completedSteps.has(stepIndex)) {
      newCompleted.delete(stepIndex);
    } else {
      newCompleted.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const handleCopyStep = (step: string, stepIndex: number) => {
    navigator.clipboard.writeText(step);
    setCopiedStep(stepIndex);
    toast.success('Step copied to clipboard');
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleVoteHelpful = (helpful: boolean) => {
    if (hasVoted) return;
    setHasVoted(true);
    // In a real app, send this to the backend
    toast.success(helpful ? 'Thanks!' : 'Thanks - we\'ll make it better');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const progressPercentage = (completedSteps.size / article.steps.length) * 100;

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-mist-gray hover:text-pure-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge
          </Button>
          
          <div className="flex-1" />
          
          <Button
            variant="ghost"
            onClick={handleShare}
            className="text-mist-gray hover:text-pure-white"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Article Header */}
        <Card className="bubo-glass-bright p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="font-space-grotesk text-3xl text-pure-white leading-tight">
                  {article.title}
                </h1>
                {article.isPopular && (
                  <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Popular
                  </Badge>
                )}
              </div>
              
              <p className="text-mist-gray text-lg leading-relaxed mb-6">
                {article.problem}
              </p>
              
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={getDifficultyColor(article.difficulty)}>
                  {article.difficulty}
                </Badge>
                <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-1 text-signal-yellow">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{article.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-mist-gray">
                  <Clock className="w-4 h-4" />
                  <span>{article.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-iq-neon-green/10 rounded-xl p-4 border border-iq-neon-green/30">
            <h3 className="text-pure-white font-medium mb-2">Quick Summary:</h3>
            <p className="text-cloud-white leading-relaxed">{article.solution}</p>
          </div>
        </Card>

        {/* Progress Tracker */}
        {completedSteps.size > 0 && (
          <Card className="bubo-glass p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-pure-white font-medium">Your Progress</h3>
              <span className="text-iq-neon-green font-medium">
                {completedSteps.size} of {article.steps.length} steps completed
              </span>
            </div>
            <div className="w-full bg-surface-dark/50 rounded-full h-2">
              <div 
                className="bg-iq-neon-green h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </Card>
        )}

        {/* Step-by-Step Solution */}
        <Card className="bubo-glass p-8 mb-6">
          <h2 className="font-space-grotesk text-2xl text-pure-white mb-6">
            Step-by-Step Solution
          </h2>
          
          <div className="space-y-4">
            {article.steps.map((step, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 ${
                  completedSteps.has(index) 
                    ? 'bg-iq-neon-green/10 border-iq-neon-green/30' 
                    : 'bg-surface-dark/30 border-slate-gray/30 hover:border-slate-gray/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleStepComplete(index)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        completedSteps.has(index)
                          ? 'bg-iq-neon-green border-iq-neon-green text-dark-midnight'
                          : 'border-slate-gray hover:border-iq-neon-green'
                      }`}
                    >
                      {completedSteps.has(index) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className={`leading-relaxed transition-colors ${
                        completedSteps.has(index) ? 'text-pure-white' : 'text-cloud-white'
                      }`}>
                        {step}
                      </p>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyStep(step, index)}
                        className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedStep === index ? (
                          <Check className="w-4 h-4 text-iq-neon-green" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Tips */}
        {article.additionalTips && article.additionalTips.length > 0 && (
          <Card className="bubo-glass p-6 mb-6">
            <h3 className="text-pure-white font-medium mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-iq-neon-green" />
              Additional Tips
            </h3>
            <div className="space-y-3">
              {article.additionalTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full mt-2 flex-shrink-0" />
                  <p className="text-cloud-white leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Warnings */}
        {article.warnings && article.warnings.length > 0 && (
          <Card className="bubo-glass p-6 mb-6 border-signal-yellow/30">
            <h3 className="text-pure-white font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-signal-yellow" />
              Important Warnings
            </h3>
            <div className="space-y-3">
              {article.warnings.map((warning, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-signal-yellow mt-1 flex-shrink-0" />
                  <p className="text-cloud-white leading-relaxed">{warning}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Feedback Section */}
        <Card className="bubo-glass p-6">
          <h3 className="text-pure-white font-medium mb-4">Was this helpful?</h3>
          
          {!hasVoted ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => handleVoteHelpful(true)}
                className="bubo-btn-neon-primary flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Yes, this helped
              </Button>
              <Button
                onClick={() => handleVoteHelpful(false)}
                className="bubo-btn-secondary flex items-center gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Needs improvement
              </Button>
            </div>
          ) : (
            <div className="text-iq-neon-green font-medium">
              Thank you for your feedback!
            </div>
          )}
          
          <Separator className="my-6 bg-slate-gray/30" />
          
          <div className="flex items-center justify-between text-sm text-mist-gray">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {article.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-iq-neon-green">
              {article.helpfulCount} people found this helpful
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};