import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye, EyeOff, CheckCircle2, XCircle, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PHIRedactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    id: string;
    source: string;
    text: string;
    detected_phi: DetectedPHI[];
  };
  onApprove: (contentId: string, approvedRedactions: string[]) => Promise<void>;
  onReject: (contentId: string, rejectedRedactions: string[]) => Promise<void>;
}

interface DetectedPHI {
  id: string;
  type: 'name' | 'ssn' | 'mrn' | 'dob' | 'address' | 'phone' | 'email' | 'diagnosis' | 'other';
  text: string;
  start: number;
  end: number;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
}

const PHI_TYPE_LABELS = {
  name: 'Patient Name',
  ssn: 'Social Security Number',
  mrn: 'Medical Record Number',
  dob: 'Date of Birth',
  address: 'Address',
  phone: 'Phone Number',
  email: 'Email Address',
  diagnosis: 'Diagnosis/Condition',
  other: 'Other PHI'
};

const PHI_TYPE_COLORS = {
  name: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30',
  ssn: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
  mrn: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30',
  dob: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30',
  address: 'bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30',
  phone: 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30',
  email: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30',
  diagnosis: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30',
  other: 'bg-mist-gray/20 text-mist-gray border-mist-gray/30'
};

export const PHIRedactionModal: React.FC<PHIRedactionModalProps> = ({
  isOpen,
  onClose,
  content,
  onApprove,
  onReject
}) => {
  const [phiItems, setPHIItems] = useState<DetectedPHI[]>(content.detected_phi);
  const [showRedacted, setShowRedacted] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleToggleStatus = (phiId: string, newStatus: 'approved' | 'rejected') => {
    setPHIItems(items =>
      items.map(item =>
        item.id === phiId ? { ...item, status: item.status === newStatus ? 'pending' : newStatus } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const approved = phiItems.filter(p => p.status === 'approved').map(p => p.id);
      const rejected = phiItems.filter(p => p.status === 'rejected').map(p => p.id);

      if (approved.length > 0) {
        await onApprove(content.id, approved);
      }
      
      if (rejected.length > 0) {
        await onReject(content.id, rejected);
      }

      toast.success('PHI redaction saved', {
        description: `${approved.length} approved, ${rejected.length} rejected`
      });
      
      onClose();
    } catch (error) {
      toast.error('Failed to save redactions', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderHighlightedText = () => {
    if (phiItems.length === 0) {
      return <p className="text-cloud-white">{content.text}</p>;
    }

    // Sort PHI items by start position
    const sortedPHI = [...phiItems].sort((a, b) => a.start - b.start);
    
    const parts: React.ReactNode[] = [];
    let lastEnd = 0;

    sortedPHI.forEach((phi, index) => {
      // Add text before PHI
      if (phi.start > lastEnd) {
        parts.push(
          <span key={`text-${index}`} className="text-cloud-white">
            {content.text.substring(lastEnd, phi.start)}
          </span>
        );
      }

      // Add highlighted PHI
      const isApproved = phi.status === 'approved';
      const isRejected = phi.status === 'rejected';
      const displayText = showRedacted && isApproved ? '[REDACTED]' : phi.text;

      parts.push(
        <span
          key={`phi-${phi.id}`}
          className={`
            inline-block px-2 py-0.5 rounded border cursor-pointer transition-all
            ${isApproved ? 'bg-iq-neon-green/20 border-iq-neon-green/50' : ''}
            ${isRejected ? 'bg-slate-gray/20 border-slate-gray/50 line-through' : ''}
            ${!isApproved && !isRejected ? PHI_TYPE_COLORS[phi.type] : ''}
          `}
          onClick={() => handleToggleStatus(phi.id, 'approved')}
          title={`${PHI_TYPE_LABELS[phi.type]} (${Math.round(phi.confidence * 100)}% confidence)`}
        >
          {displayText}
        </span>
      );

      lastEnd = phi.end;
    });

    // Add remaining text
    if (lastEnd < content.text.length) {
      parts.push(
        <span key="text-end" className="text-cloud-white">
          {content.text.substring(lastEnd)}
        </span>
      );
    }

    return <div className="leading-relaxed">{parts}</div>;
  };

  const approvedCount = phiItems.filter(p => p.status === 'approved').length;
  const rejectedCount = phiItems.filter(p => p.status === 'rejected').length;
  const pendingCount = phiItems.filter(p => p.status === 'pending').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-dark-midnight border-slate-gray/30 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-['Space_Grotesk'] text-2xl text-pure-white">
            PHI Redaction Review
          </DialogTitle>
          <DialogDescription className="text-mist-gray">
            Review and approve/reject detected Protected Health Information
          </DialogDescription>
        </DialogHeader>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bubo-glass rounded-lg p-3 text-center">
            <div className="text-2xl font-['Space_Grotesk'] text-pure-white mb-1">
              {phiItems.length}
            </div>
            <div className="text-xs text-mist-gray">Detected</div>
          </div>
          <div className="bubo-glass rounded-lg p-3 text-center">
            <div className="text-2xl font-['Space_Grotesk'] text-iq-neon-green mb-1">
              {approvedCount}
            </div>
            <div className="text-xs text-mist-gray">Approved</div>
          </div>
          <div className="bubo-glass rounded-lg p-3 text-center">
            <div className="text-2xl font-['Space_Grotesk'] text-crimson-danger mb-1">
              {rejectedCount}
            </div>
            <div className="text-xs text-mist-gray">Rejected</div>
          </div>
          <div className="bubo-glass rounded-lg p-3 text-center">
            <div className="text-2xl font-['Space_Grotesk'] text-amber-warning mb-1">
              {pendingCount}
            </div>
            <div className="text-xs text-mist-gray">Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-mist-gray">
            Source: <span className="text-cloud-white">{content.source}</span>
          </div>
          <Button
            onClick={() => setShowRedacted(!showRedacted)}
            variant="outline"
            size="sm"
            className="bubo-btn-ghost"
          >
            {showRedacted ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show Original
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Show Redacted
              </>
            )}
          </Button>
        </div>

        {/* Content Preview */}
        <div className="bubo-glass rounded-xl p-6 mb-6">
          <h4 className="font-['Space_Grotesk'] text-pure-white mb-4">Content Preview</h4>
          <div className="bg-dark-midnight/50 rounded-lg p-4 font-['Inter'] text-base">
            {renderHighlightedText()}
          </div>
        </div>

        {/* PHI Items List */}
        <div className="space-y-3 mb-6">
          <h4 className="font-['Space_Grotesk'] text-pure-white">Detected PHI ({phiItems.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {phiItems.map((phi) => (
              <div
                key={phi.id}
                className={`
                  bubo-glass rounded-lg p-3 border transition-all
                  ${phi.status === 'approved' ? 'border-iq-neon-green/30 bg-iq-neon-green/5' : ''}
                  ${phi.status === 'rejected' ? 'border-slate-gray/30 bg-slate-gray/5' : ''}
                  ${phi.status === 'pending' ? 'border-amber-warning/30 bg-amber-warning/5' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={PHI_TYPE_COLORS[phi.type]}>
                        {PHI_TYPE_LABELS[phi.type]}
                      </Badge>
                      <span className="text-sm text-mist-gray">
                        {Math.round(phi.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-cloud-white font-['JetBrains_Mono'] text-sm">
                      "{phi.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => handleToggleStatus(phi.id, 'approved')}
                      size="sm"
                      variant="outline"
                      className={phi.status === 'approved' ? 'bg-iq-neon-green/20 border-iq-neon-green text-iq-neon-green' : 'bubo-btn-ghost'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleToggleStatus(phi.id, 'rejected')}
                      size="sm"
                      variant="outline"
                      className={phi.status === 'rejected' ? 'bg-crimson-danger/20 border-crimson-danger text-crimson-danger' : 'bubo-btn-ghost'}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {pendingCount > 0 && (
          <div className="bubo-glass-bright rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-iq-neon-green mt-0.5" />
              <div>
                <p className="text-cloud-white text-sm">
                  {pendingCount} PHI item{pendingCount !== 1 ? 's' : ''} pending review. 
                  Click Approve (✓) or Reject (✗) for each item before saving.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-gray/30">
          <Button
            onClick={onClose}
            variant="outline"
            className="bubo-btn-ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || (approvedCount === 0 && rejectedCount === 0)}
            className="bubo-btn-neon-primary"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Redactions
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
