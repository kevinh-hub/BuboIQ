import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AnalystButton, ConfidenceOrb, CodeBlock } from '../AnalystComponentLibrary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { toast } from 'sonner@2.0.3';

/**
 * Screen 2: Issue Detail (with Agent Injection)
 * Ticket detail view with AI analyst recommendation panel
 */

export function IssueDetail({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [priority, setPriority] = useState('high');
  const [status, setStatus] = useState('in_progress');

  const ticket = {
    id: 'TKT-1042',
    title: 'Print spooler service crashes on WKS-SALES-042',
    description: 'User reports inability to print. Service crashes immediately after restart.',
    priority: 'high',
    status: 'in_progress',
    device: 'WKS-SALES-042',
    created: '2025-10-22 13:15:00',
    assignee: 'John Smith',
  };

  const aiRecommendation = {
    confidence: 87,
    rootCause: 'Driver corruption detected in HP Universal Print driver v6.8',
    nextStep: 'Uninstall corrupted driver, restart print spooler, install HP Universal Print v7.2',
    suggestedDescription: `**Issue:** Print spooler service crashes on startup
    
**Root Cause:** HP Universal Print driver v6.8 corruption detected via event log analysis
    
**Resolution Steps:**
1. Uninstall HP Universal Print v6.8
2. Restart print spooler service
3. Install HP Universal Print v7.2
4. Verify print functionality

**Automated Actions Taken:**
- Driver analysis completed
- Replacement driver staged
- Rollback point created`,
  };

  const applyRecommendation = () => {
    setShowApplyModal(false);
    toast.success('Ticket updated with AI recommendation.');
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#EAEFF5]">
      {/* Header */}
      <header className="border-b border-[#1F242D] bg-[#0A0B0D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={() => onNavigate?.('console')}
            className="flex items-center gap-2 text-[#AAB4C0] hover:text-[#00FF85] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Console
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#7A8694] font-jetbrains-mono mb-2">{ticket.id}</div>
              <h1 className="font-space-grotesk text-2xl font-bold text-white">
                {ticket.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#050607] border border-[#1F242D] rounded-xl px-4 py-2 text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#050607] border border-[#1F242D] rounded-xl px-4 py-2 text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Device</label>
                  <button className="text-[#3EA0FF] hover:text-[#5BB0FF] font-semibold">
                    {ticket.device}
                  </button>
                </div>
                <div>
                  <label className="text-xs text-[#7A8694] block mb-2">Description</label>
                  <p className="text-[#C7D0DA]">{ticket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#1F242D]">
                  <div>
                    <div className="text-xs text-[#7A8694] mb-1">Created</div>
                    <div className="font-jetbrains-mono text-sm text-[#C7D0DA]">{ticket.created}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#7A8694] mb-1">Assignee</div>
                    <div className="text-sm text-[#C7D0DA]">{ticket.assignee}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <h3 className="font-space-grotesk font-semibold text-white mb-4">Activity Log</h3>
              <div className="space-y-3">
                {[
                  { time: '14:32', user: 'AI Analyst', action: 'Generated recommendation', color: '#00FF85' },
                  { time: '13:45', user: 'John Smith', action: 'Assigned to self', color: '#AAB4C0' },
                  { time: '13:15', user: 'System', action: 'Ticket created', color: '#AAB4C0' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="font-jetbrains-mono text-xs text-[#7A8694] w-12">{log.time}</div>
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: log.color }} />
                    <div className="flex-1">
                      <span className="text-white font-semibold">{log.user}</span>
                      <span className="text-[#AAB4C0]"> {log.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Analyst Recommendation */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#00FF85]/10 to-[#3EA0FF]/10 border border-[#00FF85]/30 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-space-grotesk font-semibold text-white">
                  Analyst Recommendation
                </h3>
                <ConfidenceOrb value={aiRecommendation.confidence} />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-[#7A8694] mb-2">Predicted Root Cause</div>
                  <p className="text-sm text-[#C7D0DA] bg-[#050607] border border-[#1F242D] rounded-xl p-3">
                    {aiRecommendation.rootCause}
                  </p>
                </div>
                <div>
                  <div className="text-xs text-[#7A8694] mb-2">Recommended Next Step</div>
                  <p className="text-sm text-[#C7D0DA] bg-[#050607] border border-[#1F242D] rounded-xl p-3">
                    {aiRecommendation.nextStep}
                  </p>
                </div>
              </div>

              <div className="bg-[#F6C14A]/10 border border-[#F6C14A]/30 rounded-xl p-3 mb-6 text-sm text-[#F6C14A]">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                AI suggestions require review.
              </div>

              <AnalystButton
                variant="primary"
                onClick={() => setShowApplyModal(true)}
              >
                Apply to Ticket
              </AnalystButton>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="bg-[#0A0B0D] border-[#1F242D] text-[#EAEFF5] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-space-grotesk text-xl text-white">
              Apply AI Recommendation
            </DialogTitle>
            <DialogDescription className="text-[#AAB4C0]">
              Review the changes that will be applied to ticket {ticket.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-6">
            <div>
              <div className="text-xs text-[#7A8694] mb-2">Description Changes</div>
              <div className="bg-[#050607] border border-[#1F242D] rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-xs text-[#FF6B6B]">BEFORE</div>
                  <div className="text-sm text-[#AAB4C0] line-through">
                    {ticket.description}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-xs text-[#55D187]">AFTER</div>
                  <div className="text-sm text-[#C7D0DA] whitespace-pre-line">
                    {aiRecommendation.suggestedDescription}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F6C14A]/10 border border-[#F6C14A]/30 rounded-xl p-3 text-sm text-[#F6C14A]">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              AI suggestions require review. This update will be logged in the activity timeline.
            </div>
          </div>

          <div className="flex gap-3">
            <AnalystButton variant="primary" onClick={applyRecommendation}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Confirm & Apply
            </AnalystButton>
            <AnalystButton variant="ghost" onClick={() => setShowApplyModal(false)}>
              Cancel
            </AnalystButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
