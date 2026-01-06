import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { OSBadge, OSType } from './os-badge';

interface CommandBlockProps {
  command: string;
  os: OSType;
  shell?: string;
  elevated?: boolean;
  dryRun?: boolean;
  compact?: boolean;
  className?: string;
}

export const CommandBlock: React.FC<CommandBlockProps> = ({
  command,
  os,
  shell,
  elevated = false,
  dryRun = false,
  compact = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!compact);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bubo-glass rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-gray/30">
        <div className="flex items-center gap-2">
          {compact && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-mist-gray hover:text-cloud-white transition-colors"
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          <OSBadge os={os} />
          {shell && (
            <Badge className="bg-surface-dark/50 text-mist-gray border-slate-gray/30 text-xs">
              {shell}
            </Badge>
          )}
          {elevated && (
            <Badge className="bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30 text-xs">
              Admin
            </Badge>
          )}
          {dryRun && (
            <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30 text-xs">
              Dry Run
            </Badge>
          )}
        </div>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-mist-gray hover:text-iq-neon-green"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span className="ml-1 text-xs">{copied ? 'Copied' : 'Copy'}</span>
        </Button>
      </div>

      {/* Command */}
      {expanded && (
        <div className="p-4 bg-surface-dark/50">
          <pre className="font-jetbrains text-sm text-cloud-white whitespace-pre-wrap break-all">
            {command}
          </pre>
        </div>
      )}
    </div>
  );
};
