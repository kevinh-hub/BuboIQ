import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useApp } from '../App';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Shield,
  Clock,
  Users,
  AlertCircle,
  Code
} from 'lucide-react';
// Remove logo import

export default function LoginPage() {
  const { login, setShowDemoPage } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const demoAccounts = [
    { email: 'admin@ticketease.com', role: 'Admin', icon: Shield, color: 'red' },
    { email: 'sarah@ticketease.com', role: 'Agent', icon: Users, color: 'blue' },
    { email: 'john@company.com', role: 'User', icon: CheckCircle, color: 'green' },
    { email: 'client@example.com', role: 'Client', icon: Users, color: 'purple' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      console.error('Login submission error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting demo login for:', email);
      await login(email, 'demo');
    } catch (err: any) {
      console.error('Demo login error:', err);
      setError(`Demo login failed for ${email}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTryDemo = () => {
    setShowDemoPage(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-blue-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ backgroundColor: '#2ECC71' }}>
            <span className="text-4xl">🦉</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BuboIQ</h1>
          <p className="text-gray-600 text-lg">AI-Driven IT Support</p>
        </div>

        {/* Debug Toggle */}
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            <Code className="h-3 w-3 mr-1" />
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
        </div>

        {/* Debug Panel */}
        {showDebug && (
          <div className="debug-panel">
            <strong>Available Demo Accounts:</strong>
            <ul className="mt-2 space-y-1">
              {demoAccounts.map(account =>(
                <li key={account.email}>
                  • {account.email} ({account.role}) - Password: demo
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <strong>Login Process:</strong>
              <ol className="mt-1 space-y-1 list-decimal list-inside">
                <li>Frontend calls apiClient.signIn(email, password)</li>
                <li>Backend checks if password === 'demo'</li>
                <li>If demo, looks up user in KV store</li>
                <li>Returns demo session token</li>
              </ol>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Login Error</p>
                <p className="mt-1">{error}</p>
                {showDebug && (
                  <div className="mt-2 text-xs">
                    <p>Try one of the demo accounts above or check the browser console for more details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sign In Form */}
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">{isSignUp ? 'Create Account' : 'Sign In'}</CardTitle>
            <CardDescription className="text-base">
              {isSignUp 
                ? 'Create your account to start monitoring your infrastructure'
                : 'Access your BuboIQ Observatory'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="h-11"
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="h-11"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="h-11 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="h-11"
                    disabled={loading}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium btn-cta-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {!isSignUp && (
              <div className="text-center">
                <Button variant="link" className="text-sm text-gray-600" disabled={loading}>
                  Forgot your password?
                </Button>
              </div>
            )}

            <Separator />

            {/* Quick Demo Login */}
            {showDebug && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 text-center">Quick Demo Login</h4>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account) => {
                    const IconComponent = account.icon;
                    return (
                      <Button
                        key={account.email}
                        onClick={() => handleDemoLogin(account.email)}
                        variant="outline"
                        size="sm"
                        className="text-xs p-2 h-auto flex flex-col space-y-1"
                        disabled={loading}
                      >
                        <IconComponent className="h-3 w-3" />
                        <span>{account.role}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Demo CTA */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Try Before You Buy</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Explore BuboIQ with our interactive demo accounts. See AI-driven IT support in action!
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-red-500" />
                    <span className="text-gray-600">Admin</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-600">Agent</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-gray-600">User</span>
                  </div>
                </div>

                <Button 
                  onClick={handleTryDemo}
                  variant="outline" 
                  className="w-full font-medium border-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                  disabled={loading}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Try Demo Accounts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
                disabled={loading}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <span>🧠</span>
              <span>AI-Powered</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>🔮</span>
              <span>Predictive</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Proactive</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 BuboIQ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}