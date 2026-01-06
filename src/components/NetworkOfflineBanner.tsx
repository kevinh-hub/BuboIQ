import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkOfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Keep banner visible for 2 seconds to show reconnection
      setTimeout(() => {
        setShowBanner(false);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        isOnline ? 'bg-iq-green/90' : 'bg-crimson-danger/90'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-white">
          {isOnline ? (
            <>
              <Wifi className="w-5 h-5" />
              <span className="text-sm font-medium">Back online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">No internet connection</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};