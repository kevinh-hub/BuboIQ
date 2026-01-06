import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, Eye, Lock, Activity, Database, FileCheck, Zap } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { OrbSystem } from '../../marketing/OrbSystem';

interface CompliancePageProps {
  user: any;
}

interface ComplianceMetric {
  metric_type: string;
  score: number;
  status: string;
  total_controls: number;
  passing_controls: number;
  failing_controls: number;
  measured_at: string;
}

interface BreachIncident {
  id: string;
  incident_type: string;
  severity: string;
  status: string;
  description: string;
  detected_at: string;
  affected_count: number;
}

interface DevicePosture {
  device_id: string;
  compliant: boolean;
  compliance_score: number;
  risk_level: string;
  non_compliant_items: string[];
  devices: { name: string };
}

interface ComplianceDashboardData {
  metrics: ComplianceMetric[];
  nonCompliantDevices: DevicePosture[];
  recentBreaches: BreachIncident[];
  pendingPHIRedactions: number;
  activeAnomalies: any[];
}

export const CompliancePage: React.FC<CompliancePageProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<ComplianceDashboardData | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<'hipaa' | 'pci_dss' | 'soc2' | 'overall'>('overall');

  useEffect(() => {
    loadComplianceDashboard();
  }, []);

  const loadComplianceDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/compliance/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${user.session.access_token}`
          }
        }
      );

      if (!response.ok) throw new Error('Couldn\'t load compliance dashboard');

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading compliance dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLatestMetric = (type: string): ComplianceMetric | undefined => {
    return dashboardData?.metrics.find(m => m.metric_type === type);
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-iq-neon-green';
    if (score >= 70) return 'text-signal-yellow';
    return 'text-crimson-danger';
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 90) return 'Good';
    if (score >= 70) return 'At risk';
    return 'Failing';
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      low: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30',
      medium: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30',
      high: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
      critical: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30',
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getRiskLevelColor = (risk: string) => {
    const colors = {
      low: 'text-iq-neon-green',
      medium: 'text-signal-yellow',
      high: 'text-amber-warning',
      critical: 'text-crimson-danger',
    };
    return colors[risk as keyof typeof colors] || 'text-mist-gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-midnight pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-slate-gray border-t-iq-neon-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cloud-white">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  const overallMetric = getLatestMetric('overall');
  const hipaaMetric = getLatestMetric('hipaa');
  const pciMetric = getLatestMetric('pci_dss');
  const soc2Metric = getLatestMetric('soc2');

  return (
    <div className="min-h-screen bg-dark-midnight pt-16">
      {/* Background Effects */}
      <div className="fixed inset-0 bubo-circuit-pattern opacity-5 pointer-events-none" />
      
      {/* Compliance Orbs */}
      <OrbSystem
        variantType="LensRefractor"
        sizeToken="M"
        placement="TopRight"
        zLayer="MidGlass"
        tint="Base"
        motionProfile="Scroll"
        glow={2}
        className="opacity-50"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-pure-white mb-2">
                Compliance <span className="text-iq-neon-green">Dashboard</span>
              </h1>
              <p className="text-cloud-white">
                Real-time healthcare & finance compliance monitoring
              </p>
            </div>
            <Button
              onClick={loadComplianceDashboard}
              className="bubo-btn-secondary"
            >
              <Activity className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall Compliance Score */}
        {overallMetric && (
          <Card className="bubo-glass p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mist-gray mb-2">Overall Compliance Score</p>
                <div className="flex items-baseline gap-4">
                  <h2 className={`font-['Space_Grotesk'] text-6xl font-bold ${getComplianceColor(overallMetric.score)}`}>
                    {overallMetric.score}%
                  </h2>
                  <Badge className={getSeverityBadge(overallMetric.status === 'compliant' ? 'low' : overallMetric.status === 'at_risk' ? 'medium' : 'high')}>
                    {getComplianceStatus(overallMetric.score)}
                  </Badge>
                </div>
                <p className="text-sm text-cloud-white mt-2">
                  {overallMetric.passing_controls} of {overallMetric.total_controls} controls passing
                </p>
              </div>
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(55, 65, 81, 0.3)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#00FF85"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${overallMetric.score * 5.53} 553`}
                    className="transition-all duration-1000"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(0, 255, 133, 0.5))',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-iq-neon-green opacity-50" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Framework-Specific Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {hipaaMetric && (
            <Card className="bubo-glass p-6 border-l-4 border-l-electric-blue">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                  HIPAA Compliance
                </h3>
                <Eye className="w-6 h-6 text-electric-blue" />
              </div>
              <div className={`text-3xl font-bold mb-2 ${getComplianceColor(hipaaMetric.score)}`}>
                {hipaaMetric.score}%
              </div>
              <Progress value={hipaaMetric.score} className="mb-2" />
              <p className="text-xs text-mist-gray">
                {hipaaMetric.passing_controls}/{hipaaMetric.total_controls} controls
              </p>
            </Card>
          )}

          {pciMetric && (
            <Card className="bubo-glass p-6 border-l-4 border-l-signal-yellow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                  PCI-DSS Compliance
                </h3>
                <Lock className="w-6 h-6 text-signal-yellow" />
              </div>
              <div className={`text-3xl font-bold mb-2 ${getComplianceColor(pciMetric.score)}`}>
                {pciMetric.score}%
              </div>
              <Progress value={pciMetric.score} className="mb-2" />
              <p className="text-xs text-mist-gray">
                {pciMetric.passing_controls}/{pciMetric.total_controls} controls
              </p>
            </Card>
          )}

          {soc2Metric && (
            <Card className="bubo-glass p-6 border-l-4 border-l-prediction-purple">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-pure-white">
                  SOC 2 Compliance
                </h3>
                <FileCheck className="w-6 h-6 text-prediction-purple" />
              </div>
              <div className={`text-3xl font-bold mb-2 ${getComplianceColor(soc2Metric.score)}`}>
                {soc2Metric.score}%
              </div>
              <Progress value={soc2Metric.score} className="mb-2" />
              <p className="text-xs text-mist-gray">
                {soc2Metric.passing_controls}/{soc2Metric.total_controls} controls
              </p>
            </Card>
          )}
        </div>

        {/* Alert Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* PHI Redactions */}
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
                Pending PHI Redactions
              </h3>
              <Eye className="w-5 h-5 text-electric-blue" />
            </div>
            <div className="text-3xl font-bold text-signal-yellow mb-2">
              {dashboardData?.pendingPHIRedactions || 0}
            </div>
            <p className="text-sm text-mist-gray">Requiring review</p>
          </Card>

          {/* Non-Compliant Devices */}
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
                Non-Compliant Computers
              </h3>
              <AlertTriangle className="w-5 h-5 text-amber-warning" />
            </div>
            <div className="text-3xl font-bold text-amber-warning mb-2">
              {dashboardData?.nonCompliantDevices.length || 0}
            </div>
            <p className="text-sm text-mist-gray">Needing remediation</p>
          </Card>

          {/* Active Anomalies */}
          <Card className="bubo-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-pure-white">
                Active Anomalies
              </h3>
              <Zap className="w-5 h-5 text-crimson-danger" />
            </div>
            <div className="text-3xl font-bold text-crimson-danger mb-2">
              {dashboardData?.activeAnomalies.length || 0}
            </div>
            <p className="text-sm text-mist-gray">Under investigation</p>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="bg-surface-dark border border-slate-gray/30">
            <TabsTrigger value="devices">Non-Compliant Computers</TabsTrigger>
            <TabsTrigger value="breaches">Breach Incidents</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          </TabsList>

          {/* Non-Compliant Devices */}
          <TabsContent value="devices">
            <Card className="bubo-glass p-6">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                Computers Requiring Attention
              </h3>
              <div className="space-y-3">
                {dashboardData?.nonCompliantDevices.map((device) => (
                  <div
                    key={device.device_id}
                    className="bg-surface-dark rounded-xl p-4 border border-slate-gray/30 hover:border-iq-neon-green/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                            {device.devices.name}
                          </h4>
                          <Badge className={getSeverityBadge(device.risk_level)}>
                            {device.risk_level.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-mist-gray">Score:</span>
                            <span className={`text-sm font-semibold ${getComplianceColor(device.compliance_score)}`}>
                              {device.compliance_score}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-mist-gray">Issues:</span>
                            <span className="text-sm font-semibold text-amber-warning">
                              {device.non_compliant_items.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="bubo-btn-secondary">
                        Remediate
                      </Button>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.nonCompliantDevices || dashboardData.nonCompliantDevices.length === 0) && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-iq-neon-green mx-auto mb-3 opacity-50" />
                    <p className="text-cloud-white">All computers are compliant</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Breach Incidents */}
          <TabsContent value="breaches">
            <Card className="bubo-glass p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white">
                  Recent Breach Incidents
                </h3>
                <Button className="bubo-btn-secondary">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Incident
                </Button>
              </div>
              <div className="space-y-3">
                {dashboardData?.recentBreaches.map((breach) => (
                  <div
                    key={breach.id}
                    className="bg-surface-dark rounded-xl p-4 border border-slate-gray/30 hover:border-crimson-danger/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                            {breach.incident_type.replace(/_/g, ' ').toUpperCase()}
                          </h4>
                          <Badge className={getSeverityBadge(breach.severity)}>
                            {breach.severity.toUpperCase()}
                          </Badge>
                          <Badge className="bg-slate-gray/20 text-cloud-white border-slate-gray/30">
                            {breach.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-cloud-white mb-2">{breach.description}</p>
                        <div className="flex items-center gap-4 text-xs text-mist-gray">
                          <span>Detected: {new Date(breach.detected_at).toLocaleString()}</span>
                          <span>Affected: {breach.affected_count} records</span>
                        </div>
                      </div>
                      <Button size="sm" className="bubo-btn-neon-primary ml-4">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.recentBreaches || dashboardData.recentBreaches.length === 0) && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-iq-neon-green mx-auto mb-3 opacity-50" />
                    <p className="text-cloud-white">No breach incidents detected</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Anomalies */}
          <TabsContent value="anomalies">
            <Card className="bubo-glass p-6">
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-pure-white mb-4">
                Detected Anomalies
              </h3>
              <div className="space-y-3">
                {dashboardData?.activeAnomalies.map((anomaly: any) => (
                  <div
                    key={anomaly.id}
                    className="bg-surface-dark rounded-xl p-4 border border-slate-gray/30 hover:border-electric-blue/30 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-['Space_Grotesk'] font-semibold text-pure-white">
                            {anomaly.anomaly_type.replace(/_/g, ' ').toUpperCase()}
                          </h4>
                          <Badge className={getSeverityBadge(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-cloud-white mb-2">{anomaly.description}</p>
                        <p className="text-xs text-mist-gray">
                          Detected: {new Date(anomaly.detected_at).toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" className="bubo-btn-secondary ml-4">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
                {(!dashboardData?.activeAnomalies || dashboardData.activeAnomalies.length === 0) && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-iq-neon-green mx-auto mb-3 opacity-50" />
                    <p className="text-cloud-white">No anomalies detected</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};