import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertTriangle, Search, Filter, CheckCircle, ExternalLink, Clock, Shield, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AnomalyEvent {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'suspicious_login' | 'data_exfiltration' | 'unauthorized_access' | 'policy_violation' | 'anomalous_behavior';
  device_id: string;
  device_name: string;
  user_id?: string;
  user_name?: string;
  description: string;
  indicators: string[];
  confidence_score: number;
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'false_positive';
  assigned_to?: string;
}

interface AnomalyEventPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (eventId: string) => Promise<void>;
  onAcknowledge: (eventId: string) => Promise<void>;
  onFetchEvents: (filters: EventFilters) => Promise<AnomalyEvent[]>;
}

interface EventFilters {
  severity?: string;
  status?: string;
  search?: string;
  deviceId?: string;
}

const SEVERITY_CONFIG = {
  critical: { color: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30', icon: '🔴' },
  high: { color: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30', icon: '🟠' },
  medium: { color: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30', icon: '🟡' },
  low: { color: 'bg-mist-gray/20 text-mist-gray border-mist-gray/30', icon: '⚪' }
};

const TYPE_LABELS = {
  suspicious_login: 'Suspicious Login',
  data_exfiltration: 'Data Exfiltration',
  unauthorized_access: 'Unauthorized Access',
  policy_violation: 'Policy Violation',
  anomalous_behavior: 'Anomalous Behavior'
};

export const AnomalyEventPanel: React.FC<AnomalyEventPanelProps> = ({
  isOpen,
  onClose,
  onCreateIncident,
  onAcknowledge,
  onFetchEvents
}) => {
  const [events, setEvents] = useState<AnomalyEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AnomalyEvent | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadEvents();
    }
  }, [isOpen, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await onFetchEvents(filters);
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load anomaly events', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (eventId: string) => {
    if (processing[eventId]) return;

    try {
      setProcessing(prev => ({ ...prev, [eventId]: true }));
      await onAcknowledge(eventId);
      
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, status: 'acknowledged' } : e
      ));
      
      toast.success('Event acknowledged', {
        description: 'Event has been marked as acknowledged'
      });
    } catch (error) {
      toast.error('Failed to acknowledge event', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCreateIncident = async (eventId: string) => {
    if (processing[eventId]) return;

    try {
      setProcessing(prev => ({ ...prev, [eventId]: true }));
      await onCreateIncident(eventId);
      
      toast.success('Incident created', {
        description: 'Compliance incident created from anomaly event'
      });
      
      setSelectedEvent(null);
    } catch (error) {
      toast.error('Failed to create incident', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setProcessing(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const newEventsCount = events.filter(e => e.status === 'new').length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-4xl bg-dark-midnight border-l border-slate-gray/30 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-['Space_Grotesk'] text-2xl text-pure-white flex items-center gap-3">
            <Activity className="w-6 h-6 text-iq-neon-green" />
            Anomaly Events
            {newEventsCount > 0 && (
              <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
                {newEventsCount} New
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-mist-gray">
            Real-time security anomaly detection and monitoring
          </SheetDescription>
        </SheetHeader>

        {/* Filters */}
        <div className="bubo-glass rounded-xl p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Search events..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            
            <Select
              value={filters.severity || 'all'}
              onValueChange={(value) => setFilters({ ...filters, severity: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
            >
              <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-mist-gray">{events.length} events found</span>
            <Button
              onClick={loadEvents}
              size="sm"
              variant="outline"
              className="bubo-btn-ghost"
            >
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Events List */}
        <div ref={listRef} className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-iq-neon-green animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="bubo-glass rounded-xl p-12 text-center">
              <Shield className="w-16 h-16 text-mist-gray mx-auto mb-4 opacity-50" />
              <h3 className="font-['Space_Grotesk'] text-lg text-pure-white mb-2">
                No Anomalies Detected
              </h3>
              <p className="text-mist-gray text-sm">
                Your systems are operating normally
              </p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className={`
                  bubo-glass rounded-lg p-4 cursor-pointer transition-all border
                  ${selectedEvent?.id === event.id 
                    ? 'border-iq-neon-green/40 bg-iq-neon-green/5' 
                    : 'hover:border-electric-blue/40'}
                  ${event.status === 'new' ? 'border-l-4 border-l-crimson-danger' : ''}
                `}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                      event.severity === 'critical' ? 'text-crimson-danger' :
                      event.severity === 'high' ? 'text-amber-warning' :
                      event.severity === 'medium' ? 'text-signal-blue' :
                      'text-mist-gray'
                    }`} />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-['Space_Grotesk'] text-pure-white">
                          {TYPE_LABELS[event.type]}
                        </h4>
                        <Badge className={SEVERITY_CONFIG[event.severity].color}>
                          {event.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-cloud-white mb-2">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-mist-gray">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(event.timestamp)}
                        </span>
                        <span>Device: {event.device_name}</span>
                        {event.user_name && <span>User: {event.user_name}</span>}
                        <span>Confidence: {Math.round(event.confidence_score * 100)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.status === 'new' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcknowledge(event.id);
                        }}
                        disabled={processing[event.id]}
                        size="sm"
                        variant="outline"
                        className="bubo-btn-ghost"
                      >
                        {processing[event.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {selectedEvent?.id === event.id && (
                  <div className="mt-4 pt-4 border-t border-slate-gray/30 space-y-3">
                    {/* Indicators */}
                    <div>
                      <h5 className="text-sm font-medium text-pure-white mb-2">Indicators:</h5>
                      <div className="space-y-1">
                        {event.indicators.map((indicator, idx) => (
                          <div key={idx} className="text-sm text-cloud-white flex items-start gap-2">
                            <span className="text-iq-neon-green">•</span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateIncident(event.id);
                        }}
                        disabled={processing[event.id]}
                        size="sm"
                        className="bubo-btn-neon-primary"
                      >
                        {processing[event.id] ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Create Issue
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(null);
                        }}
                        size="sm"
                        variant="outline"
                        className="bubo-btn-ghost"
                      >
                        Close Detail
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};