// Org Overview (Internal) - BuboIQ Support System
// Dark glassmorphism with neon green accents
import React, { useState } from 'react';
import { ExternalLink, Building2, Calendar, AlertCircle, Plus, Settings, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Textarea } from '../ui/textarea';

interface OrgOverviewInternalProps {
  orgId?: string;
  demo?: boolean;
}

export const OrgOverviewInternal: React.FC<OrgOverviewInternalProps> = ({
  orgId = 'org_acme_dental',
  demo = true,
}) => {
  const [internalNotes, setInternalNotes] = useState(
    'Customer is very responsive. Previous issue with printer resolved quickly. They prefer email communication over phone.'
  );

  const handleOpenInStreak = () => {
    console.log('Opening organization in Streak:', orgId);
    window.open(`https://streak.com/org/${orgId}`, '_blank');
  };

  const handleCreateInvite = () => {
    console.log('Creating invite for organization:', orgId);
    // Would open invite modal
  };

  const handleManageLimits = () => {
    console.log('Managing limits for organization:', orgId);
    // Would open limits management
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <TooltipProvider>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Org Header */}
          <div className="bg-[#1C1C1E]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/5 border border-[#00FF85]/30 flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#00FF85]" />
                </div>
                <div>
                  <h1 className="text-3xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                    Acme Dental Group
                  </h1>
                  <div className="flex items-center gap-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge className="bg-gradient-to-r from-[#00FF85]/20 to-[#1E90FF]/20 text-[#00FF85] border border-[#00FF85]/40 px-3 py-1 cursor-help">
                            EA-PRO (Founders Rate)
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1C1C1E] border-[#00FF85]/30 max-w-xs">
                          <div className="space-y-2">
                            <p className="text-white font-medium">Founders Rate Active</p>
                            <p className="text-white/70 text-sm">100 devices included</p>
                            <p className="text-white/70 text-sm">$0.90/device overage</p>
                            <p className="text-white/70 text-sm">12-month lock guaranteed</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-white/50 text-sm">• ID: {orgId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleOpenInStreak}
                  className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Streak
                </Button>
                <Button
                  onClick={handleCreateInvite}
                  className="bg-[#1E90FF]/10 hover:bg-[#1E90FF]/20 text-[#1E90FF] border border-[#1E90FF]/30 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invite
                </Button>
                <Button
                  onClick={handleManageLimits}
                  variant="ghost"
                  className="text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Limits
                </Button>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Devices"
                value="47"
                subtext="of 100 included"
                icon={<Settings className="w-5 h-5" />}
                color="green"
              />
              <StatCard
                label="Trial End Date"
                value="Jan 15, 2025"
                subtext="21 days remaining"
                icon={<Calendar className="w-5 h-5" />}
                color="blue"
              />
              <StatCard
                label="Plan Tier"
                value="EA-PRO"
                subtext="$99/mo founders rate"
                icon={<Building2 className="w-5 h-5" />}
                color="green"
              />
              <StatCard
                label="Incidents"
                value="3"
                subtext="2 resolved this month"
                icon={<AlertCircle className="w-5 h-5" />}
                color="yellow"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Internal Notes Panel */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <FileText className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Internal</span>
                    <span className="text-[#00FF85]">Notes</span>
                  </CardTitle>
                  <p className="text-white/50 text-sm">
                    Private notes • Not visible to customer
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    className="min-h-[200px] bg-[#0A0A0A]/60 border-white/10 text-white placeholder:text-white/40 focus:border-[#00FF85]/50 focus:ring-2 focus:ring-[#00FF85]/20 transition-all duration-200"
                    placeholder="Add internal notes about this organization..."
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-white/40 text-xs">
                      Last updated: 2 days ago by Sarah Chen
                    </p>
                    <Button
                      size="sm"
                      className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30"
                    >
                      Save Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <AlertCircle className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Recent</span>
                    <span className="text-[#00FF85]">Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ActivityItem
                    time="2 hours ago"
                    action="Ticket resolved"
                    description="TKT-2847: Printer offline issue"
                    type="success"
                  />
                  <ActivityItem
                    time="1 day ago"
                    action="Device added"
                    description="3 new workstations enrolled"
                    type="info"
                  />
                  <ActivityItem
                    time="3 days ago"
                    action="Support session"
                    description="Remote support: Network configuration"
                    type="info"
                  />
                  <ActivityItem
                    time="5 days ago"
                    action="Ticket created"
                    description="TKT-2834: Email sync issues"
                    type="warning"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Side Panel - Org Details */}
            <div className="space-y-6">
              
              {/* Organization Details */}
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Building2 className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Organization</span>
                    <span className="text-[#00FF85]">Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow label="Industry" value="Healthcare - Dental" />
                  <DetailRow label="Size" value="12-25 employees" />
                  <DetailRow label="Primary Contact" value="John Smith" />
                  <DetailRow label="Email" value="john@acmedental.com" />
                  <DetailRow label="Phone" value="+1 (555) 123-4567" />
                  <DetailRow label="Location" value="San Francisco, CA" />
                  <DetailRow label="Joined" value="Dec 1, 2024" />
                </CardContent>
              </Card>

              {/* Billing Summary */}
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <Calendar className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Billing</span>
                    <span className="text-[#00FF85]">Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailRow 
                    label="Current Plan" 
                    value={
                      <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30">
                        EA-PRO
                      </Badge>
                    } 
                  />
                  <DetailRow label="Monthly Rate" value="$99/mo" />
                  <DetailRow label="Devices Included" value="100" />
                  <DetailRow label="Overage Rate" value="$0.90/device" />
                  <DetailRow label="Trial Status" value="Active" />
                  <DetailRow label="Trial Ends" value="Jan 15, 2025" />
                  <DetailRow 
                    label="Founders Lock" 
                    value={
                      <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                        Guaranteed
                      </Badge>
                    }
                  />
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </TooltipProvider>
    </div>
  );
};

// Helper Components
interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, icon, color }) => {
  const colorClasses = {
    green: 'from-[#00FF85]/20 to-[#00FF85]/5 border-[#00FF85]/30 text-[#00FF85]',
    blue: 'from-[#1E90FF]/20 to-[#1E90FF]/5 border-[#1E90FF]/30 text-[#1E90FF]',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-400',
  };

  return (
    <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-xl p-4">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {value}
      </p>
      <p className="text-white/40 text-xs">{subtext}</p>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
    <span className="text-white/50 text-sm">{label}</span>
    <span className="text-white/90 text-sm font-medium text-right">
      {typeof value === 'string' ? value : value}
    </span>
  </div>
);

interface ActivityItemProps {
  time: string;
  action: string;
  description: string;
  type: 'success' | 'info' | 'warning';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ time, action, description, type }) => {
  const typeColors = {
    success: 'bg-green-500',
    info: 'bg-[#1E90FF]',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="flex gap-3 p-3 bg-[#0A0A0A]/40 border border-white/5 rounded-lg hover:border-white/10 transition-all duration-200">
      <div className={`w-2 h-2 rounded-full ${typeColors[type]} mt-2`} />
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-white/90 font-medium text-sm">{action}</p>
          <span className="text-white/40 text-xs">{time}</span>
        </div>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default OrgOverviewInternal;
