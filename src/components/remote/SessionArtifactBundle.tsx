import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  Play, 
  Download, 
  Trash2, 
  Copy, 
  Save, 
  FileText, 
  Video, 
  Code, 
  HardDrive,
  Clock,
  Users,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  Share,
  Archive
} from 'lucide-react';

interface SessionSummary {
  id: string;
  duration: string;
  participants: string[];
  provider: string;
  device: string;
  startTime: string;
  endTime: string;
}

interface Artifact {
  id: string;
  type: 'recording' | 'transcript' | 'actions' | 'files' | 'snapshot';
  name: string;
  size: string;
  preview?: string;
  content?: any;
}

const SessionArtifactBundle: React.FC = () => {
  const [aiSummary, setAiSummary] = useState({
    whatHappened: "User reported print spooler service repeatedly failing. Remote session was initiated to WS-JENNIFER-PC. Technician elevated privileges, investigated service logs, and identified corrupted print cache causing service crashes.",
    whatChanged: "Print spooler service restarted successfully. Cleared corrupted print cache files. Updated printer driver to latest version. Verified print functionality with test page.",
    rootCause: "Corrupted print spooler cache files from incomplete print job were preventing service startup. Legacy printer driver compatibility issues exacerbated the problem.",
    fixApplied: "Executed PowerShell script to clear print cache, restarted spooler service, updated HP LaserJet driver to v4.2.1, and configured automatic cache cleanup policy.",
    nextSteps: "Monitor print spooler stability over next 24 hours. Consider printer driver update policy for all managed workstations. Schedule quarterly print system maintenance."
  });

  const sessionSummary: SessionSummary = {
    id: 'RW-9827',
    duration: '23m 45s',
    participants: ['Kevin H.', 'Sarah M.', 'Jennifer K. (End User)'],
    provider: 'Splashtop',
    device: 'WS-JENNIFER-PC (AST-001287)',
    startTime: '2024-01-15 14:32:15',
    endTime: '2024-01-15 14:56:00'
  };

  const artifacts: Artifact[] = [
    {
      id: '1',
      type: 'recording',
      name: 'session-recording.mp4',
      size: '142.3 MB',
      preview: '/thumbnails/session-preview.jpg'
    },
    {
      id: '2',
      type: 'transcript',
      name: 'session-transcript.vtt',
      size: '8.2 KB',
      content: `WEBVTT

00:00:00.000 --> 00:00:15.000
Kevin H.: Remote session starting. Can you confirm you're seeing the consent dialog?

00:00:15.000 --> 00:00:28.000
Jennifer K.: Yes, I can see it. Clicking accept now.

00:00:28.000 --> 00:00:45.000
Kevin H.: Perfect. I'm going to check the print spooler service status first.

00:00:45.000 --> 00:01:02.000
Kevin H.: I can see the service is stopped. Let me check the event logs.`
    },
    {
      id: '3',
      type: 'actions',
      name: 'session-actions.json',
      size: '4.1 KB',
      content: {
        events: [
          {
            timestamp: "2024-01-15T14:32:15Z",
            action: "session_start",
            details: { device: "WS-JENNIFER-PC", method: "splashtop" }
          },
          {
            timestamp: "2024-01-15T14:32:48Z",
            action: "privilege_elevation",
            details: { method: "uac", success: true }
          },
          {
            timestamp: "2024-01-15T14:34:05Z",
            action: "file_transfer",
            details: { file: "fix.ps1", size: "2.3KB", direction: "upload" }
          },
          {
            timestamp: "2024-01-15T14:34:30Z",
            action: "service_restart",
            details: { service: "Spooler", result: "success" }
          }
        ]
      }
    },
    {
      id: '4',
      type: 'files',
      name: 'files-manifest.json',
      size: '1.8 KB',
      content: {
        transferred: [
          { name: "fix.ps1", size: "2.3KB", direction: "to_device", checksum: "a1b2c3d4..." },
          { name: "driver-update.exe", size: "12.8MB", direction: "to_device", checksum: "e5f6g7h8..." }
        ]
      }
    },
    {
      id: '5',
      type: 'snapshot',
      name: 'device-snapshot.json',
      size: '15.2 KB',
      content: {
        timestamp: "2024-01-15T14:56:00Z",
        cpu: { usage: "23%", cores: 8 },
        memory: { total: "16GB", used: "8.2GB", available: "7.8GB" },
        disk: { c_drive: { total: "500GB", used: "285GB", free: "215GB" } },
        network: { status: "connected", speed: "1Gbps" },
        services: {
          spooler: { status: "running", startup: "automatic" },
          windefend: { status: "running", startup: "automatic" }
        }
      }
    }
  ];

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'recording': return <Video className="w-5 h-5 text-crimson-danger" />;
      case 'transcript': return <FileText className="w-5 h-5 text-cyan-accent" />;
      case 'actions': return <Code className="w-5 h-5 text-signal-yellow" />;
      case 'files': return <Download className="w-5 h-5 text-iq-neon-green" />;
      case 'snapshot': return <HardDrive className="w-5 h-5 text-prediction-purple" />;
      default: return <FileText className="w-5 h-5 text-mist-gray" />;
    }
  };

  const renderArtifactPreview = (artifact: Artifact) => {
    switch (artifact.type) {
      case 'recording':
        return (
          <div className="bg-dark-midnight/50 rounded-lg p-4 text-center">
            <Video className="w-12 h-12 text-crimson-danger mx-auto mb-2" />
            <p className="text-sm text-cloud-white">Video Recording</p>
            <p className="text-xs text-mist-gray">{sessionSummary.duration} duration</p>
            <Button size="sm" className="bubo-btn-secondary mt-2">
              <Play className="w-3 h-3 mr-1" />
              Preview
            </Button>
          </div>
        );
      
      case 'transcript':
        return (
          <div className="bg-dark-midnight/50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <pre className="text-xs text-cloud-white font-jetbrains-mono whitespace-pre-wrap">
              {artifact.content}
            </pre>
          </div>
        );
      
      case 'actions':
      case 'files':
      case 'snapshot':
        return (
          <div className="bg-dark-midnight/50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <pre className="text-xs text-cloud-white font-jetbrains-mono">
              {JSON.stringify(artifact.content, null, 2)}
            </pre>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white mb-2">
          End Session → Review & Attach
        </h1>
        <p className="text-mist-gray">
          Review session artifacts and AI-generated summary before attaching to ticket
        </p>
      </div>

      {/* Session Summary */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-iq-neon-green" />
          Session Summary
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-mist-gray text-xs">Session ID</Label>
            <p className="font-jetbrains-mono text-iq-neon-green">{sessionSummary.id}</p>
          </div>
          <div>
            <Label className="text-mist-gray text-xs">Duration</Label>
            <p className="text-cloud-white">{sessionSummary.duration}</p>
          </div>
          <div>
            <Label className="text-mist-gray text-xs">Provider</Label>
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
              {sessionSummary.provider}
            </Badge>
          </div>
          <div>
            <Label className="text-mist-gray text-xs">Device</Label>
            <p className="text-cloud-white text-sm">{sessionSummary.device}</p>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-mist-gray text-xs">Participants</Label>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-4 h-4 text-mist-gray" />
            <span className="text-cloud-white text-sm">
              {sessionSummary.participants.join(', ')}
            </span>
          </div>
        </div>
      </Card>

      {/* Artifacts */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4 flex items-center gap-2">
          <Archive className="w-5 h-5 text-iq-neon-green" />
          Session Artifacts
        </h2>
        
        <div className="space-y-4">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="border border-slate-gray/30 rounded-xl overflow-hidden">
              <div className="p-4 bg-surface-dark/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getArtifactIcon(artifact.type)}
                  <div>
                    <p className="font-medium text-cloud-white">{artifact.name}</p>
                    <p className="text-xs text-mist-gray">{artifact.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bubo-btn-ghost">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button size="sm" className="bubo-btn-ghost">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              {artifact.content && (
                <div className="p-4">
                  {renderArtifactPreview(artifact)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* AI Summary */}
      <Card className="bubo-glass p-6">
        <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-iq-neon-green" />
          AI Summary
          <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 ml-2">
            Editable
          </Badge>
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label className="text-cloud-white font-medium">What Happened</Label>
            <Textarea
              value={aiSummary.whatHappened}
              onChange={(e) => setAiSummary({...aiSummary, whatHappened: e.target.value})}
              className="mt-2 bg-dark-midnight/50 border-slate-gray/30 text-cloud-white"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="text-cloud-white font-medium">What Changed</Label>
            <Textarea
              value={aiSummary.whatChanged}
              onChange={(e) => setAiSummary({...aiSummary, whatChanged: e.target.value})}
              className="mt-2 bg-dark-midnight/50 border-slate-gray/30 text-cloud-white"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="text-cloud-white font-medium">Root Cause</Label>
            <Textarea
              value={aiSummary.rootCause}
              onChange={(e) => setAiSummary({...aiSummary, rootCause: e.target.value})}
              className="mt-2 bg-dark-midnight/50 border-slate-gray/30 text-cloud-white"
              rows={2}
            />
          </div>
          
          <div>
            <Label className="text-cloud-white font-medium">Fix Applied</Label>
            <Textarea
              value={aiSummary.fixApplied}
              onChange={(e) => setAiSummary({...aiSummary, fixApplied: e.target.value})}
              className="mt-2 bg-dark-midnight/50 border-slate-gray/30 text-cloud-white"
              rows={3}
            />
          </div>
          
          <div>
            <Label className="text-cloud-white font-medium">Next Steps</Label>
            <Textarea
              value={aiSummary.nextSteps}
              onChange={(e) => setAiSummary({...aiSummary, nextSteps: e.target.value})}
              className="mt-2 bg-dark-midnight/50 border-slate-gray/30 text-cloud-white"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <Card className="bubo-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Space_Grotesk'] font-semibold text-pure-white">
            Attachment Options
          </h2>
          
          <div className="flex items-center gap-4 text-xs text-mist-gray">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Retention: 90 days</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Recording deletion requires admin approval</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bubo-btn-neon-primary flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Attach to Ticket #4321
          </Button>
          
          <Button className="bubo-btn-secondary">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          <Button className="bubo-btn-ghost text-crimson-danger hover:bg-crimson-danger/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Recording
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-gray/30">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cloud-white">Copy summary to resolution</Label>
              <p className="text-xs text-mist-gray">Automatically populate ticket resolution with AI summary</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
};

export { SessionArtifactBundle };