import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, TrendingUp, Info } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

const mockTickets = [
  {
    id: 'TKT-001',
    title: 'Email server down',
    priority: 'critical',
    slaTarget: 120, // minutes
    timeElapsed: 75,
    riskLevel: 85,
    assignee: 'John Doe',
    complexity: 'High'
  },
  {
    id: 'TKT-002',
    title: 'User password reset',
    priority: 'low',
    slaTarget: 480,
    timeElapsed: 120,
    riskLevel: 25,
    assignee: 'Jane Smith',
    complexity: 'Low'
  },
  {
    id: 'TKT-003',
    title: 'Database performance issue',
    priority: 'high',
    slaTarget: 240,
    timeElapsed: 180,
    riskLevel: 75,
    assignee: 'Mike Johnson',
    complexity: 'Medium'
  }
];

export const SLARiskDemo: React.FC = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickets(prev => prev.map(ticket => ({
        ...ticket,
        timeElapsed: ticket.timeElapsed + 1,
        riskLevel: Math.min(100, ticket.riskLevel + (Math.random() - 0.3) * 2)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-crimson-danger';
    if (risk >= 60) return 'text-amber-warning';
    if (risk >= 40) return 'text-signal-yellow';
    return 'text-iq-neon-green';
  };

  const getRiskBackground = (risk: number) => {
    if (risk >= 80) return 'bg-crimson-danger/20 border-crimson-danger/30';
    if (risk >= 60) return 'bg-amber-warning/20 border-amber-warning/30';
    if (risk >= 40) return 'bg-signal-yellow/20 border-signal-yellow/30';
    return 'bg-iq-neon-green/20 border-iq-neon-green/30';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'high': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'medium': return 'bg-signal-blue/20 text-signal-blue border-signal-blue/30';
      case 'low': return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateBreachForecast = (ticket: any) => {
    const timeRemaining = ticket.slaTarget - ticket.timeElapsed;
    const riskFactor = ticket.riskLevel / 100;
    const complexityMultiplier = ticket.complexity === 'High' ? 1.5 : ticket.complexity === 'Medium' ? 1.2 : 1.0;
    
    const estimatedTimeToComplete = timeRemaining * riskFactor * complexityMultiplier;
    
    if (estimatedTimeToComplete > timeRemaining) {
      return {
        willBreach: true,
        breachTime: Math.round(estimatedTimeToComplete - timeRemaining),
        recommendation: 'Escalate immediately'
      };
    }
    
    return {
      willBreach: false,
      breachTime: 0,
      recommendation: 'On track'
    };
  };

  return (
    <Card className="bubo-glass p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-2">
            SLA Risk Meter
          </h3>
          <p className="text-mist-gray">
            Predictive SLA breach detection with automated escalation forecasting
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForecast(!showForecast)}
          className="bubo-btn-neon-primary"
        >
          {showForecast ? 'Hide' : 'Show'} Forecast
        </Button>
      </div>

      {/* Ticket List */}
      <div className="grid gap-4 mb-6">
        {tickets.map((ticket) => (
          <Card 
            key={ticket.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedTicket.id === ticket.id
                ? 'bg-iq-neon-green/10 border-iq-neon-green/30'
                : 'bg-slate-gray/20 border-slate-gray/30 hover:border-slate-gray/50'
            }`}
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-semibold text-pure-white">{ticket.title}</span>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-mist-gray">
                  <span>{ticket.id}</span>
                  <span>{ticket.assignee}</span>
                  <span>{formatTime(ticket.timeElapsed)} / {formatTime(ticket.slaTarget)}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${getRiskColor(ticket.riskLevel)}`} />
                  <span className={`font-bold ${getRiskColor(ticket.riskLevel)}`}>
                    {Math.round(ticket.riskLevel)}%
                  </span>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="w-24 h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            ticket.riskLevel >= 80 ? 'bg-crimson-danger' :
                            ticket.riskLevel >= 60 ? 'bg-amber-warning' :
                            ticket.riskLevel >= 40 ? 'bg-signal-yellow' : 'bg-iq-neon-green'
                          }`}
                          style={{ width: `${ticket.riskLevel}%` }}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>SLA Breach Risk: {Math.round(ticket.riskLevel)}%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Risk Analysis */}
      <Card className={`p-4 mb-6 ${getRiskBackground(selectedTicket.riskLevel)}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-pure-white">{selectedTicket.title}</h4>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-mist-gray" />
            <span className="text-sm text-mist-gray">
              {formatTime(selectedTicket.slaTarget - selectedTicket.timeElapsed)} remaining
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-mist-gray">Current Risk</span>
            <p className={`text-lg font-bold ${getRiskColor(selectedTicket.riskLevel)}`}>
              {Math.round(selectedTicket.riskLevel)}%
            </p>
          </div>
          <div>
            <span className="text-xs text-mist-gray">Time Elapsed</span>
            <p className="text-lg font-bold text-pure-white">
              {formatTime(selectedTicket.timeElapsed)}
            </p>
          </div>
          <div>
            <span className="text-xs text-mist-gray">Complexity</span>
            <p className="text-lg font-bold text-pure-white">
              {selectedTicket.complexity}
            </p>
          </div>
          <div>
            <span className="text-xs text-mist-gray">Assignee Load</span>
            <p className="text-lg font-bold text-pure-white">
              {Math.round(Math.random() * 40 + 40)}%
            </p>
          </div>
        </div>
      </Card>

      {/* Breach Forecast */}
      {showForecast && (
        <Card className="bg-prediction-purple/10 border-prediction-purple/30 p-4 mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-5 h-5 text-prediction-purple" />
            <h4 className="font-semibold text-pure-white">Breach Forecast</h4>
          </div>
          
          {(() => {
            const forecast = calculateBreachForecast(selectedTicket);
            return (
              <div>
                {forecast.willBreach ? (
                  <div className="space-y-2">
                    <p className="text-crimson-danger font-semibold">
                      ⚠️ Likely to breach SLA by {formatTime(forecast.breachTime)}
                    </p>
                    <p className="text-sm text-mist-gray">
                      Based on current complexity, assignee workload, and past fix patterns
                    </p>
                    <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                      {forecast.recommendation}
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-iq-neon-green font-semibold">
                      ✅ On track for SLA compliance
                    </p>
                    <p className="text-sm text-mist-gray">
                      Current pace suggests resolution within SLA window
                    </p>
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      {forecast.recommendation}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}

      <div className="p-4 bg-nocturne-indigo/50 rounded-xl">
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-cyan-accent" />
          <div>
            <h4 className="font-semibold text-pure-white mb-1">Predictive SLA Management</h4>
            <p className="text-sm text-mist-gray">
              Click tickets to see detailed risk analysis. Toggle forecast to see breach predictions.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};