import React, { useState } from 'react';
import { User, Clock, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

const mockTicket = {
  id: 'TKT-2024-DB-001',
  title: 'Database Performance Degradation',
  priority: 'High',
  status: 'In Progress',
  assignee: {
    name: 'Sarah Chen',
    role: 'Database Specialist',
    avatar: '👩‍💻',
    expertise: ['MySQL', 'Performance', 'Tuning']
  },
  sla: {
    target: '2 hours',
    remaining: '1h 15m',
    riskLevel: 'Low'
  },
  aiContext: {
    summary: 'Connection pool exhaustion causing 2.3s average response times (normal: 0.4s). 395 users affected.',
    rootCause: 'Database connection pool at 95% usage due to traffic spike',
    suggestedSolution: 'Increase connection pool size from 100 to 150 and improve connection timeout settings',
    relatedIncidents: ['INC-2024-001', 'INC-2023-192']
  },
  suggestedReply: `Hi there,

I've identified the root cause of the performance issue. Our database connection pool is running at 95% capacity due to increased traffic.

I'm implementing the following solution:
1. Increasing connection pool size from 100 to 150
2. Improving connection timeout settings
3. Adding monitoring alerts for future prevention

ETA for resolution: 30 minutes
I'll update you once the changes are deployed.

Best regards,
Sarah`
};

export const SmartTicketingDemo: React.FC = () => {
  const [showSuggestedReply, setShowSuggestedReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isUsingSuggested, setIsUsingSuggested] = useState(false);

  const useSuggestedReply = () => {
    setReplyText(mockTicket.suggestedReply);
    setIsUsingSuggested(true);
    setShowSuggestedReply(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'high': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'medium': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      case 'low': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const getSLARiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-crimson-danger';
      case 'medium': return 'text-amber-warning';
      case 'low': return 'text-iq-neon-green';
      default: return 'text-mist-gray';
    }
  };

  return (
    <Card className="bubo-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
            Smart Ticketing
          </h3>
          <p className="text-mist-gray">
            Pre-filled tickets with AI context, optimal routing, and suggested responses
          </p>
        </div>
      </div>

      {/* Ticket Header */}
      <Card className="bg-slate-gray/20 border-slate-gray/30 p-4 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                {mockTicket.title}
              </h4>
              <Badge className={getPriorityColor(mockTicket.priority)}>
                {mockTicket.priority}
              </Badge>
            </div>
            <p className="text-sm text-mist-gray">{mockTicket.id}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-mist-gray" />
              <span className="text-sm text-pure-white">{mockTicket.sla.remaining}</span>
              <span className={`text-sm font-semibold ${getSLARiskColor(mockTicket.sla.riskLevel)}`}>
                ({mockTicket.sla.riskLevel} Risk)
              </span>
            </div>
            <p className="text-xs text-mist-gray">SLA Target: {mockTicket.sla.target}</p>
          </div>
        </div>

        {/* Assignee Info */}
        <div className="flex items-center space-x-3 p-3 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-xl">
          <div className="text-2xl">{mockTicket.assignee.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-pure-white">{mockTicket.assignee.name}</span>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                Auto-assigned
              </Badge>
            </div>
            <p className="text-sm text-mist-gray">{mockTicket.assignee.role}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {mockTicket.assignee.expertise.map((skill, index) => (
                <span key={index} className="text-xs bg-cyan-accent/20 text-cyan-accent px-2 py-0.5 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-mist-gray">Match Score</p>
            <p className="font-bold text-iq-neon-green">94%</p>
          </div>
        </div>
      </Card>

      {/* AI Context */}
      <Card className="bg-prediction-purple/10 border-prediction-purple/30 p-4 mb-6">
        <h4 className="font-semibold text-pure-white mb-3 flex items-center">
          <span className="mr-2">🧠</span>
          AI Context & Analysis
        </h4>
        
        <div className="space-y-3">
          <div>
            <span className="text-xs text-mist-gray font-semibold">SUMMARY</span>
            <p className="text-sm text-cloud-white">{mockTicket.aiContext.summary}</p>
          </div>
          
          <div>
            <span className="text-xs text-mist-gray font-semibold">LIKELY ROOT CAUSE</span>
            <p className="text-sm text-cloud-white">{mockTicket.aiContext.rootCause}</p>
          </div>
          
          <div>
            <span className="text-xs text-mist-gray font-semibold">SUGGESTED SOLUTION</span>
            <p className="text-sm text-cloud-white">{mockTicket.aiContext.suggestedSolution}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-xs text-mist-gray font-semibold">RELATED INCIDENTS</span>
              <div className="flex space-x-2 mt-1">
                {mockTicket.aiContext.relatedIncidents.map((incident, index) => (
                  <Badge key={index} className="bg-signal-blue/20 text-signal-blue border-signal-blue/30 text-xs">
                    {incident}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Response Section */}
      <Card className="bg-slate-gray/20 border-slate-gray/30 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-pure-white flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Customer Response
          </h4>
          
          {!showSuggestedReply && !isUsingSuggested && (
            <Button 
              onClick={() => setShowSuggestedReply(true)}
              className="bubo-btn-ghost text-sm"
            >
              AI Suggest Reply
            </Button>
          )}
        </div>

        {showSuggestedReply && (
          <Card className="bg-iq-neon-green/10 border-iq-neon-green/30 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-iq-neon-green">🤖 AI Suggested Response</span>
              <div className="flex space-x-2">
                <Button onClick={useSuggestedReply} className="bubo-btn-neon-primary text-xs px-3 py-1">
                  Use This
                </Button>
                <Button onClick={() => setShowSuggestedReply(false)} className="bubo-btn-ghost text-xs px-3 py-1">
                  Dismiss
                </Button>
              </div>
            </div>
            <pre className="text-sm text-cloud-white whitespace-pre-wrap font-sans">
              {mockTicket.suggestedReply}
            </pre>
          </Card>
        )}

        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your response to the customer..."
          rows={8}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isUsingSuggested && (
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                AI-powered
              </Badge>
            )}
          </div>
          
          <Button className="bubo-btn-neon-primary">
            <Send className="w-4 h-4 mr-2" />
            Send Reply
          </Button>
        </div>
      </Card>

      <div className="mt-6 p-4 bg-nocturne-indigo/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-pure-white mb-1">Smart Ticketing Features</h4>
            <p className="text-sm text-mist-gray">
              Auto-routing, AI context, suggested responses, and SLA monitoring all in one view
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};