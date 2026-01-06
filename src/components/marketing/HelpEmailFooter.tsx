import React from 'react';

/**
 * HelpEmailFooter Component
 * 
 * A dark-mode footer section with clickable help email link
 * Matches BuboIQ's neon-green brand identity and glass UI system
 */
export function HelpEmailFooter() {
  return (
    <div className="relative w-full border-t border-white/10">
      {/* Glass panel background */}
      <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative py-6 px-4 flex items-center justify-center">
        <p className="text-white/70 text-center">
          <span className="font-['Space_Grotesk'] font-medium">Need help?</span>
          {' '}
          <span className="font-['Inter']">Email us at</span>
          {' '}
          <a
            href="mailto:help@buboiq.com"
            className="font-['Inter'] font-bold text-[#00FF85] hover:text-white transition-colors duration-300 ease-out underline decoration-[#00FF85]/30 hover:decoration-white/30 focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded-sm"
            aria-label="Send email to BuboIQ support"
          >
            help@buboiq.com
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Alternative variant with more prominent styling
 */
export function HelpEmailFooterProminent() {
  return (
    <div className="relative w-full border-t border-white/10">
      {/* Glass panel background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 to-[#0A0A0A]/90 backdrop-blur-lg" />
      
      {/* Content */}
      <div className="relative py-8 px-4 flex flex-col items-center justify-center space-y-2">
        <p className="font-['Space_Grotesk'] font-medium text-white/70 text-sm tracking-wide uppercase">
          Need help?
        </p>
        <a
          href="mailto:help@buboiq.com"
          className="group font-['Inter'] text-lg font-bold text-[#00FF85] hover:text-white transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] rounded-sm px-3 py-1"
          aria-label="Send email to BuboIQ support"
        >
          <span className="relative">
            help@buboiq.com
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FF85]/30 group-hover:bg-white/30 transition-colors duration-300" />
          </span>
        </a>
      </div>
    </div>
  );
}

/**
 * Compact inline variant for use within existing footers
 */
export function HelpEmailInline({ className = '' }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-white/70 text-sm">
        <span className="font-['Space_Grotesk'] font-medium">Need help?</span>
        {' '}
        <a
          href="mailto:help@buboiq.com"
          className="font-['Inter'] font-bold text-[#00FF85] hover:text-white transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 rounded-sm px-1"
          aria-label="Send email to BuboIQ support"
        >
          help@buboiq.com
        </a>
      </p>
    </div>
  );
}

export default HelpEmailFooter;
