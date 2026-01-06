import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useApp } from '../context/AppContext';
import { OwlEye, NeuralNetwork } from './BuboIconPack';
import { Eye, Brain, Zap, Shield, Mail, Lock, ArrowRight, Users, Rocket, Sparkles } from 'lucide-react';

export default function BuboLoginPage() {
  const { login, setShowDemoPage, setShowOnboarding } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'agent' | 'user' | 'client') => {
    setIsLoading(true);
    try {
      const credentials = {
        admin: { email: 'admin@ticketease.com', password: 'demo' },
        agent: { email: 'sarah@ticketease.com', password: 'demo' },
        user: { email: 'john@company.com', password: 'demo' },
        client: { email: 'client@example.com', password: 'demo' }
      };
      await login(credentials[role].email, credentials[role].password);
    } catch (error) {
      console.error('Quick login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bubo-neural-bg bubo-circuit-pattern flex items-center justify-center p-8">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-iq-green/5 rounded-full blur-3xl bubo-animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-signal-blue/5 rounded-full blur-2xl bubo-animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-prediction-purple/5 rounded-full blur-3xl bubo-animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="w-16 h-16 bg-iq-green/10 rounded-2xl flex items-center justify-center border border-iq-green/20">
                <OwlEye size={32} className="text-iq-green" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-cloud-white">BuboIQ</h1>
                <p className="text-lg text-mist-gray">AI-First IT Intelligence</p>
              </div>
            </div>
            
            <div className="max-w-md mx-auto lg:mx-0">
              <h2 className="text-2xl font-bold text-cloud-white mb-4">
                Proactive Intelligence. Predictive Actions.
              </h2>
              <p className="text-mist-gray text-lg leading-relaxed">
                BuboIQ transforms your IT operations with watchful AI that predicts, prevents, 
                and resolves issues before they impact your business.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-iq-green/20 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-iq-green" />
              </div>
              <div>
                <p className="text-cloud-white font-medium">Observatory Dashboard</p>
                <p className="text-sm text-mist-gray">Real-time infrastructure intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-signal-blue/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#93C5FD]" />
              </div>
              <div>
                <p className="text-cloud-white font-medium">Signal Processing</p>
                <p className="text-sm text-mist-gray">Intelligent event correlation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-prediction-purple/20 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#C4B5FD]" />
              </div>
              <div>
                <p className="text-cloud-white font-medium">AI Assist</p>
                <p className="text-sm text-mist-gray">Intelligent troubleshooting companion</p>
              </div>
            </div>
          </div>

          {/* Mission Launch CTA */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={() => setShowOnboarding(true)}
              className="bubo-btn-primary text-lg px-8 py-3 group"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Start Intelligence Setup
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </Button>
            <Button
              onClick={() => setShowDemoPage(true)}
              variant="outline"
              className="bubo-btn-ghost text-sm px-6 py-2 w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick Demo Instead
            </Button>
            <p className="text-xs text-mist-gray/80 text-center">
              ✨ Personalized AI workspace in 3 minutes
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bubo-signal-card border-slate-gray/30">
            <CardHeader className="space-y-4 text-center">
              <div className="w-12 h-12 bg-iq-green/10 rounded-xl mx-auto flex items-center justify-center border border-iq-green/20">
                <NeuralNetwork size={24} className="text-iq-green" />
              </div>
              <CardTitle className="text-2xl font-bold text-cloud-white">
                Welcome Back
              </CardTitle>
              <p className="text-mist-gray">
                Sign in to your BuboIQ intelligence platform
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cloud-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-mist-gray" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-input-background border-slate-gray/50 text-cloud-white placeholder-mist-gray focus:border-iq-green/50 focus:ring-iq-green/20"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-cloud-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-mist-gray" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 bg-input-background border-slate-gray/50 text-cloud-white placeholder-mist-gray focus:border-iq-green/50 focus:ring-iq-green/20"
                      required
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bubo-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Quick Login Options */}
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-gray/30" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-card text-mist-gray">Or try demo accounts</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleQuickLogin('admin')}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="bubo-btn-ghost text-xs"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Button>
                  <Button
                    onClick={() => handleQuickLogin('agent')}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="bubo-btn-ghost text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Agent
                  </Button>
                  <Button
                    onClick={() => handleQuickLogin('user')}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="bubo-btn-ghost text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    User
                  </Button>
                  <Button
                    onClick={() => handleQuickLogin('client')}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    className="bubo-btn-ghost text-xs"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Client
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-mist-gray pt-4 border-t border-slate-gray/30">
                <p>Powered by advanced AI intelligence</p>
                <p className="mt-1 opacity-75">Built for proactive IT operations</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}