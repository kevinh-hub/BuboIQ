// Marketing/Footer Snippet (Public) - BuboIQ
// Minimal dark footer with help email link
import React from 'react';
import { Mail } from 'lucide-react';

interface HelpEmailFooterProps {
  variant?: 'minimal' | 'expanded';
  className?: string;
}

export const HelpEmailFooter: React.FC<HelpEmailFooterProps> = ({
  variant = 'minimal',
  className = '',
}) => {
  if (variant === 'minimal') {
    return (
      <footer className={`bg-[#0A0A0A] border-t border-white/10 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Help Text & Email */}
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#00FF85]" />
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Need help?</span>
                <a
                  href="mailto:help@buboiq.com"
                  className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium text-sm"
                >
                  help@buboiq.com
                </a>
              </div>
            </div>

            {/* Divider (mobile only) */}
            <div className="w-full h-px bg-white/10 md:hidden" />

            {/* Copyright */}
            <div className="text-white/40 text-sm">
              © {new Date().getFullYear()} BuboIQ. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Expanded variant with more content
  return (
    <footer className={`bg-[#0A0A0A] border-t border-white/10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00FF85]/30 to-[#00FF85]/10 border border-[#00FF85]/40 flex items-center justify-center">
                <Mail className="w-4 h-4 text-[#00FF85]" />
              </div>
              <h3 className="text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
                <span className="text-white">BUBO</span>
                <span className="text-[#00FF85]">IQ</span>
              </h3>
            </div>
            <p className="text-white/60 text-sm mb-4 max-w-md">
              Every message becomes insight. AI-driven proactive IT support intelligence platform.
            </p>
            
            {/* Help Email - Featured */}
            <div className="bg-[#1C1C1E]/60 border border-white/10 rounded-lg p-4 inline-block">
              <p className="text-white/60 text-xs mb-2">Need help?</p>
              <a
                href="mailto:help@buboiq.com"
                className="text-[#00FF85] hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                help@buboiq.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-2">
              <FooterLink href="/features">Features</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/demo">Live Demo</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/kb">Knowledge Base</FooterLink>
              <FooterLink href="/support">Support</FooterLink>
              <FooterLink href="/legal">Legal</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 text-sm">
              © {new Date().getFullYear()} BuboIQ. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="/privacy" className="text-white/40 hover:text-[#00FF85] text-sm transition-colors duration-300">
                Privacy
              </a>
              <a href="/terms" className="text-white/40 hover:text-[#00FF85] text-sm transition-colors duration-300">
                Terms
              </a>
              <a href="/security" className="text-white/40 hover:text-[#00FF85] text-sm transition-colors duration-300">
                Security
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Component
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="text-white/60 hover:text-[#00FF85] text-sm transition-colors duration-300 block"
    >
      {children}
    </a>
  </li>
);

export default HelpEmailFooter;
