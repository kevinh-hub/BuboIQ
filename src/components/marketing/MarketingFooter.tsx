import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { OwlEyeOrb } from './OwlEyeOrb';
import { Button } from '../ui/button';
import { HelpEmailInline } from './HelpEmailFooter';

interface MarketingFooterProps {
  onNavigate: (page: string, options?: { legalType?: 'privacy' | 'terms' }) => void;
}

export const MarketingFooter: React.FC<MarketingFooterProps> = ({ onNavigate }) => {
  const handleLegalNavigation = (type: 'privacy' | 'terms') => {
    onNavigate('legal', { legalType: type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-20 bg-gradient-to-t from-surface-dark/80 to-transparent border-t border-iq-neon-green/10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-iq-neon-green/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <OwlEyeOrb size={36} />
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
                Bubo<span className="text-iq-neon-green">IQ</span>
              </span>
            </div>
            <p className="font-inter text-mist-gray">
              Technology that fixes itself.
            </p>
          </div>
          
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-6 text-lg">Product</h4>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  onNavigate('features');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  onNavigate('pricing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                MSP Pricing
              </button>
              <button 
                onClick={() => {
                  onNavigate('small-business');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Small Business
              </button>
              <button 
                onClick={() => {
                  onNavigate('how-it-works');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                How It Works
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-6 text-lg">Verticals</h4>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  onNavigate('healthcare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Healthcare
              </button>
              <button 
                onClick={() => {
                  onNavigate('finance');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Finance
              </button>
              <button 
                onClick={() => {
                  onNavigate('manufacturing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Manufacturing
              </button>
              <button 
                onClick={() => {
                  onNavigate('legal-vertical');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Legal
              </button>
              <button 
                onClick={() => {
                  onNavigate('sled');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                SLED
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-6 text-lg">Company</h4>
            <div className="space-y-4">
              <button 
                onClick={() => {
                  onNavigate('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => {
                  onNavigate('why');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Why BuboIQ
              </button>
              <button 
                onClick={() => {
                  onNavigate('faq');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                FAQ & Support
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-['Space_Grotesk'] font-bold text-pure-white mb-6 text-lg">Legal</h4>
            <div className="space-y-4">
              <button 
                onClick={() => handleLegalNavigation('privacy')} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleLegalNavigation('terms')} 
                className="block font-inter text-mist-gray hover:text-iq-neon-green transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mb-16 text-center">
          <div className="inline-block px-8 py-12 bubo-glass rounded-3xl border-2 border-iq-neon-green/30 relative overflow-hidden group hover:scale-105 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-iq-neon-green/10 to-electric-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <h3 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-4">
                Ready to Scale Your MSP?
              </h3>
              <p className="text-lg text-cloud-white mb-8 max-w-2xl mx-auto">
                Join MSPs managing 2.5x more clients without adding headcount
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={() => {
                    onNavigate('pricing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bubo-btn-neon-primary px-8 py-4 group/btn"
                >
                  <span className="relative z-10 flex items-center">
                    View MSP Plans
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <a
                  href="https://kevinhaskins.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-electric-blue hover:text-cyan-accent transition-colors font-medium"
                >
                  Talk to an MSP Expert
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        
        <div className="border-t border-iq-neon-green/20 pt-12 text-center">
          <p className="font-inter text-cloud-white text-lg mb-2">
            <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> — The Brain of Modern IT Operations
          </p>
          <p className="font-inter text-mist-gray mb-6">
            MSP-first. SMBs welcome.
          </p>
          
          {/* Help Email Section */}
          <HelpEmailInline className="mb-6" />
          
          <p className="font-jetbrains-mono text-mist-gray text-sm">
            © 2024 <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};