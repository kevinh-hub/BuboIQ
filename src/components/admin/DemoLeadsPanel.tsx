import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, Building2, Calendar, TrendingUp, Filter,
  CheckCircle, Clock, XCircle, AlertCircle, RefreshCw,
  BarChart3, Users, Zap, Download
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

interface DemoLead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'disqualified';
  lead_quality: 'hot' | 'warm' | 'cold';
  lead_score: number;
  demo_engagement?: {
    actions_approved?: number;
    time_in_demo?: number;
    features_explored?: string[];
  };
  notes?: string;
  created_at: string;
  contacted_at?: string;
  qualified_at?: string;
  converted_at?: string;
}

interface LeadStats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
}

export function DemoLeadsPanel() {
  const [leads, setLeads] = useState<DemoLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterQuality, setFilterQuality] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<DemoLead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterQuality !== 'all') params.append('quality', filterQuality);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }

      const data = await response.json();
      setLeads(data.leads || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching demo leads:', error);
      toast.error('Could not load demo leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filterStatus, filterQuality]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/demo-leads/${leadId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update lead');
      }

      toast.success('Lead status updated');
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead status');
    }
  };

  const exportLeads = async () => {
    try {
      setIsExporting(true);
      
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterQuality !== 'all') params.append('quality', filterQuality);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/make-server-55e8c5b2/export/demo-leads?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export leads');
      }

      // Download the CSV file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buboiq-demo-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Leads exported successfully');
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  };

  const getQualityBadge = (quality: string) => {
    const config = {
      hot: { className: 'bg-danger/20 text-danger border-danger/30', icon: <Zap className="w-3 h-3" /> },
      warm: { className: 'bg-warn/20 text-warn border-warn/30', icon: <TrendingUp className="w-3 h-3" /> },
      cold: { className: 'bg-info/20 text-info border-info/30', icon: <AlertCircle className="w-3 h-3" /> },
    };
    const { className, icon } = config[quality as keyof typeof config] || config.cold;
    
    return (
      <Badge className={className}>
        {icon}
        <span className="ml-1">{quality.toUpperCase()}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const config = {
      new: { className: 'bg-accent/20 text-accent border-accent/30', icon: <Clock className="w-3 h-3" /> },
      contacted: { className: 'bg-info/20 text-info border-info/30', icon: <Mail className="w-3 h-3" /> },
      qualified: { className: 'bg-warn/20 text-warn border-warn/30', icon: <CheckCircle className="w-3 h-3" /> },
      converted: { className: 'bg-success/20 text-success border-success/30', icon: <CheckCircle className="w-3 h-3" /> },
      disqualified: { className: 'bg-text-600/20 text-text-400 border-text-600/30', icon: <XCircle className="w-3 h-3" /> },
    };
    const { className, icon } = config[status as keyof typeof config] || config.new;
    
    return (
      <Badge className={className}>
        {icon}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-space-grotesk text-white mb-2">Demo Leads</h1>
          <p className="text-text-400">
            Leads captured from the Live Demo System
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportLeads} disabled={isExporting} className="bubo-btn-ghost">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button onClick={fetchLeads} className="bubo-btn-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="panel p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="text-2xl font-space-grotesk text-white">{stats.total}</span>
            </div>
            <p className="text-sm text-text-400">Total Leads</p>
          </Card>

          <Card className="panel p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-danger" />
              <span className="text-2xl font-space-grotesk text-danger">{stats.hot}</span>
            </div>
            <p className="text-sm text-text-400">Hot Leads</p>
          </Card>

          <Card className="panel p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-2xl font-space-grotesk text-success">{stats.converted}</span>
            </div>
            <p className="text-sm text-text-400">Converted</p>
          </Card>

          <Card className="panel p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-info" />
              <span className="text-2xl font-space-grotesk text-info">
                {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}%
              </span>
            </div>
            <p className="text-sm text-text-400">Conversion Rate</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full bg-bg-850 border-border-analyst">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="disqualified">Disqualified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={filterQuality} onValueChange={setFilterQuality}>
            <SelectTrigger className="w-full bg-bg-850 border-border-analyst">
              <TrendingUp className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Qualities</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      <Card className="panel overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="w-12 h-12 text-text-600 mx-auto mb-3" />
            <p className="text-text-400">No demo leads yet</p>
            <p className="text-sm text-text-600 mt-2">
              Leads will appear here when visitors submit the Live Demo form
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg-850 border-b border-divider">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Quality</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-space-grotesk text-text-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-bg-850/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-white font-medium">{lead.name}</p>
                        <p className="text-xs text-text-400 flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-text-600" />
                        <span className="text-sm text-text-300">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getQualityBadge(lead.lead_quality)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-bg-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-danger via-warn to-success rounded-full"
                            style={{ width: `${lead.lead_score}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-400">{lead.lead_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.demo_engagement && (
                        <div className="text-xs text-text-400 space-y-1">
                          {lead.demo_engagement.actions_approved && (
                            <div>✓ {lead.demo_engagement.actions_approved} actions</div>
                          )}
                          {lead.demo_engagement.time_in_demo && (
                            <div>⏱ {formatDuration(lead.demo_engagement.time_in_demo)}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-text-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-bg-850 border-border-analyst">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="disqualified">Disqualified</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}