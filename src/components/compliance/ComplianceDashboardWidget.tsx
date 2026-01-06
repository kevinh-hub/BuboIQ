import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Shield, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

interface ComplianceMetrics {
  overall_score: number;
  framework_scores: {
    hipaa: number;
    pci: number;
    soc2: number;
  };
  active_incidents: number;
  recent_anomalies: number;
  posture_failures: number;
  phi_detections_today: number;
}

interface ComplianceDashboardWidgetProps {
  metrics: ComplianceMetrics;
  onViewDashboard: () => void;
}

export const ComplianceDashboardWidget: React.FC<ComplianceDashboardWidgetProps> = ({
  metrics,
  onViewDashboard
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-iq-neon-green';
    if (score >= 70) return 'text-signal-blue';
    if (score >= 50) return 'text-amber-warning';
    return 'text-crimson-danger';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-iq-neon-green/10';
    if (score >= 70) return 'bg-signal-blue/10';
    if (score >= 50) return 'bg-amber-warning/10';
    return 'bg-crimson-danger/10';
  };

  const hasAlerts = metrics.active_incidents > 0 || metrics.recent_anomalies > 0 || metrics.posture_failures > 0;

  return (
    <Card className="bubo-glass border-iq-neon-green/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-['Space_Grotesk'] text-lg text-pure-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-iq-neon-green" />
            Compliance
          </CardTitle>
          {hasAlerts && (
            <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
              Alerts
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className={`rounded-lg p-4 ${getScoreBg(metrics.overall_score)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-mist-gray">Overall score</span>
            <span className={`text-2xl font-['Space_Grotesk'] ${getScoreColor(metrics.overall_score)}`}>
              {metrics.overall_score}%
            </span>
          </div>
          <Progress value={metrics.overall_score} className="h-2" />
        </div>

        {/* Framework Scores */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={`text-lg font-['Space_Grotesk'] ${getScoreColor(metrics.framework_scores.hipaa)}`}>
              {metrics.framework_scores.hipaa}%
            </div>
            <div className="text-xs text-mist-gray">HIPAA</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-['Space_Grotesk'] ${getScoreColor(metrics.framework_scores.pci)}`}>
              {metrics.framework_scores.pci}%
            </div>
            <div className="text-xs text-mist-gray">PCI-DSS</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-['Space_Grotesk'] ${getScoreColor(metrics.framework_scores.soc2)}`}>
              {metrics.framework_scores.soc2}%
            </div>
            <div className="text-xs text-mist-gray">SOC 2</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          {metrics.active_incidents > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-crimson-danger" />
                <span className="text-cloud-white">Active Incidents</span>
              </div>
              <Badge className="bg-crimson-danger/20 text-crimson-danger">
                {metrics.active_incidents}
              </Badge>
            </div>
          )}

          {metrics.recent_anomalies > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-warning" />
                <span className="text-cloud-white">Recent Anomalies</span>
              </div>
              <Badge className="bg-amber-warning/20 text-amber-warning">
                {metrics.recent_anomalies}
              </Badge>
            </div>
          )}

          {metrics.posture_failures > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-signal-blue" />
                <span className="text-cloud-white">Posture Failures</span>
              </div>
              <Badge className="bg-signal-blue/20 text-signal-blue">
                {metrics.posture_failures}
              </Badge>
            </div>
          )}

          {metrics.phi_detections_today > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-iq-neon-green" />
                <span className="text-cloud-white">PHI Detections Today</span>
              </div>
              <Badge className="bg-iq-neon-green/20 text-iq-neon-green">
                {metrics.phi_detections_today}
              </Badge>
            </div>
          )}

          {!hasAlerts && metrics.phi_detections_today === 0 && (
            <div className="flex items-center justify-center text-sm text-mist-gray py-2">
              <CheckCircle2 className="w-4 h-4 mr-2 text-iq-neon-green" />
              All systems compliant
            </div>
          )}
        </div>

        {/* View Full Dashboard */}
        <Button
          onClick={onViewDashboard}
          className="w-full bubo-btn-ghost"
        >
          View Full Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};