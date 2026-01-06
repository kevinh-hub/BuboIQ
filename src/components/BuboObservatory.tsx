import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Brain, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Eye,
  TrendingUp,
  Layers3,
  Radar,
  Sparkles
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface ObservationMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  type: 'critical' | 'warning' | 'healthy' | 'predictive';
  details?: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  category: 'performance' | 'security' | 'capacity' | 'maintenance';
}

const BuboObservatory: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Simulate AI scanning activity
  useEffect(() => {
    const interval = setInterval(() => {
      setIsScanning(prev => !prev);
      if (isScanning) {
        setScanProgress(prev => (prev + 5) % 100);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isScanning]);

  const observationMetrics: ObservationMetric[] = [
    {
      id: '1',
      title: 'System Health Score',
      value: '94%',
      change: 2.3,
      trend: 'up',
      confidence: 97,
      type: 'healthy',
      details: 'All critical systems operating within normal parameters'
    },
    {
      id: '2',
      title: 'Predicted Issues',
      value: 3,
      change: -40,
      trend: 'down',
      confidence: 89,
      type: 'predictive',
      details: 'Potential disk space issue in 48-72 hours'
    },
    {
      id: '3',
      title: 'Active Correlations',
      value: 12,
      change: 8.2,
      trend: 'up',
      confidence: 94,
      type: 'warning',
      details: 'Network latency patterns detected across 4 services'
    },
    {
      id: '4',
      title: 'Response Time',
      value: '147ms',
      change: -12.5,
      trend: 'down',
      confidence: 91,
      type: 'healthy',
      details: 'Average response time across all endpoints'
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: '1',
      title: 'Database Connection Pool Tuning',
      description: 'AI detected inefficient connection pooling patterns that could be improved for 23% performance gain.',
      confidence: 94,
      impact: 'high',
      timeframe: '2-3 days',
      category: 'performance'
    },
    {
      id: '2',
      title: 'Security Anomaly Pattern',
      description: 'Unusual authentication patterns detected from EU region. Recommend improved monitoring.',
      confidence: 87,
      impact: 'medium',
      timeframe: 'Immediate',
      category: 'security'
    },
    {
      id: '3',
      title: 'Capacity Planning Alert',
      description: 'Current growth trajectory suggests storage capacity limit in 6-8 weeks.',
      confidence: 96,
      impact: 'high',
      timeframe: '6-8 weeks',
      category: 'capacity'
    }
  ];

  const getMetricColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-crimson-danger';
      case 'warning': return 'text-amber-warning';
      case 'healthy': return 'text-iq-green';
      case 'predictive': return 'text-prediction-purple';
      default: return 'text-mist-gray';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'medium': return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      case 'low': return 'bg-iq-green/20 text-iq-green border-iq-green/30';
      default: return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  return (
    <div className="min-h-screen bg-background bubo-neural-bg p-6 space-y-8">
      {/* Cinematic Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className="text-center space-y-4 mb-12">
          <motion.div
            animate={{ rotate: isScanning ? 360 : 0 }}
            transition={{ duration: 2, ease: "linear", repeat: isScanning ? Infinity : 0 }}
            className="mx-auto w-16 h-16 bg-iq-green/20 rounded-full flex items-center justify-center mb-4 bubo-glow-green"
          >
            <Eye className="w-8 h-8 text-iq-green" />
          </motion.div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-iq-green to-glow-cyan bg-clip-text text-transparent">
            BuboIQ Observatory
          </h1>
          <p className="text-mist-gray text-lg max-w-2xl mx-auto">
            AI-powered intelligence monitoring your IT environment 24/7. 
            {isScanning ? ' Currently scanning for anomalies...' : ' Quiet network. Bubo is on watch.'}
          </p>
          
          {/* AI Scanning Indicator */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md"
            >
              <div className="flex items-center gap-3 text-sm text-iq-green/80 mb-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>AI Analysis in Progress</span>
                <span className="ml-auto">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Observation Metrics - Radial Star-Map Layout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {observationMetrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bubo-animate-float"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <Card className="bubo-signal-card p-6 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-iq-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{metric.title}</h3>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getMetricColor(metric.type)} opacity-20`}>
                    {metric.type === 'predictive' ? (
                      <Brain className="w-4 h-4" />
                    ) : metric.type === 'critical' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : metric.type === 'healthy' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold ${getMetricColor(metric.type)}`}>
                      {metric.value}
                    </span>
                    <span className={`text-sm flex items-center gap-1 ${
                      metric.trend === 'up' ? 'text-iq-green' : 
                      metric.trend === 'down' ? 'text-crimson-danger' : 'text-mist-gray'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      {Math.abs(metric.change)}%
                    </span>
                  </div>

                  {/* Confidence Ribbon */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-mist-gray">
                      <span>Confidence</span>
                      <span>{metric.confidence}%</span>
                    </div>
                    <div className="bubo-confidence-ribbon">
                      <div 
                        className="h-full bg-gradient-to-r from-iq-green/50 to-iq-green rounded-full transition-all duration-1000"
                        style={{ width: `${metric.confidence}%` }}
                      />
                    </div>
                  </div>

                  {metric.details && (
                    <p className="text-xs text-mist-gray/80 mt-3">
                      {metric.details}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* AI Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-prediction-purple/20 rounded-lg">
            <Brain className="w-5 h-5 text-prediction-purple" />
          </div>
          <h2 className="text-2xl font-bold">AI Intelligence Insights</h2>
          <Badge variant="secondary" className="bg-prediction-purple/20 text-prediction-purple">
            3 Active Insights
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bubo-prediction-card p-6 h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground leading-tight">
                      {insight.title}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`${getImpactColor(insight.impact)} text-xs`}
                    >
                      {insight.impact.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-mist-gray leading-relaxed">
                    {insight.description}
                  </p>

                  <div className="space-y-3">
                    {/* Confidence Indicator */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-mist-gray">AI Confidence</span>
                      <span className="text-iq-green font-semibold">{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />

                    {/* Metadata */}
                    <div className="flex justify-between text-xs text-mist-gray/80">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {insight.timeframe}
                      </span>
                      <span className="capitalize">{insight.category}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bubo-signal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-iq-green" />
            <h3 className="font-semibold">Security Posture</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Threat Level</span>
              <span className="text-iq-green">Low</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Last Scan</span>
              <span className="text-foreground">2 minutes ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Vulnerabilities</span>
              <span className="text-iq-green">0 Critical</span>
            </div>
          </div>
        </Card>

        <Card className="bubo-signal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Layers3 className="w-5 h-5 text-signal-blue" />
            <h3 className="font-semibold">Infrastructure</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Services</span>
              <span className="text-iq-green">24/24 Online</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Load Average</span>
              <span className="text-foreground">0.47</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Uptime</span>
              <span className="text-iq-green">99.9%</span>
            </div>
          </div>
        </Card>

        <Card className="bubo-signal-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Radar className="w-5 h-5 text-amber-warning" />
            <h3 className="font-semibold">Monitoring</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Active Probes</span>
              <span className="text-iq-green">47</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">Data Points/min</span>
              <span className="text-foreground">1,247</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mist-gray">AI Models</span>
              <span className="text-iq-green">3 Active</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BuboObservatory;