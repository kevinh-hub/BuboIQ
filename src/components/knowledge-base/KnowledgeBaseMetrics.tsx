import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Clock, CheckCircle, Brain, Zap, Target, BarChart3, Calendar, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface KnowledgeBaseMetricsProps {
  user: any;
  onBack: () => void;
}

const deflectionData = [
  { month: 'Jan', deflected: 45, total: 120, rate: 37.5 },
  { month: 'Feb', deflected: 62, total: 145, rate: 42.8 },
  { month: 'Mar', deflected: 78, total: 160, rate: 48.8 },
  { month: 'Apr', deflected: 89, total: 175, rate: 50.9 },
  { month: 'May', deflected: 102, total: 185, rate: 55.1 },
  { month: 'Jun', deflected: 118, total: 195, rate: 60.5 }
];

const confidenceData = [
  { month: 'Jan', high: 12, medium: 8, low: 5 },
  { month: 'Feb', high: 18, medium: 12, low: 4 },
  { month: 'Mar', high: 25, medium: 15, low: 3 },
  { month: 'Apr', high: 32, medium: 18, low: 2 },
  { month: 'May', high: 38, medium: 22, low: 2 },
  { month: 'Jun', high: 45, medium: 25, low: 1 }
];

const timeToResolveData = [
  { category: 'With KB', time: 12, color: '#00FF85' },
  { category: 'Without KB', time: 45, color: '#EF4444' }
];

const usageData = [
  { name: 'Windows Updates', value: 30, color: '#00FF85' },
  { name: 'Printer Issues', value: 25, color: '#1E90FF' },
  { name: 'Network Problems', value: 20, color: '#FFD400' },
  { name: 'Software Crashes', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 10, color: '#9CA3AF' }
];

const articlesData = [
  { month: 'Jan', published: 5, drafts: 8, deprecated: 2 },
  { month: 'Feb', published: 8, drafts: 12, deprecated: 1 },
  { month: 'Mar', published: 12, drafts: 15, deprecated: 3 },
  { month: 'Apr', published: 16, drafts: 18, deprecated: 2 },
  { month: 'May', published: 22, drafts: 20, deprecated: 4 },
  { month: 'Jun', published: 28, drafts: 25, deprecated: 3 }
];

export const KnowledgeBaseMetrics: React.FC<KnowledgeBaseMetricsProps> = ({
  user,
  onBack
}) => {
  const [timeRange, setTimeRange] = useState('6m');
  const [activeTab, setActiveTab] = useState('overview');

  const kpiCards = [
    {
      title: 'Deflection Rate',
      value: '60.5%',
      change: '+5.4%',
      trend: 'up' as const,
      description: 'Issues resolved via Knowledge Base',
      icon: <Target className="w-6 h-6" />
    },
    {
      title: 'Avg. Time Saved',
      value: '33min',
      change: '+8min',
      trend: 'up' as const,
      description: 'Per issue compared to manual resolution',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Article Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up' as const,
      description: 'Success rate of published solutions',
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      title: 'Knowledge Growth',
      value: '28',
      change: '+6',
      trend: 'up' as const,
      description: 'New articles this month',
      icon: <Brain className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-dark-midnight bubo-neural-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} className="bubo-btn-ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-iq-neon-green/20 to-electric-blue/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-iq-neon-green" />
            </div>
            <div>
              <h1 className="font-space-grotesk text-2xl text-pure-white mb-1">
                Knowledge Base Analytics
              </h1>
              <p className="text-mist-gray">Performance insights and impact metrics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-surface-dark/50 border-slate-gray/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="bubo-glass p-6 hover:bubo-glow-green transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-iq-neon-green/20 flex items-center justify-center text-iq-neon-green">
                {kpi.icon}
              </div>
              <Badge className={`${
                kpi.trend === 'up' 
                  ? 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30' 
                  : 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {kpi.change}
              </Badge>
            </div>
            
            <div className="mb-2">
              <div className="text-3xl font-bold text-pure-white mb-1">{kpi.value}</div>
              <div className="text-sm text-pure-white font-medium">{kpi.title}</div>
            </div>
            
            <div className="text-xs text-mist-gray">{kpi.description}</div>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-surface-dark/50 border border-slate-gray/30 rounded-xl p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="deflection" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            Deflection Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="confidence" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            Confidence Trends
          </TabsTrigger>
          <TabsTrigger 
            value="usage" 
            className="data-[state=active]:bg-iq-neon-green/20 data-[state=active]:text-iq-neon-green text-mist-gray"
          >
            Usage Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deflection Rate Chart */}
            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-iq-neon-green" />
                Issue Deflection Rate
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={deflectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid rgba(0, 255, 133, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#00FF85" 
                      strokeWidth={3}
                      dot={{ fill: '#00FF85', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Time to Resolve Comparison */}
            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-electric-blue" />
                Time to fix
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeToResolveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                    <XAxis dataKey="category" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid rgba(0, 255, 133, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="time" fill="#00FF85" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Article Growth */}
            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-prediction-purple" />
                Knowledge Base Growth
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={articlesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid rgba(0, 255, 133, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Bar dataKey="published" fill="#00FF85" name="Published" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="drafts" fill="#1E90FF" name="Drafts" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="deprecated" fill="#EF4444" name="Deprecated" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Issues Categories */}
            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-signal-yellow" />
                Most Common Issues
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid rgba(0, 255, 133, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {usageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-pure-white">{item.name}</span>
                    </div>
                    <span className="text-sm text-mist-gray">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deflection" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="text-lg font-semibold text-pure-white mb-6">Issue Deflection Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deflectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(0, 255, 133, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="deflected" 
                    stroke="#00FF85" 
                    strokeWidth={3}
                    name="Deflected Issues"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#1E90FF" 
                    strokeWidth={3}
                    name="Total Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="confidence" className="space-y-6">
          <Card className="bubo-glass p-6">
            <h3 className="text-lg font-semibold text-pure-white mb-6">Solution Confidence Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.1)" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1C1C1E',
                      border: '1px solid rgba(0, 255, 133, 0.3)',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Bar dataKey="high" fill="#00FF85" name="High Confidence" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="medium" fill="#FFD400" name="Medium Confidence" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="low" fill="#EF4444" name="Low Confidence" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-6">Issue Categories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid rgba(0, 255, 133, 0.3)',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bubo-glass p-6">
              <h3 className="text-lg font-semibold text-pure-white mb-6">Category Breakdown</h3>
              <div className="space-y-4">
                {usageData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-pure-white">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-pure-white">{item.value}%</div>
                      <div className="text-xs text-mist-gray">of total issues</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};