// BuboIQ Support System - Reusable Component Library
// Design system components for dark glassmorphism + neon green theme
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

// Status Badges
export const StatusBadges = {
  // Ticket Status
  TicketStatus: ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Triage': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'In Progress': 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30',
      'Waiting on User': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Resolved': 'bg-green-500/20 text-green-400 border-green-500/30',
      'KB Drafted': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return (
      <Badge className={`${colors[status] || 'bg-white/20 text-white border-white/30'} border px-3 py-1`}>
        {status}
      </Badge>
    );
  },

  // Priority Badges
  Priority: ({ level }: { level: 'Sev-1' | 'Sev-2' | 'Sev-3' }) => {
    const colors = {
      'Sev-1': 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
      'Sev-2': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Sev-3': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    };
    return (
      <Badge className={`${colors[level]} border px-3 py-1`}>
        {level}
      </Badge>
    );
  },

  // Early Access Plan Badge
  EAPro: () => (
    <Badge className="bg-gradient-to-r from-[#00FF85]/20 to-[#1E90FF]/20 text-[#00FF85] border border-[#00FF85]/40 px-3 py-1">
      EA-PRO (Founders Rate)
    </Badge>
  ),

  // Trial Badge
  Trial: () => (
    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1">
      Trial
    </Badge>
  ),

  // Observe Only Badge
  ObserveOnly: () => (
    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1">
      Observe-only
    </Badge>
  ),

  // Founders Rate Badge
  FoundersRate: () => (
    <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 text-xs">
      Grandfathered
    </Badge>
  ),
};

// Status Pills (smaller, more compact)
export const StatusPills = {
  // Invite Status
  InviteStatus: ({ status }: { status: 'Unused' | 'Redeemed' | 'Expired' | 'Revoked' }) => {
    const colors = {
      'Unused': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Redeemed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Expired': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      'Revoked': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return (
      <Badge className={`${colors[status]} border px-2 py-0.5 text-xs`}>
        {status}
      </Badge>
    );
  },

  // Token Validity
  TokenValidity: ({ status }: { status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Revoked' }) => {
    const colors = {
      'Valid': 'bg-green-500/20 text-green-400 border-green-500/40',
      'Expiring Soon': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
      'Expired': 'bg-gray-500/20 text-gray-400 border-gray-500/40',
      'Revoked': 'bg-red-500/20 text-red-400 border-red-500/40',
    };
    return (
      <Badge className={`${colors[status]} border px-3 py-1 text-sm`}>
        {status}
      </Badge>
    );
  },
};

// Buttons
export const SupportButtons = {
  // Primary (Neon Green)
  Primary: ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] font-bold transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,133,0.4)] disabled:opacity-40"
    >
      {children}
    </Button>
  ),

  // Secondary (Outline)
  Secondary: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <Button
      onClick={onClick}
      variant="outline"
      className="border-white/20 text-white hover:bg-white/5 transition-all duration-200"
    >
      {children}
    </Button>
  ),

  // Destructive
  Destructive: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <Button
      onClick={onClick}
      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-all duration-200"
    >
      {children}
    </Button>
  ),

  // External Link (with icon)
  ExternalLink: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <Button
      onClick={() => href && window.open(href, '_blank')}
      className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]"
    >
      {children}
      <ExternalLink className="w-4 h-4 ml-2" />
    </Button>
  ),
};

// Email Link Component (with special styling)
export const EmailLink = ({ 
  email = 'help@buboiq.com',
  subject,
  variant = 'default',
}: { 
  email?: string; 
  subject?: string;
  variant?: 'default' | 'button';
}) => {
  const href = subject 
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`;

  if (variant === 'button') {
    return (
      <a
        href={href}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]"
      >
        {email}
      </a>
    );
  }

  return (
    <a
      href={href}
      className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium"
    >
      {email}
    </a>
  );
};

// Open in Streak Link
export const OpenInStreakLink = ({ 
  id,
  type = 'ticket',
}: { 
  id: string;
  type?: 'ticket' | 'org' | 'contact';
}) => {
  const handleOpen = () => {
    console.log(`Opening ${type} ${id} in Streak`);
    window.open(`https://streak.com/${type}/${id}`, '_blank');
  };

  return (
    <Button
      onClick={handleOpen}
      className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,133,0.3)]"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Open in Streak
    </Button>
  );
};

// Empty States
export const EmptyStates = {
  NoKBArticle: ({ onCreateDraft }: { onCreateDraft?: () => void }) => (
    <div className="bg-[#0A0A0A]/60 border border-dashed border-white/20 rounded-xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-white/60 text-sm mb-4">No KB article linked yet</p>
      {onCreateDraft && (
        <Button
          onClick={onCreateDraft}
          className="bg-[#00FF85]/10 hover:bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30"
        >
          Create KB Draft
        </Button>
      )}
    </div>
  ),

  NoInvites: ({ onCreateInvite }: { onCreateInvite?: () => void }) => (
    <div className="bg-[#0A0A0A]/60 border border-dashed border-white/20 rounded-xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-white/60 text-sm mb-4">No invites created yet</p>
      {onCreateInvite && (
        <Button
          onClick={onCreateInvite}
          className="bg-[#00FF85] hover:bg-[#00FF85]/90 text-[#0A0A0A] font-bold"
        >
          Create Your First Invite
        </Button>
      )}
    </div>
  ),
};

// Toast Messages (examples for sonner)
export const showToasts = {
  success: (message: string) => {
    // import { toast } from 'sonner';
    console.log('Success:', message);
  },
  warning: (message: string) => {
    console.log('Warning:', message);
  },
  error: (message: string) => {
    console.log('Error:', message);
  },
  info: (message: string) => {
    console.log('Info:', message);
  },
};

// Motion-reduced variants flag
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
