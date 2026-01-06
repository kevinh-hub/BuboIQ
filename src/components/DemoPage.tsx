import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import BuboOnboardingMission from './BuboOnboardingMission';
import { 
  Shield, 
  UserCheck, 
  User as UserIcon, 
  Users, 
  ArrowLeft,
  Eye,
  Brain,
  Rocket,
  Sparkles
} from 'lucide-react';

interface DemoPageProps {
  onBackToLogin: () => void;
}

export default function DemoPage({ onBackToLogin }: DemoPageProps) {
  const { login } = useApp();
  const [showMission, setShowMission] = useState(false);

  const demoAccounts = [
    {
      type: 'admin',
      email: 'admin@buboiq.com',
      password: 'demo',
      name: 'Dr. Sarah Chen - Chief Intelligence Officer',
      description: 'Full platform control with AI intelligence oversight',
      icon: Shield,
      gradient: 'from-crimson-danger to-amber-warning',
      features: [
        'Complete AI intelligence dashboard access',
        'Signal stream configuration and tuning',
        'Incident room command and control',
        'Automation studio workflow design',
        'Team and governance management',
        'Advanced analytics and reporting'
      ],
      stats: { signals: '1,247', incidents: '23', efficiency: '94%' }
    },
    {
      type: 'analyst',
      email: 'alex@buboiq.com',
      password: 'demo',
      name: 'Alex Rodriguez - Senior AI Analyst',
      description: 'AI-powered incident response and signal analysis',
      icon: UserCheck,
      gradient: 'from-signal-blue to-iq-green',
      features: [
        'Real-time alert stream monitoring',
        'AI-assisted incident investigation',
        'Evidence pack analysis and correlation',
        'Automated response workflows',
        'Performance metrics and insights',
        'Collaborative incident management'
      ],
      stats: { analyzed: '456', resolved: '89%', accuracy: '97%' },
      recommended: true
    },
    {
      type: 'engineer',
      email: 'jordan@company.com',
      password: 'demo',
      name: 'Jordan Kim - DevOps Engineer',
      description: 'Infrastructure monitoring and technical signal analysis',
      icon: UserIcon,
      gradient: 'from-iq-green to-glow-cyan',
      features: [
        'Infrastructure signal monitoring',
        'Technical incident escalation',
        'System performance analysis',
        'Network anomaly detection',
        'Automated remediation triggers',
        'Hardware failure prediction'
      ],
      stats: { monitored: '24/7', uptime: '99.9%', alerts: '342' }
    },
    {
      type: 'observer',
      email: 'client@partner.com',
      password: 'demo',
      name: 'External Security Partner',
      description: 'Limited access for external stakeholders',
      icon: Users,
      gradient: 'from-prediction-purple to-signal-blue',
      features: [
        'Dedicated observer portal interface',
        'Resolved incident tracking only',
        'Custom security reporting',
        'Limited access controls',
        'Priority communication channels',
        'Compliance monitoring'
      ],
      stats: { projects: '3', incidents: '18', access: 'Secure' }
    }
  ];

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    console.log('Attempting demo login for:', account.email, 'with password:', account.password);
    login(account.email, account.password);
  };

  if (showMission) {
    return (
      <div className="min-h-screen bg-nocturne-indigo">
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-50">
          <Button
            variant="ghost"
            onClick={() => setShowMission(false)}
            className="text-mist-gray hover:text-cloud-white bg-slate-gray/30 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Demo Options
          </Button>
        </div>
        <BuboOnboardingMission />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nocturne-indigo bubo-neural-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-iq-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-signal-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-prediction-purple/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-mist-gray/10 backdrop-blur-sm bg-nocturne-indigo/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBackToLogin}
              className="text-mist-gray hover:text-cloud-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-iq-green to-glow-cyan rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-nocturne-indigo" />
              </div>
              <div>
                <h1 className="font-bold text-cloud-white">BuboIQ Demo</h1>
                <p className="text-sm text-mist-gray">Experience AI intelligence</p>
              </div>
            </div>
            
            <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30">
              <Sparkles className="w-3 h-3 mr-1" />
              No Registration Required
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-iq-green to-glow-cyan rounded-3xl flex items-center justify-center mb-8 bubo-glow-green shadow-2xl">
            <Brain className="w-10 h-10 text-nocturne-indigo" />
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-iq-green via-glow-cyan to-prediction-purple bg-clip-text text-transparent mb-6">
            Experience BuboIQ Intelligence
          </h1>
          <p className="text-xl text-mist-gray max-w-4xl mx-auto mb-12">
            Choose your path: Launch an AI-guided mission to see BuboIQ learn your environment, 
            or dive directly into role-based demos with pre-configured scenarios.
          </p>

          {/* Mission Launch CTA */}
          <div className="mb-16">
            <Button
              onClick={() => setShowMission(true)}
              className="bubo-btn-primary text-lg px-8 py-4 mr-4"
            >
              <Rocket className="w-5 h-5 mr-3" />
              Launch AI Mission Experience
              <Sparkles className="w-5 h-5 ml-3" />
            </Button>
            <p className="text-sm text-mist-gray/80 mt-3">
              Watch BuboIQ analyze your environment and demonstrate intelligence in real-time
            </p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-mist-gray/30 to-transparent w-full max-w-md" />
            <span className="px-4 text-sm text-mist-gray bg-nocturne-indigo">OR</span>
            <div className="h-px bg-gradient-to-r from-transparent via-mist-gray/30 to-transparent w-full max-w-md" />
          </div>
        </div>

        {/* Demo Accounts Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-cloud-white mb-8">
            Try Role-Based Demos
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {demoAccounts.map((account) => {
              const Icon = account.icon;
              return (
                <Card
                  key={account.type}
                  className={`group relative overflow-hidden bubo-signal-card cursor-pointer hover:bubo-glow-green transition-all duration-500 ${
                    account.recommended ? 'ring-2 ring-iq-green/30' : ''
                  }`}
                  onClick={() => handleDemoLogin(account)}
                >
                  {account.recommended && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-iq-green text-nocturne-indigo border-iq-green">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    </div>
                  )}

                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${account.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${account.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="h-8 w-8 text-nocturne-indigo" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-cloud-white mb-1">{account.name}</h3>
                        <Badge variant="outline" className="text-xs mb-3 border-iq-green/30 text-iq-green">
                          {account.type.toUpperCase()} ROLE
                        </Badge>
                        <p className="text-sm text-mist-gray leading-relaxed">
                          {account.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-slate-gray/20 rounded-xl border border-mist-gray/10">
                      {Object.entries(account.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="font-bold text-iq-green">{value}</div>
                          <div className="text-xs text-mist-gray capitalize">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-cloud-white text-sm">Capabilities:</h4>
                      <div className="space-y-2">
                        {account.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-iq-green mt-2 flex-shrink-0" />
                            <span className="text-mist-gray">{feature}</span>
                          </div>
                        ))}
                        {account.features.length > 4 && (
                          <p className="text-xs text-iq-green pl-3.5">
                            +{account.features.length - 4} more capabilities
                          </p>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button className="w-full bubo-btn-secondary">
                      <Eye className="w-4 h-4 mr-2" />
                      Experience {account.name}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card/50 border-border/50 text-center">
            <div className="w-12 h-12 bg-iq-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-6 w-6 text-iq-green" />
            </div>
            <h3 className="font-semibold text-cloud-white mb-2">Instant Intelligence</h3>
            <p className="text-sm text-mist-gray">
              No setup required. Experience BuboIQ's AI analyzing and learning your environment in real-time.
            </p>
          </Card>
          
          <Card className="p-6 bg-card/50 border-border/50 text-center">
            <div className="w-12 h-12 bg-signal-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-signal-blue" />
            </div>
            <h3 className="font-semibold text-cloud-white mb-2">Full AI Features</h3>
            <p className="text-sm text-mist-gray">
              Experience complete signal correlation, predictive analytics, and intelligent automation workflows.
            </p>
          </Card>
          
          <Card className="p-6 bg-card/50 border-border/50 text-center">
            <div className="w-12 h-12 bg-prediction-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-prediction-purple" />
            </div>
            <h3 className="font-semibold text-cloud-white mb-2">Role Perspectives</h3>
            <p className="text-sm text-mist-gray">
              Understand how different users interact with BuboIQ's intelligence platform and AI capabilities.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}