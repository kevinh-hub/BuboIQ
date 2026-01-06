import React, { useState } from 'react';
import { Monitor, Server, Smartphone, Laptop } from 'lucide-react';
import { ConnectButton } from './ConnectButton';
import { RemoteSessionModal } from './RemoteSessionModal';
import { UpgradeGuardOverlay } from './UpgradeGuardOverlay';

interface Device {
  id: string;
  name: string;
  type: 'laptop' | 'desktop' | 'server' | 'mobile';
  status: 'online' | 'offline' | 'unknown';
  lastSeen?: string;
}

interface TicketConnectPanelProps {
  ticketId: string;
  userTier: 'basic' | 'pro';
  devices?: Device[];
  onUpgrade: () => void;
}

export const TicketConnectPanel: React.FC<TicketConnectPanelProps> = ({
  ticketId,
  userTier,
  devices = [],
  onUpgrade
}) => {
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showUpgradeGuard, setShowUpgradeGuard] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  // Mock devices if none provided
  const mockDevices: Device[] = devices.length > 0 ? devices : [
    {
      id: 'device-1',
      name: 'CORP-LAPTOP-847',
      type: 'laptop',
      status: 'online',
      lastSeen: '2 minutes ago'
    },
    {
      id: 'device-2', 
      name: 'DEV-WORKSTATION',
      type: 'desktop',
      status: 'online',
      lastSeen: 'now'
    },
    {
      id: 'device-3',
      name: 'PROD-SERVER-01',
      type: 'server',
      status: 'offline',
      lastSeen: '45 minutes ago'
    }
  ];

  const handleConnectClick = (deviceId?: string) => {
    if (userTier === 'basic') {
      setShowUpgradeGuard(true);
    } else {
      setSelectedDevice(deviceId || null);
      setShowSessionModal(true);
    }
  };

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'laptop':
        return <Laptop className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'server':
        return <Server className="w-4 h-4" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return 'text-iq-neon-green';
      case 'offline':
        return 'text-mist-gray';
      case 'unknown':
        return 'text-amber-warning';
      default:
        return 'text-mist-gray';
    }
  };

  return (
    <>
      <div className="bubo-glass rounded-2xl p-6 border border-iq-neon-green/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-iq-neon-green/20 rounded-xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-iq-neon-green" />
            </div>
            <div>
              <h3 className="font-space-grotesk text-lg font-bold text-pure-white">
                Remote Access
              </h3>
              <p className="text-mist-gray text-sm">
                Connect to devices related to this ticket
              </p>
            </div>
          </div>
          
          <ConnectButton
            userTier={userTier}
            onClick={() => handleConnectClick()}
            size="md"
            variant="primary"
          />
        </div>

        {/* Device List */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-mist-gray mb-3">
            Available Devices ({mockDevices.filter(d => d.status === 'online').length} online)
          </h4>
          
          {mockDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 bg-surface-dark/50 rounded-xl border border-iq-neon-green/10"
            >
              <div className="flex items-center space-x-3">
                <div className={`${getStatusColor(device.status)}`}>
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <div className="font-medium text-pure-white text-sm">
                    {device.name}
                  </div>
                  <div className="text-xs text-mist-gray">
                    {device.status === 'online' ? 'Online' : 'Offline'} • {device.lastSeen}
                  </div>
                </div>
              </div>
              
              <ConnectButton
                userTier={userTier}
                onClick={() => handleConnectClick(device.id)}
                size="sm"
                variant="secondary"
                disabled={device.status !== 'online'}
                className="min-w-[120px]"
              />
            </div>
          ))}
        </div>

        {/* Pro Benefits for Basic Users */}
        {userTier === 'basic' && (
          <div className="mt-6 pt-6 border-t border-iq-neon-green/10">
            <div className="bg-iq-neon-green/5 border border-iq-neon-green/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Monitor className="w-5 h-5 text-iq-neon-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-iq-neon-green font-medium text-sm mb-1">
                    Unlock Instant Remote Access
                  </p>
                  <p className="text-mist-gray text-xs">
                    Connect to any device in seconds. Fix issues without switching tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <RemoteSessionModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        ticketId={ticketId}
        deviceId={selectedDevice || undefined}
      />

      <UpgradeGuardOverlay
        isOpen={showUpgradeGuard}
        onClose={() => setShowUpgradeGuard(false)}
        onUpgrade={onUpgrade}
        featureName="Remote Access"
      />
    </>
  );
};