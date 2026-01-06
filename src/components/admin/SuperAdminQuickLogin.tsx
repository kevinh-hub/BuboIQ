// Super Admin Quick Login Helper - BuboIQ
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Crown, Shield } from 'lucide-react';

interface SuperAdminQuickLoginProps {
  onLoginAttempt: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const SuperAdminQuickLogin: React.FC<SuperAdminQuickLoginProps> = ({ 
  onLoginAttempt, 
  isLoading: externalLoading = false 
}) => {
  // Internal loading state for this component
  const [internalLoading, setInternalLoading] = useState(false);
  
  // Default super admin credentials
  const SUPER_ADMIN_CREDENTIALS = {
    email: 'kevinh@buboiq.com',
    password: 'TestAccount123!'
  };

  const handleSuperAdminLogin = async () => {
    console.log('=== SuperAdminQuickLogin: BUTTON CLICKED ===');
    console.log('SuperAdminQuickLogin: Setting loading state to true');
    setInternalLoading(true);
    try {
      console.log('SuperAdminQuickLogin: About to call onLoginAttempt');
      console.log('SuperAdminQuickLogin: Email:', SUPER_ADMIN_CREDENTIALS.email);
      await onLoginAttempt(SUPER_ADMIN_CREDENTIALS.email, SUPER_ADMIN_CREDENTIALS.password);
      console.log('=== SuperAdminQuickLogin: Login attempt completed successfully ===');
    } catch (error) {
      console.error('=== SuperAdminQuickLogin: Login FAILED ===');
      console.error('Error details:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('SuperAdminQuickLogin: Setting loading state to false');
      setInternalLoading(false);
    }
  };

  const isLoading = internalLoading || externalLoading;

  return (
    <Card className="bubo-glass border-iq-neon-green/20 mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-iq-neon-green" />
          <CardTitle className="text-sm">
            <span className="text-white">Super Admin</span>
            <span className="text-iq-neon-green ml-1">Quick Login</span>
          </CardTitle>
        </div>
        <CardDescription className="text-mist-gray text-xs">
          kevinh@buboiq.com • Change password after login
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          type="button"
          onClick={handleSuperAdminLogin}
          disabled={isLoading}
          className="w-full bubo-btn-neon-primary text-sm"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-dark-midnight border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Shield className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Logging in...' : 'Login as Super Admin'}
        </Button>
      </CardContent>
    </Card>
  );
};