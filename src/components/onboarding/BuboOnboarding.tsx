import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Users, 
  Building, 
  User, 
  Mail, 
  MessageSquare, 
  Database, 
  Cloud, 
  Calculator,
  Key,
  Printer,
  Zap,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Lock,
  Phone,
  Star,
  Shield,
  Wifi,
  Lightbulb,
  X,
  ChevronRight,
  BookOpen,
  Settings,
  HelpCircle
} from 'lucide-react';
import { OwlEyeOrb } from '../marketing/OwlEyeOrb';

interface OnboardingProps {
  onComplete: (userData: any) => void;
  onSkip?: () => void;
}

type UserRole = 'msp' | 'it-pro' | 'business-owner';
type OnboardingStep = 'welcome' | 'setup' | 'tour' | 'defaults' | 'celebration' | 'complete';
type SetupSubStep = 'connect' | 'define' | 'test';

interface UserData {
  firstName: string;
  role: UserRole;
  selectedIntegrations: string[];
  selectedPlaybooks: string[];
  completedSteps: string[];
}

const integrationOptions = [
  { id: 'email', name: 'Email', icon: Mail, description: 'Gmail, Outlook, Exchange' },
  { id: 'chat', name: 'Chat', icon: MessageSquare, description: 'Teams, Slack, Discord' },
  { id: 'psa', name: 'PSA/CRM', icon: Database, description: 'ConnectWise, Autotask' },
  { id: 'office365', name: 'Office 365', icon: Cloud, description: 'Microsoft 365' },
  { id: 'quickbooks', name: 'QuickBooks', icon: Calculator, description: 'Money tracking' }
];

const starterPlaybooks = [
  { 
    id: 'password-resets', 
    name: 'Password resets', 
    icon: Key, 
    description: 'Auto-fix password resets',
    color: 'iq-neon-green'
  },
  { 
    id: 'printer-issues', 
    name: 'Printer problems', 
    icon: Printer, 
    description: 'Find and fix printer issues',
    color: 'electric-blue'
  },
  { 
    id: 'app-crashes', 
    name: 'App crashes', 
    icon: Zap, 
    description: 'Fix crashing apps',
    color: 'signal-yellow'
  }
];

export const BuboOnboarding: React.FC<OnboardingProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [setupSubStep, setSetupSubStep] = useState<SetupSubStep>('connect');
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Alex', // Mock first name
    role: 'msp',
    selectedIntegrations: [],
    selectedPlaybooks: [],
    completedSteps: []
  });
  const [tourStep, setTourStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showMicroTip, setShowMicroTip] = useState(false);

  // Auto-progress through certain steps
  useEffect(() => {
    if (currentStep === 'celebration') {
      const timer = setTimeout(() => {
        setCurrentStep('complete');
        onComplete(userData);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, userData, onComplete]);

  const handleRoleSelection = (role: UserRole) => {
    setUserData(prev => ({ ...prev, role }));
    setCurrentStep('setup');
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setUserData(prev => ({
      ...prev,
      selectedIntegrations: prev.selectedIntegrations.includes(integrationId)
        ? prev.selectedIntegrations.filter(id => id !== integrationId)
        : [...prev.selectedIntegrations, integrationId]
    }));
  };

  const handlePlaybookSelection = (playbookId: string) => {
    setUserData(prev => ({
      ...prev,
      selectedPlaybooks: [playbookId] // Single selection for demo
    }));
  };

  const getSetupProgress = () => {
    const steps = ['connect', 'define', 'test'];
    const currentIndex = steps.indexOf(setupSubStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderWelcomeScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bubo-circuit-pattern opacity-10 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-iq-neon-green/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-electric-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <Card className="bubo-glass max-w-2xl w-full p-12 text-center relative z-10">
        {/* Owl Eye Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <OwlEyeOrb size={128} className="bubo-neon-text-green" />
            <div className="absolute inset-0 bg-iq-neon-green/20 rounded-full blur-xl animate-pulse" />
          </div>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-pure-white mb-4">
            Welcome, {userData.firstName}
          </h1>
          <p className="text-xl text-mist-gray mb-12">
            BuboIQ helps you <span className="text-iq-neon-green bubo-neon-text-green">See More.</span>{' '}
            <span className="text-electric-blue bubo-neon-text-blue">Solve Faster.</span>
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <p className="text-lg text-mist-gray mb-8">Tell us about your role:</p>
          
          <div className="grid gap-4 max-w-lg mx-auto">
            <Button
              onClick={() => handleRoleSelection('msp')}
              className="bubo-btn-secondary h-16 text-lg group relative overflow-hidden"
            >
              <Users className="w-6 h-6 mr-3" />
              I'm an MSP
              <div className="absolute inset-0 bg-iq-neon-green/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
            
            <Button
              onClick={() => handleRoleSelection('it-pro')}
              className="bubo-btn-secondary h-16 text-lg group relative overflow-hidden"
            >
              <Shield className="w-6 h-6 mr-3" />
              I'm an IT Pro
              <div className="absolute inset-0 bg-electric-blue/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
            
            <Button
              onClick={() => handleRoleSelection('business-owner')}
              className="bubo-btn-secondary h-16 text-lg group relative overflow-hidden"
            >
              <Building className="w-6 h-6 mr-3" />
              I'm a Small Business Owner
              <div className="absolute inset-0 bg-signal-yellow/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );

  const renderSetupWizard = () => (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <Card className="bubo-glass-bright p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">Setup Wizard</h2>
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
              Step {['connect', 'define', 'test'].indexOf(setupSubStep) + 1} of 3
            </Badge>
          </div>
          
          <div className="relative">
            <Progress value={getSetupProgress()} className="h-2" />
            <div className="flex justify-between mt-2 text-sm">
              <span className={setupSubStep === 'connect' ? 'text-iq-neon-green' : 'text-mist-gray'}>Connect</span>
              <span className={setupSubStep === 'define' ? 'text-iq-neon-green' : 'text-mist-gray'}>Define</span>
              <span className={setupSubStep === 'test' ? 'text-iq-neon-green' : 'text-mist-gray'}>Test</span>
            </div>
          </div>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {setupSubStep === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bubo-glass p-8">
                <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-4">
                  Connect Your World
                </h3>
                <p className="text-lg text-mist-gray mb-8">
                  Choose the integrations that matter to your workflow
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {integrationOptions.map((integration) => (
                    <motion.div
                      key={integration.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`bubo-glass-bright p-6 cursor-pointer border-2 transition-all duration-300 ${
                          userData.selectedIntegrations.includes(integration.id)
                            ? 'border-iq-neon-green/50 bg-iq-neon-green/10'
                            : 'border-transparent hover:border-iq-neon-green/30'
                        }`}
                        onClick={() => handleIntegrationToggle(integration.id)}
                      >
                        <integration.icon className="w-12 h-12 text-iq-neon-green mb-4" />
                        <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-2">
                          {integration.name}
                        </h4>
                        <p className="text-sm text-mist-gray">{integration.description}</p>
                        
                        {userData.selectedIntegrations.includes(integration.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4"
                          >
                            <CheckCircle className="w-6 h-6 text-iq-neon-green" />
                          </motion.div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setSetupSubStep('define')}
                  className="bubo-btn-neon-primary"
                  disabled={userData.selectedIntegrations.length === 0}
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {setupSubStep === 'define' && (
            <motion.div
              key="define"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bubo-glass p-8">
                <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-4">
                  Define Your Flow
                </h3>
                <p className="text-lg text-mist-gray mb-8">
                  Choose a starter playbook to get immediate value
                </p>

                <div className="grid gap-6 mb-8">
                  {starterPlaybooks.map((playbook) => (
                    <motion.div
                      key={playbook.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Card
                        className={`bubo-glass-bright p-6 cursor-pointer border-2 transition-all duration-300 ${
                          userData.selectedPlaybooks.includes(playbook.id)
                            ? 'border-iq-neon-green/50 bg-iq-neon-green/10'
                            : 'border-transparent hover:border-iq-neon-green/30'
                        }`}
                        onClick={() => handlePlaybookSelection(playbook.id)}
                      >
                        <div className="flex items-center space-x-6">
                          <div className={`w-16 h-16 bg-${playbook.color}/20 rounded-2xl flex items-center justify-center`}>
                            <playbook.icon className={`w-8 h-8 text-${playbook.color}`} />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-2 text-xl">
                              {playbook.name}
                            </h4>
                            <p className="text-mist-gray">{playbook.description}</p>
                          </div>
                          
                          {userData.selectedPlaybooks.includes(playbook.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <CheckCircle className="w-8 h-8 text-iq-neon-green" />
                            </motion.div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => setSetupSubStep('test')}
                  className="bubo-btn-neon-primary"
                  disabled={userData.selectedPlaybooks.length === 0}
                >
                  Continue <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {setupSubStep === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bubo-glass p-8">
                <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-4">
                  Test drive an issue
                </h3>
                <p className="text-lg text-mist-gray mb-8">
                  Watch BuboIQ patterns in action
                </p>

                {/* Sample Ticket */}
                <Card className="bubo-glass-bright p-6 mb-8 border-amber-warning/30">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-warning/20 rounded-xl flex items-center justify-center">
                      <Wifi className="w-6 h-6 text-amber-warning" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-2">
                        Wi-Fi Down in Conference Room B
                      </h4>
                      <p className="text-mist-gray mb-4">
                        Reported by: Sarah (Marketing) • Priority: High • Just now
                      </p>
                      
                      {/* Triage Animation */}
                      <div className="bg-dark-midnight/50 rounded-xl p-4 mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-6 h-6 bg-iq-neon-green/20 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-3 h-3 bg-iq-neon-green rounded-full" />
                          </div>
                          <span className="text-iq-neon-green font-['JetBrains_Mono'] text-sm">
                            BuboIQ scanning...
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-mist-gray font-['JetBrains_Mono']">
                          <div>✓ Cross-referencing similar incidents...</div>
                          <div>✓ Checking network infrastructure...</div>
                          <div>✓ Analyzing access point logs...</div>
                          <div className="text-iq-neon-green">⟳ Suggesting automated fix...</div>
                        </div>
                      </div>
                      
                      {/* Suggested Fix */}
                      <div className="bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <Lightbulb className="w-5 h-5 text-iq-neon-green" />
                          <span className="font-['Space_Grotesk'] font-bold text-iq-neon-green">
                            Suggested fix
                          </span>
                        </div>
                        <p className="text-sm text-pure-white mb-3">
                          Router restart required for AP-CB-01. Confidence: 94%
                        </p>
                        <Button size="sm" className="bubo-btn-neon-primary">
                          Apply Fix Automatically
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Button
                  onClick={() => setCurrentStep('tour')}
                  className="bubo-btn-neon-primary text-lg px-8 py-4"
                >
                  <PlayCircle className="w-6 h-6 mr-3" />
                  Complete Setup & Start Tour
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  const renderDashboardTour = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative"
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-dark-midnight/80 backdrop-blur-sm z-40" />
      
      {/* Mock Dashboard Elements */}
      <div className="p-8 relative z-30">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-4 bg-surface-dark/50 rounded-2xl">
          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">BuboIQ Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Badge className="bg-iq-neon-green/20 text-iq-neon-green">3 Active</Badge>
            <div className="w-8 h-8 bg-mist-gray/20 rounded-full" />
          </div>
        </div>

        {/* Health Dashboard - Highlighted */}
        <div className={`relative mb-8 ${tourStep === 0 ? 'z-50' : 'z-10'}`}>
          <Card className={`bubo-glass-bright p-6 border-2 transition-all duration-500 ${
            tourStep === 0 ? 'border-iq-neon-green/50 shadow-[0_0_30px_rgba(0,255,133,0.3)]' : 'border-transparent'
          }`}>
            <h3 className="font-['Space_Grotesk'] font-bold text-xl text-pure-white mb-4">Real-Time Health Dashboard</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-iq-neon-green">98%</div>
                <div className="text-sm text-mist-gray">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-blue">12</div>
                <div className="text-sm text-mist-gray">Active Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-signal-yellow">3</div>
                <div className="text-sm text-mist-gray">Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-iq-neon-green">Fast</div>
                <div className="text-sm text-mist-gray">Response</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bubo-glass p-4">
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-4">Recent Tickets</h4>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 bg-surface-dark/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-pure-white">Ticket #{i + 1000}</span>
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green">Resolved</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bubo-glass p-4">
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-4">Intelligence Insights</h4>
            <div className="space-y-3">
              <div className="p-3 bg-electric-blue/10 rounded-xl border border-electric-blue/30">
                <div className="text-sm text-pure-white">Pattern detected in printer issues</div>
              </div>
              <div className="p-3 bg-iq-neon-green/10 rounded-xl border border-iq-neon-green/30">
                <div className="text-sm text-pure-white">3 tickets auto-resolved</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tour Tooltip */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <Card className="bubo-glass-bright p-6 max-w-md border border-iq-neon-green/30">
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-3">
              Your Real-Time Health Dashboard
            </h4>
            <p className="text-mist-gray mb-6">
              This is where you'll see live metrics and system health. Try filtering tickets by status to explore!
            </p>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => setCurrentStep('defaults')}
                className="bubo-btn-neon-primary flex-1"
              >
                Next
              </Button>
              <Button
                onClick={() => setCurrentStep('defaults')}
                variant="ghost"
                className="text-mist-gray hover:text-pure-white"
              >
                Skip Tour
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );

  const renderSmartDefaults = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen p-8"
    >
      <div className="max-w-6xl mx-auto">
        <Card className="bubo-glass-bright p-8 mb-8 text-center">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-pure-white mb-4">
            Smart Defaults Applied
          </h2>
          <p className="text-lg text-mist-gray">
            We've configured your dashboard based on your role as {userData.role === 'msp' ? 'an MSP' : userData.role === 'it-pro' ? 'an IT Professional' : 'a Business Owner'}
          </p>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Nav Categories */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-bold text-xl text-pure-white mb-6">Auto-Filled Categories</h3>
            <div className="space-y-3">
              {['Updates', 'Access Issues', 'Hardware'].map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-iq-neon-green/10 rounded-xl border border-iq-neon-green/30"
                >
                  <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                  <span className="text-pure-white">{category}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Role-Based Dashboard */}
          <Card className="bubo-glass p-6 lg:col-span-2">
            <h3 className="font-['Space_Grotesk'] font-bold text-xl text-pure-white mb-6">
              {userData.role === 'msp' ? 'MSP Client Dashboard' : userData.role === 'it-pro' ? 'IT Professional View' : 'Business Health Monitor'}
            </h3>
            
            {userData.role === 'msp' && (
              <div className="space-y-4">
                <div className="p-4 bg-electric-blue/10 rounded-xl border border-electric-blue/30">
                  <h4 className="font-bold text-pure-white mb-2">Client Workload</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-electric-blue">5</div>
                      <div className="text-mist-gray">Active Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-iq-neon-green">23</div>
                      <div className="text-mist-gray">Total Tickets</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-signal-yellow">2.1h</div>
                      <div className="text-mist-gray">Avg Response</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {userData.role === 'business-owner' && (
              <div className="p-4 bg-iq-neon-green/10 rounded-xl border border-iq-neon-green/30">
                <h4 className="font-bold text-pure-white mb-2">Business Health Meter</h4>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 relative">
                    <div className="w-full h-full bg-dark-midnight/50 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-iq-neon-green">94%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-pure-white mb-2">IT Load: Minimal</div>
                    <div className="text-sm text-mist-gray">Your technology is running smoothly</div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={() => setCurrentStep('celebration')}
            className="bubo-btn-neon-primary text-lg px-8 py-4"
          >
            Complete Setup <CheckCircle className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderCelebration = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-dark-midnight/90 backdrop-blur-sm"
    >
      {/* Confetti Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-iq-neon-green rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -10,
              rotate: 0
            }}
            animate={{
              y: window.innerHeight + 10,
              rotate: 360
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Infinity
            }}
          />
        ))}
      </div>

      <Card className="bubo-glass-bright p-12 text-center max-w-2xl mx-8 relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-iq-neon-green/20 rounded-full flex items-center justify-center">
            <Star className="w-12 h-12 text-iq-neon-green" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-pure-white mb-4">
            🎉 First Win Unlocked!
          </h2>
          <p className="text-xl text-mist-gray mb-8">
            You solved your first issue 50% faster with BuboIQ intelligence
          </p>
          
          <Button className="bubo-btn-secondary">
            <Star className="w-5 h-5 mr-3" />
            Share Badge
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );

  // Main render based on current step
  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && renderWelcomeScreen()}
        {currentStep === 'setup' && renderSetupWizard()}
        {currentStep === 'tour' && renderDashboardTour()}
        {currentStep === 'defaults' && renderSmartDefaults()}
      </AnimatePresence>
      
      {/* Celebration Modal */}
      <AnimatePresence>
        {currentStep === 'celebration' && renderCelebration()}
      </AnimatePresence>

      {/* Persistent Help Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Button className="bubo-btn-neon-primary rounded-full p-4 shadow-lg">
          <Phone className="w-5 h-5 mr-2" />
          Need Help? Book a 15-min setup call
        </Button>
      </motion.div>

      {/* Skip Button */}
      {onSkip && (
        <Button
          onClick={onSkip}
          variant="ghost"
          className="fixed top-6 right-6 text-mist-gray hover:text-pure-white z-40"
        >
          Skip Onboarding
        </Button>
      )}
    </div>
  );
};