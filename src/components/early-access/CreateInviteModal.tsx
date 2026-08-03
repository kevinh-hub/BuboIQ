/**
 * Create Early Access Invite Modal
 * 
 * Interface for creating new invite-only EA invites
 */

import React, { useState } from 'react';
import { X, Mail, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { projectId } from '../../utils/supabase/info';
import { toast } from 'sonner';

interface CreateInviteModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInviteModal({ onClose, onSuccess }: CreateInviteModalProps) {
  const [email, setEmail] = useState('');
  const [daysValid, setDaysValid] = useState(10);
  const [notes, setNotes] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [createdInvite, setCreatedInvite] = useState<{
    token: string;
    inviteUrl: string;
    emailSent: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (email && !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('supabase.auth.token');
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55e8c5b2/early-access/admin/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email || null,
            daysValid,
            notes,
            sendEmail: sendEmail && email
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create invite');
      }

      setCreatedInvite({
        token: data.invite.token,
        inviteUrl: `${window.location.origin}/invite/ea?token=${data.invite.token}`,
        emailSent: data.emailSent
      });

      toast.success(data.emailSent ? 'Invite created and email sent!' : 'Invite created successfully!');
    } catch (error: any) {
      console.error('[EA] Create invite error:', error);
      toast.error(error.message || 'Failed to create invite');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdInvite) {
      navigator.clipboard.writeText(createdInvite.inviteUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="bubo-glass border-[#00FF85]/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white">
              Create Early Access Invite
            </h2>
            <button 
              onClick={onClose}
              className="text-mist-gray hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!createdInvite ? (
            <>
              {/* Form */}
              <div className="space-y-6">
                <div>
                  <Label className="text-cloud-white mb-2 block">
                    Recipient Email (optional)
                  </Label>
                  <Input 
                    type="email"
                    placeholder="Leave blank for open invite"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-surface-dark border-slate-gray/30 text-white"
                  />
                  <p className="text-xs text-mist-gray mt-1">
                    Optional: Leave blank to create an open invite link that anyone can use
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-cloud-white mb-2 block">
                      Days Valid
                    </Label>
                    <Input 
                      type="number"
                      value={daysValid}
                      onChange={(e) => setDaysValid(parseInt(e.target.value) || 10)}
                      min={1}
                      max={90}
                      className="bg-surface-dark border-slate-gray/30 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-cloud-white mb-2 block">
                      Plan
                    </Label>
                    <Input 
                      value="EA-Pro"
                      disabled
                      className="bg-surface-dark border-slate-gray/30 text-white opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-cloud-white mb-2 block">
                      Devices Included
                    </Label>
                    <Input 
                      value="100"
                      disabled
                      className="bg-surface-dark border-slate-gray/30 text-white opacity-50"
                    />
                  </div>

                  <div>
                    <Label className="text-cloud-white mb-2 block">
                      Overage Rate
                    </Label>
                    <Input 
                      value="$0.90/device"
                      disabled
                      className="bg-surface-dark border-slate-gray/30 text-white opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-cloud-white mb-2 block">
                    Notes (internal)
                  </Label>
                  <Textarea 
                    placeholder="Add internal notes about this invite..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="bg-surface-dark border-slate-gray/30 text-white resize-none"
                  />
                </div>

                {email && (
                  <label className="flex items-center gap-2 text-cloud-white cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-gray/30 text-[#00FF85] focus:ring-[#00FF85]"
                    />
                    <span className="text-sm">Send email notification to recipient</span>
                  </label>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-gray/30">
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="text-mist-gray hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreate}
                  disabled={loading}
                  className="bubo-btn-neon-primary"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      {sendEmail && email ? (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Generate & Send
                        </>
                      ) : (
                        'Generate Link Only'
                      )}
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="space-y-6">
                <div className="bg-[#00FF85]/10 border border-[#00FF85]/30 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00FF85]/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-6 h-6 text-[#00FF85]" />
                    </div>
                    <div>
                      <h3 className="font-['Space_Grotesk'] font-bold text-white mb-1">
                        Invite Created Successfully!
                      </h3>
                      <p className="text-cloud-white text-sm">
                        {createdInvite.emailSent 
                          ? `Email sent to ${email}` 
                          : 'Share this link with your recipient'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-dark rounded-lg p-4">
                    <Label className="text-mist-gray text-xs mb-2 block">INVITE URL</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-[#00FF85] font-jetbrains-mono text-sm break-all">
                        {createdInvite.inviteUrl}
                      </code>
                      <Button
                        size="sm"
                        onClick={handleCopy}
                        className={copied ? 'bg-[#00FF85] text-black' : 'bg-surface-dark hover:bg-[#00FF85]/20'}
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm">
                      <strong>Important:</strong> This is a <strong>single-use</strong> link. 
                      It will expire in <strong>{daysValid} days</strong> on{' '}
                      <strong>{new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toLocaleDateString()}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button 
                    onClick={handleCopy}
                    variant="outline"
                    className="border-[#00FF85]/30 text-[#00FF85] hover:bg-[#00FF85]/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button 
                    onClick={handleDone}
                    className="bubo-btn-neon-primary"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}