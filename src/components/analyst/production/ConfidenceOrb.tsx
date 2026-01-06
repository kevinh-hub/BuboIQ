import React from 'react';

export function ConfidenceOrb({ value = 0.5, size = 96 }: { value?: number; size?: number }) {
  const pct = Math.max(0, Math.min(1, value));
  const percent = Math.round(pct * 100);
  const aura = 0.25 + pct * 0.45; // 0.25..0.7

  return (
    <div
      className="relative grid place-items-center rounded-full shadow-card"
      style={{ width: size, height: size, background: 'rgb(10 11 13)' }}
      aria-label={`Confidence ${percent} percent`}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 0 ${Math.round(size * 0.6)}px ${Math.round(size * 0.15)}px rgba(0,255,133,${aura})`,
        }}
        aria-hidden
      />
      <div className="relative z-10 rounded-full panel w-[92%] h-[92%] grid place-items-center border border-[color:rgb(var(--border-analyst))]">
        <span className="text-lg font-semibold font-space-grotesk">{percent}%</span>
      </div>
    </div>
  );
}
