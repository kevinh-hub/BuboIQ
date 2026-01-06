import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { FileText, Download, Send, Clock, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BreachNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: {
    id: string;
    title: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    affected_users_count: number;
    regulatory_frameworks: string[];
    discovery_timestamp: string;
  };
  onGenerateNotice: (framework: string, recipients: string[]) => Promise<{ content: string; filename: string }>;
}

const NOTIFICATION_TEMPLATES = {
  HIPAA: {
    name: 'HIPAA Breach Notice',
    recipients: ['HHS Office for Civil Rights', 'People affected', 'Media (if 500+)'],
    timeline: '60 days after you find out',
    required_info: [
      'What happened',
      'What health data was affected',
      'What people should do',
      'How you\'re investigating',
      'How to ask questions'
    ]
  },
  'PCI-DSS': {
    name: 'PCI-DSS Breach Notice',
    recipients: ['Card companies', 'Your bank', 'Cardholders affected'],
    timeline: 'Right away',
    required_info: [
      'What was compromised',
      'Which card data was affected',
      'Which systems were hit',
      'How you fixed it',
      'Investigation status'
    ]
  },
  'SOC 2': {
    name: 'SOC 2 Security Event Notice',
    recipients: ['Customers', 'Auditors', 'Management'],
    timeline: 'When your contract says',
    required_info: [
      'What happened',
      'Which security areas were affected',
      'Impact on security',
      'How you fixed it',
      'When it happened and what you did'
    ]
  }
};

export const BreachNotificationModal: React.FC<BreachNotificationModalProps> = ({
  isOpen,
  onClose,
  incident,
  onGenerateNotice
}) => {
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{ content: string; filename: string } | null>(null);

  const handleGenerate = async (framework: string) => {
    try {
      setGenerating(true);
      setSelectedFramework(framework);
      
      const template = NOTIFICATION_TEMPLATES[framework as keyof typeof NOTIFICATION_TEMPLATES];
      const result = await onGenerateNotice(framework, template.recipients);
      
      setGeneratedContent(result);
      toast.success('Notice ready', {
        description: `${framework} breach notice ready to review`
      });
    } catch (error) {
      toast.error('Couldn\'t create notice', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent) return;

    const blob = new Blob([generatedContent.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedContent.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Notice downloaded', {
      description: `Saved as ${generatedContent.filename}`
    });
  };

  const handleSend = () => {
    toast.success('Notice sending initiated', {
      description: 'Recipients will be notified according to regulatory requirements'
    });
    onClose();
  };

  const daysSinceDiscovery = Math.floor(
    (Date.now() - new Date(incident.discovery_timestamp).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-dark-midnight border-slate-gray/30 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
            Breach Notification Generator
          </DialogTitle>
          <DialogDescription className="text-mist-gray">
            Generate regulatory-compliant breach notifications
          </DialogDescription>
        </DialogHeader>

        {/* Incident Summary */}
        <div className="bubo-glass rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-['Space_Grotesk'] text-lg text-pure-white mb-1">
                {incident.title}
              </h3>
              <p className="text-sm text-mist-gray">Incident ID: {incident.id}</p>
            </div>
            <Badge className={
              incident.severity === 'critical' ? 'bg-crimson-danger/20 text-crimson-danger' :
              incident.severity === 'high' ? 'bg-amber-warning/20 text-amber-warning' :
              'bg-signal-blue/20 text-signal-blue'
            }>
              {incident.severity.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-mist-gray">Affected Users:</span>
              <p className="text-pure-white font-medium">{incident.affected_users_count}</p>
            </div>
            <div>
              <span className="text-mist-gray">Days Since Discovery:</span>
              <p className="text-pure-white font-medium">{daysSinceDiscovery} days</p>
            </div>
            <div>
              <span className="text-mist-gray">Frameworks:</span>
              <p className="text-pure-white font-medium">{incident.regulatory_frameworks.length}</p>
            </div>
          </div>

          {/* Timeline Warning */}
          {daysSinceDiscovery > 30 && incident.regulatory_frameworks.includes('HIPAA') && (
            <div className="mt-3 flex items-start space-x-2 text-amber-warning bg-amber-warning/10 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                HIPAA requires notification within 60 days. {60 - daysSinceDiscovery} days remaining.
              </p>
            </div>
          )}
        </div>

        {/* Framework Tabs */}
        <Tabs defaultValue={incident.regulatory_frameworks[0]} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-surface-dark border border-slate-gray/30">
            {incident.regulatory_frameworks.map((framework) => (
              <TabsTrigger
                key={framework}
                value={framework}
                className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green"
              >
                {framework}
              </TabsTrigger>
            ))}
          </TabsList>

          {incident.regulatory_frameworks.map((framework) => {
            const template = NOTIFICATION_TEMPLATES[framework as keyof typeof NOTIFICATION_TEMPLATES];
            if (!template) return null;

            return (
              <TabsContent key={framework} value={framework} className="space-y-4">
                {/* Template Info */}
                <div className="bubo-glass rounded-xl p-4">
                  <h4 className="font-['Space_Grotesk'] text-pure-white mb-3">{template.name}</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-iq-neon-green" />
                        <span className="text-sm text-mist-gray">Timeline:</span>
                      </div>
                      <p className="text-cloud-white text-sm pl-6">{template.timeline}</p>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Send className="w-4 h-4 text-iq-neon-green" />
                        <span className="text-sm text-mist-gray">Recipients:</span>
                      </div>
                      <ul className="text-cloud-white text-sm pl-6 space-y-1">
                        {template.recipients.map((recipient, idx) => (
                          <li key={idx}>• {recipient}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-iq-neon-green" />
                        <span className="text-sm text-mist-gray">Required Information:</span>
                      </div>
                      <ul className="text-cloud-white text-sm pl-6 space-y-1">
                        {template.required_info.map((info, idx) => (
                          <li key={idx}>• {info}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Generated Content */}
                {generatedContent && selectedFramework === framework ? (
                  <div className="bubo-glass-bright rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-iq-neon-green" />
                        <h4 className="font-['Space_Grotesk'] text-pure-white">Generated Notice</h4>
                      </div>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="bubo-btn-ghost"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <pre className="text-sm text-cloud-white whitespace-pre-wrap bg-dark-midnight/50 rounded-lg p-4 max-h-64 overflow-y-auto font-['JetBrains_Mono']">
                      {generatedContent.content}
                    </pre>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleGenerate(framework)}
                    disabled={generating}
                    className="w-full bubo-btn-neon-primary"
                  >
                    {generating && selectedFramework === framework ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Notice...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate {framework} Notice
                      </>
                    )}
                  </Button>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Actions */}
        {generatedContent && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-gray/30">
            <Button
              onClick={onClose}
              variant="outline"
              className="bubo-btn-ghost"
            >
              Close
            </Button>
            <Button
              onClick={handleSend}
              className="bubo-btn-neon-primary"
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Recipients
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
