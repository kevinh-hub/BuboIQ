import React, { useState } from 'react';
import { useApp } from '../App';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Brain,
  MessageSquare,
  Copy,
  Send,
  Sparkles,
  FileText,
  User,
  Shield,
  Crown,
  ChevronDown,
  ChevronRight,
  Link,
  Zap
} from 'lucide-react';

interface Summary {
  id: string;
  title: string;
  content: string;
  confidence: number;
  sources: string[];
  tone: 'end-user' | 'sysadmin' | 'executive';
  generatedAt: Date;
}

interface PlaybookSuggestion {
  id: string;
  title: string;
  description: string;
  confidence: number;
  estimatedTime: string;
  complexity: 'low' | 'medium' | 'high';
  category: 'network' | 'server' | 'security' | 'user';
}

const AssistPanel: React.FC = () => {
  const { user } = useApp();
  const [selectedTone, setSelectedTone] = useState<'end-user' | 'sysadmin' | 'executive'>('end-user');
  const [customPrompt, setCustomPrompt] = useState('');
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  
  const [summaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'VPN Gateway Incident Summary',
      content: `Hi team,\n\nWe're currently experiencing network connectivity issues with our primary VPN gateway. Here's what we know:\n\n• Issue started at 2:23 PM\n• Affecting 45 remote workers\n• Packet loss detected at 23.4%\n• Backup gateway is now active\n• ISP has been contacted (Ticket #ISP-789123)\n\nWe expect resolution within the next 30 minutes. Remote workers can continue using the backup connection with slightly reduced performance.\n\nWe'll keep you updated as the situation develops.`,
      confidence: 87,
      sources: ['gateway-logs', 'monitoring-alerts', 'user-reports'],
      tone: 'end-user',
      generatedAt: new Date(Date.now() - 5 * 60000)
    },
    {
      id: '2',
      title: 'Technical Root Cause Analysis',
      content: `INCIDENT: VPN-2024-001 - Primary Gateway Packet Loss\n\nROOT CAUSE:\nISP routing table corruption causing suboptimal path selection to primary gateway (203.0.113.15). Traceroute analysis shows 15-hop path vs normal 8-hop path.\n\nIMPACT:\n- Packet loss: 23.4% (threshold: 5%)\n- Latency increase: 5,344% (45ms → 2,450ms)\n- Affected services: Remote access, cloud sync, VoIP\n\nMITIGATION:\n1. Automated failover to secondary gateway (203.0.113.16) - COMPLETE\n2. ISP escalation via priority support channel - IN PROGRESS\n3. BGP route improvement pending ISP fix - PENDING\n\nNEXT STEPS:\n- Monitor secondary gateway performance\n- Prepare rollback procedures\n- Document lessons learned`,
      confidence: 92,
      sources: ['traceroute-logs', 'bgp-tables', 'performance-metrics'],
      tone: 'sysadmin',
      generatedAt: new Date(Date.now() - 3 * 60000)
    },
    {
      id: '3',
      title: 'Executive Incident Brief',
      content: `EXECUTIVE SUMMARY - Network Incident\n\nSTATUS: Contained and mitigating\nBUSINESS IMPACT: Minimal disruption to operations\nETA RESOLUTION: 30 minutes\n\nSITUATION:\nOur primary VPN experienced degraded performance due to an external ISP routing issue. Our automated systems immediately activated backup infrastructure, ensuring business continuity.\n\nACTIONS TAKEN:\n• Automatic failover systems engaged (no manual intervention required)\n• ISP escalation initiated through priority support channels\n• All affected users notified with workaround instructions\n\nBUSINESS IMPACT:\n• 45 remote workers affected (12% of workforce)\n• No data loss or security incidents\n• Productivity impact: <10% due to rapid failover\n• Customer-facing services: No impact\n\nThis incident demonstrates the value of our redundant infrastructure investments.`,
      confidence: 89,
      sources: ['incident-timeline', 'business-metrics', 'user-feedback'],
      tone: 'executive',
      generatedAt: new Date(Date.now() - 1 * 60000)
    }
  ]);

  const [playbookSuggestions] = useState<PlaybookSuggestion[]>([
    {
      id: '1',
      title: 'VPN Gateway Failover',
      description: 'Automated procedure for VPN gateway failover with health checks and rollback',
      confidence: 95,
      estimatedTime: '5 minutes',
      complexity: 'medium',
      category: 'network'
    },
    {
      id: '2',
      title: 'ISP Escalation Protocol',
      description: 'Step-by-step process for escalating network issues to ISP priority support',
      confidence: 88,
      estimatedTime: '10 minutes',
      complexity: 'low',
      category: 'network'
    },
    {
      id: '3',
      title: 'User Communication Template',
      description: 'Multi-channel user notification for network incidents with workarounds',
      confidence: 92,
      estimatedTime: '3 minutes',
      complexity: 'low',
      category: 'user'
    }
  ]);

  const generateCustomSummary = async () => {
    setGeneratingSummary(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingSummary(false);
    // In real implementation, this would call AI service
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast would show here
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'end-user': return <User className="w-4 h-4" />;
      case 'sysadmin': return <Shield className="w-4 h-4" />;
      case 'executive': return <Crown className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'end-user': return 'bg-blue-100 text-blue-800';
      case 'sysadmin': return 'bg-green-100 text-green-800';
      case 'executive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background-gray min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-iq-green" />
          <h1 className="text-2xl font-semibold text-bubo-indigo">AI Assist</h1>
          <Badge variant="outline" className="text-iq-green border-iq-green">
            <Sparkles className="w-3 h-3 mr-1" />
            Copilot Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Summaries */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-bubo-indigo">Smart Summaries</h2>
            <Badge variant="secondary" className="text-xs">
              with provenance tracking
            </Badge>
          </div>

          <div className="space-y-4">
            {summaries.map((summary) => (
              <Card key={summary.id} className="bg-white">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-bubo-indigo">{summary.title}</h3>
                      <Badge className={getToneColor(summary.tone)}>
                        {getToneIcon(summary.tone)}
                        <span className="ml-1 capitalize">{summary.tone}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {summary.confidence}% confidence
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedSummary(
                          expandedSummary === summary.id ? null : summary.id
                        )}
                      >
                        {expandedSummary === summary.id ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {expandedSummary === summary.id && (
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">
                        {summary.content}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-interface-gray">Sources:</span>
                          {summary.sources.map(source => (
                            <Badge key={source} variant="outline" className="text-xs">
                              <Link className="w-3 h-3 mr-1" />
                              {source}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(summary.content)}
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="w-3 h-3 mr-1" />
                            Send to Slack
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Custom Prompt */}
          <Card className="p-4 bg-white">
            <h3 className="font-medium text-bubo-indigo mb-4">Generate Custom Summary</h3>
            <div className="space-y-3">
              <Select value={selectedTone} onValueChange={(value: any) => setSelectedTone(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="end-user">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>End User</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sysadmin">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>SysAdmin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="executive">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>Executive</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="Describe what kind of summary you need..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
              />
              
              <Button 
                onClick={generateCustomSummary}
                disabled={!customPrompt.trim() || generatingSummary}
                className="w-full"
              >
                {generatingSummary ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Suggested Playbooks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-bubo-indigo">Suggested Playbooks</h2>
            <Badge variant="secondary" className="text-xs">
              AI-recommended
            </Badge>
          </div>

          <div className="space-y-4">
            {playbookSuggestions.map((playbook) => (
              <Card key={playbook.id} className="p-4 bg-white hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-bubo-indigo mb-1">{playbook.title}</h3>
                      <p className="text-sm text-interface-gray mb-2">{playbook.description}</p>
                    </div>
                    <Badge className="bg-iq-green text-white text-xs">
                      {playbook.confidence}%
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {playbook.estimatedTime}
                      </Badge>
                      <Badge className={getComplexityColor(playbook.complexity) + " text-xs"}>
                        {playbook.complexity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-iq-green hover:bg-green-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="p-4 bg-white">
            <h3 className="font-medium text-bubo-indigo mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Create Runbook
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Draft Email
              </Button>
              <Button variant="outline" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Auto-remediate
              </Button>
              <Button variant="outline" size="sm">
                <Brain className="w-4 h-4 mr-2" />
                Ask Bubo
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AssistPanel;