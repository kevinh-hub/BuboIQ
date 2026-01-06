import React from 'react';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface NotFoundPageProps {
  onNavigateHome?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 404 Card */}
        <div className="bubo-glass rounded-2xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-signal-yellow/20 border-2 border-signal-yellow/50 flex items-center justify-center">
              <Search className="w-10 h-10 text-signal-yellow" />
            </div>
          </div>

          {/* 404 Text */}
          <div className="text-center space-y-2">
            <div className="text-8xl font-['Space_Grotesk'] font-bold">
              <span className="text-white">4</span>
              <span className="text-iq-neon-green">0</span>
              <span className="text-white">4</span>
            </div>
            <h1 className="text-3xl font-['Space_Grotesk'] text-pure-white">
              Page Not Found
            </h1>
            <p className="text-lg text-mist-gray">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGoHome}
              className="bubo-btn-neon-primary"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={handleGoBack}
              className="bubo-btn-secondary"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center pt-4 border-t border-slate-gray/30">
            <p className="text-sm text-mist-gray">
              Lost? Check our{' '}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleGoHome();
                }}
                className="text-iq-neon-green hover:underline"
              >
                home page
              </a>
              {' '}or contact us at{' '}
              <a
                href="mailto:support@buboiq.com"
                className="text-iq-neon-green hover:underline"
              >
                support@buboiq.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};