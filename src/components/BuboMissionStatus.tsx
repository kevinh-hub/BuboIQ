import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  Zap, 
  ArrowRight, 
  Crown, 
  Brain, 
  Target,
  TrendingUp,
  Sparkles,
  Award,
  Eye
} from 'lucide-react';

export default function BuboMissionStatus() {
  const { trialInfo, setShowUpgradeModal, setCurrentPage, user } = useApp();
  const [missionProgress, setMissionProgress] = useState(73);
  const [roiValue, setRoiValue] = useState(12400);
  const [insightsGenerated, setInsightsGenerated] = useState(28);

  // Simulate mission progress
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionProgress(prev => Math.min(100, prev + Math.random() * 1.5));
      setRoiValue(prev => prev + Math.random() * 200);
      setInsightsGenerated(prev => prev + (Math.random() > 0.85 ? 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!trialInfo.isActive || trialInfo.plan !== 'trial') {
    return null;
  }

  const daysLeft = trialInfo.daysRemaining;
  const isUrgent = daysLeft <= 3;
  const missionComplete = missionProgress >= 95;
  const trialProgress = ((14 - daysLeft) / 14) * 100;

  return (
    <div className="bubo-prediction-card p-6 relative overflow-hidden">
      {/* Mission Complete Particle Effect */}
      {missionComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 300, 
                y: 200,
                opacity: 0 
              }}
              animate={{ 
                y: -20, 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 3, 
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
              className="absolute w-1 h-1 bg-iq-green rounded-full"
            />
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 bg-gradient-to-br from-iq-green to-glow-cyan rounded-xl flex items-center justify-center shadow-lg"
            >
              <Eye className="h-5 w-5 text-nocturne-indigo" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-cloud-white flex items-center gap-2">
                BuboIQ Mission
                {missionComplete ? (
                  <Badge className="bg-iq-green text-nocturne-indigo border-iq-green">
                    <Award className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge className="bg-signal-blue/20 text-signal-blue border-signal-blue/30 animate-pulse">
                    <Brain className="w-3 h-3 mr-1" />
                    Learning
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-mist-gray">
                {missionComplete 
                  ? 'Pattern analysis complete' 
                  : isUrgent 
                  ? 'Mission ending soon!' 
                  : 'AI studying your setup'
                }
              </p>
            </div>
          </div>

          <Badge 
            variant="outline" 
            className={`px-3 py-1 text-sm font-medium ${
              isUrgent 
                ? 'bg-amber-warning/20 text-amber-warning border-amber-warning/30' 
                : 'bg-iq-green/20 text-iq-green border-iq-green/30'
            }`}
          >
            <Clock className="h-3 w-3 mr-1" />
            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
          </Badge>
        </div>

        {/* Mission Progress */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-sm text-mist-gray mb-2">
              <span>Mission Progress</span>
              <span>{Math.round(missionProgress)}%</span>
            </div>
            <Progress value={missionProgress} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between text-sm text-mist-gray mb-2">
              <span>Trial Duration</span>
              <span>{Math.round(trialProgress)}% elapsed</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isUrgent 
                    ? 'bg-gradient-to-r from-amber-warning to-crimson-danger' 
                    : 'bg-gradient-to-r from-iq-green to-glow-cyan'
                }`}
                style={{ width: `${trialProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mission Insights */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-gray/20 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-bold text-iq-green">${roiValue.toLocaleString()}</p>
            <p className="text-xs text-mist-gray">ROI Identified</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-signal-blue">{insightsGenerated}</p>
            <p className="text-xs text-mist-gray">AI Insights</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-prediction-purple">{Math.round(missionProgress)}%</p>
            <p className="text-xs text-mist-gray">Intelligence</p>
          </div>
        </div>

        {/* Mission Benefits */}
        <div className="space-y-2 mb-6">
          <div className="text-sm font-medium text-cloud-white">
            Mission includes:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-mist-gray">
            <div className="flex items-center space-x-1">
              <span className="text-iq-green">✓</span>
              <span>Real-time alert analysis</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-iq-green">✓</span>
              <span>AI incident correlation</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-iq-green">✓</span>
              <span>Predictive insights</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-iq-green">✓</span>
              <span>Environment mapping</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <AnimatePresence>
            {missionComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bubo-btn-primary w-full justify-center"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Unlock Full BuboIQ Platform
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <p className="text-xs text-center text-iq-green">
                  🎉 Mission complete! Ready to activate full intelligence?
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setCurrentPage('pricing')}
                  className="bubo-btn-secondary flex-1 justify-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Intelligence Plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                {(user?.role === 'admin' || user?.role === 'agent') && (
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bubo-btn-primary flex-1 justify-center"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Urgency warning */}
        {isUrgent && !missionComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-amber-warning/10 rounded-lg border border-amber-warning/30"
          >
            <p className="text-xs text-amber-warning text-center">
              ⚠️ <strong>Mission ending soon:</strong> Activate full BuboIQ to continue intelligence monitoring
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}