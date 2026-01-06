// Billing (Pre-Stripe) - BuboIQ
// Display-only billing state before Stripe portal launch
import React from 'react';
import { AlertCircle, Calendar, Shield, Mail, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface BillingPreStripeProps {
  trialExpired?: boolean;
  demo?: boolean;
}

export const BillingPreStripe: React.FC<BillingPreStripeProps> = ({
  trialExpired = false,
  demo = true,
}) => {
  const handleContactSupport = () => {
    window.location.href = 'mailto:help@buboiq.com?subject=Billing%20Support%20Request';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
            <span className="text-white">Billing</span>{' '}
            <span className="text-[#00FF85]">& Subscription</span>
          </h1>
          <p className="text-white/60">Manage your BuboIQ subscription and payment details</p>
        </div>

        {/* Coming Soon Banner */}
        <Alert className="bg-gradient-to-r from-[#1E90FF]/20 to-[#1E90FF]/10 border-[#1E90FF]/30">
          <AlertCircle className="h-5 w-5 text-[#1E90FF]" />
          <AlertTitle className="text-[#1E90FF] font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Billing Portal Launches Soon
          </AlertTitle>
          <AlertDescription className="text-white/80 mt-2">
            Your founders rate is reserved and will be available when our billing portal goes live. 
            You'll be notified via email when payment setup is ready.
          </AlertDescription>
        </Alert>

        {/* Trial Expired Banner - Conditional */}
        {trialExpired && (
          <Alert className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border-yellow-500/30">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <AlertTitle className="text-yellow-400 font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Trial Ended — Read-Only Mode
            </AlertTitle>
            <AlertDescription className="text-white/80 mt-2">
              Your 14-day trial has ended. Your account is in observe-only mode until payment 
              is configured. All your data is preserved and will be fully accessible once you upgrade.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Current Plan Card */}
          <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Shield className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Your</span>
                    <span className="text-[#00FF85]">Plan</span>
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-[#00FF85]/20 to-[#1E90FF]/20 text-[#00FF85] border border-[#00FF85]/40">
                    EA-PRO • Founders Rate
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl text-white font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    $99
                  </div>
                  <div className="text-white/60 text-sm">per month</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              
              {/* Plan Details */}
              <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-xl p-4 space-y-3">
                <PlanDetail label="Devices Included" value="100" />
                <PlanDetail label="Overage Rate" value="$0.90 per device" />
                <PlanDetail 
                  label="Founders Lock" 
                  value={
                    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                      Grandfathered
                    </Badge>
                  } 
                />
                <PlanDetail label="Rate Guaranteed Until" value="Dec 1, 2025" />
              </div>

              {/* Features Included */}
              <div className="space-y-2 pt-2">
                <p className="text-white/60 text-sm font-medium mb-3">Included Features:</p>
                <FeatureItem text="AI-Driven Intelligence Signals" />
                <FeatureItem text="Proactive Issue Detection" />
                <FeatureItem text="Knowledge Base Automation" />
                <FeatureItem text="Multi-User Collaboration" />
                <FeatureItem text="Priority Email Support" />
              </div>

            </CardContent>
          </Card>

          {/* Status & Support Card */}
          <div className="space-y-6">
            
            {/* Trial Status Card */}
            {!trialExpired ? (
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Calendar className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Trial</span>
                    <span className="text-[#00FF85]">Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-br from-[#00FF85]/10 to-[#00FF85]/5 border border-[#00FF85]/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/80 text-sm">Trial Period</span>
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                        Active
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Started</span>
                        <span className="text-white/90">Dec 25, 2024</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Ends</span>
                        <span className="text-white/90">Jan 8, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Days Remaining</span>
                        <span className="text-[#00FF85] font-bold">14 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 text-sm font-medium mb-1">
                      Trial: 14 days, no card required
                    </p>
                    <p className="text-white/60 text-xs">
                      You'll be notified before your trial ends. Continue using all features risk-free.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              // Observe-Only State Card
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Account</span>
                    <span className="text-yellow-400">Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 mb-3">
                      Observe-Only Mode
                    </Badge>
                    <p className="text-white/80 text-sm mb-3">
                      Your trial has ended. You can view all your data but cannot create new tickets, 
                      signals, or modify settings until payment is configured.
                    </p>
                    <div className="space-y-2 pt-2 border-t border-yellow-500/20">
                      <p className="text-white/60 text-xs">✓ All data preserved</p>
                      <p className="text-white/60 text-xs">✓ Founders rate reserved</p>
                      <p className="text-white/60 text-xs">✓ Full access after upgrade</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleContactSupport}
                    className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/40 transition-all duration-200"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Us to Upgrade
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Support Card */}
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <Mail className="w-5 h-5 text-[#00FF85]" />
                  <span className="text-white">Need</span>
                  <span className="text-[#00FF85]">Help?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70 text-sm">
                  Have questions about billing, your plan, or need assistance? 
                  Our team is here to help.
                </p>

                <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-xs mb-2">Contact Support</p>
                  <a
                    href="mailto:help@buboiq.com"
                    className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    help@buboiq.com
                  </a>
                </div>

                <Button
                  onClick={handleContactSupport}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/5 transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-[#1C1C1E]/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
          <p className="text-white/60 text-sm">
            Questions about billing?{' '}
            <a
              href="mailto:help@buboiq.com"
              className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium"
            >
              help@buboiq.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
};

// Helper Components
interface PlanDetailProps {
  label: string;
  value: React.ReactNode;
}

const PlanDetail: React.FC<PlanDetailProps> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-white/60 text-sm">{label}</span>
    <span className="text-white/90 text-sm font-medium">
      {typeof value === 'string' ? value : value}
    </span>
  </div>
);

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF85]" />
    <span className="text-white/80">{text}</span>
  </div>
);

export default BillingPreStripe;
