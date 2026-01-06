import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { 
  Users, 
  MessageCircle, 
  FileText, 
  Play, 
  Square, 
  Monitor,
  Settings,
  Wifi,
  Clock,
  Record,
  Shield,
  Eye,
  RotateCcw,
  Terminal,
  FileDown,
  Zap,
  Brain,
  Activity,
  Gauge
} from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'idle' | 'away';
  cursor?: { x: number; y: number };
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'system' | 'action' | 'ai' | 'file';
  content: string;
  aiAnnotation?: string;
  details?: string;
}

const RemoteWorkroom: React.FC = () => {
  const [isRecording, setIsRecording] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [latency, setLatency] = useState(42);
  const [quality, setQuality] = useState(85);
  const [currentMonitor, setCurrentMonitor] = useState(1);
  const [notes, setNotes] = useState('');

  const technicians: Technician[] = [
    {
      id: '1',
      name: 'Kevin H.',
      avatar: 'KH',
      status: 'active',
      cursor: { x: 45, y: 30 }
    },
    {
      id: '2',
      name: 'Sarah M.',
      avatar: 'SM',
      status: 'active',
      cursor: { x: 60, y: 50 }
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      timestamp: '14:32:15',
      type: 'system',
      content: 'Session connected to WS-JENNIFER-PC',
      details: 'Remote access set up via Splashtop'
    },
    {
      id: '2',
      timestamp: '14:32:48',
      type: 'system',
      content: 'UAC elevation granted',
      details: 'Admin access granted'
    },
    {
      id: '3',
      timestamp: '14:33:22',
      type: 'action',
      content: 'Display 2 selected',
      details: 'Switched to secondary monitor'
    },
    {
      id: '4',
      timestamp: '14:34:05',
      type: 'file',
      content: 'File transferred: fix.ps1',
      details: '2.3 KB PowerShell script uploaded'
    },
    {
      id: '5',
      timestamp: '14:34:30',
      type: 'action',
      content: 'Service "Spooler" restarted',
      details: 'Print spooler service cycle completed',
      aiAnnotation: 'Possible root cause: corrupted print spooler cache'
    },
    {
      id: '6',
      timestamp: '14:35:12',
      type: 'ai',
      content: 'AI detected printer queue clearing',
      aiAnnotation: 'Fix confidence: 89%'
    }
  ];

  const runbookActions = [
    { name: 'Restart Service', icon: RotateCcw, type: 'system' },
    { name: 'Clear Temp Files', icon: FileDown, type: 'cleanup' },
    { name: 'Flush DNS', icon: Wifi, type: 'network' },
    { name: 'Run Script', icon: Terminal, type: 'custom' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setLatency(prev => Math.max(20, prev + (Math.random() - 0.5) * 10));
      setQuality(prev => Math.max(70, Math.min(95, prev + (Math.random() - 0.5) * 5)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'system': return <Settings className="w-4 h-4 text-cyan-accent" />;
      case 'action': return <Zap className="w-4 h-4 text-signal-yellow" />;
      case 'ai': return <Brain className="w-4 h-4 text-prediction-purple" />;
      case 'file': return <FileDown className="w-4 h-4 text-iq-neon-green" />;
      default: return <Activity className="w-4 h-4 text-mist-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-iq-green';
      case 'idle': return 'bg-signal-yellow';
      case 'away': return 'bg-mist-gray';
      default: return 'bg-mist-gray';
    }
  };

  return (
    <div className="h-screen bg-dark-midnight flex">
      {/* Left Sidebar - Collaboration */}
      <div className="w-80 bg-surface-dark border-r border-slate-gray/30 flex flex-col">
        {/* Technicians */}
        <div className="p-4 border-b border-slate-gray/30">
          <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-iq-neon-green" />
            Technicians ({technicians.length})
          </h3>
          
          <div className="space-y-2">
            {technicians.map((tech) => (
              <div key={tech.id} className="flex items-center gap-3 p-2 bg-dark-midnight/50 rounded-lg">
                <div className="relative">
                  <Avatar className="w-8 h-8 bg-iq-neon-green/20 flex items-center justify-center">
                    <span className="text-xs font-semibold text-iq-neon-green">{tech.avatar}</span>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(tech.status)} rounded-full border-2 border-surface-dark`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-pure-white">{tech.name}</div>
                  <div className="text-xs text-mist-gray capitalize">{tech.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-dark-midnight/50 m-4 mb-0">
              <TabsTrigger value="chat" className="data-[state=active]:bg-iq-neon-green/20">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-iq-neon-green/20">
                <FileText className="w-4 h-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 p-4 pt-2">
              <div className="bg-dark-midnight/30 rounded-lg p-3 text-center">
                <MessageCircle className="w-8 h-8 text-mist-gray mx-auto mb-2 opacity-50" />
                <p className="text-xs text-mist-gray">Chat with end user and team</p>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 p-4 pt-2">
              <Textarea
                placeholder="Session notes and observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 bg-dark-midnight/30 border-slate-gray/30 text-pure-white resize-none"
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Runbook Actions */}
        <div className="p-4 border-t border-slate-gray/30">
          <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white mb-3 text-sm">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {runbookActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                className="bubo-btn-secondary text-xs h-auto py-2 flex flex-col gap-1"
              >
                <action.icon className="w-3 h-3" />
                {action.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas - Remote Screen */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 bg-surface-dark border-b border-slate-gray/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Badge className="bg-cyan-accent/20 text-cyan-accent border-cyan-accent/30">
              Splashtop
            </Badge>
            
            <div className="flex items-center gap-2 text-sm">
              <Wifi className="w-4 h-4 text-iq-neon-green" />
              <span className="text-cloud-white">{latency}ms</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-signal-yellow" />
              <span className="text-cloud-white">{quality}%</span>
            </div>

            <Button size="sm" className="bubo-btn-ghost">
              <Monitor className="w-4 h-4 mr-1" />
              Display {currentMonitor}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-crimson-danger rounded-full animate-pulse" />
                  <span className="text-sm font-jetbrains-mono text-cloud-white">
                    {formatTime(sessionTime)}
                  </span>
                </>
              )}
            </div>

            <Button className="bubo-btn-secondary">
              <Square className="w-4 h-4 mr-2" />
              End Session
            </Button>
          </div>
        </div>

        {/* Remote Screen Canvas */}
        <div className="flex-1 bg-nocturne-indigo/20 relative overflow-hidden">
          {/* Simulated Desktop */}
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 relative">
            {/* Desktop Icons */}
            <div className="absolute top-4 left-4 space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded border border-blue-400/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded border border-green-400/30 flex items-center justify-center">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
            </div>

            {/* Technician Cursors */}
            {technicians.map((tech) => (
              tech.cursor && (
                <div
                  key={tech.id}
                  className="absolute pointer-events-none transition-all duration-300"
                  style={{ 
                    left: `${tech.cursor.x}%`, 
                    top: `${tech.cursor.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-iq-neon-green rounded-full border-2 border-dark-midnight shadow-lg" />
                    <div className="absolute top-5 left-0 bg-iq-neon-green text-dark-midnight text-xs px-2 py-1 rounded whitespace-nowrap font-medium">
                      {tech.name}
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Privacy Blackout Demo */}
            <div className="absolute top-20 right-20 w-64 h-40 bg-dark-midnight/90 border-2 border-dashed border-signal-yellow/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Shield className="w-8 h-8 text-signal-yellow mx-auto mb-2" />
                <p className="text-xs text-signal-yellow">Sensitive Content Hidden</p>
              </div>
            </div>

            {/* Consent Banner (end-user side) */}
            <div className="absolute bottom-4 left-4 right-4 bg-iq-neon-green/10 border border-iq-neon-green/30 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-iq-neon-green" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-pure-white">
                    Remote session active with BuboIQ support
                  </p>
                  <p className="text-xs text-mist-gray">
                    Session is being recorded • End user consented
                  </p>
                </div>
                <Badge className="bg-iq-green/20 text-iq-green border-iq-green/30">
                  <Record className="w-3 h-3 mr-1" />
                  Recording
                </Badge>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute top-4 right-4 opacity-30">
              <p className="text-xs font-jetbrains-mono text-cloud-white">
                BuboIQ • {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Timeline */}
      <div className="w-96 bg-surface-dark border-l border-slate-gray/30 flex flex-col">
        <div className="p-4 border-b border-slate-gray/30">
          <h3 className="font-['Space_Grotesk'] font-semibold text-pure-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-iq-neon-green" />
            Session Timeline
          </h3>
          <p className="text-xs text-mist-gray mt-1">
            RW-9827 • Live since {formatTime(sessionTime)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-dark-midnight/50 rounded-full flex items-center justify-center">
                  {getEventIcon(event.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-jetbrains-mono text-xs text-mist-gray">
                      {event.timestamp}
                    </span>
                    {event.type === 'ai' && (
                      <Badge className="bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30 text-xs">
                        AI
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-cloud-white mb-1">{event.content}</p>
                  
                  {event.details && (
                    <p className="text-xs text-mist-gray">{event.details}</p>
                  )}
                  
                  {event.aiAnnotation && (
                    <div className="mt-2 p-2 bg-prediction-purple/10 border border-prediction-purple/30 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <Brain className="w-3 h-3 text-prediction-purple" />
                        <span className="text-xs font-medium text-prediction-purple">AI Insight</span>
                      </div>
                      <p className="text-xs text-cloud-white">{event.aiAnnotation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Artifacts Section */}
        <div className="p-4 border-t border-slate-gray/30">
          <h4 className="font-['Space_Grotesk'] font-semibold text-pure-white text-sm mb-3">
            Artifacts in Progress
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cloud-white">Recording.mp4</span>
              <span className="text-iq-green">24.3 MB</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cloud-white">Transcript.vtt</span>
              <span className="text-cyan-accent">Live</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cloud-white">Actions.json</span>
              <span className="text-signal-yellow">6 events</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-cloud-white">Files transferred</span>
              <span className="text-mist-gray">1 file</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RemoteWorkroom };