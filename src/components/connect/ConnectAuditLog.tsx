import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Clock, 
  User, 
  Monitor, 
  Activity, 
  Search,
  Filter,
  Download,
  Eye,
  Play,
  Square,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { connectApi } from '../../utils/supabase/client';

interface AuditEntry {
  id: string;
  ts: string;
  user_id: string;
  event: string;
  device_id?: string;
  ticket_id?: string;
  session_id?: string;
  provider?: string;
  ip_address?: string;
  user_agent?: string;
  meta: Record<string, any>;
  devices?: {
    id: string;
    display_name: string;
  };
  sessions?: {
    id: string;
    status: string;
  };
}

interface ConnectAuditLogProps {
  user: any;
  userTier: 'basic' | 'pro';
  onUpgrade: () => void;
}

export const ConnectAuditLog: React.FC<ConnectAuditLogProps> = ({
  user,
  userTier,
  onUpgrade
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const EVENTS_PER_PAGE = 25;

  useEffect(() => {
    if (user && userTier === 'pro') {
      loadAuditLogs();
    }
  }, [user, userTier]);

  const loadAuditLogs = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setError(null);
      }

      const offset = loadMore ? page * EVENTS_PER_PAGE : 0;
      const response = await connectApi.getAuditLogs(EVENTS_PER_PAGE, offset);

      if (response?.audit_logs) {
        if (loadMore) {
          setAuditLogs(prev => [...prev, ...response.audit_logs]);
        } else {
          setAuditLogs(response.audit_logs);
        }
        
        setHasMore(response.audit_logs.length === EVENTS_PER_PAGE);
        if (loadMore) {
          setPage(prev => prev + 1);
        }
      }
    } catch (error: any) {
      console.error('Error loading audit logs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    loadAuditLogs(true);
  };

  const refresh = () => {
    setPage(0);
    setHasMore(true);
    loadAuditLogs();
  };

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'session_started':
        return <Play className="w-4 h-4 text-iq-neon-green" />;
      case 'session_ended':
        return <Square className="w-4 h-4 text-mist-gray" />;
      case 'session_expired':
        return <Clock className="w-4 h-4 text-amber-warning" />;
      case 'device_added':
        return <Monitor className="w-4 h-4 text-electric-blue" />;
      case 'device_removed':
        return <Monitor className="w-4 h-4 text-crimson-danger" />;
      case 'device_updated':
        return <Monitor className="w-4 h-4 text-amber-warning" />;
      case 'permission_granted':
        return <CheckCircle className="w-4 h-4 text-iq-neon-green" />;
      case 'permission_denied':
        return <AlertTriangle className="w-4 h-4 text-crimson-danger" />;
      default:
        return <Activity className="w-4 h-4 text-mist-gray" />;
    }
  };

  const getEventBadgeColor = (event: string) => {
    switch (event) {
      case 'session_started':
      case 'permission_granted':
      case 'device_added':
        return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'session_ended':
        return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
      case 'session_expired':
      case 'device_updated':
        return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'device_removed':
      case 'permission_denied':
        return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      default:
        return 'bg-electric-blue/20 text-electric-blue border-electric-blue/30';
    }
  };

  const formatEventName = (event: string) => {
    return event.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getUniqueEvents = () => {
    const events = auditLogs.map(log => log.event);
    return ['all', ...new Set(events)];
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.devices?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ticket_id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEvent = filterEvent === 'all' || log.event === filterEvent;

    return matchesSearch && matchesEvent;
  });

  // Show upgrade guard for Basic users
  if (userTier === 'basic') {
    return (
      <div className="bubo-glass rounded-3xl p-8 text-center border border-iq-neon-green/20">
        <div className="w-20 h-20 bg-iq-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-iq-neon-green" />
        </div>
        <h2 className="font-space-grotesk text-2xl font-bold text-pure-white mb-4">
          Security Audit Logs • Pro Feature
        </h2>
        <p className="text-mist-gray mb-8 max-w-md mx-auto">
          Track all remote access activities with full audit logging for compliance and security monitoring.
        </p>
        <Button onClick={onUpgrade} className="bubo-btn-neon-primary">
          Upgrade to Pro
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-8 h-8 text-iq-neon-green animate-spin mx-auto mb-4" />
        <p className="text-mist-gray">Loading audit logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-space-grotesk text-3xl font-bold text-pure-white">
            Connect Audit Logs
          </h1>
          <p className="text-mist-gray mt-2">
            Security monitoring and compliance tracking
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={refresh}
            variant="outline"
            className="bubo-btn-secondary"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            className="bubo-btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-iq-neon-green" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">{auditLogs.length}</p>
                <p className="text-mist-gray text-sm">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-electric-blue/20 rounded-xl flex items-center justify-center">
                <Play className="w-6 h-6 text-electric-blue" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {auditLogs.filter(log => log.event === 'session_started').length}
                </p>
                <p className="text-mist-gray text-sm">Sessions Started</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-warning/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-amber-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {auditLogs.filter(log => log.event === 'device_added').length}
                </p>
                <p className="text-mist-gray text-sm">Devices Added</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bubo-glass border-iq-neon-green/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-crimson-danger/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-crimson-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold text-pure-white">
                  {auditLogs.filter(log => log.event.includes('denied') || log.event.includes('failed')).length}
                </p>
                <p className="text-mist-gray text-sm">Security Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bubo-glass border-iq-neon-green/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mist-gray" />
                <Input
                  placeholder="Search events, devices, tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bubo-glass pl-10"
                />
              </div>
            </div>
            <Select value={filterEvent} onValueChange={setFilterEvent}>
              <SelectTrigger className="w-48 bubo-glass">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueEvents().map(event => (
                  <SelectItem key={event} value={event}>
                    {event === 'all' ? 'All Events' : formatEventName(event)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      {error && (
        <div className="bubo-error-message">
          <p>{error}</p>
        </div>
      )}

      <Card className="bubo-glass border-iq-neon-green/20">
        <CardHeader>
          <CardTitle className="text-pure-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-iq-neon-green" />
            Security Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-mist-gray">Timestamp</TableHead>
                <TableHead className="text-mist-gray">Event</TableHead>
                <TableHead className="text-mist-gray">Device</TableHead>
                <TableHead className="text-mist-gray">Session</TableHead>
                <TableHead className="text-mist-gray">Provider</TableHead>
                <TableHead className="text-mist-gray">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const timestamp = formatTimestamp(log.ts);
                
                return (
                  <TableRow key={log.id} className="border-iq-neon-green/10">
                    <TableCell>
                      <div className="text-pure-white text-sm">
                        <div>{timestamp.date}</div>
                        <div className="text-mist-gray text-xs">{timestamp.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEventIcon(log.event)}
                        <Badge className={getEventBadgeColor(log.event)}>
                          {formatEventName(log.event)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.devices ? (
                        <div className="text-pure-white text-sm">
                          {log.devices.display_name}
                        </div>
                      ) : (
                        <span className="text-mist-gray text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.session_id ? (
                        <div className="text-pure-white text-sm font-mono">
                          {log.session_id.substring(0, 8)}...
                        </div>
                      ) : (
                        <span className="text-mist-gray text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.provider ? (
                        <div className="text-pure-white text-sm capitalize">
                          {log.provider}
                        </div>
                      ) : (
                        <span className="text-mist-gray text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.ip_address ? (
                        <div className="text-pure-white text-sm font-mono">
                          {log.ip_address}
                        </div>
                      ) : (
                        <span className="text-mist-gray text-sm">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && !loading && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-mist-gray mx-auto mb-4" />
              <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
                No Audit Logs Found
              </h3>
              <p className="text-mist-gray">
                {auditLogs.length === 0 
                  ? "No security events have been logged yet"
                  : "No events match your current filters"
                }
              </p>
            </div>
          )}

          {/* Load More */}
          {hasMore && filteredLogs.length > 0 && (
            <div className="text-center mt-6">
              <Button 
                onClick={loadMore}
                variant="outline"
                className="bubo-btn-secondary"
              >
                Load More Events
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};