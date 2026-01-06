import React from 'react';
import { Button } from '../../ui/button';

export function ActionItem({
  actionType,
  payload,
  hints = [],
  onApprove,
  onReject,
  disabled,
}: {
  actionType: string;
  payload: unknown;
  hints?: string[];
  onApprove?: () => void;
  onReject?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-text-400 mb-2 font-space-grotesk">
            {actionType}
          </div>
          <pre className="text-xs text-text-300 whitespace-pre-wrap overflow-auto max-h-40 font-jetbrains-mono">
            {JSON.stringify(payload, null, 2)}
          </pre>
          {hints.length > 0 && (
            <ul className="mt-2 text-xs text-warn space-y-1">
              {hints.map((h, i) => (
                <li key={i}>• {h}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            onClick={onApprove} 
            disabled={disabled}
            className="bg-accent text-black hover:opacity-90 disabled:opacity-50"
          >
            Approve
          </Button>
          <Button 
            onClick={onReject} 
            disabled={disabled}
            variant="ghost"
            className="bg-transparent text-text-100 hover:bg-bg-850 border border-[color:rgb(var(--border-analyst))]"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
