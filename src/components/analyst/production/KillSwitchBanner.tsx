import React from 'react';

export function KillSwitchBanner({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <div className="w-full p-3 rounded-xl border border-[color:rgb(var(--danger))] bg-[rgb(40_20_20_/_0.35)] text-[rgb(255_180_180)]">
      <strong>Observe-Only is enabled.</strong> Executable actions are paused.
    </div>
  );
}
