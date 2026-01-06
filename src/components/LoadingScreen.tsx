import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-900">Initializing BuboIQ...</h2>
        <p className="text-gray-600">Setting up your AI-driven IT support platform</p>
      </div>
    </div>
  );
};