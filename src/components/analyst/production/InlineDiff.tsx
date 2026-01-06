import React from 'react';

export function InlineDiff({ before = '', after = '' }: { before?: string; after?: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <div className="text-xs text-text-400 mb-1 font-space-grotesk">Before</div>
        <pre className="panel p-3 whitespace-pre-wrap text-text-300 font-jetbrains-mono">{before}</pre>
      </div>
      <div>
        <div className="text-xs text-text-400 mb-1 font-space-grotesk">After</div>
        <pre className="panel p-3 whitespace-pre-wrap ring-1 ring-[color:rgb(var(--accent-analyst))] text-text-100 font-jetbrains-mono">
          {after}
        </pre>
      </div>
    </div>
  );
}
