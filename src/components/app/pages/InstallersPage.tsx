import React, { useState, useEffect } from 'react';
import { Download, Shield, CheckCircle2, AlertCircle, Loader2, Monitor, Apple, Server } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

interface InstallerArtifact {
  platform: string;
  architecture: string;
  filename: string;
  downloadUrl: string;
  checksum: string | null;
  version: string | null;
  published: boolean;
}

export const InstallersPage: React.FC = () => {
  const [installers, setInstallers] = useState<InstallerArtifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInstallers();
  }, []);

  const loadInstallers = async () => {
    try {
      setLoading(true);
      setError(null);

      // In production, this would query Supabase Storage or a releases bucket
      // For now, define the expected artifacts structure
      const expectedInstallers: InstallerArtifact[] = [
        {
          platform: 'Windows',
          architecture: 'x64',
          filename: 'buboiq-agent-windows-x64.exe',
          downloadUrl: '', // Will be populated from storage
          checksum: null,
          version: null,
          published: false
        },
        {
          platform: 'macOS',
          architecture: 'arm64',
          filename: 'buboiq-agent-macos-arm64.pkg',
          downloadUrl: '',
          checksum: null,
          version: null,
          published: false
        },
        {
          platform: 'macOS',
          architecture: 'x64',
          filename: 'buboiq-agent-macos-x64.pkg',
          downloadUrl: '',
          checksum: null,
          version: null,
          published: false
        },
        {
          platform: 'Linux',
          architecture: 'x64',
          filename: 'buboiq-agent-linux-x64.deb',
          downloadUrl: '',
          checksum: null,
          version: null,
          published: false
        }
      ];

      // TODO: Query actual artifacts from Supabase Storage bucket
      // const { data, error } = await supabase.storage.from('agent-releases').list();

      setInstallers(expectedInstallers);
    } catch (err: any) {
      console.error('Failed to load installers:', err);
      setError(err.message || 'Couldn\'t load installers');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Windows':
        return <Monitor className="w-8 h-8 text-electric-blue" />;
      case 'macOS':
        return <Apple className="w-8 h-8 text-mist-gray" />;
      case 'Linux':
        return <Server className="w-8 h-8 text-iq-neon-green" />;
      default:
        return <Monitor className="w-8 h-8 text-mist-gray" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-['Space_Grotesk']">
          <span className="text-white">Agent </span>
          <span className="text-iq-neon-green">Installers</span>
        </h1>
        <p className="text-mist-gray text-lg">
          Download and deploy BuboIQ agents across your managed devices
        </p>
      </div>

      {/* Instructions Card */}
      <Card className="bubo-glass border-iq-neon-green/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pure-white">
            <Shield className="w-5 h-5 text-iq-neon-green" />
            Deployment Instructions
          </CardTitle>
          <CardDescription className="text-cloud-white">
            Follow these steps to install agents on your managed devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-mist-gray">
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 mt-0.5">
              1
            </Badge>
            <p>Download the appropriate installer for your target platform and architecture</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 mt-0.5">
              2
            </Badge>
            <p>Verify the checksum to ensure file integrity (if provided)</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 mt-0.5">
              3
            </Badge>
            <p>Deploy using your RMM tool or run the installer directly on the target device</p>
          </div>
          <div className="flex items-start gap-2">
            <Badge variant="outline" className="bg-iq-neon-green/10 text-iq-neon-green border-iq-neon-green/30 mt-0.5">
              4
            </Badge>
            <p>Agents will auto-register and appear in your Devices dashboard within 2-3 minutes</p>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-iq-neon-green animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-crimson-danger/30 bg-crimson-danger/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-crimson-danger">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Installers Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {installers.map((installer, index) => (
            <Card
              key={index}
              className={`bubo-glass ${
                installer.published
                  ? 'border-iq-neon-green/20 hover:border-iq-neon-green/40'
                  : 'border-slate-gray/20 opacity-75'
              } transition-all duration-300`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(installer.platform)}
                    <div>
                      <CardTitle className="text-pure-white">
                        {installer.platform}
                      </CardTitle>
                      <CardDescription className="text-mist-gray">
                        {installer.architecture}
                      </CardDescription>
                    </div>
                  </div>
                  {installer.published ? (
                    <Badge className="bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-gray/20 text-mist-gray border-slate-gray/30">
                      Not Published
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filename */}
                <div className="space-y-1">
                  <p className="text-xs text-mist-gray">Filename</p>
                  <p className="text-sm font-mono text-cloud-white">
                    {installer.filename}
                  </p>
                </div>

                {/* Version */}
                {installer.version && (
                  <div className="space-y-1">
                    <p className="text-xs text-mist-gray">Version</p>
                    <p className="text-sm font-mono text-cloud-white">
                      {installer.version}
                    </p>
                  </div>
                )}

                {/* Checksum */}
                <div className="space-y-1">
                  <p className="text-xs text-mist-gray">SHA-256 Checksum</p>
                  {installer.checksum ? (
                    <p className="text-xs font-mono text-cloud-white break-all">
                      {installer.checksum}
                    </p>
                  ) : (
                    <p className="text-xs text-mist-gray italic">
                      Not available yet
                    </p>
                  )}
                </div>

                {/* Download Button */}
                {installer.published ? (
                  <Button
                    className="w-full bubo-btn-neon-primary"
                    onClick={() => {
                      if (installer.downloadUrl) {
                        window.open(installer.downloadUrl, '_blank');
                      }
                    }}
                    disabled={!installer.downloadUrl}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                ) : (
                  <Button
                    className="w-full bubo-btn-secondary"
                    disabled
                  >
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Support Footer */}
      <Card className="bubo-glass border-electric-blue/20">
        <CardContent className="pt-6">
          <p className="text-sm text-mist-gray text-center">
            Need help with agent deployment?{' '}
            <a
              href="mailto:support@buboiq.com"
              className="text-iq-neon-green hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};