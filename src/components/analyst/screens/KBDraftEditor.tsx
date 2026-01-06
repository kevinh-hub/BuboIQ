import React, { useState } from 'react';
import { ArrowLeft, Save, Upload, TrendingUp, History } from 'lucide-react';
import { AnalystButton, AnalystBadge, CodeBlock, TierGuardBanner } from '../AnalystComponentLibrary';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { toast } from 'sonner@2.0.3';

/**
 * Screen 3: KB Draft Editor
 * Knowledge base article editor with AI-generated content
 */

export function KBDraftEditor({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [status, setStatus] = useState<'draft' | 'review' | 'published'>('draft');

  const article = {
    id: 'KB-2034',
    title: 'Resolving Print Spooler Driver Corruption',
    status: 'draft',
    author: 'AI Analyst',
    created: '2025-10-22 14:35:00',
    updated: '2025-10-22 15:12:00',
    confidence: 87,
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
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm text-[#7A8694] font-jetbrains-mono mb-1">{article.id}</div>
                <h1 className="font-space-grotesk text-2xl font-bold text-white">
                  {article.title}
                </h1>
              </div>
              <AnalystBadge variant={status === 'published' ? 'success' : status === 'review' ? 'warn' : 'info'}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </AnalystBadge>
            </div>
            <div className="flex items-center gap-3">
              <AnalystButton
                variant="ghost"
                onClick={() => toast.success('Draft saved.')}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </AnalystButton>
              <AnalystButton
                variant="primary"
                onClick={() => {
                  setStatus('published');
                  toast.success('Article published.');
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Publish
              </AnalystButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs text-[#7A8694] block mb-2">Article Title</label>
              <input
                type="text"
                defaultValue={article.title}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0B0D] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50"
              />
            </div>

            {/* Content Sections */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <h3 className="font-space-grotesk font-semibold text-white mb-4">Content Sections</h3>
              <Accordion type="single" collapsible className="space-y-3">
                <AccordionItem value="prechecks" className="border border-[#1F242D] rounded-xl px-4">
                  <AccordionTrigger className="text-white font-space-grotesk hover:no-underline">
                    Prechecks
                  </AccordionTrigger>
                  <AccordionContent className="text-[#C7D0DA] space-y-3">
                    <textarea
                      className="w-full h-32 px-4 py-3 rounded-xl bg-[#050607] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 resize-none"
                      defaultValue="1. Verify print spooler service is running
2. Check event logs for driver errors
3. Identify installed printer drivers
4. Create system restore point"
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fix" className="border border-[#1F242D] rounded-xl px-4">
                  <AccordionTrigger className="text-white font-space-grotesk hover:no-underline">
                    Fix Steps
                  </AccordionTrigger>
                  <AccordionContent className="text-[#C7D0DA] space-y-3">
                    <textarea
                      className="w-full h-48 px-4 py-3 rounded-xl bg-[#050607] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 resize-none"
                      defaultValue="**Step 1: Uninstall Corrupted Driver**
- Open Device Manager
- Locate printer device
- Uninstall driver and delete software

**Step 2: Restart Print Spooler**
- Open Services
- Stop Print Spooler service
- Clear spool directory
- Start Print Spooler service

**Step 3: Install Updated Driver**
- Download HP Universal Print v7.2
- Run installer as administrator
- Restart system if prompted"
                    />
                    <CodeBlock code={`# PowerShell automation
Stop-Service -Name Spooler
Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force
Start-Service -Name Spooler`} />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="verify" className="border border-[#1F242D] rounded-xl px-4">
                  <AccordionTrigger className="text-white font-space-grotesk hover:no-underline">
                    Verification
                  </AccordionTrigger>
                  <AccordionContent className="text-[#C7D0DA] space-y-3">
                    <textarea
                      className="w-full h-24 px-4 py-3 rounded-xl bg-[#050607] border border-[#1F242D] text-[#EAEFF5] focus:outline-none focus:ring-2 focus:ring-[#00FF85]/50 resize-none"
                      defaultValue="1. Print test page successfully
2. Confirm no event log errors
3. Verify driver version in Device Manager
4. Document resolution in ticket"
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Metadata */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <h3 className="font-space-grotesk font-semibold text-white mb-4">Metadata</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#7A8694] mb-1">Author</div>
                  <div className="text-sm text-[#C7D0DA]">{article.author}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A8694] mb-1">Created</div>
                  <div className="text-sm font-jetbrains-mono text-[#C7D0DA]">{article.created}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A8694] mb-1">Last Updated</div>
                  <div className="text-sm font-jetbrains-mono text-[#C7D0DA]">{article.updated}</div>
                </div>
                <div>
                  <div className="text-xs text-[#7A8694] mb-1">AI Confidence</div>
                  <div className="text-sm font-semibold text-[#00FF85]">{article.confidence}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Confidence Trend */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#00FF85]" />
                <h3 className="font-space-grotesk font-semibold text-white">Confidence Trend</h3>
              </div>
              <div className="h-32 flex items-end gap-2">
                {[65, 72, 78, 81, 85, 87].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-[#00FF85]/50 to-[#00FF85]/20 rounded-t"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-xs text-[#7A8694] font-jetbrains-mono">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version History */}
            <div className="bg-[#0A0B0D] border border-[#1F242D] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-[#AAB4C0]" />
                <h3 className="font-space-grotesk font-semibold text-white">Version History</h3>
              </div>
              <div className="space-y-3">
                {[
                  { version: 'v1.2', time: '15:12', user: 'AI Analyst', action: 'Updated fix steps' },
                  { version: 'v1.1', time: '14:58', user: 'AI Analyst', action: 'Added verification' },
                  { version: 'v1.0', time: '14:35', user: 'AI Analyst', action: 'Initial draft' },
                ].map((log, idx) => (
                  <div key={idx} className="text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-jetbrains-mono text-xs text-[#00FF85]">{log.version}</span>
                      <span className="font-jetbrains-mono text-xs text-[#7A8694]">{log.time}</span>
                    </div>
                    <div className="text-[#AAB4C0]">{log.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <AnalystButton
                variant="ghost"
                onClick={() => toast.info('Embedding generation queued.')}
              >
                Generate Embeddings
              </AnalystButton>
              <div className="text-xs text-[#7A8694] text-center">
                Embeddings enable semantic search
              </div>
            </div>

            {/* Tier Guard (if needed) */}
            {status === 'draft' && (
              <TierGuardBanner
                feature="Auto-Publish"
                currentTier="Pro"
                requiredTier="Team"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
