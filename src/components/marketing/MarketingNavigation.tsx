import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { OwlEyeOrb } from './OwlEyeOrb';
import { useAuth } from '../../context/AuthContext';

interface MarketingNavigationProps {
  currentPage: string;
  onNavigate: (page: any) => void;
  onTryItNow: () => void;
  user?: any;
}

export const MarketingNavigation: React.FC<MarketingNavigationProps> = ({
  currentPage,
  onNavigate,
  onTryItNow,
  user
}) => {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showVerticalsDropdown, setShowVerticalsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowVerticalsDropdown(false);
      }
    };

    if (showVerticalsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVerticalsDropdown]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'why', label: 'Why BuboIQ' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' }
  ];

  const verticalItems = [
    { id: 'healthcare', label: 'Healthcare', badge: 'HIPAA' },
    { id: 'finance', label: 'Finance', badge: 'PCI-DSS' },
    { id: 'manufacturing', label: 'Manufacturing', badge: 'CMMC' },
    { id: 'legal-vertical', label: 'Legal', badge: 'ABA' },
    { id: 'sled', label: 'SLED', badge: 'CJIS' }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="sticky top-0 z-50 bubo-glass border-b border-iq-neon-green/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <OwlEyeOrb size={32} />
              <span className="font-['Space_Grotesk'] text-xl font-bold">
                <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 font-['Space_Grotesk'] font-medium transition-all duration-300 group ${
                    currentPage === item.id 
                      ? 'text-iq-neon-green' 
                      : 'text-mist-gray hover:text-pure-white'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-iq-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-dark-midnight rounded-lg`}
                >
                  {item.label}
                  {currentPage === item.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent rounded-full">
                      <div className="absolute inset-0 bg-iq-neon-green blur-sm opacity-50" />
                    </div>
                  )}
                  {currentPage !== item.id && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-iq-neon-green to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>
              ))}

              {/* Verticals Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setShowVerticalsDropdown(true)}
                onMouseLeave={() => setShowVerticalsDropdown(false)}
              >
                <button
                  onClick={() => setShowVerticalsDropdown(!showVerticalsDropdown)}
                  className={`relative flex items-center space-x-1 px-4 py-2 font-medium transition-all duration-300 ${
                    showVerticalsDropdown || ['healthcare', 'finance', 'manufacturing', 'legal-vertical', 'sled'].includes(currentPage)
                      ? 'text-iq-neon-green' 
                      : 'text-mist-gray hover:text-pure-white'
                  }`}
                >
                  <span>Verticals</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showVerticalsDropdown ? 'rotate-180' : ''}`} />
                  {['healthcare', 'finance', 'manufacturing', 'legal-vertical', 'sled'].includes(currentPage) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-iq-neon-green rounded-full" />
                  )}
                </button>
                
                {showVerticalsDropdown && (
                  <div className="absolute top-full right-0 pt-2 -mt-2 z-50">
                    <div className="w-56 bubo-glass rounded-xl border border-iq-neon-green/20 overflow-hidden"
                         style={{ boxShadow: 'var(--elevation-3), 0 0 30px rgba(0, 255, 133, 0.2)' }}>
                      {verticalItems.map((vertical) => (
                        <button
                          key={vertical.id}
                          onClick={() => {
                            onNavigate(vertical.id);
                            setShowVerticalsDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors group ${
                            currentPage === vertical.id
                              ? 'bg-iq-neon-green/15 border-l-2 border-l-iq-neon-green'
                              : 'hover:bg-iq-neon-green/10'
                          }`}
                        >
                          <span className={`transition-colors ${
                            currentPage === vertical.id
                              ? 'text-iq-neon-green font-medium'
                              : 'text-cloud-white group-hover:text-pure-white'
                          }`}>{vertical.label}</span>
                          <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            currentPage === vertical.id
                              ? 'text-iq-neon-green bg-iq-neon-green/20 border border-iq-neon-green/30'
                              : 'text-iq-neon-green bg-iq-neon-green/10 group-hover:bg-iq-neon-green/20'
                          }`}>
                            {vertical.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={() => onNavigate('dashboard')}
                      className="bubo-btn-neon-primary"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => signOut()}
                      variant="ghost"
                      size="icon"
                      className="text-mist-gray hover:text-crimson-danger hover:bg-crimson-danger/10"
                      title="Sign Out"
                    >
                      <LogOut size={20} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={() => onNavigate('login')}
                      className="bubo-btn-ghost"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => onNavigate('pricing')}
                      className="bubo-btn-neon-primary"
                    >
                      Start Free Trial
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-mist-gray hover:text-pure-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-dark-midnight/95 backdrop-blur-lg">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-6 border-b border-iq-neon-green/10">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
              >
                <OwlEyeOrb size={32} />
                <span className="font-['Space_Grotesk'] text-xl font-bold">
                  <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span>
                </span>
              </div>
              <button
                className="p-2 text-mist-gray hover:text-pure-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-4 rounded-xl text-lg transition-all duration-300 ${
                    currentPage === item.id 
                      ? 'text-iq-neon-green bg-iq-neon-green/10 border border-iq-neon-green/30' 
                      : 'text-mist-gray hover:text-pure-white hover:bg-surface-dark/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Verticals Section in Mobile */}
              <div className="pt-4 mt-4 border-t border-slate-gray/30">
                <div className="text-xs text-mist-gray uppercase mb-2 px-4 font-jetbrains-mono">Industry Verticals</div>
                {verticalItems.map((vertical) => (
                  <button
                    key={vertical.id}
                    onClick={() => {
                      onNavigate(vertical.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      currentPage === vertical.id
                        ? 'text-iq-neon-green bg-iq-neon-green/10 border border-iq-neon-green/30'
                        : 'text-mist-gray hover:text-pure-white hover:bg-surface-dark/50'
                    }`}
                  >
                    <span>{vertical.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      currentPage === vertical.id
                        ? 'text-iq-neon-green bg-iq-neon-green/20 border border-iq-neon-green/30'
                        : 'text-iq-neon-green bg-iq-neon-green/10'
                    }`}>
                      {vertical.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile CTA Buttons */}
            <div className="p-6 space-y-4 border-t border-iq-neon-green/10">
              {user ? (
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bubo-btn-neon-primary"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-crimson-danger/10 text-crimson-danger hover:bg-crimson-danger/20 border border-crimson-danger/30"
                    size="lg"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    onClick={() => {
                      onNavigate('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bubo-btn-ghost"
                    size="lg"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => {
                      onTryItNow();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bubo-btn-neon-primary"
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};