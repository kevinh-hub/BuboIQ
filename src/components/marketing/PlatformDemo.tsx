import React, { useState } from 'react';
import { X, ArrowRight, Users, FileText, Settings, BarChart, Activity, Bell, Clock, CheckCircle, AlertTriangle, Zap, Eye, Brain, TrendingUp, Shield, Upload, Plus, Sparkles, Send, Info, Image, FileArchive } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PlatformDemoProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const PlatformDemo: React.FC<PlatformDemoProps> = ({ onClose, onNavigate }) => {
  const [activeView, setActiveView] = useState<'admin' | 'user'>('admin');

  return (
    <TooltipProvider>
      <div className="fixed inset-0 bg-dark-midnight/95 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen p-4">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex items-center justify-between p-6 bubo-glass rounded-3xl relative overflow-hidden">
              {/* Animated Intelligence Orb */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00FF85] to-[#1E90FF] blur-3xl bubo-orb-pulse" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#00FF85]/20 flex items-center justify-center bubo-orb-breathe">
                    <Sparkles className="h-5 w-5 text-[#00FF85]" />
                  </div>
                  <h1 className="font-space-grotesk text-3xl text-white">
                    <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> Platform Demo
                  </h1>
                </div>
                <p className="text-mist-gray ml-[52px]">
                  Experience the actual admin dashboard and user submission form
                </p>
              </div>
              <Button onClick={onClose} className="bubo-btn-ghost p-3 relative z-10">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

        {/* View Selector */}
        <div className="max-w-7xl mx-auto mb-6">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'admin' | 'user')}>
            <TabsList className="grid w-full grid-cols-2 bubo-glass p-2 rounded-2xl max-w-md mx-auto border border-[#374151]/50">
              <TabsTrigger 
                value="admin" 
                className="data-[state=active]:bg-[#00FF85]/20 data-[state=active]:text-[#00FF85] data-[state=active]:shadow-[0_0_15px_rgba(0,255,133,0.2)] flex items-center gap-2 rounded-xl transition-all font-space-grotesk"
              >
                <BarChart className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="user"
                className="data-[state=active]:bg-[#1E90FF]/20 data-[state=active]:text-[#1E90FF] data-[state=active]:shadow-[0_0_15px_rgba(30,144,255,0.2)] flex items-center gap-2 rounded-xl transition-all font-space-grotesk"
              >
                <FileText className="w-4 h-4" />
                <span>User Submission</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="mt-6">
              <div className="bubo-glass rounded-3xl p-8 space-y-8 relative overflow-hidden">
                {/* Animated Background Orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00FF85] to-[#1E90FF] blur-3xl bubo-orb-float" />
                </div>
                <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1E90FF] to-[#8B5CF6] blur-3xl bubo-orb-breathe" />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#00FF85]/20 flex items-center justify-center bubo-orb-breathe">
                            <Eye className="w-6 h-6 text-[#00FF85]" />
                          </div>
                          <h1 className="text-3xl font-space-grotesk text-white">
                            Good morning, Demo User
                          </h1>
                        </div>
                        <Badge className="bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30 px-3 py-1">Admin</Badge>
                      </div>
                      <p className="text-[#9CA3AF] text-lg ml-[60px]">
                        <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> is watching your infrastructure. Here's what needs your attention.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-2 bg-[#1C1C1E]/50 rounded-xl border border-[#00FF85]/20">
                        <div className="w-2 h-2 bg-[#00FF85] rounded-full bubo-orb-pulse"></div>
                        <span className="text-sm text-white font-jetbrains-mono">All Systems Operational</span>
                      </div>
                      <Button className="bubo-btn-neon-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Signal
                      </Button>
                    </div>
                  </div>

                  {/* System Overview Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bubo-glass-bright rounded-2xl p-6 hover:bubo-glass-bright transition-all group cursor-pointer border border-[#00FF85]/20 hover:border-[#00FF85]/40">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-space-grotesk text-[#9CA3AF]">Signal Detection</span>
                        <div className="w-10 h-10 rounded-xl bg-[#00FF85]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity className="h-5 w-5 text-[#00FF85]" />
                        </div>
                      </div>
                      <div className="text-3xl font-space-grotesk text-white mb-2">Active</div>
                      <div className="flex items-center gap-2 text-xs text-[#00FF85]">
                        <TrendingUp className="w-3 h-3" />
                        <span>Monitoring in progress</span>
                      </div>
                    </div>

                    <div className="bg-[#1C1C1E]/50 backdrop-filter backdrop-blur-xl border border-[#374151]/50 rounded-2xl p-6 hover:border-[#1E90FF]/40 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-space-grotesk text-[#9CA3AF]">AI Analysis</span>
                        <div className="w-10 h-10 rounded-xl bg-[#1E90FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Brain className="h-5 w-5 text-[#1E90FF]" />
                        </div>
                      </div>
                      <div className="text-3xl font-space-grotesk text-white mb-2">Ready</div>
                      <p className="text-xs text-[#9CA3AF]">Processing signals</p>
                    </div>

                    <div className="bg-[#1C1C1E]/50 backdrop-filter backdrop-blur-xl border border-[#374151]/50 rounded-2xl p-6 hover:border-[#F59E0B]/40 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-space-grotesk text-[#9CA3AF]">Active Signals</span>
                        <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                        </div>
                      </div>
                      <div className="text-3xl font-space-grotesk text-white mb-2">3</div>
                      <p className="text-xs text-[#9CA3AF]">Requires attention</p>
                    </div>

                    <div className="bg-[#1C1C1E]/50 backdrop-filter backdrop-blur-xl border border-[#374151]/50 rounded-2xl p-6 hover:border-[#00FF85]/40 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-space-grotesk text-[#9CA3AF]">System Health</span>
                        <div className="w-10 h-10 rounded-xl bg-[#00FF85]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield className="h-5 w-5 text-[#00FF85]" />
                        </div>
                      </div>
                      <div className="text-3xl font-space-grotesk text-white mb-2">98%</div>
                      <p className="text-xs text-[#00FF85]">All systems online</p>
                    </div>
                  </div>

                  {/* Signal Stream and Focus Queue */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Latest Signals */}
                    <div className="bg-[#1C1C1E]/50 backdrop-filter backdrop-blur-xl border border-[#374151]/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-[#00FF85]/20 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-[#00FF85]" />
                        </div>
                        <h3 className="text-xl font-space-grotesk text-white">Latest Signals</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border-l-4 border-l-[#EF4444] p-4 rounded-r-xl bg-[#EF4444]/10 hover:bg-[#EF4444]/15 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-space-grotesk text-white">Anomalous Network Traffic Detected</h4>
                            <Badge className="bg-[#EF4444]/20 text-[#EF4444] border-0 whitespace-nowrap">Critical</Badge>
                          </div>
                          <p className="text-sm text-[#9CA3AF] mb-3">
                            Unusual spike in outbound connections from DC-SRV-01. Pattern suggests potential data exfiltration.
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#6B7280] font-jetbrains-mono">
                            <span className="text-[#00FF85]">High confidence</span>
                            <span>•</span>
                            <span>2 min ago</span>
                            <span>•</span>
                            <span><span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> Network</span>
                          </div>
                        </div>

                        <div className="border-l-4 border-l-[#F59E0B] p-4 rounded-r-xl bg-[#F59E0B]/10 hover:bg-[#F59E0B]/15 transition-all">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-space-grotesk text-white">Database Performance Degradation</h4>
                            <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-0 whitespace-nowrap">High</Badge>
                          </div>
                          <p className="text-sm text-[#9CA3AF] mb-3">
                            Query response times increasing significantly over baseline. Connection pool saturation detected.
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#6B7280] font-jetbrains-mono">
                            <span className="text-[#00FF85]">High confidence</span>
                            <span>•</span>
                            <span>7 min ago</span>
                            <span>•</span>
                            <span><span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> Performance</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Focus Queue */}
                    <div className="bg-[#1C1C1E]/50 backdrop-filter backdrop-blur-xl border border-[#374151]/50 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-[#1E90FF]/20 flex items-center justify-center">
                          <Brain className="h-4 w-4 text-[#1E90FF]" />
                        </div>
                        <h3 className="text-xl font-space-grotesk text-white">Focus Queue</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border-l-4 border-l-[#EF4444] p-4 rounded-r-xl bg-[#1C1C1E]/30 hover:bg-[#1C1C1E]/50 transition-all border border-[#374151]/30">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-space-grotesk text-white">Network Intrusion Response</h4>
                            <Badge className="bg-[#EF4444]/20 text-[#EF4444] border-0 whitespace-nowrap">Critical</Badge>
                          </div>
                          <p className="text-sm text-[#9CA3AF] mb-3">
                            Coordinate immediate response to detected network anomaly. Isolate affected systems.
                          </p>
                          <div className="text-xs space-y-1 font-jetbrains-mono">
                            <div className="text-[#9CA3AF]">Impact: <span className="text-[#EF4444]">High</span> - Production Systems</div>
                            <div className="text-[#9CA3AF]">Priority: <span className="text-[#F59E0B]">Immediate attention</span></div>
                            <div className="text-[#1E90FF] flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Suggestion: Execute Incident Response Playbook #3
                            </div>
                          </div>
                        </div>

                        <div className="border-l-4 border-l-[#1E90FF] p-4 rounded-r-xl bg-[#1C1C1E]/30 hover:bg-[#1C1C1E]/50 transition-all border border-[#374151]/30">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-space-grotesk text-white">Database Tuning Required</h4>
                            <Badge className="bg-[#F59E0B]/20 text-[#F59E0B] border-0 whitespace-nowrap">High</Badge>
                          </div>
                          <p className="text-sm text-[#9CA3AF] mb-3">
                            Improve query performance and connection pool settings to fix slow response times.
                          </p>
                          <div className="text-xs space-y-1 font-jetbrains-mono">
                            <div className="text-[#9CA3AF]">Impact: <span className="text-[#F59E0B]">Medium</span> - User Experience</div>
                            <div className="text-[#9CA3AF]">Priority: <span className="text-[#00FF85]">Schedule for today</span></div>
                            <div className="text-[#1E90FF] flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI Suggestion: Add recommended database index
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="user" className="mt-6">
              <div className="bubo-glass rounded-3xl p-8 space-y-6 relative overflow-hidden">
                {/* Animated Intelligence Orb */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1E90FF] to-[#00FF85] blur-3xl bubo-orb-pulse" />
                </div>

                {/* Header */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#1E90FF]/20 flex items-center justify-center bubo-orb-breathe">
                      <Sparkles className="h-5 w-5 text-[#1E90FF]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-space-grotesk text-white">Submit a Request</h2>
                      <p className="text-sm text-[#9CA3AF]">We're here to help • Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* User Submission Form - Match actual CreateTicketForm styling */}
                <div className="max-w-2xl mx-auto relative z-10">
                  <form className="space-y-6">
                    {/* Subject Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="subject" className="text-[#F3F4F6] font-space-grotesk flex items-center gap-2">
                          Subject *
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-[#9CA3AF] cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Brief summary of your issue or request</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <span className="text-xs font-jetbrains-mono text-[#9CA3AF]">37/100</span>
                      </div>
                      <Input
                        id="subject"
                        placeholder="e.g., Unable to access dashboard"
                        value="My computer is running very slowly"
                        className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white placeholder:text-[#6B7280] focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20 transition-all"
                        readOnly
                      />
                    </div>

                    {/* Category & Priority Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-[#F3F4F6] font-space-grotesk">Category</Label>
                        <Select>
                          <SelectTrigger className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20">
                            <SelectValue placeholder="Performance" />
                          </SelectTrigger>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority" className="text-[#F3F4F6] font-space-grotesk flex items-center gap-2">
                          Priority
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-[#9CA3AF] cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">High: Urgent • Medium: Important • Low: Nice to have</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Select>
                          <SelectTrigger className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20">
                            <SelectValue placeholder="Medium Priority" />
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="description" className="text-[#F3F4F6] font-space-grotesk">Description *</Label>
                        <span className="text-xs font-jetbrains-mono text-[#9CA3AF]">158/1000</span>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Please provide as much detail as possible..."
                        value="My computer has been getting slower over the past few days. It takes a long time to open programs and websites are loading slowly. I tried restarting but it didn't help."
                        rows={5}
                        className="bg-[#1C1C1E]/50 border-[#374151]/50 text-white placeholder:text-[#6B7280] focus:border-[#00FF85]/50 focus:ring-[#00FF85]/20 transition-all resize-none"
                        readOnly
                      />
                    </div>

                    {/* Attachments Upload Area */}
                    <div className="space-y-3">
                      <Label className="text-[#F3F4F6] font-space-grotesk">
                        Attachments <span className="text-[#6B7280] text-xs">(Optional, max 5 files)</span>
                      </Label>
                      <div className="border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 border-[#374151]/50 hover:border-[#00FF85]/30 hover:bg-[#1C1C1E]/30 cursor-pointer">
                        <Upload className="h-10 w-10 mx-auto mb-3 text-[#6B7280]" />
                        <p className="text-sm text-[#9CA3AF] mb-3">
                          Drag & drop files here, or click to browse
                        </p>
                        <Button type="button" variant="outline" size="sm" className="bubo-btn-secondary">
                          Choose Files
                        </Button>
                        <p className="text-xs text-[#6B7280] mt-2">Supported: Images, PDFs, Documents, Archives</p>
                      </div>

                      {/* Sample Attached File */}
                      <div className="space-y-2">
                        <p className="text-xs text-[#9CA3AF] font-space-grotesk">Attached files (1/5):</p>
                        <div className="flex items-center justify-between p-3 bg-[#1C1C1E]/50 border border-[#374151]/30 rounded-xl hover:border-[#00FF85]/30 transition-all group">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#00FF85]/10 flex items-center justify-center flex-shrink-0">
                              <Image className="h-4 w-4 text-[#00FF85]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">screenshot.png</p>
                              <p className="text-xs text-[#6B7280]">245.3 KB</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Smart Detection Banner */}
                    <div className="border border-[#1E90FF]/30 rounded-xl p-4 bg-[#1E90FF]/10">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#1E90FF] mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-space-grotesk text-[#1E90FF]">Smart Detection Active</h4>
                          <p className="text-sm text-[#F3F4F6] mt-1">
                            <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> is automatically gathering system information to help diagnose this issue faster.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-[#374151]/30">
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <CheckCircle className="h-4 w-4 text-[#00FF85]" />
                        <span>All fields are secure and encrypted</span>
                      </div>
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" className="bubo-btn-ghost">
                          Cancel
                        </Button>
                        <Button type="submit" className="bubo-btn-neon-primary relative overflow-hidden group">
                          <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Bottom Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00FF85]/30 to-transparent" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="max-w-7xl mx-auto">
          <div className="bubo-glass rounded-3xl p-6 relative overflow-hidden">
            {/* Accent Orb */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 opacity-20 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00FF85] to-[#1E90FF] blur-3xl bubo-orb-breathe" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="font-space-grotesk text-2xl text-white mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-[#9CA3AF]">
                  Experience the full <span className="text-white">BUBO</span><span className="text-iq-neon-green">IQ</span> platform with your own data and team.
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button onClick={onClose} className="bubo-btn-ghost">
                  Back to How It Works
                </Button>
                <Button onClick={() => onNavigate('pricing')} className="bubo-btn-neon-primary">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};