import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Download, Calendar as CalendarIcon, FileText, Loader2, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EvidenceExportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (config: ExportConfig) => Promise<{ filename: string; url: string; hash: string }>;
}

interface ExportConfig {
  startDate: Date;
  endDate: Date;
  sources: string[];
  format: 'csv' | 'json' | 'pdf';
  includeSHA256: boolean;
}

const EVIDENCE_SOURCES = [
  { id: 'audit_logs', name: 'Audit logs', description: 'All system events', icon: Shield },
  { id: 'remote_sessions', name: 'Remote sessions', description: 'Session recordings and notes', icon: FileText },
  { id: 'phi_detections', name: 'PHI detections', description: 'Health info logs', icon: Shield },
  { id: 'device_posture', name: 'Security status', description: 'Computer security snapshots', icon: CheckCircle2 },
  { id: 'breach_incidents', name: 'Breach incidents', description: 'Incident reports and what we did', icon: Shield },
  { id: 'anomaly_events', name: 'Anomaly events', description: 'Weird security stuff we caught', icon: Shield },
  { id: 'compliance_scores', name: 'Compliance scores', description: 'Compliance history', icon: CheckCircle2 },
  { id: 'consent_records', name: 'Consent records', description: 'User consent proof', icon: FileText }
];

export const EvidenceExportWizard: React.FC<EvidenceExportWizardProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedSources, setSelectedSources] = useState<string[]>(['audit_logs']);
  const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('pdf');
  const [includeSHA256, setIncludeSHA256] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{ filename: string; url: string; hash: string } | null>(null);

  const handleToggleSource = (sourceId: string) => {
    setSelectedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleExport = async () => {
    if (selectedSources.length === 0) {
      toast.error('Pick at least one source', {
        description: 'You need to select what to export'
      });
      return;
    }

    try {
      setExporting(true);
      
      const result = await onExport({
        startDate,
        endDate,
        sources: selectedSources,
        format,
        includeSHA256
      });

      setExportResult(result);
      
      toast.success('Export ready', {
        description: `${selectedSources.length} sources exported with secure signature`
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportResult) return;

    const link = document.createElement('a');
    link.href = exportResult.url;
    link.download = exportResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Download started', {
      description: exportResult.filename
    });
  };

  const handleReset = () => {
    setExportResult(null);
    setSelectedSources(['audit_logs']);
    setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    setEndDate(new Date());
  };

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-dark-midnight border-slate-gray/30">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
            Evidence Export Wizard
          </DialogTitle>
          <DialogDescription className="text-mist-gray">
            Export compliance evidence for audits and regulatory requirements
          </DialogDescription>
        </DialogHeader>

        {!exportResult ? (
          <div className="space-y-6">
            {/* Time Range */}
            <div>
              <Label className="text-pure-white mb-3 block">Time Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-mist-gray mb-2 block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left bg-surface-dark border-slate-gray/30 text-cloud-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-surface-dark border-slate-gray/30">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm text-mist-gray mb-2 block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left bg-surface-dark border-slate-gray/30 text-cloud-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-surface-dark border-slate-gray/30">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="text-xs text-mist-gray mt-2">
                Selected range: {daysDiff} days
              </p>
            </div>

            {/* Evidence Sources */}
            <div>
              <Label className="text-pure-white mb-3 block">Evidence Sources</Label>
              <div className="grid grid-cols-2 gap-3">
                {EVIDENCE_SOURCES.map((source) => {
                  const IconComponent = source.icon;
                  const isSelected = selectedSources.includes(source.id);

                  return (
                    <label
                      key={source.id}
                      className={`
                        bubo-glass rounded-lg p-3 cursor-pointer transition-all border
                        ${isSelected ? 'border-iq-neon-green/40 bg-iq-neon-green/5' : 'hover:border-electric-blue/40'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSource(source.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="w-4 h-4 text-iq-neon-green" />
                            <span className="text-sm font-medium text-pure-white">
                              {source.name}
                            </span>
                          </div>
                          <p className="text-xs text-mist-gray">
                            {source.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-mist-gray mt-2">
                {selectedSources.length} source{selectedSources.length !== 1 ? 's' : ''} selected
              </p>
            </div>

            {/* Export Format */}
            <div>
              <Label className="text-pure-white mb-3 block">Export Format</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['pdf', 'csv', 'json'] as const).map((fmt) => (
                  <label
                    key={fmt}
                    className={`
                      bubo-glass rounded-lg p-4 cursor-pointer transition-all border text-center
                      ${format === fmt ? 'border-iq-neon-green/40 bg-iq-neon-green/5' : 'hover:border-electric-blue/40'}
                    `}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={fmt}
                      checked={format === fmt}
                      onChange={() => setFormat(fmt)}
                      className="sr-only"
                    />
                    <FileText className="w-6 h-6 text-iq-neon-green mx-auto mb-2" />
                    <span className="text-sm font-medium text-pure-white uppercase">
                      {fmt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Options */}
            <div className="bubo-glass-bright rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={includeSHA256}
                  onCheckedChange={(checked) => setIncludeSHA256(checked as boolean)}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-iq-neon-green" />
                    <span className="text-sm font-medium text-pure-white">
                      Add security fingerprint
                    </span>
                  </div>
                  <p className="text-xs text-mist-gray">
                    Creates a unique code to prove the file wasn't changed. Needed for audits.
                  </p>
                </div>
              </label>
            </div>

            {/* Summary */}
            <div className="bubo-glass rounded-lg p-4">
              <h4 className="font-['Space_Grotesk'] text-pure-white mb-3">Export Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist-gray">Time Range:</span>
                  <span className="text-cloud-white">{daysDiff} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Sources:</span>
                  <span className="text-cloud-white">{selectedSources.length} selected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Format:</span>
                  <span className="text-cloud-white uppercase">{format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Security:</span>
                  <span className="text-cloud-white">{includeSHA256 ? 'Fingerprint on' : 'Standard'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="bubo-btn-ghost"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={exporting || selectedSources.length === 0}
                className="bubo-btn-neon-primary"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Evidence
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success State */}
            <div className="bubo-glass-bright rounded-xl p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-iq-neon-green mx-auto mb-4" />
              <h3 className="font-['Space_Grotesk'] text-xl text-pure-white mb-2">
                Evidence Export Complete
              </h3>
              <p className="text-mist-gray mb-6">
                Your compliance evidence package is ready for download
              </p>

              <div className="bubo-glass rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mist-gray">Filename:</span>
                    <span className="text-cloud-white font-['JetBrains_Mono']">{exportResult.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist-gray">Sources:</span>
                    <span className="text-cloud-white">{selectedSources.length} included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist-gray">Time Range:</span>
                    <span className="text-cloud-white">{daysDiff} days</span>
                  </div>
                  {exportResult.hash && (
                    <div className="pt-2 border-t border-slate-gray/30">
                      <div className="text-mist-gray mb-1">SHA-256 Hash:</div>
                      <code className="text-xs text-iq-neon-green font-['JetBrains_Mono'] break-all">
                        {exportResult.hash}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleDownload}
                  className="bubo-btn-neon-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Package
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="bubo-btn-ghost"
                >
                  Export Again
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => {
                  handleReset();
                  onClose();
                }}
                variant="outline"
                className="bubo-btn-ghost"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};