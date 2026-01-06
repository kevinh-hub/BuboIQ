import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Maximize2,
  Download,
  Copy,
  ExternalLink,
  Clock,
  Users,
  Monitor,
  FileText,
  Video,
  Code,
  HardDrive,
  Brain,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

interface SessionChapter {
  id: string;
  title: string;
  timestamp: string;
  duration: string;
  description: string;
  type: 'connect' | 'elevate' | 'fix' | 'verify';
}

interface SessionArtifact {
  id: string;
  type: 'recording' | 'transcript' | 'actions' | 'files' | 'snapshot';
  name: string;
  size: string;
  url?: string;
  preview?: string;
}

const AttachedSessionView: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('12:34');
  const [totalTime] = useState('23:45');
  const [selectedChapter, setSelectedChapter] = useState<string>('connect');

  const sessionInfo = {
    id: 'RW-9827',
    ticketId: '4321',
    technicians: ['Kevin H.', 'Sarah M.'],
    device: 'WS-JENNIFER-PC',
    provider: 'Splashtop',
    duration: '23m 45s',
    outcome: 'resolved',
    recordedAt: '2024-01-15 14:32'
  };

  const chapters: SessionChapter[] = [
    {
      id: 'connect',
      title: 'Connection set up',
      timestamp: '00:00',
      duration: '2m 15s',
      description: 'Remote session started, consent given, UAC elevation',
      type: 'connect'
    },
    {
      id: 'elevate',
      title: 'Admin access',
      timestamp: '02:15',
      duration: '1m 30s',
      description: 'Admin access granted, security check',
      type: 'elevate'
    },
    {
      id: 'fix',
      title: 'Fix applied',
      timestamp: '03:45',
      duration: '18m 20s',
      description: 'Print spooler check, cache cleanup, driver update',
      type: 'fix'
    },
    {
      id: 'verify',
      title: 'Test and confirm',
      timestamp: '22:05',
      duration: '1m 40s',
      description: 'Print test worked, cleanup tasks, session summary',
      type: 'verify'
    }
  ];

  const artifacts: SessionArtifact[] = [
    {
      id: '1',
      type: 'recording',
      name: 'session-recording.mp4',
      size: '142.3 MB',
      url: '/recordings/rw-9827.mp4'
    },
    {
      id: '2',
      type: 'transcript',
      name: 'session-transcript.vtt',
      size: '8.2 KB',
      preview: 'Chat transcript with 47 messages'
    },
    {
      id: '3',
      type: 'actions',
      name: 'session-actions.json',
      size: '4.1 KB',
      preview: '12 system actions recorded'
    },
    {
      id: '4',
      type: 'files',
      name: 'files-manifest.json',
      size: '1.8 KB',
      preview: '2 files transferred'
    },
    {
      id: '5',
      type: 'snapshot',
      name: 'device-snapshot.json',
      size: '15.2 KB',
      preview: 'System state at session end'
    }
  ];

  const aiSummary = {
    whatHappened: "User reported print spooler service repeatedly failing. Remote session was initiated to WS-JENNIFER-PC. Technician elevated privileges, investigated service logs, and identified corrupted print cache causing service crashes.",
    whatChanged: "Print spooler service restarted successfully. Cleared corrupted print cache files. Updated printer driver to latest version. Verified print functionality with test page.",
    rootCause: "Corrupted print spooler cache files from incomplete print job were preventing service startup. Legacy printer driver compatibility issues exacerbated the problem.",
    fixApplied: "Executed PowerShell script to clear print cache, restarted spooler service, updated HP LaserJet driver to v4.2.1, and configured automatic cache cleanup policy.",
    nextSteps: "Monitor print spooler stability over next 24 hours. Consider printer driver update policy for all managed workstations. Schedule quarterly print system maintenance."
  };

  const getChapterIcon = (type: string) => {
    switch (type) {
      case 'connect': return '🔗';
      case 'elevate': return '🔑';
      case 'fix': return '🔧';
      case 'verify': return '✅';
      default: return '📋';
    }
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'recording': return <Video className="w-4 h-4 text-crimson-danger" />;
      case 'transcript': return <FileText className="w-4 h-4 text-cyan-accent" />;
      case 'actions': return <Code className="w-4 h-4 text-signal-yellow" />;
      case 'files': return <Download className="w-4 h-4 text-iq-neon-green" />;
      case 'snapshot': return <HardDrive className="w-4 h-4 text-prediction-purple" />;
      default: return <FileText className="w-4 h-4 text-mist-gray" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-pure-white">
              Session {sessionInfo.id} 
              <span className="text-mist-gray ml-2">→ Ticket #{sessionInfo.ticketId}</span>
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-mist-gray">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {sessionInfo.recordedAt}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {sessionInfo.technicians.join(', ')}
              </div>
              <div className="flex items-center gap-1">
                <Monitor className="w-4 h-4" />
                {sessionInfo.device}
              </div>
              <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30">
                {sessionInfo.outcome}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bubo-btn-secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bubo-btn-ghost">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bubo-glass overflow-hidden">
            {/* Video Container */}
            <div className="relative bg-dark-midnight aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-mist-gray mx-auto mb-4 opacity-50" />
                  <p className="text-mist-gray">Session Recording</p>
                  <p className="text-sm text-slate-gray">{sessionInfo.duration}</p>
                </div>
              </div>
              
              {/* Play Button Overlay */}
              <Button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/20 border-0 text-pure-white"
              >
                {isPlaying ? (
                  <Pause className="w-16 h-16" />
                ) : (
                  <Play className="w-16 h-16" />
                )}
              </Button>

              {/* Watermark */}
              <div className="absolute top-4 right-4 opacity-60">
                <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30 text-xs">
                  BuboIQ • {sessionInfo.recordedAt}
                </Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-surface-dark/50">
              <div className="flex items-center gap-4 mb-3">
                <Button size="sm" className="bubo-btn-ghost">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bubo-btn-secondary"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" className="bubo-btn-ghost">
                  <SkipForward className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-slate-gray/30 rounded-full overflow-hidden">
                    <div className="h-full bg-iq-neon-green w-1/3 rounded-full" />
                  </div>
                </div>
                
                <span className="text-sm text-cloud-white font-jetbrains-mono">
                  {currentTime} / {totalTime}
                </span>
                
                <Button size="sm" className="bubo-btn-ghost">
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button size="sm" className="bubo-btn-ghost">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Chapters */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
              Session Chapters
            </h3>
            
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedChapter === chapter.id 
                      ? 'bg-iq-neon-green/10 border border-iq-neon-green/30' 
                      : 'bg-surface-dark/30 hover:bg-surface-dark/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getChapterIcon(chapter.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-cloud-white">{chapter.title}</h4>
                        <span className="text-xs font-jetbrains-mono text-mist-gray">
                          {chapter.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-mist-gray">{chapter.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-slate-gray/20 text-slate-gray border-slate-gray/30 text-xs">
                          {chapter.duration}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-mist-gray" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Summary & Artifacts Tabs */}
          <Card className="bubo-glass p-6">
            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2 bg-surface-dark/50">
                <TabsTrigger value="summary" className="data-[state=active]:bg-iq-neon-green/20">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Summary
                </TabsTrigger>
                <TabsTrigger value="artifacts" className="data-[state=active]:bg-iq-neon-green/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Artifacts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-medium text-pure-white mb-2">What Happened</h4>
                  <p className="text-sm text-mist-gray leading-relaxed">{aiSummary.whatHappened}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-2">Root Cause</h4>
                  <p className="text-sm text-mist-gray leading-relaxed">{aiSummary.rootCause}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-pure-white mb-2">Fix Applied</h4>
                  <p className="text-sm text-mist-gray leading-relaxed">{aiSummary.fixApplied}</p>
                </div>

                <Button className="bubo-btn-secondary w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to notes
                </Button>
              </TabsContent>

              <TabsContent value="artifacts" className="space-y-3 mt-4">
                {artifacts.map((artifact) => (
                  <div key={artifact.id} className="flex items-center justify-between p-3 bg-surface-dark/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getArtifactIcon(artifact.type)}
                      <div>
                        <p className="text-sm font-medium text-cloud-white">{artifact.name}</p>
                        <p className="text-xs text-mist-gray">
                          {artifact.size} • {artifact.preview}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="bubo-btn-ghost">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Quick Actions */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-2">
              <Button className="bubo-btn-secondary w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Search in Timeline
              </Button>
              
              <Button className="bubo-btn-secondary w-full justify-start">
                <Code className="w-4 h-4 mr-2" />
                View Actions JSON
              </Button>
              
              <Button className="bubo-btn-secondary w-full justify-start">
                <Filter className="w-4 h-4 mr-2" />
                Filter Events
              </Button>
              
              <Button className="bubo-btn-secondary w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </Card>

          {/* Session Metadata */}
          <Card className="bubo-glass p-6">
            <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-4">
              Session Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-mist-gray">Provider:</span>
                <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
                  {sessionInfo.provider}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Duration:</span>
                <span className="text-cloud-white">{sessionInfo.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Quality:</span>
                <span className="text-iq-green">HD (1080p)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">File Size:</span>
                <span className="text-cloud-white">142.3 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mist-gray">Encryption:</span>
                <span className="text-iq-green">AES-256</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { AttachedSessionView };