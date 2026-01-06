import React, { useState } from 'react';
import { FileText, Clock, Users, TrendingUp, Ticket } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';

const mockIncident = {
  id: 'INC-2024-001',
  title: 'Database Performance Degradation',
  confidence: 95,
  hypothesis: 'Connection pool exhaustion due to increased user load',
  impact: 'High - 395 users affected',
  timeline: [
    { time: '14:32', event: 'Initial database timeout signals detected', confidence: 76 },
    { time: '14:34', event: 'Memory usage spike correlation identified', confidence: 87 },
    { time: '14:35', event: 'Network latency increase patterns matched', confidence: 91 },
    { time: '14:36', event: 'Root cause hypothesis generated', confidence: 95 }
  ],
  evidence: [
    { type: 'metric', title: 'Database Connections', value: '95/100 (95% utilized)' },
    { type: 'log', title: 'Error Logs', value: '127 timeout errors in 5 minutes' },
    { type: 'user', title: 'User Reports', value: '8 complaints via multiple channels' },
    { type: 'performance', title: 'Response Time', value: '2.3s avg (normal: 0.4s)' }
  ]
};

export const IncidentRoomDemo: React.FC = () => {
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const promoteToTicket = () => {
    setIsPromoting(true);
    setTimeout(() => {
      setIsPromoting(false);
      setShowTicketModal(true);
    }, 2000);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'metric': return <TrendingUp className="w-4 h-4" />;
      case 'log': return <FileText className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      case 'performance': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-iq-neon-green';
    if (confidence >= 75) return 'text-amber-warning';
    return 'text-crimson-danger';
  };

  return (
    <Card className="bubo-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
            Incident Room
          </h3>
          <p className="text-mist-gray">
            AI-generated hypotheses with evidence packs and confidence scoring
          </p>
        </div>
        
        <Button 
          onClick={promoteToTicket}
          className="bubo-btn-neon-primary"
          disabled={isPromoting}
        >
          {isPromoting ? 'Creating Ticket...' : 'Promote to Ticket'}
          <Ticket className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {isPromoting && (
        <div className="mb-6 p-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
          <div className="flex items-center space-x-2 text-iq-neon-green mb-2">
            <div className="w-3 h-3 bg-iq-neon-green rounded-full animate-pulse" />
            <span className="font-semibold">Generating smart ticket...</span>
          </div>
          <Progress value={85} className="h-2" />
          <p className="text-sm text-mist-gray mt-1">
            Preparing context, assigning team member, setting SLA...
          </p>
        </div>
      )}

      {/* Incident Overview */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-slate-gray/20 border-slate-gray/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-pure-white">Current Hypothesis</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-mist-gray">Confidence</span>
              <span className={`font-bold ${getConfidenceColor(mockIncident.confidence)}`}>
                {mockIncident.confidence}%
              </span>
            </div>
          </div>
          <p className="text-cloud-white mb-3">{mockIncident.hypothesis}</p>
          <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
            {mockIncident.impact}
          </Badge>
        </Card>

        <Card className="bg-slate-gray/20 border-slate-gray/30 p-4">
          <h4 className="font-semibold text-pure-white mb-3">Investigation Timeline</h4>
          <div className="space-y-2">
            {mockIncident.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-iq-neon-green rounded-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-mist-gray font-mono">{event.time}</span>
                    <span className={`text-xs font-bold ${getConfidenceColor(event.confidence)}`}>
                      {event.confidence}%
                    </span>
                  </div>
                  <p className="text-sm text-cloud-white">{event.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Evidence Pack */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-pure-white mb-1">Supporting Data</h4>
            <p className="text-xs text-mist-gray">Key metrics and information that help validate the incident analysis</p>
          </div>
          <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
            {mockIncident.evidence.length} data points
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mockIncident.evidence.map((item, index) => (
            <Card key={index} className="bg-nocturne-indigo/50 border-slate-gray/30 p-4 hover:border-iq-neon-green/30 transition-all duration-300 cursor-pointer hover:scale-105 group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-iq-neon-green/20 rounded-lg flex items-center justify-center text-iq-neon-green group-hover:bg-iq-neon-green/30 transition-colors">
                  {getEvidenceIcon(item.type)}
                </div>
                <span className="text-sm font-semibold text-pure-white">{item.title}</span>
              </div>
              <p className="text-xs text-mist-gray mb-2">{item.value}</p>
              <div className="flex items-center text-xs text-cyan-accent">
                <span className="w-2 h-2 bg-cyan-accent rounded-full mr-2 animate-pulse"></span>
                Real-time data
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-dark-midnight/50 rounded-lg border border-iq-neon-green/20">
          <p className="text-xs text-mist-gray">
            💡 <span className="text-iq-neon-green">Pro Tip:</span> BuboIQ automatically gathers supporting data from multiple sources to build a complete view of each incident, helping teams make informed decisions faster.
          </p>
        </div>
      </div>

      {/* Ticket Creation Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-dark-midnight/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bubo-glass p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-iq-neon-green" />
              </div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
                Smart Ticket Created
              </h3>
              <p className="text-mist-gray mb-4">
                Ticket #TKT-2024-DB-001 has been created with full context and assigned to Sarah Chen (Database Specialist).
              </p>
              <div className="bg-nocturne-indigo/50 rounded-xl p-3 mb-4">
                <div className="text-sm text-cloud-white space-y-1">
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <span className="text-crimson-danger">High</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA:</span>
                    <span className="text-amber-warning">2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assignee:</span>
                    <span className="text-iq-neon-green">Sarah Chen</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowTicketModal(false)}
                className="bubo-btn-neon-primary w-full"
              >
                Got it!
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="p-4 bg-nocturne-indigo/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-pure-white mb-1">AI Investigation Process</h4>
            <p className="text-sm text-mist-gray">
              Click "Promote to Ticket" to see how context transfers to your team
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};