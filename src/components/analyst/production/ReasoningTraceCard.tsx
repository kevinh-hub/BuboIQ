import React from 'react';
import { ConfidenceOrb } from './ConfidenceOrb';

export function ReasoningTraceCard({
  createdAt,
  confidence,
  output,
  onLineage,
}: {
  createdAt: string;
  confidence?: number;
  output: unknown;
  onLineage?: () => void;
}) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-text-400 font-jetbrains-mono">
          {new Date(createdAt).toLocaleString()}
        </span>
        <ConfidenceOrb value={confidence ?? 0.5} size={72} />
      </div>
      <pre className="text-xs text-text-300 whitespace-pre-wrap overflow-auto max-h-56 font-jetbrains-mono">
        {JSON.stringify(output, null, 2)}
      </pre>
      <div className="mt-3 flex justify-end">
        <button 
          className="text-sm text-accent underline underline-offset-4 hover:text-[#00E676] transition-colors" 
          onClick={onLineage}
        >
          See lineage
        </button>
      </div>
    </div>
  );
}
