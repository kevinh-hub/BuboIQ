import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn, Shield, Brain, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { SuperAdminQuickLogin } from '../admin/SuperAdminQuickLogin';

interface LoginPageProps {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
  onNavigate: (page: 'home' | 'features' | 'pricing' | 'about') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Signup flow
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setLoading(false);
          return;
        }

        // In production, this would create a new user account
        // For now, we'll simulate the signup process
        toast.success('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        // Login flow
        console.log('LoginPage: Attempting login for:', email);
        await onLoginSuccess(email, password);
        console.log('LoginPage: Login completed successfully');
      }
    } catch (error) {
      console.error('LoginPage: Auth error:', error);
      toast.error('Login Failed', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-iq-neon-green/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-accent/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <Card className="bubo-glass border-iq-neon-green/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="w-8 h-8 text-iq-neon-green" />
              <span className="font-['Space_Grotesk'] text-2xl font-bold">
                <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-mist-gray">
              {isSignUp 
                ? 'Start your free trial today' 
                : 'Sign in to your BuboIQ account'
              }
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white font-medium">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bubo-glass border-slate-gray/50 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-white font-medium">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 bubo-glass border-slate-gray/50 text-white"
                    placeholder={isSignUp ? 'Create a strong password' : 'Enter your password'}
                    required
                    minLength={isSignUp ? 8 : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-gray hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-white font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-gray" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 bubo-glass border-slate-gray/50 text-white"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bubo-btn-neon-primary text-lg py-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-dark-midnight border-t-transparent rounded-full animate-spin" />
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </div>
              )}
            </Button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-mist-gray">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-iq-neon-green hover:text-cyan-accent transition-colors font-medium"
            >
              {isSignUp ? 'Sign In' : 'Create Free Account'}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bubo-glass-blue rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-electric-blue" />
              <span className="text-electric-blue font-medium">Secure & Private</span>
            </div>
            <p className="text-sm text-mist-gray">
              Your data is encrypted and secure. We never share your information with third parties.
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-mist-gray hover:text-white transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </Card>

        {/* Super Admin Quick Login */}
        {/* Hidden as requested by user to remove super admin console references */}
        {/* <SuperAdminQuickLogin 
          onLoginAttempt={onLoginAttempt}
          isLoading={loading}
        /> */}

        {/* Configuration Info - Hidden in production */}
      </div>
    </div>
  );
};