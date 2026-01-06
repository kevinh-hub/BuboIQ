import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  User,
  Shield,
  Calendar,
  ArrowLeft,
  Send,
  Monitor,
  Wifi,
  Server,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

interface InteractiveShowcaseProps {
  onExit: () => void;
  onGetStarted?: () => void;
}

type ViewType = 'selection' | 'business-owner' | 'it-professional';

// Sample data for admin dashboard
const sampleTickets = [
  {
    id: "BQ-001",
    title: "Email server not responding",
    user: "Sarah Johnson",
    priority: "High",
    status: "In Progress",
    created: "2 hours ago",
    assignee: "Mike Chen"
  },
  {
    id: "BQ-002", 
    title: "Printer won't connect to network",
    user: "David Miller",
    priority: "Medium",
    status: "New",
    created: "5 hours ago",
    assignee: "Unassigned"
  },
  {
    id: "BQ-003",
    title: "Software installation request",
    user: "Emily Davis",
    priority: "Low", 
    status: "Resolved",
    created: "1 day ago",
    assignee: "Alex Rodriguez"
  }
];

const sampleDevices = [
  { name: "DESK-001", type: "Workstation", status: "Healthy", user: "Sarah Johnson" },
  { name: "SRV-EMAIL", type: "Server", status: "Warning", user: "System" },
  { name: "PRINT-LOBBY", type: "Printer", status: "Offline", user: "Shared" },
  { name: "DESK-045", type: "Laptop", status: "Healthy", user: "David Miller" }
];

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  onExit,
  onGetStarted
}) => {
  const [currentView, setCurrentView] = useState<ViewType>('selection');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    category: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'text-[#00FF85]';
      case 'Warning': return 'text-[#FFD400]';
      case 'Offline': return 'text-[#EF4444]';
      default: return 'text-[#9CA3AF]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30';
      case 'Medium': return 'bg-[#FFD400]/20 text-[#FFD400] border-[#FFD400]/30';
      case 'Low': return 'bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30';
      default: return 'bg-[#9CA3AF]/20 text-[#9CA3AF] border-[#9CA3AF]/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-[#00FF85]" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-[#FFD400]" />;
      case 'New': return <AlertCircle className="w-4 h-4 text-[#1E90FF]" />;
      default: return <AlertCircle className="w-4 h-4 text-[#9CA3AF]" />;
    }
  };

  const renderViewSelection = () => (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-12">
        <div className="space-y-6">
          <Badge className="bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30 px-4 py-2">
            Interactive Showcase
          </Badge>
          <h1 className="font-space-grotesk text-5xl font-bold text-white leading-tight">
            See <span className="text-white">BUBO</span><span className="text-[#00FF85]">IQ</span> in Action
          </h1>
          <p className="text-xl text-[#9CA3AF] max-w-2xl mx-auto">
            Experience how BuboIQ transforms IT support from your perspective
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* End User View */}
          <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-8 hover:border-[#00FF85]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('business-owner')}>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#00FF85]/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-[#00FF85]" />
              </div>
              <div>
                <h3 className="font-space-grotesk text-2xl font-bold text-white mb-3">
                  End User
                </h3>
                <p className="text-[#9CA3AF] mb-6">
                  Submit IT requests easily with our simple ticket form
                </p>
                <ul className="text-left text-sm text-[#9CA3AF] space-y-2">
                  <li>• Simple ticket submission</li>
                  <li>• Clear priority selection</li>
                  <li>• Instant confirmation</li>
                </ul>
              </div>
              <Button className="w-full bg-[#00FF85] hover:bg-[#00E676] text-[#0E0E0E] font-semibold">
                Try Ticket Form
              </Button>
            </div>
          </Card>

          {/* Admin View */}
          <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-8 hover:border-[#1E90FF]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setCurrentView('it-professional')}>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-[#1E90FF]/20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-[#1E90FF]" />
              </div>
              <div>
                <h3 className="font-space-grotesk text-2xl font-bold text-white mb-3">
                  IT Admin
                </h3>
                <p className="text-[#9CA3AF] mb-6">
                  Manage tickets and monitor devices from your dashboard
                </p>
                <ul className="text-left text-sm text-[#9CA3AF] space-y-2">
                  <li>• Live ticket management</li>
                  <li>• Device monitoring</li>
                  <li>• Team assignment</li>
                </ul>
              </div>
              <Button className="w-full bg-[#1E90FF] hover:bg-[#1976D2] text-white font-semibold">
                View Dashboard
              </Button>
            </div>
          </Card>
        </div>

        <div className="pt-8">
          <Button 
            onClick={onGetStarted}
            variant="outline"
            className="bg-transparent border-[#00FF85]/30 text-[#00FF85] hover:bg-[#00FF85]/10"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Get Started with BuboIQ
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTicketForm = () => (
    <div className="min-h-screen bg-[#0E0E0E] p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => setCurrentView('selection')}
            variant="ghost"
            className="text-[#9CA3AF] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-[#00FF85]/20 text-[#00FF85] border-[#00FF85]/30 px-4 py-2">
              End User View
            </Badge>
            <Button
              onClick={() => setCurrentView('it-professional')}
              variant="outline"
              size="sm"
              className="border-[#1E90FF]/30 text-[#1E90FF] hover:bg-[#1E90FF]/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Switch to Admin View
            </Button>
          </div>
        </div>

        {/* Ticket Form */}
        <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 className="font-space-grotesk text-3xl font-bold text-white mb-2">
              Submit IT Request
            </h1>
            <p className="text-[#9CA3AF]">
              Need help? Submit a ticket and we'll take care of it.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#00FF85]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#00FF85]" />
              </div>
              <h2 className="font-space-grotesk text-xl font-bold text-white mb-2">
                Ticket Submitted!
              </h2>
              <p className="text-[#9CA3AF] mb-4">
                Your request has been received. Ticket #BQ-004 has been created.
              </p>
              <Badge className="bg-[#1E90FF]/20 text-[#1E90FF] border-[#1E90FF]/30">
                Estimated resolution: 2-4 hours
              </Badge>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  What do you need help with? *
                </label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Can't access email, printer not working..."
                  required
                  className="bg-[#1C1C1E] border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    How urgent is this? *
                  </label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger className="bg-[#1C1C1E] border-white/20 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low - Can wait</SelectItem>
                      <SelectItem value="Medium">Medium - Need soon</SelectItem>
                      <SelectItem value="High">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Category
                  </label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="bg-[#1C1C1E] border-white/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Issues</SelectItem>
                      <SelectItem value="hardware">Hardware Problem</SelectItem>
                      <SelectItem value="software">Software Request</SelectItem>
                      <SelectItem value="network">Network/WiFi</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Additional details
                </label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe what's happening, what you were trying to do, any error messages..."
                  rows={4}
                  className="bg-[#1C1C1E] border-white/20 text-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#00FF85] hover:bg-[#00E676] text-[#0E0E0E] font-semibold py-3"
                disabled={!formData.title || !formData.priority}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </form>
          )}
        </Card>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button 
            onClick={onGetStarted}
            variant="outline"
            className="border-[#00FF85]/30 text-[#00FF85] hover:bg-[#00FF85]/10"
          >
            <Calendar className="w-4 h-4 mr-2" />
            See How This Works in Your Environment
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="min-h-screen bg-[#0E0E0E] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => setCurrentView('selection')}
            variant="ghost"
            className="text-[#9CA3AF] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-[#1E90FF]/20 text-[#1E90FF] border-[#1E90FF]/30 px-4 py-2">
              IT Admin Dashboard
            </Badge>
            <Button
              onClick={() => setCurrentView('business-owner')}
              variant="outline"
              size="sm"
              className="border-[#00FF85]/30 text-[#00FF85] hover:bg-[#00FF85]/10"
            >
              <User className="w-4 h-4 mr-2" />
              Switch to User View
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tickets Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-6">
              <h2 className="font-space-grotesk text-xl font-bold text-white mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-[#1E90FF]" />
                Active Tickets
              </h2>
              
              <div className="space-y-4">
                {sampleTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-[#1C1C1E]/40 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(ticket.status)}
                          <span className="font-jetbrains-mono text-sm text-[#00FF85]">{ticket.id}</span>
                          <Badge className={`text-xs px-2 py-1 ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-white">{ticket.title}</h3>
                        <p className="text-sm text-[#9CA3AF]">
                          Reported by {ticket.user} • {ticket.created}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#9CA3AF]">Assigned to</p>
                        <p className="text-sm text-white">{ticket.assignee}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Device Status Panel */}
          <div>
            <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-6">
              <h2 className="font-space-grotesk text-xl font-bold text-white mb-6 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-[#1E90FF]" />
                Device Status
              </h2>
              
              <div className="space-y-4">
                {sampleDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#1C1C1E]/40 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      {device.type === 'Server' ? (
                        <Server className="w-4 h-4 text-[#9CA3AF]" />
                      ) : device.type === 'Printer' ? (
                        <Monitor className="w-4 h-4 text-[#9CA3AF]" />
                      ) : (
                        <Monitor className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">{device.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{device.user}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#1C1C1E]/60 backdrop-blur-lg border border-white/10 p-6 mt-6">
              <h3 className="font-space-grotesk font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-[#1E90FF]/20 hover:bg-[#1E90FF]/30 text-[#1E90FF] border border-[#1E90FF]/30" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Team
                </Button>
                <Button className="w-full bg-[#00FF85]/20 hover:bg-[#00FF85]/30 text-[#00FF85] border border-[#00FF85]/30" size="sm">
                  <Wifi className="w-4 h-4 mr-2" />
                  Network Status
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button 
            onClick={onGetStarted}
            className="bg-[#00FF85] hover:bg-[#00E676] text-[#0E0E0E] font-space-grotesk font-semibold px-8 py-4 rounded-2xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(180deg, #0E0E0E 0%, #1A1A2E 100%)'
    }}>
      {currentView === 'selection' ? renderViewSelection() : 
       currentView === 'business-owner' ? renderTicketForm() : renderAdminDashboard()}
    </div>
  );
};