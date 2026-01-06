// Support Pipeline - Ticket Detail (Internal)
// BuboIQ - Dark glassmorphism with neon green accents
import React, { useState } from 'react';
import { ExternalLink, Mail, Clock, User, AlertTriangle, Tag, MessageSquare, FileText, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TicketDetailInternalProps {
  ticketId?: string;
  orgName?: string;
  demo?: boolean;
}

type TicketStatus = 'New' | 'Triage' | 'In Progress' | 'Waiting on User' | 'Resolved' | 'KB Drafted';
type Priority = 'Sev-1' | 'Sev-2' | 'Sev-3';
type Category = 'Bug' | 'Feature' | 'How-to';
type Sentiment = 'Frustrated' | 'Neutral' | 'Positive';

const statusColors: Record<TicketStatus, string> = {
  'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Triage': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'In Progress': 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30',
  'Waiting on User': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Resolved': 'bg-green-500/20 text-green-400 border-green-500/30',
  'KB Drafted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const priorityColors: Record<Priority, string> = {
  'Sev-1': 'bg-red-500/20 text-red-400 border-red-500/40 glow-red',
  'Sev-2': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Sev-3': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const sentimentColors: Record<Sentiment, string> = {
  'Frustrated': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Neutral': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Positive': 'bg-green-500/20 text-green-400 border-green-500/30',
};

export const TicketDetailInternal: React.FC<TicketDetailInternalProps> = ({
  ticketId = 'TKT-2847',
  orgName = 'Acme Dental Group',
  demo = true,
}) => {
  const [status] = useState<TicketStatus>('In Progress');
  const [priority] = useState<Priority>('Sev-2');
  const [category] = useState<Category>('Bug');
  const [sentiment] = useState<Sentiment>('Frustrated');
  const [kbLinkCopied, setKbLinkCopied] = useState(false);

  const handleOpenInStreak = () => {
    // Demo mode - would normally open Streak
    console.log('Opening in Streak:', ticketId);
    window.open(`https://streak.com/ticket/${ticketId}`, '_blank');
  };

  const handleCopyKBLink = () => {
    navigator.clipboard.writeText('https://kb.buboiq.com/articles/printer-offline-fix');
    setKbLinkCopied(true);
    setTimeout(() => setKbLinkCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <TooltipProvider>
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="bg-[#1C1C1E]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                    Printer Offline - Unable to Print
                  </h1>
                  <Badge className={`${statusColors[status]} border px-3 py-1 transition-all duration-200`}>
                    {status}
                  </Badge>
                </div>
                <p className="text-white/60 text-sm">Ticket #{ticketId}</p>
              </div>
              
              <Button
                onClick={handleOpenInStreak}
                className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Streak
              </Button>
            </div>

            {/* Meta Panel */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
              <MetaItem
                icon={<User className="w-4 h-4" />}
                label="Organization"
                value={orgName}
              />
              <MetaItem
                icon={<User className="w-4 h-4" />}
                label="Assignee"
                value="Sarah Chen"
              />
              <MetaItem
                icon={<AlertTriangle className="w-4 h-4" />}
                label="Priority"
                value={
                  <Badge className={`${priorityColors[priority]} border px-2 py-0.5 text-xs`}>
                    {priority}
                  </Badge>
                }
              />
              <MetaItem
                icon={<Tag className="w-4 h-4" />}
                label="Category"
                value={category}
              />
              <MetaItem
                icon={<MessageSquare className="w-4 h-4" />}
                label="Sentiment"
                value={
                  <Badge className={`${sentimentColors[sentiment]} border px-2 py-0.5 text-xs`}>
                    {sentiment}
                  </Badge>
                }
              />
              <MetaItem
                icon={<Clock className="w-4 h-4" />}
                label="Created"
                value="2h ago"
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Activity Pane - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <MessageSquare className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Latest</span>
                    <span className="text-[#00FF85]">Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Last Email Summary */}
                  <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/5 border border-[#00FF85]/30 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-[#00FF85]" />
                        </div>
                        <div>
                          <p className="text-white/90 font-medium">From: john@acmedental.com</p>
                          <p className="text-white/60 text-sm">2 hours ago</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleOpenInStreak}
                        className="text-white/60 hover:text-[#00FF85] transition-colors duration-200"
                      >
                        View Full Thread
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                    
                    <div className="pl-13">
                      <p className="text-white/80 font-medium mb-2">
                        Subject: Re: Printer still showing offline
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        Hi team, I tried restarting the printer like you suggested but it's still 
                        showing as offline on all workstations. This is urgent - we have patient 
                        forms that need to be printed today. Please help!
                      </p>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="bg-[#0A0A0A]/60 border border-[#00FF85]/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
                      <p className="text-white/90 font-medium text-sm">Internal Note</p>
                      <span className="text-white/40 text-xs">· 45 min ago</span>
                    </div>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      Checked network logs - printer lost IP lease. Likely DHCP reservation issue. 
                      Will create KB article after resolution.
                    </p>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Side Panel - KB Link */}
            <div className="space-y-6">
              <Card className="bg-[#1C1C1E]/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    <FileText className="w-5 h-5 text-[#00FF85]" />
                    <span className="text-white">Knowledge</span>
                    <span className="text-[#00FF85]">Base</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* KB Article Linked */}
                  <div className="bg-gradient-to-br from-[#00FF85]/10 to-[#00FF85]/5 border border-[#00FF85]/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00FF85]/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#00FF85]" />
                        </div>
                        <div>
                          <p className="text-white/90 font-medium text-sm">Linked Article</p>
                          <p className="text-white/50 text-xs">Draft · Ready for review</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyKBLink}
                        className="text-[#00FF85] hover:text-white transition-colors duration-200"
                      >
                        {kbLinkCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">
                        Fixing Printer Offline Issues
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        Step-by-step guide to resolve network printer connectivity problems 
                        in Windows environments.
                      </p>
                    </div>

                    <Button
                      className="w-full bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 transition-all duration-200"
                    >
                      View Draft Article
                    </Button>
                  </div>

                  {/* Empty State Example (commented out) */}
                  {/* <div className="bg-[#0A0A0A]/60 border border-dashed border-white/20 rounded-xl p-6 text-center">
                    <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm mb-4">
                      No KB article linked yet
                    </p>
                    <Button
                      className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create KB Draft
                    </Button>
                  </div> */}

                </CardContent>
              </Card>
            </div>

          </div>

          {/* Footer - Help Email */}
          <div className="bg-[#1C1C1E]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00FF85]" />
                <div>
                  <p className="text-white/90 font-medium text-sm">Questions?</p>
                  <a 
                    href="mailto:help@buboiq.com"
                    className="text-[#00FF85] hover:text-white transition-colors duration-300 text-sm"
                  >
                    help@buboiq.com
                  </a>
                </div>
              </div>
              <p className="text-white/50 text-xs">
                Replies thread into Streak automatically
              </p>
            </div>
          </div>

        </div>
      </TooltipProvider>
    </div>
  );
};

// Helper component for meta items
interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const MetaItem: React.FC<MetaItemProps> = ({ icon, label, value }) => (
  <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-lg p-3">
    <div className="flex items-center gap-2 mb-1 text-white/50">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <div className="text-white/90 text-sm font-medium">
      {typeof value === 'string' ? value : value}
    </div>
  </div>
);

export default TicketDetailInternal;
