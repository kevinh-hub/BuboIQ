import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { Eye, Brain, Zap, Shield, Cpu, BarChart3, Users, CheckCircle, ArrowRight, Star, Play, Pause } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BuboPricingSection from './BuboPricingSection';

interface OwlEyeProps {
  mouseX: number;
  mouseY: number;
}

const OwlEye: React.FC<OwlEyeProps> = ({ mouseX, mouseY }) => {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilX = useTransform(
    useSpring(mouseX, { stiffness: 100, damping: 30 }),
    [0, window?.innerWidth || 1920],
    [-8, 8]
  );
  const pupilY = useTransform(
    useSpring(mouseY, { stiffness: 100, damping: 30 }),
    [0, window?.innerHeight || 1080],
    [-8, 8]
  );

  return (
    <div 
      ref={eyeRef}
      className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF85]/20 to-[#00FFC6]/20 
                 border-2 border-[#00FF85]/40 backdrop-blur-sm flex items-center justify-center
                 shadow-[0_0_40px_rgba(0,255,133,0.3)]"
    >
      <motion.div 
        className="w-12 h-12 rounded-full bg-[#0E1726] flex items-center justify-center relative overflow-hidden"
        animate={{ scaleY: blinking ? 0.1 : 1 }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00FF85] to-[#00FFC6] 
                     shadow-[0_0_20px_rgba(0,255,133,0.6)]"
          style={{ x: pupilX, y: pupilY }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
      </motion.div>
    </div>
  );
};

const AnimatedCounter: React.FC<{ value: number; suffix: string; prefix?: string }> = ({ 
  value, suffix, prefix = "" 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCount(prev => {
          const increment = Math.ceil(value / 50);
          const next = prev + increment;
          return next > value ? value : next;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="bubo-neon-text text-4xl font-bold">
      {prefix}{count}{suffix}
    </span>
  );
};

interface BuboLandingPageProps {
  onGetStarted?: () => void;
  onLoginClick?: () => void;
}

const BuboLandingPage: React.FC<BuboLandingPageProps> = ({ onGetStarted, onLoginClick }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTeamSize, setSelectedTeamSize] = useState('');
  const [selectedPainPoint, setSelectedPainPoint] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const roles = [
    { id: 'it-director', label: 'IT Director', icon: Cpu },
    { id: 'support-manager', label: 'Support Manager', icon: Users },
    { id: 'help-desk', label: 'Help Desk Agent', icon: Brain },
    { id: 'cto', label: 'CTO', icon: BarChart3 }
  ];

  const teamSizes = [
    { id: 'small', label: '1-10 people', desc: 'Growing startup' },
    { id: 'medium', label: '11-100 people', desc: 'Scale-up company' },
    { id: 'large', label: '100+ people', desc: 'Enterprise' }
  ];

  const painPoints = [
    { id: 'slow-response', label: 'Slow Response Times', impact: 'High' },
    { id: 'ticket-chaos', label: 'Ticket Chaos', impact: 'Critical' },
    { id: 'escalation-hell', label: 'Escalation Hell', impact: 'High' },
    { id: 'knowledge-gaps', label: 'Knowledge Gaps', impact: 'Medium' }
  ];

  return (
    <div className="min-h-screen bg-[#0E1726] text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0E1726] via-[#1a2332] to-[#0E1726]" />
          <div className="bubo-particles absolute inset-0" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF85]/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00FFC6]/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bubo-circuit-pattern opacity-20" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Owl Eye */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <OwlEye mouseX={mousePosition.x} mouseY={mousePosition.y} />
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-white via-[#00FF85] to-[#00FFC6] 
                         bg-clip-text text-transparent leading-tight space-grotesk">
              Raise Your IT IQ
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Legacy support is slow. BuboIQ senses, routes, and learns — so your team fixes more with fewer clicks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#00FF85] to-[#00FFC6] 
                       text-[#0E1726] font-semibold text-lg rounded-xl shadow-lg
                       hover:shadow-[0_0_40px_rgba(0,255,133,0.4)] transition-all duration-300 
                       transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Instant Sandbox
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00FFC6] to-[#00FF85]"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Button>

            <Button
              variant="outline"
              onClick={onLoginClick}
              className="px-8 py-4 border-2 border-[#00FF85]/30 text-[#00FF85] 
                       hover:bg-[#00FF85]/10 hover:border-[#00FF85] font-semibold text-lg 
                       rounded-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Floating Cards Preview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { icon: Brain, title: 'AI-Powered Triage', desc: 'Intelligent routing' },
              { icon: Zap, title: 'Real-time Insights', desc: 'Predictive analytics' },
              { icon: Shield, title: 'Proactive Monitoring', desc: 'Issue prevention' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bubo-glass rounded-2xl p-6 text-center hover:bubo-glow-green transition-all duration-500"
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3 + index * 0.5, 
                  repeat: Infinity,
                  delay: index * 0.2 
                }}
                whileHover={{ scale: 1.05, y: -20 }}
              >
                <item.icon className="w-8 h-8 text-[#00FF85] mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Problem vs Solution Split */}
      <section className="relative min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Legacy Chaos */}
            <motion.div
              className="relative"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-orange-500/10 
                            border border-red-500/20 backdrop-blur-sm">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Legacy Chaos</Badge>
                </div>
                
                <h3 className="text-3xl font-bold mb-6 text-red-300">The Old Way</h3>
                
                <div className="space-y-4">
                  {[
                    'Manual ticket routing',
                    'Reactive problem solving',
                    'Knowledge silos',
                    'Escalation bottlenecks',
                    'Frustrated users'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bubo Flow */}
            <motion.div
              className="relative"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#00FF85]/10 to-[#00FFC6]/10 
                            border border-[#00FF85]/20 backdrop-blur-sm bubo-glow-green">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30">Bubo Flow</Badge>
                </div>
                
                <h3 className="text-3xl font-bold mb-6 text-[#00FF85]">The BuboIQ Way</h3>
                
                <div className="space-y-4">
                  {[
                    'AI-powered intelligent routing',
                    'Predictive issue detection',
                    'Unified knowledge base',
                    'Automated escalation rules',
                    'Delighted users'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#00FF85]/5 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="w-5 h-5 text-[#00FF85]" />
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Instant Sandbox Experience */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00FF85] 
                         bg-clip-text text-transparent space-grotesk">
              Experience BuboIQ Now
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Build your personalized demo in 60 seconds. No signup required.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Configuration Panel */}
            <motion.div
              className="bubo-glass rounded-3xl p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-8 text-[#00FF85]">Customize Your Experience</h3>

              {/* Role Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-4">Your Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                        selectedRole === role.id
                          ? 'border-[#00FF85] bg-[#00FF85]/10 bubo-glow-green'
                          : 'border-gray-600 hover:border-[#00FF85]/50'
                      }`}
                    >
                      <role.icon className={`w-5 h-5 mb-2 ${
                        selectedRole === role.id ? 'text-[#00FF85]' : 'text-gray-400'
                      }`} />
                      <div className="text-sm font-medium text-white">{role.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Team Size */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-4">Team Size</label>
                <div className="space-y-3">
                  {teamSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedTeamSize(size.id)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                        selectedTeamSize === size.id
                          ? 'border-[#00FF85] bg-[#00FF85]/10 bubo-glow-green'
                          : 'border-gray-600 hover:border-[#00FF85]/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{size.label}</div>
                          <div className="text-gray-400 text-sm">{size.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pain Points */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-4">Primary Pain Point</label>
                <div className="space-y-3">
                  {painPoints.map((pain) => (
                    <button
                      key={pain.id}
                      onClick={() => setSelectedPainPoint(pain.id)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                        selectedPainPoint === pain.id
                          ? 'border-[#00FF85] bg-[#00FF85]/10 bubo-glow-green'
                          : 'border-gray-600 hover:border-[#00FF85]/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{pain.label}</span>
                        <Badge 
                          className={`${
                            pain.impact === 'Critical' 
                              ? 'bg-red-500/20 text-red-300 border-red-500/30'
                              : pain.impact === 'High'
                              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                              : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          }`}
                        >
                          {pain.impact}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={onGetStarted}
                disabled={!selectedRole || !selectedTeamSize || !selectedPainPoint}
                className="w-full py-4 bg-gradient-to-r from-[#00FF85] to-[#00FFC6] 
                         text-[#0E1726] font-semibold text-lg rounded-xl shadow-lg
                         hover:shadow-[0_0_40px_rgba(0,255,133,0.4)] transition-all duration-300 
                         transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start 60-Second Guided Preview
              </Button>
            </motion.div>

            {/* Live Preview */}
            <motion.div
              className="bubo-glass rounded-3xl p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#00FF85]">Live Preview</h3>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-[#00FF85]/20 text-[#00FF85] hover:bg-[#00FF85]/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#00FF85]/10 to-[#00FFC6]/10 border border-[#00FF85]/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-[#00FF85] rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-[#00FF85]">AI Triage Active</span>
                  </div>
                  <div className="text-white font-medium">
                    {selectedPainPoint === 'slow-response' && "Improving response times with predictive routing..."}
                    {selectedPainPoint === 'ticket-chaos' && "Organizing tickets with intelligent categorization..."}
                    {selectedPainPoint === 'escalation-hell' && "Reducing escalations with smart automation..."}
                    {selectedPainPoint === 'knowledge-gaps' && "Building knowledge graphs from past solutions..."}
                    {!selectedPainPoint && "Select your pain point to see AI in action"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#111827] border border-gray-600">
                    <div className="text-2xl font-bold text-white mb-1">
                      {selectedTeamSize === 'small' && '47'}
                      {selectedTeamSize === 'medium' && '234'}
                      {selectedTeamSize === 'large' && '1,247'}
                      {!selectedTeamSize && '--'}
                    </div>
                    <div className="text-sm text-gray-400">Active Tickets</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#111827] border border-gray-600">
                    <div className="text-2xl font-bold text-[#00FF85] mb-1">98.3%</div>
                    <div className="text-sm text-gray-400">AI Accuracy</div>
                  </div>
                </div>

                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc1NjgxMjQyNHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Dashboard Preview"
                  className="w-full h-48 object-cover rounded-xl opacity-60"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Feature Stories */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00FF85] 
                         bg-clip-text text-transparent space-grotesk">
              Intelligence in Action
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how BuboIQ transforms every aspect of IT support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Predictive Routing',
                desc: 'AI routes tickets to the right expert before escalation',
                color: 'from-[#00FF85] to-[#00FFC6]',
                demo: 'Route prediction: 94% accuracy'
              },
              {
                icon: BarChart3,
                title: 'Real-time Analytics',
                desc: 'Live dashboards track performance and predict issues',
                color: 'from-[#00FFC6] to-[#FFD400]',
                demo: 'SLA compliance: ↗️ 23%'
              },
              {
                icon: Zap,
                title: 'Auto-fix',
                desc: 'Common issues fixed automatically with confidence',
                color: 'from-[#FFD400] to-[#00FF85]',
                demo: 'Auto-resolved: 67% of tickets'
              },
              {
                icon: Shield,
                title: 'Proactive Monitoring',
                desc: 'Detect and prevent issues before they impact users',
                color: 'from-[#00FF85] to-[#00FFC6]',
                demo: 'Issues prevented: 156 this week'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-2xl bubo-glass p-6 hover:scale-105 
                         transition-all duration-500 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 
                               group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <feature.icon className="w-12 h-12 text-[#00FF85] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.desc}</p>
                  
                  <motion.div
                    className="p-3 rounded-lg bg-[#00FF85]/10 border border-[#00FF85]/30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-[#00FF85] font-semibold text-sm">{feature.demo}</div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Over Promises */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00FF85] 
                         bg-clip-text text-transparent space-grotesk">
              Measurable Impact
            </h2>
          </motion.div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { value: 32, suffix: '%', prefix: '-', label: 'Handle Time', color: 'text-[#00FF85]' },
              { value: 18, suffix: '%', prefix: '+', label: 'Fixed on first call', color: 'text-[#00FFC6]' },
              { value: 41, suffix: '%', prefix: '-', label: 'Escalations', color: 'text-[#FFD400]' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                className="text-center p-8 rounded-2xl bubo-glass hover:bubo-glow-green transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`mb-4 ${metric.color}`}>
                  <AnimatedCounter 
                    value={metric.value} 
                    suffix={metric.suffix} 
                    prefix={metric.prefix} 
                  />
                </div>
                <div className="text-gray-300 text-lg">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'IT Director',
                company: 'TechCorp',
                quote: 'BuboIQ reduced our ticket backlog by 60% in the first month.',
                rating: 5
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Support Manager',
                company: 'GlobalSoft',
                quote: 'The AI predictions are incredibly accurate. Game-changing.',
                rating: 5
              },
              {
                name: 'Emily Watson',
                role: 'CTO',
                company: 'StartupXYZ',
                quote: 'Finally, proactive IT support that actually works.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bubo-glass hover:border-[#00FF85]/30 transition-all duration-500"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD400] text-[#FFD400]" />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <BuboPricingSection onGetStarted={onGetStarted} />

      {/* Security & FAQ */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-[#00FF85] 
                         bg-clip-text text-transparent space-grotesk">
              Security & Trust
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbmV0d29yayUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzU2ODg3NjIwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Security"
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Shield className="w-8 h-8 text-[#00FF85]" />
                <div>
                  <h3 className="text-xl font-bold text-white">SOC 2 Compliant</h3>
                  <p className="text-gray-400">Enterprise-grade security standards</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Eye className="w-8 h-8 text-[#00FF85]" />
                <div>
                  <h3 className="text-xl font-bold text-white">GDPR Ready</h3>
                  <p className="text-gray-400">Full data privacy protection</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Cpu className="w-8 h-8 text-[#00FF85]" />
                <div>
                  <h3 className="text-xl font-bold text-white">End-to-End Encryption</h3>
                  <p className="text-gray-400">Your data stays secure</p>
                </div>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: 'How does BuboIQ integrate with existing tools?',
                a: 'BuboIQ connects with over 100+ tools including Slack, Microsoft Teams, Jira, ServiceNow, and more through our reliable API and pre-built integrations.'
              },
              {
                q: 'What makes the AI predictions accurate?',
                a: 'Our AI models are trained on millions of support interactions and continuously learn from your specific environment, achieving 94%+ accuracy in routing and resolution predictions.'
              },
              {
                q: 'Can I customize the automation rules?',
                a: 'Absolutely! BuboIQ provides a visual rule builder that lets you create custom workflows, escalation paths, and automation triggers tailored to your organization.'
              },
              {
                q: 'How long does implementation take?',
                a: 'Most customers are up and running within 2-3 business days. Our guided onboarding process and dedicated success team ensure a smooth transition.'
              }
            ].map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-600">
                <AccordionTrigger className="text-white hover:text-[#00FF85] transition-colors">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FF85]/5 to-[#00FFC6]/5" />
        <motion.div
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-white via-[#00FF85] to-[#00FFC6] 
                       bg-clip-text text-transparent space-grotesk">
            Upgrade Your Support Brain
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join thousands of IT teams already using BuboIQ to deliver intelligent, proactive support.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={onGetStarted}
              className="group relative px-12 py-6 bg-gradient-to-r from-[#00FF85] to-[#00FFC6] 
                       text-[#0E1726] font-bold text-xl rounded-xl shadow-lg
                       hover:shadow-[0_0_60px_rgba(0,255,133,0.5)] transition-all duration-300 
                       transform hover:scale-110 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Instant Sandbox
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>

            <Button
              variant="outline"
              onClick={onLoginClick}
              className="px-12 py-6 border-2 border-[#00FF85]/30 text-[#00FF85] 
                       hover:bg-[#00FF85]/10 hover:border-[#00FF85] font-bold text-xl 
                       rounded-xl transition-all duration-300 hover:scale-105"
            >
              Start Intelligent Onboarding
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BuboLandingPage;