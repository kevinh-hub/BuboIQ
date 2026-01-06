import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Download, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FrameworkScore {
  framework: 'HIPAA' | 'PCI-DSS' | 'SOC2';
  overall_score: number;
  last_updated: string;
  controls: FrameworkControl[];
  certification_status: 'compliant' | 'non_compliant' | 'in_progress';
  next_audit_date?: string;
}

interface FrameworkControl {
  id: string;
  name: string;
  category: string;
  status: 'pass' | 'fail' | 'na' | 'in_progress';
  description: string;
  evidence_count: number;
  last_verified: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

interface FrameworkScorecardsProps {
  scores: FrameworkScore[];
  onExportScorecard: (framework: string, format: 'pdf' | 'csv') => Promise<void>;
  onViewEvidence: (controlId: string) => void;
}

const FRAMEWORK_INFO = {
  HIPAA: {
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    icon: Shield,
    color: 'iq-neon-green',
    description: 'Healthcare data protection compliance'
  },
  'PCI-DSS': {
    name: 'PCI-DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    icon: Shield,
    color: 'electric-blue',
    description: 'Cardholder data security requirements'
  },
  SOC2: {
    name: 'SOC 2',
    fullName: 'Service Organization Control 2',
    icon: Shield,
    color: 'prediction-purple',
    description: 'Trust services criteria compliance'
  }
};

export const FrameworkScorecards: React.FC<FrameworkScorecardsProps> = ({
  scores,
  onExportScorecard,
  onViewEvidence
}) => {
  const [exporting, setExporting] = useState<{ [key: string]: boolean }>({});
  const [selectedFramework, setSelectedFramework] = useState<'HIPAA' | 'PCI-DSS' | 'SOC2'>('HIPAA');

  const handleExport = async (framework: string, format: 'pdf' | 'csv') => {
    const key = `${framework}-${format}`;
    if (exporting[key]) return;

    try {
      setExporting(prev => ({ ...prev, [key]: true }));
      await onExportScorecard(framework, format);
      
      toast.success('Scorecard exported', {
        description: `${framework} compliance report downloaded`
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setExporting(prev => ({ ...prev, [key]: false }));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-iq-neon-green';
    if (score >= 70) return 'text-signal-blue';
    if (score >= 50) return 'text-amber-warning';
    return 'text-crimson-danger';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">Compliant</Badge>;
      case 'non_compliant':
        return <Badge className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">Non-Compliant</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">In Progress</Badge>;
      default:
        return null;
    }
  };

  const getControlIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="w-5 h-5 text-iq-neon-green" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-crimson-danger" />;
      case 'in_progress':
        return <AlertTriangle className="w-5 h-5 text-amber-warning" />;
      case 'na':
        return <div className="w-5 h-5 rounded-full bg-mist-gray/20 border border-mist-gray/30" />;
      default:
        return null;
    }
  };

  const currentScore = scores.find(s => s.framework === selectedFramework);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {scores.map((score) => {
          const info = FRAMEWORK_INFO[score.framework];
          const IconComponent = info.icon;

          return (
            <Card
              key={score.framework}
              className={`
                bubo-glass cursor-pointer transition-all border
                ${selectedFramework === score.framework 
                  ? 'border-iq-neon-green/40 bg-iq-neon-green/5' 
                  : 'hover:border-electric-blue/40'}
              `}
              onClick={() => setSelectedFramework(score.framework)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${info.color}/20`}>
                    <IconComponent className={`w-5 h-5 text-${info.color}`} />
                  </div>
                  {getStatusBadge(score.certification_status)}
                </div>
                <CardTitle className="font-['Space_Grotesk'] text-lg text-pure-white">
                  {info.name}
                </CardTitle>
                <p className="text-xs text-mist-gray">{info.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-4xl font-['Space_Grotesk'] ${getScoreColor(score.overall_score)}`}>
                        {score.overall_score}%
                      </span>
                      <span className="text-sm text-mist-gray">Overall</span>
                    </div>
                    <Progress value={score.overall_score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="text-iq-neon-green font-medium">
                        {score.controls.filter(c => c.status === 'pass').length}
                      </div>
                      <div className="text-mist-gray">Pass</div>
                    </div>
                    <div>
                      <div className="text-crimson-danger font-medium">
                        {score.controls.filter(c => c.status === 'fail').length}
                      </div>
                      <div className="text-mist-gray">Fail</div>
                    </div>
                    <div>
                      <div className="text-amber-warning font-medium">
                        {score.controls.filter(c => c.status === 'in_progress').length}
                      </div>
                      <div className="text-mist-gray">Progress</div>
                    </div>
                    <div>
                      <div className="text-mist-gray font-medium">
                        {score.controls.filter(c => c.status === 'na').length}
                      </div>
                      <div className="text-mist-gray">N/A</div>
                    </div>
                  </div>

                  <div className="text-xs text-mist-gray pt-2 border-t border-slate-gray/30">
                    Last updated: {new Date(score.last_updated).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View */}
      {currentScore && (
        <Card className="bubo-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-['Space_Grotesk'] text-2xl text-pure-white mb-2">
                  {FRAMEWORK_INFO[selectedFramework].fullName}
                </CardTitle>
                <p className="text-mist-gray">
                  Detailed control-by-control compliance status
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleExport(selectedFramework, 'pdf')}
                  disabled={exporting[`${selectedFramework}-pdf`]}
                  size="sm"
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  {exporting[`${selectedFramework}-pdf`] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  PDF
                </Button>
                <Button
                  onClick={() => handleExport(selectedFramework, 'csv')}
                  disabled={exporting[`${selectedFramework}-csv`]}
                  size="sm"
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  {exporting[`${selectedFramework}-csv`] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Group controls by category */}
            {Object.entries(
              currentScore.controls.reduce((acc, control) => {
                if (!acc[control.category]) {
                  acc[control.category] = [];
                }
                acc[control.category].push(control);
                return acc;
              }, {} as Record<string, FrameworkControl[]>)
            ).map(([category, controls]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="font-['Space_Grotesk'] text-lg text-pure-white mb-4">
                  {category}
                </h3>
                <div className="space-y-3">
                  {controls.map((control) => (
                    <div
                      key={control.id}
                      className={`
                        bubo-glass rounded-lg p-4 border transition-all
                        ${control.status === 'fail' ? 'border-crimson-danger/30 bg-crimson-danger/5' : ''}
                        ${control.status === 'pass' ? 'border-iq-neon-green/30 bg-iq-neon-green/5' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getControlIcon(control.status)}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-['Space_Grotesk'] text-pure-white">
                                {control.name}
                              </h4>
                              {control.risk_level !== 'low' && (
                                <Badge className={
                                  control.risk_level === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
                                  control.risk_level === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
                                  'bg-signal-blue/20 text-signal-blue'
                                }>
                                  {control.risk_level}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-cloud-white mb-2">
                              {control.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-mist-gray">
                              <span>Evidence: {control.evidence_count} items</span>
                              <span>Last verified: {new Date(control.last_verified).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        {control.evidence_count > 0 && (
                          <Button
                            onClick={() => onViewEvidence(control.id)}
                            size="sm"
                            variant="outline"
                            className="bubo-btn-ghost"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Evidence
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};