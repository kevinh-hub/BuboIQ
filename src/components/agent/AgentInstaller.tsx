import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Download, Shield, Monitor, Zap, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface AgentInstallerProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  organizationName: string;
}

interface InstallStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon: React.ReactNode;
}

export function AgentInstaller({ isOpen, onClose, organizationId, organizationName }: AgentInstallerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [softwareInventory, setSoftwareInventory] = useState(true);
  const [remoteAccess, setRemoteAccess] = useState(true);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<'windows' | 'macos' | 'linux'>('windows');

  const steps: InstallStep[] = [
    {
      id: 'configure',
      title: 'Configure Agent',
      description: 'Set privacy and security preferences',
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : 'pending',
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'generate',
      title: 'Generate Code',
      description: 'Create secure enrollment credentials',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending',
      icon: <Zap className="w-4 h-4" />
    },
    {
      id: 'download',
      title: 'Download Installer',
      description: 'Get the agent installer for your platform',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending',
      icon: <Download className="w-4 h-4" />
    },
    {
      id: 'install',
      title: 'Install & Enroll',
      description: 'Run installer and connect to BuboIQ',
      status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending',
      icon: <Monitor className="w-4 h-4" />
    }
  ];

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      // Reset state when modal opens
      setEnrollmentCode('');
      setInstallProgress(0);
    }
  }, [isOpen, currentStep]);

  const generateEnrollmentCode = async () => {
    setIsGeneratingCode(true);
    try {
      // Simulate API call to generate enrollment code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate enrollment code format: ORG-YYYY-XXXXXX-CHECKSUM
      const year = new Date().getFullYear();
      const orgCode = organizationName.substring(0, 4).toUpperCase();
      const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
      const checksum = Math.random().toString(16).substring(2, 8).toUpperCase();
      
      const code = `${orgCode}-${year}-${randomHex}-${checksum}`;
      setEnrollmentCode(code);
      setCurrentStep(1);
      
      toast.success('Enrollment code generated successfully');
    } catch (error) {
      toast.error('Failed to generate enrollment code');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyEnrollmentCode = () => {
    navigator.clipboard.writeText(enrollmentCode);
    toast.success('Enrollment code copied to clipboard');
  };

  const downloadInstaller = (platform: 'windows' | 'macos' | 'linux') => {
    setSelectedPlatform(platform);
    setCurrentStep(2);
    
    // Simulate download
    toast.success(`Downloading BuboIQ Agent for ${platform}...`);
    
    // In production, this would trigger actual download
    const downloadUrls = {
      windows: '/downloads/BuboIQ-Agent-Setup-1.0.0.exe',
      macos: '/downloads/BuboIQ-Agent-1.0.0.pkg',
      linux: '/downloads/buboiq-agent_1.0.0_amd64.deb'
    };
    
    // Create download link
    const link = document.createElement('a');
    link.href = downloadUrls[platform];
    link.download = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const simulateInstallation = () => {
    setCurrentStep(3);
    setInstallProgress(0);
    
    // Simulate installation progress
    const interval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('Agent installed and enrolled successfully!');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="software-inventory">Data Collection Settings</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-surface-dark/50">
                  <div className="space-y-1">
                    <p className="font-medium">Software Inventory</p>
                    <p className="text-sm text-mist-gray">Collect installed software information for license management</p>
                  </div>
                  <Switch
                    id="software-inventory"
                    checked={softwareInventory}
                    onCheckedChange={setSoftwareInventory}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="remote-access">Remote Support Settings</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-surface-dark/50">
                  <div className="space-y-1">
                    <p className="font-medium">Enable Remote Access</p>
                    <p className="text-sm text-mist-gray">Allow IT technicians to connect for support (with user consent)</p>
                  </div>
                  <Switch
                    id="remote-access"
                    checked={remoteAccess}
                    onCheckedChange={setRemoteAccess}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-iq-neon-green/5 border-iq-neon-green/20">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-iq-neon-green mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-iq-neon-green">Privacy & Security</p>
                  <p className="text-sm text-mist-gray">
                    All data is encrypted in transit and at rest. Only authorized IT personnel in your organization can access device information.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={generateEnrollmentCode}
              disabled={isGeneratingCode}
              className="w-full bubo-btn-neon-primary"
            >
              {isGeneratingCode ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-dark-midnight border-t-transparent rounded-full animate-spin" />
                  <span>Generating Code...</span>
                </div>
              ) : (
                'Generate Enrollment Code'
              )}
            </Button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-iq-neon-green/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enrollment Code Generated</h3>
                <p className="text-mist-gray">Use this code during agent installation to connect to your organization</p>
              </div>
            </div>

            <Card className="bg-surface-dark/50 border-iq-neon-green/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wide text-mist-gray">Enrollment Code</Label>
                    <p className="text-2xl font-mono font-bold text-iq-neon-green">{enrollmentCode}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyEnrollmentCode}
                    className="border-iq-neon-green/30 hover:bg-iq-neon-green/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="p-4 border rounded-lg bg-amber-warning/5 border-amber-warning/20">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-warning mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-amber-warning">Important</p>
                  <p className="text-sm text-mist-gray">
                    This enrollment code expires in 24 hours. Keep it secure and only share with authorized personnel.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full bubo-btn-neon-primary"
            >
              Continue to Download
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Choose Your Platform</h3>
              <p className="text-mist-gray">Download the BuboIQ Agent installer for your operating system</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className="cursor-pointer hover:border-iq-neon-green/30 transition-colors bg-surface-dark/50"
                onClick={() => downloadInstaller('windows')}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-signal-blue/20 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-signal-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Windows</h4>
                    <p className="text-sm text-mist-gray">Windows 10/11 (x64)</p>
                  </div>
                  <Badge variant="secondary" className="bg-signal-blue/20 text-signal-blue">
                    MSI Installer
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-iq-neon-green/30 transition-colors bg-surface-dark/50"
                onClick={() => downloadInstaller('macos')}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-slate-gray/20 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-cloud-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">macOS</h4>
                    <p className="text-sm text-mist-gray">macOS 10.15+ (Universal)</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-gray/20 text-cloud-white">
                    PKG Installer
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:border-iq-neon-green/30 transition-colors bg-surface-dark/50"
                onClick={() => downloadInstaller('linux')}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-amber-warning/20 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-amber-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Linux</h4>
                    <p className="text-sm text-mist-gray">Ubuntu/Debian (x64)</p>
                  </div>
                  <Badge variant="secondary" className="bg-amber-warning/20 text-amber-warning">
                    DEB Package
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 border rounded-lg bg-electric-blue/5 border-electric-blue/20">
              <div className="flex items-start space-x-3">
                <Download className="w-5 h-5 text-electric-blue mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-electric-blue">Installation Instructions</p>
                  <ol className="text-sm text-mist-gray list-decimal list-inside space-y-1">
                    <li>Download the installer for your platform</li>
                    <li>Run the installer with administrator privileges</li>
                    <li>Enter the enrollment code when prompted</li>
                    <li>Complete the installation wizard</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-iq-neon-green/20 rounded-full flex items-center justify-center">
                <Monitor className="w-8 h-8 text-iq-neon-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Agent Installation</h3>
                <p className="text-mist-gray">Follow the installation wizard on your device</p>
              </div>
            </div>

            <Card className="bg-surface-dark/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Installation Progress</span>
                  <span className="text-sm text-mist-gray">{Math.round(installProgress)}%</span>
                </div>
                <Progress value={installProgress} className="h-2" />
                
                <div className="space-y-2 text-sm text-mist-gray">
                  {installProgress < 25 && <p>📦 Downloading agent binary...</p>}
                  {installProgress >= 25 && installProgress < 50 && <p>🔒 Verifying digital signature...</p>}
                  {installProgress >= 50 && installProgress < 75 && <p>⚙️ Installing system service...</p>}
                  {installProgress >= 75 && installProgress < 100 && <p>🔗 Connecting to BuboIQ...</p>}
                  {installProgress >= 100 && <p>✅ Agent installed and enrolled successfully!</p>}
                </div>
              </CardContent>
            </Card>

            {installProgress < 100 ? (
              <Button 
                onClick={simulateInstallation}
                className="w-full bubo-btn-neon-primary"
                disabled={installProgress > 0}
              >
                {installProgress > 0 ? 'Installing...' : 'Start Installation Simulation'}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  onClick={onClose}
                  className="w-full bubo-btn-neon-primary"
                >
                  Complete Setup
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open('/devices', '_blank')}
                  className="w-full border-iq-neon-green/30 hover:bg-iq-neon-green/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Devices Dashboard
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-dark-midnight border-slate-gray/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-iq-neon-green font-space-grotesk">
            Install BuboIQ Agent
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                ${step.status === 'completed' 
                  ? 'bg-iq-neon-green border-iq-neon-green text-dark-midnight' 
                  : step.status === 'active'
                  ? 'border-iq-neon-green text-iq-neon-green bg-iq-neon-green/10'
                  : 'border-slate-gray text-mist-gray'
                }
              `}>
                {step.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-0.5 mx-2 transition-all
                  ${step.status === 'completed' ? 'bg-iq-neon-green' : 'bg-slate-gray'}
                `} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}