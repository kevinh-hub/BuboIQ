import React from 'react';

export const RouteLoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9998] bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-slate-gray/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-iq-neon-green rounded-full animate-spin" />
        </div>
        
        {/* Text */}
        <p className="text-mist-gray text-sm">Loading...</p>
      </div>
    </div>
  );
};