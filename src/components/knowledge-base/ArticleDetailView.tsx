import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertTriangle, RotateCcw, Play, Eye, Edit, ThumbsUp, ThumbsDown, Target, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { KnowledgeArticle, StepItem } from './sampleArticles';

interface ArticleDetailViewProps {
  article: KnowledgeArticle;
  onBack: () => void;
  onFeedback: () => void;
  user: any;
}

interface StepCardProps {
  step: StepItem;
  stepNumber: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  showActions?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ 
  step, 
  stepNumber, 
  isCompleted, 
  onToggleComplete,
  showActions = true 
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-iq-neon-green border-iq-neon-green/30 bg-iq-neon-green/10';
      case 'Medium': return 'text-signal-yellow border-signal-yellow/30 bg-signal-yellow/10';
      case 'High': return 'text-crimson-danger border-crimson-danger/30 bg-crimson-danger/10';
      default: return 'text-mist-gray border-mist-gray/30 bg-mist-gray/10';
    }
  };

  return (
    <Card className={`
      bubo-glass p-6 transition-all duration-300
      border-prediction-purple/20 hover:border-prediction-purple/40
      ${isCompleted ? 'bg-iq-neon-green/5 border-iq-neon-green/30' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center font-bold
            ${isCompleted 
              ? 'bg-iq-neon-green text-dark-midnight' 
              : 'bg-prediction-purple/20 text-prediction-purple border border-prediction-purple/30'
            }
          `}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNumber}
          </div>
          <div>
            <h3 className="font-space-grotesk font-semibold text-pure-white">
              {step.title}
            </h3>
            <div className="flex items-center space-x-3 mt-1">
              <Badge className={`text-xs ${getRiskColor(step.riskLevel)}`}>
                {step.riskLevel} Risk
              </Badge>
              <div className="flex items-center text-xs text-cyan-accent">
                <Clock className="w-3 h-3 mr-1" />
                {step.estimatedTime}
              </div>
              {step.canRollback && (
                <div className="flex items-center text-xs text-electric-blue">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Can undo
                </div>
              )}
            </div>
          </div>
        </div>
        
        {showActions && (
          <Button
            onClick={onToggleComplete}
            className={
              isCompleted 
                ? "bubo-btn-secondary text-xs px-3 py-1" 
                : "bubo-btn-neon-primary text-xs px-3 py-1"
            }
          >
            {isCompleted ? 'Undo' : 'Done'}
          </Button>
        )}
      </div>

      <p className="text-mist-gray mb-4 leading-relaxed">
        {step.description}
      </p>

      {step.command && (
        <div className="bg-[#1C1C1E]/50 border border-electric-blue/20 rounded-xl p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-electric-blue rounded-full mr-2" />
            <span className="text-xs font-medium text-electric-blue">COMMAND</span>
          </div>
          <code className="font-jetbrains-mono text-sm text-cloud-white block">
            {step.command}
          </code>
        </div>
      )}

      {step.expectedResult && (
        <div className="bg-iq-neon-green/5 border border-iq-neon-green/20 rounded-xl p-4 mb-4">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 text-iq-neon-green mr-2" />
            <span className="text-xs font-medium text-iq-neon-green">EXPECTED RESULT</span>
          </div>
          <p className="text-sm text-cloud-white">
            {step.expectedResult}
          </p>
        </div>
      )}

      {step.rollbackInstructions && isCompleted && (
        <div className="bg-signal-yellow/5 border border-signal-yellow/20 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <RotateCcw className="w-4 h-4 text-signal-yellow mr-2" />
            <span className="text-xs font-medium text-signal-yellow">ROLLBACK INFO</span>
          </div>
          <p className="text-sm text-mist-gray">
            {step.rollbackInstructions}
          </p>
        </div>
      )}
    </Card>
  );
};

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ 
  article, 
  onBack, 
  onFeedback,
  user 
}) => {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('prechecks');

  const toggleStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getProgressForTab = (steps: StepItem[]) => {
    const completed = steps.filter(step => completedSteps.has(step.id)).length;
    return steps.length > 0 ? (completed / steps.length) * 100 : 0;
  };

  const getTotalProgress = () => {
    const allSteps = [...article.prechecks, ...article.fixSteps, ...article.verifySteps];
    return getProgressForTab(allSteps);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-iq-neon-green';
    if (confidence >= 60) return 'text-signal-yellow';
    return 'text-crimson-danger';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} className="bubo-btn-ghost">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>
        
        <div className="flex items-center space-x-3">
          {user?.role === 'admin' && (
            <>
              <Button className="bubo-btn-secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Article
              </Button>
              <Button className="bubo-btn-secondary">
                Publish
              </Button>
              <Button className="bubo-btn-ghost text-crimson-danger hover:text-crimson-danger">
                Deprecate
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Article Header */}
      <Card className="bubo-glass p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-prediction-purple/10 to-iq-neon-green/10" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="font-space-grotesk text-3xl font-bold text-pure-white mb-4">
                {article.title}
              </h1>
              <p className="text-xl text-mist-gray mb-6 leading-relaxed">
                {article.problem}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getConfidenceColor(article.confidence)} bg-current/20 border border-current animate-pulse`} />
                  <span className={`font-medium ${getConfidenceColor(article.confidence)}`}>
                    {article.confidence}% Confidence
                  </span>
                </div>
                <div className="flex items-center text-cyan-accent">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.estimatedTime}
                </div>
                <div className="flex items-center text-electric-blue">
                  <Target className="w-4 h-4 mr-1" />
                  {article.difficulty}
                </div>
                <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30">
                  Built from {article.casesCount} cases
                </Badge>
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-[#1C1C1E]"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - getTotalProgress() / 100)}`}
                    className="text-iq-neon-green transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-pure-white">
                    {Math.round(getTotalProgress())}%
                  </span>
                </div>
              </div>
              <span className="text-sm text-mist-gray mt-2">Complete</span>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-mist-gray">Overall Progress</span>
              <span className="text-pure-white">{Math.round(getTotalProgress())}% Complete</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Audit Info Sidebar */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Step Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bubo-glass border-prediction-purple/20">
              <TabsTrigger value="prechecks" className="data-[state=active]:bg-electric-blue/20">
                <Eye className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span>Prechecks</span>
                  <span className="text-xs opacity-75">
                    {Math.round(getProgressForTab(article.prechecks))}% done
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="fix" className="data-[state=active]:bg-iq-neon-green/20">
                <Zap className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span>Fix Steps</span>
                  <span className="text-xs opacity-75">
                    {Math.round(getProgressForTab(article.fixSteps))}% done
                  </span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="verify" className="data-[state=active]:bg-prediction-purple/20">
                <CheckCircle className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start">
                  <span>Verify</span>
                  <span className="text-xs opacity-75">
                    {Math.round(getProgressForTab(article.verifySteps))}% done
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prechecks" className="mt-6 space-y-4">
              <div className="mb-4">
                <h2 className="font-space-grotesk text-xl font-semibold text-pure-white mb-2">
                  Diagnostic Checks
                </h2>
                <p className="text-mist-gray">
                  Run these checks first to confirm the problem and gather information.
                </p>
              </div>
              {article.prechecks.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                  isCompleted={completedSteps.has(step.id)}
                  onToggleComplete={() => toggleStepComplete(step.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="fix" className="mt-6 space-y-4">
              <div className="mb-4">
                <h2 className="font-space-grotesk text-xl font-semibold text-pure-white mb-2">
                  Solution Steps
                </h2>
                <p className="text-mist-gray">
                  Follow these steps in order to fix the problem. Each step can be undone if needed.
                </p>
              </div>
              {article.fixSteps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                  isCompleted={completedSteps.has(step.id)}
                  onToggleComplete={() => toggleStepComplete(step.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="verify" className="mt-6 space-y-4">
              <div className="mb-4">
                <h2 className="font-space-grotesk text-xl font-semibold text-pure-white mb-2">
                  Verification Steps
                </h2>
                <p className="text-mist-gray">
                  Confirm that the problem is fully resolved and won't come back.
                </p>
              </div>
              {article.verifySteps.map((step, index) => (
                <StepCard
                  key={step.id}
                  step={step}
                  stepNumber={index + 1}
                  isCompleted={completedSteps.has(step.id)}
                  onToggleComplete={() => toggleStepComplete(step.id)}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Stats */}
          <Card className="bubo-glass p-6">
            <h3 className="font-space-grotesk font-semibold text-pure-white mb-4">
              Article Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-mist-gray">Success Rate</span>
                  <span className="text-iq-neon-green">{article.successRate}%</span>
                </div>
                <Progress value={article.successRate} className="h-2" />
              </div>
              
              <Separator />
              
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-mist-gray">Built from:</span>
                  <span className="text-pure-white">{article.casesCount} cases</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Last verified:</span>
                  <span className="text-pure-white">{article.lastVerified.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Risk level:</span>
                  <Badge className={`
                    ${article.riskLevel === 'Low' ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' : ''}
                    ${article.riskLevel === 'Medium' ? 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' : ''}
                    ${article.riskLevel === 'High' ? 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30' : ''}
                  `}>
                    {article.riskLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bubo-glass p-6">
            <h3 className="font-space-grotesk font-semibold text-pure-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button onClick={onFeedback} className="w-full bubo-btn-secondary">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Rate This Article
              </Button>
              <Button className="w-full bubo-btn-ghost">
                <Play className="w-4 h-4 mr-2" />
                Run Auto-Fix
                <Badge className="ml-2 bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs">
                  Pro
                </Badge>
              </Button>
            </div>
          </Card>

          {/* Tags */}
          <Card className="bubo-glass p-6">
            <h3 className="font-space-grotesk font-semibold text-pure-white mb-4">
              Related Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge 
                  key={tag}
                  className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 cursor-pointer hover:bg-prediction-purple/30"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Completion Actions */}
      {getTotalProgress() === 100 && (
        <Card className="bubo-glass p-6 border-iq-neon-green/30 bg-iq-neon-green/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-8 h-8 text-iq-neon-green" />
              <div>
                <h3 className="font-space-grotesk font-semibold text-pure-white">
                  Great work! You've completed all steps.
                </h3>
                <p className="text-mist-gray">
                  Help us improve by sharing how this solution worked for you.
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={onFeedback} className="bubo-btn-neon-primary">
                <ThumbsUp className="w-4 h-4 mr-2" />
                It Helped!
              </Button>
              <Button onClick={onFeedback} className="bubo-btn-ghost">
                <ThumbsDown className="w-4 h-4 mr-2" />
                Had Issues
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};