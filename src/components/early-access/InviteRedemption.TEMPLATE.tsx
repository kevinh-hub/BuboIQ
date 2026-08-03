/**
 * Early Access Invite Redemption Page
 * 
 * Public landing page for invite redemption
 * Route: /invite/ea?token=ABC123
 * 
 * TEMPLATE - Implement based on Figma prompt specifications
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StatusPill, PlanCardBadge } from './EABadges';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface InviteRedemptionProps {
  token: string;
  onNavigate: (page: string) => void;
}

interface InviteDetails {
  email: string | null;
  planName: string;
  devicesIncluded: number;
  overageRate: number;
  expiresAt: string;
}

type ValidationStatus = 
  | 'loading'
  | 'valid'
  | 'expired'
  | 'redeemed'
  | 'revoked'
  | 'cohort-closed'
  | 'not-found';

export function InviteRedemption({ token, onNavigate }: InviteRedemptionProps) {
  const [status, setStatus] = useState<ValidationStatus>('loading');
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    validateToken();
    checkAuth();
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/validate/${token}`
      );
      
      const data = await res.json();

      if (data.valid) {
        setStatus('valid');
        setInviteDetails(data.invite);
      } else {
        setStatus(data.status || 'not-found');
      }
    } catch (error) {
      console.error('[EA] Validate error:', error);
      setStatus('not-found');
      toast.error('Failed to validate invite');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    // TODO: Check if user is authenticated
    const authToken = localStorage.getItem('supabase.auth.token');
    setIsAuthenticated(!!authToken);
  };

  const handleActivate = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Early Access terms');
      return;
    }

    const orgName = prompt('Enter your organization name:');
    if (!orgName) return;

    setActivating(true);
    try {
      const authToken = localStorage.getItem('supabase.auth.token');
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/redeem`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inviteToken: token,
            orgName
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success('Early Access activated successfully!');
        // TODO: Navigate to EA onboarding
        onNavigate('ea-onboarding');
      } else {
        throw new Error(data.error || 'Failed to activate invite');
      }
    } catch (error: any) {
      console.error('[EA] Activate error:', error);
      toast.error(error.message || 'Failed to activate invite');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#00FF85] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-cloud-white font-inter">Validating invite...</p>
        </div>
      </div>
    );
  }

  // Error States
  if (status !== 'valid') {
    return (
      <div className="min-h-screen bg-dark-midnight flex items-center justify-center p-4">
        <Card className="bubo-glass border-red-500/30 max-w-2xl w-full p-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-white mb-4">
              {status === 'expired' && 'Invite Expired'}
              {status === 'redeemed' && 'Invite Already Used'}
              {status === 'revoked' && 'Invite Revoked'}
              {status === 'cohort-closed' && 'Early Access Closed'}
              {status === 'not-found' && 'Invalid Invite'}
            </h1>

            <p className="text-cloud-white mb-8">
              {status === 'expired' && 'This invite has expired and can no longer be used.'}
              {status === 'redeemed' && 'This invite has already been activated by another user.'}
              {status === 'revoked' && 'This invite has been revoked and is no longer valid.'}
              {status === 'cohort-closed' && 'The Early Access cohort is currently closed.'}
              {status === 'not-found' && 'This invite could not be found. Please check the link.'}
            </p>

            <StatusPill status={status} className="mb-8" />

            <div className="space-y-3">
              <p className="text-mist-gray text-sm">
                Need help? Contact us at{' '}
                <a 
                  href="mailto:help@buboiq.com" 
                  className="text-[#00FF85] hover:text-white transition-colors"
                >
                  help@buboiq.com
                </a>
              </p>
              {(status === 'expired' || status === 'revoked') && (
                <Button 
                  onClick={() => window.location.href = 'mailto:help@buboiq.com?subject=Request%20New%20Early%20Access%20Invite'}
                  className="bubo-btn-neon-primary"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Request New Invite
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-midnight flex items-center justify-center p-4">
        <Card className="bubo-glass border-[#00FF85]/30 max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#00FF85]/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-[#00FF85]" />
            </div>

            <StatusPill status="valid" className="mb-6" />

            <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white mb-4">
              You're invited to{' '}
              <span className="text-[#00FF85] bubo-neon-text-green">BuboIQ Early Access</span>
            </h1>

            <p className="text-cloud-white text-lg mb-2">
              This single-use link expires on{' '}
              <strong className="text-white">
                {inviteDetails ? new Date(inviteDetails.expiresAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </strong>
            </p>

            <p className="text-mist-gray">
              Sign in to continue
            </p>
          </div>

          {/* Plan Preview */}
          {inviteDetails && (
            <PlanCardBadge 
              planName={inviteDetails.planName}
              devicesIncluded={inviteDetails.devicesIncluded}
              overageRate={inviteDetails.overageRate}
              className="mb-8"
            />
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => onNavigate('login')}
              className="bubo-btn-neon-primary w-full"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => onNavigate('signup')}
              className="bubo-btn-secondary w-full"
            >
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Authenticated State - Ready to Activate
  return (
    <div className="min-h-screen bg-dark-midnight flex items-center justify-center p-4">
      <Card className="bubo-glass border-[#00FF85]/30 max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#00FF85]/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-[#00FF85]" />
          </div>

          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white mb-4">
            Activate Your{' '}
            <span className="text-[#00FF85] bubo-neon-text-green">Early Access</span>
          </h1>

          <p className="text-cloud-white text-lg">
            You're about to join the exclusive BuboIQ Early Access program
          </p>
        </div>

        {/* Plan Summary */}
        {inviteDetails && (
          <>
            <div className="bubo-glass rounded-xl p-6 border border-[#00FF85]/30 mb-6">
              <h3 className="font-['Space_Grotesk'] font-bold text-white mb-4">
                What's Included:
              </h3>
              
              <ul className="space-y-3 text-cloud-white">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>EA-Pro Plan:</strong> $99/mo founders rate (locked for 12 months)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{inviteDetails.devicesIncluded} devices included</strong>, 
                    ${inviteDetails.overageRate.toFixed(2)}/device overage
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>14-day trial</strong>, no card required
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Single-use, invite-only</strong> — activate before it expires
                  </span>
                </li>
              </ul>
            </div>

            {/* Expiration Warning */}
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <p className="text-orange-400 text-sm">
                <strong>⏰ This invite expires on{' '}
                {new Date(inviteDetails.expiresAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</strong>
              </p>
            </div>
          </>
        )}

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 p-4 bubo-glass rounded-lg border border-slate-gray/30 cursor-pointer hover:border-[#00FF85]/30 transition-colors mb-6">
          <input 
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="w-5 h-5 rounded border-slate-gray/30 text-[#00FF85] focus:ring-[#00FF85] mt-0.5"
          />
          <span className="text-cloud-white text-sm flex-1">
            I agree to the Early Access terms and understand this program is invite-only. 
            I acknowledge the founders rate is locked for 12 months and billing will activate after the 14-day trial.
          </span>
        </label>

        {/* Activate Button */}
        <Button 
          onClick={handleActivate}
          disabled={!agreedToTerms || activating}
          className="bubo-btn-neon-primary w-full"
        >
          {activating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Activating...
            </>
          ) : (
            'Activate Early Access'
          )}
        </Button>

        <p className="text-center text-mist-gray text-sm mt-6">
          Questions? Email us at{' '}
          <a 
            href="mailto:help@buboiq.com" 
            className="text-[#00FF85] hover:text-white transition-colors"
          >
            help@buboiq.com
          </a>
        </p>
      </Card>
    </div>
  );
}

/**
 * IMPLEMENTATION NOTES:
 * 
 * 1. Token Validation:
 *    - Called on component mount
 *    - Shows loading state while validating
 *    - Handles all error states (expired, revoked, used, closed)
 * 
 * 2. Authentication Check:
 *    - Shows sign in/signup if not authenticated
 *    - Shows activation form if authenticated
 * 
 * 3. Activation Flow:
 *    - Requires terms checkbox
 *    - Prompts for org name
 *    - Calls redeem endpoint
 *    - Navigates to EA onboarding on success
 * 
 * 4. Error Handling:
 *    - All API errors shown via toast
 *    - Clear error messages for each state
 *    - Help email prominent on all error states
 * 
 * 5. Brand Consistency:
 *    - Uses EABadges components
 *    - Follows BuboIQ color scheme
 *    - Space Grotesk for headlines
 *    - Inter for body text
 * 
 * TODO:
 * - Add route to App.tsx for /invite/ea
 * - Parse token from URL query params
 * - Integrate with auth system
 * - Add analytics tracking
 * - Test all error states
 * - Implement mobile-responsive variant
 */