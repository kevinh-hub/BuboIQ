// Invite Redemption Landing (/invite/ea)
// BuboIQ - Early Access Invite Redemption Flow
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Clock, Shield, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface InviteRedemptionPageProps {
  token?: string;
  authenticated?: boolean;
  demo?: boolean;
}

type TokenStatus = 'Valid' | 'Expiring Soon' | 'Expired' | 'Revoked';

export const InviteRedemptionPage: React.FC<InviteRedemptionPageProps> = ({
  token = 'abc123def456',
  authenticated = false,
  demo = true,
}) => {
  const [tokenStatus] = useState<TokenStatus>('Valid');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    if (!acceptedTerms) {
      toast.error('Accept the terms to continue');
      return;
    }

    setIsActivating(true);
    
    // Simulate activation
    setTimeout(() => {
      toast.success('Early Access activated! Welcome to BuboIQ 🎉', {
        description: 'Redirecting to onboarding...',
      });
      setTimeout(() => {
        // Would redirect to onboarding
        console.log('Redirecting to onboarding...');
        setIsActivating(false);
      }, 2000);
    }, 1500);
  };

  const getTokenStatusColor = (status: TokenStatus) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'Expiring Soon':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'Expired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
      case 'Revoked':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-white/20 text-white border-white/40';
    }
  };

  const getTokenStatusIcon = (status: TokenStatus) => {
    switch (status) {
      case 'Valid':
        return <CheckCircle className="w-5 h-5" />;
      case 'Expiring Soon':
        return <Clock className="w-5 h-5" />;
      case 'Expired':
      case 'Revoked':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Unauthenticated View
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          
          {/* BuboIQ Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FF85]/30 to-[#00FF85]/10 border border-[#00FF85]/40 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#00FF85]" />
              </div>
            </div>
            <h1 className="text-4xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
              <span className="text-white">BUBO</span>
              <span className="text-[#00FF85]">IQ</span>
            </h1>
          </div>

          <Card className="bg-[#1C1C1E]/60 backdrop-blur-xl border-[#00FF85]/20 shadow-[0_0_50px_rgba(0,255,133,0.1)]">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                You're invited to <span className="text-[#00FF85]">BuboIQ Early Access</span>
              </CardTitle>
              
              {/* Token Status */}
              <div className="flex justify-center">
                <Badge className={`${getTokenStatusColor(tokenStatus)} border px-4 py-2 flex items-center gap-2`}>
                  {getTokenStatusIcon(tokenStatus)}
                  <span className="font-medium">Invite {tokenStatus}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              
              {/* Invite Info */}
              <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-xl p-6 text-center">
                <p className="text-white/90 text-lg mb-2">
                  Every message becomes insight.
                </p>
                <p className="text-white/60">
                  You've been selected for exclusive founders-rate access to BuboIQ's 
                  AI-driven proactive IT support intelligence platform.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid md:grid-cols-3 gap-4">
                <BenefitCard
                  icon={<Shield className="w-6 h-6" />}
                  title="Founders Rate"
                  description="Lock in $99/mo pricing"
                />
                <BenefitCard
                  icon={<Users className="w-6 h-6" />}
                  title="100 Devices"
                  description="Included in plan"
                />
                <BenefitCard
                  icon={<Clock className="w-6 h-6" />}
                  title="14-Day Trial"
                  description="No card required"
                />
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] font-bold py-6 text-lg transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,133,0.4)]"
                  onClick={() => console.log('Navigate to signup')}
                >
                  Create Account
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5 py-6 text-lg"
                  onClick={() => console.log('Navigate to login')}
                >
                  Sign In
                </Button>
              </div>

              {/* Expiry Notice */}
              {tokenStatus === 'Valid' && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400 font-medium text-sm">Your link expires on Jan 5, 2025</p>
                    <p className="text-white/60 text-sm mt-1">
                      Create your account to secure your founders rate
                    </p>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Footer Help */}
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm mb-2">Questions?</p>
            <a
              href="mailto:help@buboiq.com"
              className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium"
            >
              help@buboiq.com
            </a>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated View - Activation
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        
        {/* BuboIQ Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00FF85]/30 to-[#00FF85]/10 border border-[#00FF85]/40 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#00FF85]" />
            </div>
          </div>
          <h1 className="text-4xl mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
            <span className="text-white">BUBO</span>
            <span className="text-[#00FF85]">IQ</span>
          </h1>
        </div>

        <Card className="bg-[#1C1C1E]/60 backdrop-blur-xl border-[#00FF85]/20 shadow-[0_0_50px_rgba(0,255,133,0.1)]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
              Activate Your <span className="text-[#00FF85]">Early Access</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-[#00FF85]/10 to-[#00FF85]/5 border border-[#00FF85]/30 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/40 mb-3">
                    EA-PRO • Founders Rate
                  </Badge>
                  <h3 className="text-2xl text-white font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    $99<span className="text-lg text-white/60 font-normal">/month</span>
                  </h3>
                </div>
                <CheckCircle className="w-8 h-8 text-[#00FF85]" />
              </div>

              <div className="space-y-3">
                <PlanFeature text="100 devices included" />
                <PlanFeature text="$0.90 per device overage" />
                <PlanFeature text="14-day trial, no card required" />
                <PlanFeature text="Single-use founders rate (locked for 12 months)" />
                <PlanFeature text="Full access to BuboIQ Intelligence Platform" />
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="bg-[#0A0A0A]/60 border border-white/10 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  className="mt-1 border-white/30 data-[state=checked]:bg-[#00FF85] data-[state=checked]:border-[#00FF85]"
                />
                <Label
                  htmlFor="terms"
                  className="text-white/80 leading-relaxed cursor-pointer text-sm"
                >
                  I understand that this is a <span className="text-[#00FF85] font-medium">single-use</span> founders 
                  rate invitation. By activating, I agree to the EA-Pro plan terms: $99/month for 100 devices, 
                  $0.90 per additional device, with a 14-day trial period (no credit card required). 
                  This rate is locked for 12 months from activation.
                </Label>
              </div>
            </div>

            {/* Activation Button */}
            <Button
              onClick={handleActivate}
              disabled={!acceptedTerms || isActivating}
              className="w-full bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] font-bold py-6 text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,133,0.4)]"
            >
              {isActivating ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin mr-3" />
                  Activating...
                </>
              ) : (
                'Activate Early Access'
              )}
            </Button>

            {/* Help Text */}
            <p className="text-center text-white/50 text-sm">
              Questions? Contact us at{' '}
              <a
                href="mailto:help@buboiq.com"
                className="text-[#00FF85] hover:text-white transition-colors duration-300"
              >
                help@buboiq.com
              </a>
            </p>

          </CardContent>
        </Card>

      </div>
    </div>
  );
};

// Helper Components
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <div className="bg-[#0A0A0A]/40 border border-white/10 rounded-xl p-4 text-center">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/5 border border-[#00FF85]/30 flex items-center justify-center mx-auto mb-3 text-[#00FF85]">
      {icon}
    </div>
    <h4 className="text-white font-medium mb-1">{title}</h4>
    <p className="text-white/60 text-sm">{description}</p>
  </div>
);

interface PlanFeatureProps {
  text: string;
}

const PlanFeature: React.FC<PlanFeatureProps> = ({ text }) => (
  <div className="flex items-center gap-3">
    <CheckCircle className="w-5 h-5 text-[#00FF85] flex-shrink-0" />
    <span className="text-white/90">{text}</span>
  </div>
);

export default InviteRedemptionPage;
