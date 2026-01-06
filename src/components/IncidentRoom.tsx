import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  FileText, 
  Image, 
  Database, 
  Terminal, 
  Brain,
  Users,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  Camera,
  Code,
  Activity,
  TrendingUp,
  Eye,
  Download,
  Share,
  Play,
  Pause
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'detection' | 'analysis' | 'action' | 'resolution' | 'escalation';
  title: string;
  description: string;
  actor: 'system' | 'ai' | 'user';
  actorName: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  metadata?: any;
}

interface EvidencePack {
  id: string;
  title: string;
  type: 'logs' | 'metrics' | 'screenshot' | 'code' | 'config' | 'network';
  description: string;
  timestamp: Date;
  size: string;
  preview?: string;
  confidence: number;
  relevance: number;
  aiGenerated: boolean;
}

interface AIInsight {
  id: string;
  title: string;
  content: string;
  confidence: number;
  type: 'root_cause' | 'impact_analysis' | 'recommendation' | 'prediction';
  isThinking: boolean;
}

const IncidentRoom: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock incident data
  const incidentId = "INC-2024-001247";
  const incidentTitle = "Database running out of connections";
  const incidentStatus = "Investigating";
  const incidentSeverity = "High";
  const startTime = new Date(Date.now() - 1000 * 60 * 45); // 45 minutes ago

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 0),
      type: 'detection',
      title: 'Strange activity detected',
      description: 'BuboIQ found unusual database connection patterns',
      actor: 'ai',
      actorName: 'BuboIQ Detection Engine',
      severity: 'warning'
    },
    {
      id: '2',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 2),
      type: 'analysis',
      title: 'Finding root cause',
      description: 'AI started checking connection pool metrics and query patterns',
      actor: 'ai',
      actorName: 'BuboIQ Analyzer',
      severity: 'info'
    },
    {
      id: '3',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 5),
      type: 'escalation',
      title: 'Incident Created',
      description: 'Automatic incident creation due to confidence threshold breach (94%)',
      actor: 'system',
      actorName: 'BuboIQ Incident Manager',
      severity: 'warning'
    },
    {
      id: '4',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 8),
      type: 'action',
      title: 'Evidence Collection',
      description: 'Gathered connection pool logs, metrics, and performance traces',
      actor: 'ai',
      actorName: 'BuboIQ Evidence Collector',
      severity: 'info'
    },
    {
      id: '5',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 12),
      type: 'analysis',
      title: 'Pattern Match Found',
      description: 'Similar incident pattern identified from 3 weeks ago (INC-2024-001089)',
      actor: 'ai',
      actorName: 'BuboIQ Pattern Matcher',
      severity: 'info'
    },
    {
      id: '6',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 18),
      type: 'action',
      title: 'Team Notification',
      description: 'On-call engineer Sarah Chen notified via Slack and SMS',
      actor: 'system',
      actorName: 'BuboIQ Notification Engine',
      severity: 'info'
    },
    {
      id: '7',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 25),
      type: 'action',
      title: 'Investigation Started',
      description: 'Sarah Chen joined incident room and began investigation',
      actor: 'user',
      actorName: 'Sarah Chen',
      severity: 'info'
    }
  ];

  const evidencePacks: EvidencePack[] = [
    {
      id: 'e1',
      title: 'Connection Pool Metrics',
      type: 'metrics',
      description: 'Real-time connection pool usage, wait times, and throughput metrics',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 8),
      size: '2.4 MB',
      confidence: 95,
      relevance: 98,
      aiGenerated: false,
      preview: 'Peak connections: 98/100 (98%)\nAvg wait time: 2.3s\nTimeout rate: 12%'
    },
    {
      id: 'e2',
      title: 'Database Query Logs',
      type: 'logs',
      description: 'Slow query logs and execution plans from the last 2 hours',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 10),
      size: '15.7 MB',
      confidence: 87,
      relevance: 92,
      aiGenerated: false,
      preview: '[2024-01-15 14:23:15] SLOW QUERY: SELECT * FROM users WHERE...'
    },
    {
      id: 'e3',
      title: 'Performance Dashboard Screenshot',
      type: 'screenshot',
      description: 'Grafana dashboard showing connection pool trends at incident time',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 12),
      size: '847 KB',
      confidence: 91,
      relevance: 85,
      aiGenerated: false
    },
    {
      id: 'e4',
      title: 'AI-Generated Query Analysis',
      type: 'code',
      description: 'BuboIQ analysis of inefficient queries contributing to pool exhaustion',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 15),
      size: '234 KB',
      confidence: 94,
      relevance: 96,
      aiGenerated: true,
      preview: 'INEFFICIENT PATTERN DETECTED:\n- Missing index on user_events.created_at\n- N+1 query in user dashboard'
    },
    {
      id: 'e5',
      title: 'Network Traffic Capture',
      type: 'network',
      description: 'TCP connection analysis showing connection establishment patterns',
      timestamp: new Date(startTime.getTime() + 1000 * 60 * 18),
      size: '45.2 MB',
      confidence: 78,
      relevance: 73,
      aiGenerated: false
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: 'ai1',
      title: 'Root Cause Analysis',
      content: 'The connection pool exhaustion is caused by a combination of factors: (1) Missing database index on user_events.created_at causing slow queries, (2) N+1 query pattern in the user dashboard endpoint, and (3) Increased mobile app usage since the v2.1 release. The slow queries are holding connections longer than normal, while increased traffic is creating more demand.',
      confidence: 94,
      type: 'root_cause',
      isThinking: false
    },
    {
      id: 'ai2',
      title: 'Impact Assessment',
      content: 'Current impact: API response times increased by 340%, affecting ~2,400 active users. If unresolved, connection pool will reach 100% usage in approximately 23 minutes, causing complete service outage. Revenue impact estimated at $12,000/hour during outage.',
      confidence: 89,
      type: 'impact_analysis',
      isThinking: false
    },
    {
      id: 'ai3',
      title: 'Recommended Actions',
      content: 'Immediate: (1) Scale connection pool from 100 to 200 connections, (2) Deploy query performance patch for user dashboard. Short-term: (3) Add missing index on user_events.created_at, (4) Implement connection pool monitoring alerts. This approach should restore service in ~8 minutes.',
      confidence: 91,
      type: 'recommendation',
      isThinking: false
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'detection': return AlertTriangle;
      case 'analysis': return Brain;
      case 'action': return Zap;
      case 'resolution': return CheckCircle2;
      case 'escalation': return TrendingUp;
      default: return Info;
    }
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'logs': return FileText;
      case 'metrics': return Activity;
      case 'screenshot': return Camera;
      case 'code': return Code;
      case 'config': return Terminal;
      case 'network': return Activity;
      default: return FileText;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-crimson-danger border-crimson-danger/50 bg-crimson-danger/10';
      case 'warning': return 'text-amber-warning border-amber-warning/50 bg-amber-warning/10';
      case 'success': return 'text-iq-green border-iq-green/50 bg-iq-green/10';
      case 'info': return 'text-signal-blue border-signal-blue/50 bg-signal-blue/10';
      default: return 'text-mist-gray border-mist-gray/50 bg-mist-gray/10';
    }
  };

  return (
    <div className="min-h-screen bg-background bubo-neural-bg p-6">
      {/* Incident Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-warning/20 rounded-lg bubo-glow-amber">
                <AlertTriangle className="w-6 h-6 text-amber-warning" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{incidentTitle}</h1>
                <p className="text-mist-gray">{incidentId} • Started {startTime.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-amber-warning/20 text-amber-warning border-amber-warning/30">
              {incidentStatus}
            </Badge>
            <Badge variant="outline" className="bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30">
              Severity: {incidentSeverity}
            </Badge>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Duration</span>
              <span className="font-bold text-foreground">
                {Math.floor((Date.now() - startTime.getTime()) / 1000 / 60)}m
              </span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Events</span>
              <span className="font-bold text-foreground">{timelineEvents.length}</span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Evidence</span>
              <span className="font-bold text-foreground">{evidencePacks.length}</span>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-mist-gray">Responders</span>
              <span className="font-bold text-foreground">3</span>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Timeline - 2/3 width */}
        <div className="xl:col-span-2 space-y-6">
          {/* Timeline Controls */}
          <Card className="p-4 bg-card/50 border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'} Timeline
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-mist-gray">Speed:</span>
                  {[0.5, 1, 2, 4].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 text-xs rounded ${
                        playbackSpeed === speed 
                          ? 'bg-iq-green text-background' 
                          : 'text-mist-gray hover:text-foreground'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-mist-gray">
                <Clock className="w-4 h-4" />
                Live Mode
              </div>
            </div>
          </Card>

          {/* 3D Timeline */}
          <Card className="p-6 bg-card/50 border-border/50">
            <h2 className="text-xl font-semibold mb-6">Incident Timeline</h2>
            
            <ScrollArea className="h-[600px]" ref={scrollRef}>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-iq-green via-signal-blue to-mist-gray" />

                <div className="space-y-6">
                  {timelineEvents.map((event, index) => {
                    const EventIcon = getEventIcon(event.type);
                    const isSelected = selectedEvent === event.id;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative flex items-start gap-6"
                        onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                      >
                        {/* Timeline Node */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`relative z-10 p-2 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                            isSelected 
                              ? 'bg-iq-green border-iq-green text-background bubo-glow-green' 
                              : `${getSeverityColor(event.severity)} border-2`
                          }`}
                        >
                          <EventIcon className="w-4 h-4" />
                        </motion.div>

                        {/* Event Content */}
                        <motion.div
                          layout
                          className={`flex-1 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'bg-iq-green/10 border-iq-green/30 bubo-glow-green' 
                              : 'bg-card/30 border-border/50 hover:border-iq-green/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{event.title}</h3>
                              <p className="text-sm text-mist-gray">{event.description}</p>
                            </div>
                            <div className="text-right text-xs text-mist-gray">
                              <div>{event.timestamp.toLocaleTimeString()}</div>
                              <div className="mt-1">{event.actorName}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getSeverityColor(event.severity)}`}
                            >
                              {event.type.replace('_', ' ')}
                            </Badge>
                            {event.actor === 'ai' && (
                              <Badge variant="outline" className="bg-iq-green/20 text-iq-green border-iq-green/30 text-xs">
                                <Brain className="w-3 h-3 mr-1" />
                                AI
                              </Badge>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-border/30"
                              >
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-mist-gray">Actor Type:</span>
                                    <span className="ml-2 capitalize">{event.actor}</span>
                                  </div>
                                  <div>
                                    <span className="text-mist-gray">Event ID:</span>
                                    <span className="ml-2 font-mono">{event.id}</span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel - 1/3 width */}
        <div className="space-y-6">
          <Tabs defaultValue="ai-insights" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="evidence">Evidence</TabsTrigger>
            </TabsList>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="space-y-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bubo-prediction-card p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground">{insight.title}</h3>
                        {insight.isThinking && (
                          <div className="flex items-center gap-2 text-iq-green">
                            <Brain className="w-4 h-4 animate-pulse" />
                            <span className="text-xs">Thinking...</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-mist-gray leading-relaxed">
                        {insight.content}
                      </p>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-mist-gray">Confidence</span>
                          <span className="text-iq-green">{insight.confidence}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-iq-green/50 to-iq-green"
                          />
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-xs capitalize">
                        {insight.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* AI Thinking Bubble */}
              {aiThinking && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-prediction-purple/10 border border-prediction-purple/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-prediction-purple/20 rounded-lg">
                      <Brain className="w-4 h-4 text-prediction-purple animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-medium">BuboIQ is analyzing...</h4>
                      <p className="text-xs text-mist-gray">Processing correlation patterns and historical data</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* Evidence Tab */}
            <TabsContent value="evidence" className="space-y-4">
              {evidencePacks.map((evidence, index) => {
                const EvidenceIcon = getEvidenceIcon(evidence.type);
                
                return (
                  <motion.div
                    key={evidence.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bubo-signal-card p-4 hover:bubo-glow-green cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-signal-blue/20 rounded-lg">
                              <EvidenceIcon className="w-4 h-4 text-signal-blue" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{evidence.title}</h4>
                              <p className="text-xs text-mist-gray">{evidence.description}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>

                        {evidence.preview && (
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <pre className="text-xs text-foreground font-mono overflow-hidden">
                              {evidence.preview}
                            </pre>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-4">
                            <span className="text-mist-gray">{evidence.size}</span>
                            <span className="text-mist-gray">
                              {evidence.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          {evidence.aiGenerated && (
                            <Badge variant="outline" className="bg-iq-green/20 text-iq-green border-iq-green/30">
                              <Brain className="w-3 h-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex justify-between text-xs text-mist-gray mb-1">
                              <span>Relevance</span>
                              <span>{evidence.relevance}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-iq-green rounded-full"
                                style={{ width: `${evidence.relevance}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs text-mist-gray mb-1">
                              <span>Confidence</span>
                              <span>{evidence.confidence}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-signal-blue rounded-full"
                                style={{ width: `${evidence.confidence}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default IncidentRoom;