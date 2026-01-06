import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Brain, 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  Sparkles, 
  MessageCircle,
  CheckCircle,
  Star,
  TrendingUp,
  Activity,
  Send,
  Clock,
  Target,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { OwlEye } from './BuboIconPack';
import { useApp } from '../context/AppContext';
import BuboOnboardingLoader from './BuboOnboardingLoader';
import { 
  CursorGlow, 
  BuboTooltip, 
  RippleEffect, 
  ParticleField, 
  HologramEffect,
  useSoundEffects 
} from './BuboInteractiveEffects';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  points: number;
  unlocks: string[];
}

interface AIMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  animated?: boolean;
}

interface MissionProgress {
  currentStep: number;
  iqScore: number;
  completedSteps: string[];
  unlockedFeatures: string[];
  userResponses: Record<string, string>;
}

const OwlEyeAnimated: React.FC<{ size?: number; className?: string; isActive?: boolean }> = ({ 
  size = 48, 
  className = "", 
  isActive = false 
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (eyeRef.current) {
        const rect = eyeRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / 10;
        const y = (e.clientY - centerY) / 10;
        setMousePos({ x: Math.max(-5, Math.min(5, x)), y: Math.max(-5, Math.min(5, y)) });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={eyeRef} className={`relative ${className}`}>
      <motion.div
        className={`w-${size} h-${size} bg-gradient-to-br from-iq-green/20 to-signal-blue/20 rounded-full flex items-center justify-center border-2 border-iq-green/30 shadow-lg relative overflow-hidden`}
        animate={{ 
          scale: isActive ? [1, 1.1, 1] : 1,
          boxShadow: isActive 
            ? ['0 0 20px rgba(46, 204, 113, 0.3)', '0 0 40px rgba(46, 204, 113, 0.5)', '0 0 20px rgba(46, 204, 113, 0.3)']
            : '0 0 20px rgba(46, 204, 113, 0.3)'
        }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
      >
        <motion.div
          className="text-iq-green"
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <OwlEye size={size * 0.6} />
        </motion.div>
        
        {/* Scanning effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-iq-green/20 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </motion.div>
    </div>
  );
};

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { playHoverSound, playClickSound } = useSoundEffects();

  return (
    <CursorGlow className="min-h-screen">
      <motion.div 
        className="min-h-screen bg-background bubo-neural-bg flex items-center justify-center p-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <ParticleField particleCount={30} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-iq-green/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>

        <div className="text-center space-y-12 relative z-10 max-w-4xl">
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
            className="flex justify-center"
          >
            <OwlEyeAnimated size={120} isActive={true} />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-bold text-cloud-white tracking-tight">
              Raise Your <span className="text-iq-green">IT IQ</span>
            </h1>
            <p className="text-2xl text-mist-gray max-w-2xl mx-auto leading-relaxed">
              Legacy tools slow you down. Let's build your 
              <span className="text-signal-blue font-semibold"> intelligent workspace</span>.
            </p>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Eye, title: "Observatory", desc: "Real-time intelligence", tooltip: "Monitor your entire IT infrastructure" },
              { icon: Zap, title: "Signal Stream", desc: "AI-powered triage", tooltip: "Intelligent event correlation and prioritization" },
              { icon: Brain, title: "Prediction Engine", desc: "Proactive insights", tooltip: "Predict and prevent issues before they occur" }
            ].map((feature, i) => (
              <BuboTooltip key={feature.title} content={feature.tooltip} position="bottom" glowing>
                <RippleEffect>
                  <HologramEffect intensity={0.5}>
                    <motion.div
                      className="bg-card/50 border border-slate-gray/30 rounded-2xl p-6 backdrop-blur-sm hover:border-iq-green/30 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ delay: 1.2 + i * 0.2 }}
                      onMouseEnter={playHoverSound}
                    >
                      <feature.icon className="w-8 h-8 text-iq-green mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-cloud-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-mist-gray">{feature.desc}</p>
                    </motion.div>
                  </HologramEffect>
                </RippleEffect>
              </BuboTooltip>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <Button
              onClick={onStart}
              className="bubo-btn-primary text-xl px-12 py-6 rounded-2xl group"
            >
              <Rocket className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
              Start Intelligence Setup
              <Sparkles className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform" />
            </Button>
            <p className="text-sm text-mist-gray/80 mt-4">
              ✨ Personalized AI workspace in 3 minutes
            </p>
          </motion.div>
        </div>
      </motion.div>
    </CursorGlow>
  );
};

const AIGuidedSetup: React.FC<{ 
  progress: MissionProgress; 
  onProgress: (progress: Partial<MissionProgress>) => void;
  onComplete: () => void;
}> = ({ progress, onProgress, onComplete }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm Bubo, your AI intelligence companion. I'll help you set up your personalized IT command center. What's your name?",
      timestamp: new Date(),
      animated: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      id: 'name',
      question: "What's your name?",
      followUp: "Nice to meet you, {name}! What's your role in IT operations?",
      points: 10
    },
    {
      id: 'role',
      question: "What's your role in IT operations?",
      options: ['IT Manager', 'System Administrator', 'DevOps Engineer', 'Help Desk Agent', 'CTO/Director'],
      followUp: "Perfect! How many team members do you work with?",
      points: 15
    },
    {
      id: 'team_size',
      question: "How many team members do you work with?",
      options: ['Just me', '2-5 people', '6-20 people', '21-50 people', '50+ people'],
      followUp: "Got it! What's your biggest IT challenge right now?",
      points: 15
    },
    {
      id: 'challenge',
      question: "What's your biggest IT challenge right now?",
      options: ['Too many alerts', 'Slow incident response', 'Lack of visibility', 'Manual processes', 'Downtime prevention'],
      followUp: "I understand. Let me configure your personalized dashboard...",
      points: 20
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update progress
    const currentQ = questions[currentQuestion];
    const newResponses = { ...progress.userResponses, [currentQ.id]: inputValue };
    const newIQ = progress.iqScore + currentQ.points;
    
    onProgress({
      userResponses: newResponses,
      iqScore: newIQ,
      completedSteps: [...progress.completedSteps, currentQ.id]
    });

    setInputValue('');

    // AI Response
    setTimeout(() => {
      let aiResponse = currentQ.followUp || "Thank you for that information!";
      
      if (currentQ.id === 'name') {
        aiResponse = aiResponse.replace('{name}', inputValue);
      }

      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        animated: true
      };

      setMessages(prev => [...prev, aiMessage]);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Setup complete
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 1000);
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    setTimeout(() => handleSend(), 100);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background bubo-neural-bg flex">
      {/* Chat Interface */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-gray/30">
          <div className="flex items-center gap-4">
            <OwlEyeAnimated size={48} isActive={true} />
            <div>
              <h2 className="text-2xl font-bold text-cloud-white">BuboIQ Intelligence Setup</h2>
              <p className="text-mist-gray">Building your personalized command center</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-2xl font-bold text-iq-green">{progress.iqScore}</div>
              <div className="text-sm text-mist-gray">IQ Points</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={message.animated ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-md ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.type === 'ai' && (
                    <div className="w-8 h-8 bg-iq-green/10 rounded-full flex items-center justify-center border border-iq-green/20 flex-shrink-0">
                      <OwlEye size={16} className="text-iq-green" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-iq-green text-neural-black'
                        : 'bg-card border border-slate-gray/30 text-cloud-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-60`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-gray/30">
          {currentQ?.options ? (
            <div className="space-y-3">
              <p className="text-sm text-mist-gray">{currentQ.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQ.options.map((option) => (
                  <Button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    variant="outline"
                    className="bubo-btn-ghost justify-start text-left h-auto py-3"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your response..."
                className="bg-input-background border-slate-gray/50 text-cloud-white placeholder-mist-gray"
              />
              <Button onClick={handleSend} className="bubo-btn-primary px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Sidebar */}
      <div className="w-80 bg-card/50 border-l border-slate-gray/30 p-6">
        <div className="space-y-6">
          {/* IQ Meter */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-cloud-white mb-4">Intelligence Quotient</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="rgba(55, 65, 81, 0.3)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="url(#iqGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress.iqScore / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeDasharray="314"
                  strokeDashoffset="314"
                />
                <defs>
                  <linearGradient id="iqGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#2ECC71" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-iq-green">{progress.iqScore}</div>
                  <div className="text-xs text-mist-gray">Points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-cloud-white">Setup Progress</h4>
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  progress.completedSteps.includes(q.id)
                    ? 'bg-iq-green text-neural-black'
                    : i === currentQuestion
                    ? 'bg-signal-blue text-cloud-white'
                    : 'bg-slate-gray/30 text-mist-gray'
                }`}>
                  {progress.completedSteps.includes(q.id) ? <CheckCircle className="w-3 h-3" /> : i + 1}
                </div>
                <span className={`text-sm ${
                  progress.completedSteps.includes(q.id) ? 'text-cloud-white' : 'text-mist-gray'
                }`}>
                  {q.question}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureUnlockCelebration: React.FC<{ feature: string; onContinue: () => void }> = ({ 
  feature, 
  onContinue 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-lg flex items-center justify-center z-50"
    >
      <Card className="bubo-signal-card max-w-md mx-auto border-iq-green/30 bubo-glow-green">
        <CardContent className="p-8 text-center space-y-6">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 bg-iq-green/20 rounded-2xl mx-auto flex items-center justify-center border border-iq-green/30"
          >
            <Sparkles className="w-8 h-8 text-iq-green" />
          </motion.div>
          
          <div>
            <h3 className="text-2xl font-bold text-cloud-white mb-2">Feature Unlocked!</h3>
            <p className="text-lg text-iq-green font-semibold">{feature}</p>
            <p className="text-sm text-mist-gray mt-2">
              Your IT IQ just leveled up! This feature is now active in your dashboard.
            </p>
          </div>

          <Button onClick={onContinue} className="bubo-btn-primary">
            <Rocket className="w-4 h-4 mr-2" />
            Continue Setup
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CompletionScreen: React.FC<{ 
  progress: MissionProgress; 
  onEnterDashboard: () => void 
}> = ({ progress, onEnterDashboard }) => {
  const { setShowDemoPage } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background bubo-neural-bg flex items-center justify-center p-8"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="w-32 h-32 bg-iq-green/10 rounded-full mx-auto flex items-center justify-center border-4 border-iq-green/30 bubo-glow-green">
            <CheckCircle className="w-16 h-16 text-iq-green" />
          </div>
          {/* Celebration particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-iq-green rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 100,
                y: Math.sin(i * 30 * Math.PI / 180) * 100,
                opacity: [1, 0],
                scale: [1, 0],
              }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          ))}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold text-cloud-white">
            You've Raised Your IQ by <span className="text-iq-green">{progress.iqScore} Points!</span>
          </h1>
          <p className="text-xl text-mist-gray max-w-2xl mx-auto">
            Your personalized BuboIQ intelligence platform is ready. 
            Experience the future of proactive IT operations.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          <div className="bg-card/50 border border-slate-gray/30 rounded-2xl p-6 backdrop-blur-sm">
            <TrendingUp className="w-8 h-8 text-iq-green mx-auto mb-3" />
            <div className="text-2xl font-bold text-cloud-white">{progress.iqScore}</div>
            <div className="text-sm text-mist-gray">Intelligence Points</div>
          </div>
          
          <div className="bg-card/50 border border-slate-gray/30 rounded-2xl p-6 backdrop-blur-sm">
            <Star className="w-8 h-8 text-amber-warning mx-auto mb-3" />
            <div className="text-2xl font-bold text-cloud-white">{progress.completedSteps.length}</div>
            <div className="text-sm text-mist-gray">Steps Completed</div>
          </div>
          
          <div className="bg-card/50 border border-slate-gray/30 rounded-2xl p-6 backdrop-blur-sm">
            <Lightbulb className="w-8 h-8 text-signal-blue mx-auto mb-3" />
            <div className="text-2xl font-bold text-cloud-white">4</div>
            <div className="text-sm text-mist-gray">Features Unlocked</div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => setShowDemoPage(true)}
            className="bubo-btn-primary text-lg px-8 py-4 rounded-2xl"
          >
            <Eye className="w-5 h-5 mr-3" />
            Enter Your Dashboard
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
          
          <Button
            variant="outline"
            className="bubo-btn-secondary text-lg px-8 py-4 rounded-2xl"
          >
            <Users className="w-5 h-5 mr-3" />
            Invite Your Team
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-sm text-mist-gray/80"
        >
          🎉 Welcome to the future of IT intelligence • Your journey begins now
        </motion.p>
      </div>
    </motion.div>
  );
};

export default function BuboOnboardingMission() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'setup' | 'celebration' | 'complete'>('welcome');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [celebrationFeature, setCelebrationFeature] = useState('');
  const [progress, setProgress] = useState<MissionProgress>({
    currentStep: 0,
    iqScore: 0,
    completedSteps: [],
    unlockedFeatures: [],
    userResponses: {}
  });

  const handleStart = () => {
    setShowLoader(true);
    setLoaderMessage('Initializing Intelligence Matrix...');
    setLoaderProgress(0);
    
    // Simulate loading progression
    const progressSteps = [
      { progress: 25, message: 'Calibrating AI Neural Networks...' },
      { progress: 50, message: 'Establishing Signal Protocols...' },
      { progress: 75, message: 'Preparing Your Command Center...' },
      { progress: 100, message: 'Ready for Launch!' }
    ];
    
    progressSteps.forEach((step, index) => {
      setTimeout(() => {
        setLoaderProgress(step.progress);
        setLoaderMessage(step.message);
        
        if (step.progress === 100) {
          setTimeout(() => {
            setShowLoader(false);
            setCurrentScreen('setup');
          }, 1000);
        }
      }, (index + 1) * 800);
    });
  };

  const handleProgress = (newProgress: Partial<MissionProgress>) => {
    setProgress(prev => ({ ...prev, ...newProgress }));
    
    // Check for feature unlocks
    if (newProgress.iqScore && newProgress.iqScore >= 25 && !progress.unlockedFeatures.includes('Observatory')) {
      setCelebrationFeature('Observatory Dashboard');
      setShowCelebration(true);
      setProgress(prev => ({ ...prev, unlockedFeatures: [...prev.unlockedFeatures, 'Observatory'] }));
    }
  };

  const handleSetupComplete = () => {
    setShowLoader(true);
    setLoaderMessage('Assembling Your Personalized Dashboard...');
    setLoaderProgress(0);
    
    // Simulate final assembly
    const finalSteps = [
      { progress: 30, message: 'Integrating AI Insights...' },
      { progress: 60, message: 'Activating Observatory Systems...' },
      { progress: 90, message: 'Finalizing Intelligence Configuration...' },
      { progress: 100, message: 'Intelligence Platform Ready!' }
    ];
    
    finalSteps.forEach((step, index) => {
      setTimeout(() => {
        setLoaderProgress(step.progress);
        setLoaderMessage(step.message);
        
        if (step.progress === 100) {
          setTimeout(() => {
            setShowLoader(false);
            setCurrentScreen('complete');
          }, 1500);
        }
      }, (index + 1) * 1000);
    });
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
  };

  const handleEnterDashboard = () => {
    // This would typically navigate to the main dashboard
    console.log('Entering dashboard with progress:', progress);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        )}
        
        {currentScreen === 'setup' && (
          <AIGuidedSetup
            key="setup"
            progress={progress}
            onProgress={handleProgress}
            onComplete={handleSetupComplete}
          />
        )}
        
        {currentScreen === 'complete' && (
          <CompletionScreen
            key="complete"
            progress={progress}
            onEnterDashboard={handleEnterDashboard}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && (
          <FeatureUnlockCelebration
            key="celebration"
            feature={celebrationFeature}
            onContinue={handleCelebrationContinue}
          />
        )}
      </AnimatePresence>

      {/* Onboarding Loader */}
      <BuboOnboardingLoader
        isVisible={showLoader}
        message={loaderMessage}
        progress={loaderProgress}
      />
    </div>
  );
}