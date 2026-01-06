import React, { useState } from 'react';
import { CheckCircle, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const comparisons = [
  {
    id: 'noise',
    label: 'False Alert Reduction',
    zendesk: { status: 'poor', note: 'Manual filtering only' },
    servicenow: { status: 'fair', note: 'Basic deduplication' },
    buboiq: { status: 'excellent', note: 'AI-powered alert grouping' }
  },
  {
    id: 'routing',
    label: 'Predictive Routing',
    zendesk: { status: 'poor', note: 'Rule-based assignment' },
    servicenow: { status: 'fair', note: 'Skills-based routing' },
    buboiq: { status: 'excellent', note: 'ML-driven optimal assignment' }
  },
  {
    id: 'sla',
    label: 'SLA Risk Prediction',
    zendesk: { status: 'poor', note: 'Manual tracking' },
    servicenow: { status: 'fair', note: 'Time-based alerts' },
    buboiq: { status: 'excellent', note: 'Predictive risk assessment' }
  },
  {
    id: 'setup',
    label: 'SMB-Friendly Setup',
    zendesk: { status: 'fair', note: 'Complex configuration' },
    servicenow: { status: 'poor', note: 'Enterprise-only complexity' },
    buboiq: { status: 'excellent', note: 'Minutes to deployment' }
  },
  {
    id: 'speed',
    label: 'Speed & UX',
    zendesk: { status: 'fair', note: 'Legacy interface' },
    servicenow: { status: 'poor', note: 'Clunky enterprise UI' },
    buboiq: { status: 'excellent', note: 'Cinematic, responsive design' }
  }
];

const filterOptions = [
  { id: 'all', label: 'All Features' },
  { id: 'noise', label: 'False Alert Reduction' },
  { id: 'routing', label: 'Predictive Routing' },
  { id: 'sla', label: 'SLA Risk' },
  { id: 'setup', label: 'SMB Setup' },
  { id: 'speed', label: 'Speed/UX' }
];

export const ComparisonTable: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="w-5 h-5 text-iq-neon-green" />;
      case 'fair':
        return <AlertCircle className="w-5 h-5 text-amber-warning" />;
      case 'poor':
        return <X className="w-5 h-5 text-crimson-danger" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30';
      case 'fair':
        return 'bg-amber-warning/10 text-amber-warning border-amber-warning/30';
      case 'poor':
        return 'bg-crimson-danger/10 text-crimson-danger border-crimson-danger/30';
      default:
        return '';
    }
  };

  const filteredComparisons = activeFilter === 'all' 
    ? comparisons 
    : comparisons.filter(item => item.id === activeFilter);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-pure-white mb-6">
          How BuboIQ Compares
        </h2>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => setActiveFilter(option.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                activeFilter === option.id
                  ? 'bg-iq-neon-green/20 text-iq-neon-green border border-iq-neon-green/30'
                  : 'bubo-btn-ghost'
              }`}
              size="sm"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="bubo-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-gray/30">
                <th className="text-left p-6 font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                  Feature
                </th>
                <th className="text-center p-6 font-['Space_Grotesk'] text-lg font-bold text-mist-gray">
                  Zendesk
                </th>
                <th className="text-center p-6 font-['Space_Grotesk'] text-lg font-bold text-mist-gray">
                  ServiceNow
                </th>
                <th className="text-center p-6 font-['Space_Grotesk'] text-lg font-bold text-iq-neon-green">
                  BuboIQ
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredComparisons.map((item, index) => (
                <tr 
                  key={item.id}
                  className={`border-b border-slate-gray/20 hover:bg-slate-gray/10 transition-colors ${
                    index % 2 === 0 ? 'bg-nocturne-indigo/20' : ''
                  }`}
                >
                  <td className="p-6">
                    <span className="font-semibold text-pure-white">{item.label}</span>
                  </td>
                  
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {getStatusIcon(item.zendesk.status)}
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(item.zendesk.status)}`}>
                        {item.zendesk.note}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {getStatusIcon(item.servicenow.status)}
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(item.servicenow.status)}`}>
                        {item.servicenow.note}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {getStatusIcon(item.buboiq.status)}
                      <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(item.buboiq.status)}`}>
                        {item.buboiq.note}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-iq-neon-green/5 border-t border-iq-neon-green/20">
          <div className="text-center">
            <p className="text-mist-gray mb-4">Ready to experience the difference?</p>
            <Button className="bubo-btn-neon-primary">
              Start Your Free Trial
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};