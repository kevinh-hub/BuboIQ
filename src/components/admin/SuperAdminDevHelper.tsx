// Super Admin Development Helper - BuboIQ
// Displays default credentials prominently in development mode
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Crown, Copy, Check, Eye, EyeOff, Code, AlertTriangle, Rocket } from 'lucide-react';
import { QuickSetupGuide } from './QuickSetupGuide';
import { toast } from 'sonner';

// Only show in development environment
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

export const SuperAdminDevHelper: React.FC = () => {
  const [showHelper, setShowHelper] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({});

  // Default credentials
  const CREDENTIALS = {
    email: 'kevinh@buboiq.com',
    password: 'TestAccount123!'
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems({ ...copiedItems, [key]: true });
      
      setTimeout(() => {
        setCopiedItems({ ...copiedItems, [key]: false });
      }, 2000);
      
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // Don't render in production or if dismissed
  if (!isDevelopment || !showHelper) {
    return null;
  }

  return (
    <>
      {showSetupGuide && (
        <QuickSetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
      
      <div className="fixed bottom-4 right-4 z-40 max-w-sm">
        <Card className="bubo-glass border-iq-neon-green/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-iq-neon-green" />
              <CardTitle className="text-sm">
                <span className="text-white">Dev</span>
                <span className="text-iq-neon-green ml-1">Helper</span>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelper(false)}
              className="h-6 w-6 p-0 text-mist-gray hover:text-white"
            >
              ×
            </Button>
          </div>
          <CardDescription className="text-xs text-mist-gray">
            Super Admin credentials for development
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Alert className="border-iq-neon-green/30 bg-iq-neon-green/10 p-2">
            <Crown className="w-3 h-3 text-iq-neon-green" />
            <AlertDescription className="text-xs text-iq-neon-green">
              Default super admin account created automatically
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {/* Email */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-mist-gray">Email:</span>
              <div className="flex items-center gap-1">
                <code className="text-xs text-electric-blue bg-dark-midnight px-1 py-0.5 rounded">
                  {CREDENTIALS.email}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(CREDENTIALS.email, 'email')}
                  className="h-5 w-5 p-0"
                >
                  {copiedItems.email ? (
                    <Check className="w-2 h-2 text-iq-neon-green" />
                  ) : (
                    <Copy className="w-2 h-2" />
                  )}
                </Button>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-mist-gray">Password:</span>
              <div className="flex items-center gap-1">
                <code className="text-xs text-signal-yellow bg-dark-midnight px-1 py-0.5 rounded">
                  {showPassword ? CREDENTIALS.password : '••••••••••••••'}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-5 w-5 p-0"
                >
                  {showPassword ? (
                    <EyeOff className="w-2 h-2" />
                  ) : (
                    <Eye className="w-2 h-2" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(CREDENTIALS.password, 'password')}
                  className="h-5 w-5 p-0"
                >
                  {copiedItems.password ? (
                    <Check className="w-2 h-2 text-iq-neon-green" />
                  ) : (
                    <Copy className="w-2 h-2" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-amber-warning/10 rounded border border-amber-warning/30">
            <AlertTriangle className="w-2 h-2 text-amber-warning flex-shrink-0" />
            <p className="text-xs text-amber-warning">
              Change password in Security tab
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Badge className="bg-slate-gray/20 text-mist-gray border-slate-gray/30 text-xs">
              Development Only
            </Badge>
            <Button
              onClick={() => setShowSetupGuide(true)}
              size="sm"
              variant="ghost"
              className="h-6 text-xs text-electric-blue hover:text-white"
            >
              <Rocket className="w-3 h-3 mr-1" />
              Setup Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};