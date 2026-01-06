import React, { useState } from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';

interface DemoEngagement {
  actions_approved?: number;
  time_in_demo?: number;
  features_explored?: string[];
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; company: string }) => void;
  demoEngagement?: DemoEngagement;
}

export function LeadCaptureModal({ isOpen, onClose, onSubmit, demoEngagement }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to backend
      const leadData = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        source: 'demo_conversion',
        notes: 'Captured from Live Demo after successful action approval',
        demo_engagement: demoEngagement || null,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(leadData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit lead');
      }

      // Call parent callback
      onSubmit(formData);
      setIsSuccess(true);
      
      // Auto-close after showing success
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', company: '' });
        setError(null);
      }, 3000);
    } catch (err) {
      console.error('Error submitting lead:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    setFormData({ name: '', email: '', company: '' });
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fadeInUp">
      <div className="bubo-glass max-w-lg w-full rounded-2xl border border-accent/20 shadow-modal overflow-hidden">
        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="p-8 pb-6 relative">
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-bg-850 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-400" />
              </button>
              
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 mb-6">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              
              <h2 className="text-2xl font-space-grotesk text-white mb-3">
                Want this on your devices?
              </h2>
              <p className="text-text-400">
                We'll wire a pilot in <span className="text-accent font-semibold">24 hours</span>. 
                No commitment, no credit card required.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
              {error && (
                <div className="panel p-4 bg-danger/10 border-danger/30">
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-space-grotesk text-text-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-space-grotesk text-text-300 mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-space-grotesk text-text-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-bg-850 border border-[color:rgb(var(--border-analyst))] rounded-xl text-text-100 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Acme Corp"
                />
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bubo-btn-neon-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Get Your Pilot Started'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 text-text-400 hover:text-text-300 text-sm transition-colors disabled:opacity-50"
                >
                  Skip for now
                </button>
              </div>

              <p className="text-xs text-text-600 text-center">
                Your data is secure and will only be used to set up your pilot. 
                We respect your privacy.
              </p>
            </form>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 border-2 border-success/40 mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-space-grotesk text-white mb-3">
              Thanks—check your inbox!
            </h2>
            <p className="text-text-400">
              We'll reach out within 24 hours to get your pilot environment configured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}