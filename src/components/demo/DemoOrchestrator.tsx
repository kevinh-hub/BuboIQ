import React, { useState } from 'react';
import { DemoLauncher } from './DemoLauncher';
import { LiveDemoConsole } from './LiveDemoConsole';
import { LeadCaptureModal } from './LeadCaptureModal';

interface DemoOrchestratorProps {
  onClose: () => void;
}

type DemoFlow = 'launcher' | 'console' | 'closed';

export function DemoOrchestrator({ onClose }: DemoOrchestratorProps) {
  const [demoFlow, setDemoFlow] = useState<DemoFlow>('launcher');
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleStartDemo = () => {
    setDemoFlow('console');
    
    // Track demo start in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'demo_started', {
        demo_type: 'live_analyst_console',
        source: 'demo_launcher'
      });
    }
  };

  const handleConversion = () => {
    // Only show lead capture once per session
    if (!leadSubmitted) {
      setShowLeadCapture(true);
    }
  };

  const handleLeadSubmit = (data: { name: string; email: string; company: string }) => {
    setLeadSubmitted(true);
    
    // Track lead capture in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'lead_captured', {
        lead_source: 'demo_conversion',
        company: data.company
      });
    }

    // In production, this would send to your CRM/backend
    console.log('Lead captured:', data);
    
    // Send to make-server endpoint
    const leadData = {
      name: data.name,
      email: data.email,
      company: data.company,
      source: 'demo_conversion',
      notes: 'Captured from live demo after successful action approval'
    };
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/partner-leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(leadData),
    }).catch(err => console.error('Failed to submit lead:', err));
  };

  const handleCloseDemo = () => {
    setDemoFlow('closed');
    onClose();
    
    // Track demo close
    if ((window as any).gtag) {
      (window as any).gtag('event', 'demo_closed', {
        lead_captured: leadSubmitted
      });
    }
  };

  return (
    <>
      {demoFlow === 'launcher' && (
        <DemoLauncher
          onStartDemo={handleStartDemo}
          onClose={onClose}
        />
      )}

      {demoFlow === 'console' && (
        <LiveDemoConsole
          onClose={handleCloseDemo}
          onConversion={handleConversion}
        />
      )}

      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSubmit={handleLeadSubmit}
      />
    </>
  );
}