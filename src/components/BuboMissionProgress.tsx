import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp,
  Zap,
  Award,
  ArrowRight,
  Eye
} from 'lucide-react';

export default function BuboMissionProgress() {
  const { subscriptionInfo, setCurrentPage, setShowUpgradeModal } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [missionProgress, setMissionProgress] = useState(67);
  const [roiValue, setRoiValue] = useState(8400);
  const [insightsGenerated, setInsightsGenerated] = useState(23);

  // Simulate live mission progress
  useEffect(() => {
    const interval = setInterval(() => {
      setMissionProgress(prev => Math.min(100, prev + Math.random() * 2));
      setRoiValue(prev => prev + Math.random() * 100);
      setInsightsGenerated(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!subscriptionInfo.isActive || isDismissed || subscriptionInfo.tier !== 'trial') {
    return null;
  }

  const progressPercentage = subscriptionInfo.daysRemaining ? ((14 - subscriptionInfo.daysRemaining) / 14) * 100 : 0;
  const missionComplete = missionProgress >= 95;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-r from-slate-gray via-slate-gray/90 to-slate-gray border-b border-iq-green/20 backdrop-blur-sm"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-iq-green/10 via-transparent to-signal-blue/10 opacity-50" />
      
      <div className="relative flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          {/* Mission Status */}
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-gradient-to-br from-iq-green to-glow-cyan rounded-lg flex items-center justify-center"
            >
              <Eye className="h-4 w-4 text-nocturne-indigo" />
            </motion.div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-cloud-white text-sm">
                  BuboIQ Mission Active
                </span>
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
              </div>
              <div className="flex items-center gap-4 text-xs text-mist-gray mt-1">
                <span>Progress: {Math.round(missionProgress)}%</span>
                <span>•</span>
                <span>${roiValue.toLocaleString()} ROI Identified</span>
                <span>•</span>
                <span>{insightsGenerated} AI Insights</span>
              </div>
            </div>
          </div>

          {/* Mission Progress Bar */}
          <div className="hidden lg:block w-48">
            <div className="flex justify-between text-xs text-mist-gray mb-1">
              <span>Mission Progress</span>
              <span>{Math.round(missionProgress)}%</span>
            </div>
            <Progress value={missionProgress} className="h-2" />
          </div>

          {/* Trial Time */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <div className="px-3 py-1 bg-amber-warning/20 text-amber-warning rounded-lg border border-amber-warning/30">
              <span className="font-medium">{subscriptionInfo.daysRemaining || 0} days</span>
              <span className="text-xs ml-1 opacity-80">remaining</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <AnimatePresence>
            {missionComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bubo-btn-primary text-sm px-4 py-2"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Activate Full Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!missionComplete && (
            <Button
              onClick={() => setCurrentPage('pricing')}
              variant="outline"
              size="sm"
              className="bg-slate-gray/50 border-iq-green/30 text-iq-green hover:bg-iq-green/10"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Plans
            </Button>
          )}
          
          <Button
            onClick={() => setIsDismissed(true)}
            variant="ghost"
            size="sm"
            className="text-mist-gray hover:bg-slate-gray/50 p-2 rounded-lg"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Trial Time Progress */}
        <div className="h-0.5 bg-amber-warning/20">
          <motion.div 
            className="h-full bg-amber-warning"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Mission Progress */}
        <div className="h-0.5 bg-iq-green/20">
          <motion.div 
            className="h-full bg-gradient-to-r from-iq-green to-glow-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${missionProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </div>

      {/* Particle Effects for Mission Complete */}
      {missionComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: 20,
                opacity: 0 
              }}
              animate={{ 
                y: -20, 
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                delay: Math.random() * 1,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute w-1 h-1 bg-iq-green rounded-full"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}