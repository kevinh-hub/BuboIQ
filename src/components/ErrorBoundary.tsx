import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Future: Send to error tracking service (Sentry hookup point)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-dark-midnight bubo-neural-bg flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bubo-glass rounded-2xl p-8 space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-crimson-danger/20 border-2 border-crimson-danger/50 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-crimson-danger" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-['Space_Grotesk'] text-pure-white">
                  Something Went Wrong
                </h1>
                <p className="text-lg text-mist-gray">
                  We've encountered an unexpected error. Our team has been notified and is working on a fix.
                </p>
              </div>

              {/* Error Details (Dev Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bubo-debug-panel space-y-2">
                  <p className="font-semibold text-cloud-white">Error Details:</p>
                  <p className="text-crimson-danger">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-mist-gray hover:text-cloud-white">
                        Component Stack
                      </summary>
                      <pre className="mt-2 text-xs overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  onClick={this.handleReload}
                  className="bubo-btn-neon-primary"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
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
                  Need help? Contact us at{' '}
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
    }

    return this.props.children;
  }
}