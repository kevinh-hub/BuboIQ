// BuboIQ Support System - Complete Showcase
// All screens + components in one interactive demo
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { FileText, Users, CreditCard, Mail, Layers } from 'lucide-react';

// Import all support components
import { TicketDetailInternal } from './TicketDetailInternal';
import { OrgOverviewInternal } from './OrgOverviewInternal';
import { EarlyAccessAdminFull } from './EarlyAccessAdminFull';
import { InviteRedemptionPage } from './InviteRedemptionPage';
import { BillingPreStripe } from './BillingPreStripe';
import { HelpEmailFooter } from './HelpEmailFooter';
import { StatusBadges, StatusPills, SupportButtons, EmailLink, OpenInStreakLink, EmptyStates } from './SupportComponents';

export const SupportShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ticket');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      
      {/* Header */}
      <div className="bg-[#1C1C1E]/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                <span className="text-white">Support</span>{' '}
                <span className="text-[#00FF85]">System</span>{' '}
                <span className="text-white/60">Showcase</span>
              </h1>
              <p className="text-white/60 text-sm">
                Complete UI kit for BuboIQ Support + Early Access
              </p>
            </div>
            <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30">
              Production Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          
          {/* Tab Navigation */}
          <TabsList className="bg-[#1C1C1E]/60 border border-white/10 p-1 grid grid-cols-6 gap-1">
            <TabsTrigger 
              value="ticket" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Ticket Detail
            </TabsTrigger>
            <TabsTrigger 
              value="org" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <Users className="w-4 h-4 mr-2" />
              Org Overview
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <Layers className="w-4 h-4 mr-2" />
              EA Admin
            </TabsTrigger>
            <TabsTrigger 
              value="invite" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <Mail className="w-4 h-4 mr-2" />
              Redemption
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger 
              value="components" 
              className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85]"
            >
              <Layers className="w-4 h-4 mr-2" />
              Components
            </TabsTrigger>
          </TabsList>

          {/* Ticket Detail */}
          <TabsContent value="ticket" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Support Pipeline</span>{' '}
                  <span className="text-[#00FF85]">— Ticket Detail (Internal)</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Internal ticket view with Streak integration, status tracking, and KB linking
                </p>
              </CardHeader>
            </Card>
            <TicketDetailInternal demo={true} />
          </TabsContent>

          {/* Org Overview */}
          <TabsContent value="org" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Organization</span>{' '}
                  <span className="text-[#00FF85]">Overview (Internal)</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Complete org profile with plan details, activity tracking, and internal notes
                </p>
              </CardHeader>
            </Card>
            <OrgOverviewInternal demo={true} />
          </TabsContent>

          {/* EA Admin */}
          <TabsContent value="admin" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Early Access</span>{' '}
                  <span className="text-[#00FF85]">Admin Dashboard</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Cohort management, invite creation, and redemption tracking
                </p>
              </CardHeader>
            </Card>
            <EarlyAccessAdminFull />
          </TabsContent>

          {/* Invite Redemption */}
          <TabsContent value="invite" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10 mb-6">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Invite</span>{' '}
                  <span className="text-[#00FF85]">Redemption Landing</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Public landing page for Early Access invite redemption
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      !isAuthenticated
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    Unauthenticated View
                  </button>
                  <button
                    onClick={() => setIsAuthenticated(true)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      isAuthenticated
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    Authenticated View
                  </button>
                </div>
              </CardContent>
            </Card>
            <InviteRedemptionPage authenticated={isAuthenticated} demo={true} />
          </TabsContent>

          {/* Billing */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10 mb-6">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Billing</span>{' '}
                  <span className="text-[#00FF85]">(Pre-Stripe)</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Read-only billing view before Stripe portal launch
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTrialExpired(false)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      !trialExpired
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    Active Trial
                  </button>
                  <button
                    onClick={() => setTrialExpired(true)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      trialExpired
                        ? 'bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30'
                        : 'bg-white/5 text-white/60 border border-white/10'
                    }`}
                  >
                    Trial Expired
                  </button>
                </div>
              </CardContent>
            </Card>
            <BillingPreStripe trialExpired={trialExpired} demo={true} />
          </TabsContent>

          {/* Components Library */}
          <TabsContent value="components" className="space-y-6">
            <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="text-white">Component</span>{' '}
                  <span className="text-[#00FF85]">Library</span>
                </CardTitle>
                <p className="text-white/60 text-sm mt-2">
                  Reusable design system components
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                
                {/* Status Badges */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Status Badges
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadges.TicketStatus status="New" />
                    <StatusBadges.TicketStatus status="In Progress" />
                    <StatusBadges.TicketStatus status="Resolved" />
                    <StatusBadges.Priority level="Sev-1" />
                    <StatusBadges.Priority level="Sev-2" />
                    <StatusBadges.EAPro />
                    <StatusBadges.FoundersRate />
                  </div>
                </div>

                {/* Status Pills */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Status Pills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <StatusPills.InviteStatus status="Unused" />
                    <StatusPills.InviteStatus status="Redeemed" />
                    <StatusPills.InviteStatus status="Expired" />
                    <StatusPills.TokenValidity status="Valid" />
                    <StatusPills.TokenValidity status="Expiring Soon" />
                  </div>
                </div>

                {/* Buttons */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Buttons
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <SupportButtons.Primary>Primary Action</SupportButtons.Primary>
                    <SupportButtons.Secondary>Secondary Action</SupportButtons.Secondary>
                    <SupportButtons.Destructive>Delete</SupportButtons.Destructive>
                    <SupportButtons.ExternalLink href="#">Open in Streak</SupportButtons.ExternalLink>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Special Links
                  </h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    <EmailLink />
                    <EmailLink variant="button" />
                    <OpenInStreakLink id="TKT-123" type="ticket" />
                  </div>
                </div>

                {/* Empty States */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Empty States
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <EmptyStates.NoKBArticle onCreateDraft={() => console.log('Create draft')} />
                    <EmptyStates.NoInvites onCreateInvite={() => console.log('Create invite')} />
                  </div>
                </div>

                {/* Footer Examples */}
                <div>
                  <h3 className="text-white font-medium mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Footer Components
                  </h3>
                  <div className="space-y-4">
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <p className="text-white/60 text-xs p-3 bg-[#1C1C1E]/40">Minimal Footer:</p>
                      <HelpEmailFooter variant="minimal" />
                    </div>
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <p className="text-white/60 text-xs p-3 bg-[#1C1C1E]/40">Expanded Footer:</p>
                      <HelpEmailFooter variant="expanded" />
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
};

export default SupportShowcase;
