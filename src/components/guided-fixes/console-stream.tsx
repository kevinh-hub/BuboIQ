import React, { useState, useRef, useEffect } from 'react';
import { Copy, Save, Search, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

export type ConsoleStatus = 'idle' | 'running' | 'success' | 'failed' | 'aborted';

interface ConsoleOutputLine {
  timestamp: Date;
  text: string;
  type?: 'stdout' | 'stderr' | 'info' | 'error';
}

interface ConsoleStreamProps {
  lines: ConsoleOutputLine[];
  status: ConsoleStatus;
  redactOnCopy?: boolean;
  onRedactToggle?: (enabled: boolean) => void;
  className?: string;
}

export const ConsoleStream: React.FC<ConsoleStreamProps> = ({
  lines,
  status,
  redactOnCopy = true,
  onRedactToggle,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [redact, setRedact] = useState(redactOnCopy);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCopy = () => {
    const text = lines.map(line => {
      const timestamp = line.timestamp.toLocaleTimeString();
      return `[${timestamp}] ${line.text}`;
    }).join('\n');
    
    const finalText = redact ? redactSensitiveData(text) : text;
    navigator.clipboard.writeText(finalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const text = lines.map(line => {
      const timestamp = line.timestamp.toLocaleTimeString();
      return `[${timestamp}] ${line.text}`;
    }).join('\n');
    
    const finalText = redact ? redactSensitiveData(text) : text;
    const blob = new Blob([finalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const redactSensitiveData = (text: string): string => {
    // Redact emails, IPs, device IDs
    return text
      .replace(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL_REDACTED]')
      .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP_REDACTED]')
      .replace(/\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi, '[ID_REDACTED]')
      .replace(/password[=:]\s*\S+/gi, 'password=[REDACTED]');
  };

  const highlightMatch = (text: string): React.ReactNode => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-signal-yellow/30 text-signal-yellow">{part}</span>
      ) : part
    );
  };

  const statusConfig: Record<ConsoleStatus, { label: string; color: string }> = {
    idle: { label: 'Ready', color: 'bg-mist-gray/20 text-mist-gray border-mist-gray/30' },
    running: { label: 'Running', color: 'bg-electric-blue/20 text-electric-blue border-electric-blue/30' },
    success: { label: 'Success', color: 'bg-success-green/20 text-success-green border-success-green/30' },
    failed: { label: 'Failed', color: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30' },
    aborted: { label: 'Aborted', color: 'bg-signal-yellow/20 text-signal-yellow border-signal-yellow/30' }
  };

  const statusStyle = statusConfig[status];

  return (
    <div className={`bubo-glass rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-gray/30">
        <div className="flex items-center gap-2">
          <h3 className="font-space-grotesk text-sm text-pure-white">Console Output</h3>
          <Badge className={statusStyle.color}>{statusStyle.label}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Redact Toggle */}
          <div className="flex items-center gap-2 mr-2">
            <Label htmlFor="redact-toggle" className="text-xs text-mist-gray cursor-pointer">
              {redact ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Label>
            <Switch
              id="redact-toggle"
              checked={redact}
              onCheckedChange={(checked) => {
                setRedact(checked);
                onRedactToggle?.(checked);
              }}
            />
          </div>

          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-mist-gray hover:text-iq-neon-green"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>

          <Button
            onClick={handleSave}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-mist-gray hover:text-iq-neon-green"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-gray/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-gray" />
          <Input
            type="text"
            placeholder="Find in output..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-surface-dark/50 border-slate-gray/30 text-cloud-white text-sm"
          />
        </div>
      </div>

      {/* Console Output */}
      <div
        ref={consoleRef}
        className="p-4 bg-surface-dark/50 h-64 overflow-y-auto font-jetbrains text-xs"
      >
        {lines.length === 0 ? (
          <p className="text-mist-gray">Waiting for output...</p>
        ) : (
          lines.map((line, idx) => {
            const show = !searchQuery || line.text.toLowerCase().includes(searchQuery.toLowerCase());
            if (!show) return null;

            const timestamp = line.timestamp.toLocaleTimeString();
            const typeColor = line.type === 'error' || line.type === 'stderr' 
              ? 'text-crimson-danger' 
              : line.type === 'info' 
              ? 'text-electric-blue' 
              : 'text-cloud-white';

            return (
              <div key={idx} className="mb-1">
                <span className="text-mist-gray">[{timestamp}]</span>{' '}
                <span className={typeColor}>{highlightMatch(line.text)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
