import React from 'react';
import { Button } from '../../ui/button';

export function TierGuardBanner({
  tier,
  summary,
  onUpgrade,
}: {
  tier: 'starter' | 'pro' | 'team';
  summary: string;
  onUpgrade?: () => void;
}) {
  const label =
    tier === 'starter' ? 'Observe-Only' : tier === 'pro' ? 'Approval Required' : 'Auto-Approve Eligible';
  return (
    <div className="panel p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="px-2 py-1 rounded-md text-xs bg-bg-850 border border-[color:rgb(var(--border-analyst))] text-text-300">
          {label}
        </span>
        <p className="text-sm text-text-300">{summary}</p>
      </div>
      {onUpgrade && (
        <Button onClick={onUpgrade} className="bg-accent text-black hover:opacity-90">
          Upgrade
        </Button>
      )}
    </div>
  );
}
