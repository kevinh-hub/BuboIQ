import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorPageProps {
  onNavigateHome?: () => void;
  errorMessage?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ 
  onNavigateHome,
  errorMessage = 'We encountered an unexpected error. Please try again.'
}) => {
  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bubo-glass rounded-2xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-crimson-danger/20 border-2 border-crimson-danger/50 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-crimson-danger" />
            </div>
          </div>

          {/* Error Text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-['Space_Grotesk'] text-pure-white">
              Server Error
            </h1>
            <p className="text-lg text-mist-gray">
              {errorMessage}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleReload}
              className="bubo-btn-neon-primary"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={handleGoHome}
              className="bubo-btn-secondary"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center pt-4 border-t border-slate-gray/30">
            <p className="text-sm text-mist-gray">
              If this problem persists, contact us at{' '}
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