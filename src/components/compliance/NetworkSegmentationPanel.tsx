import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Network, Shield, AlertTriangle, CheckCircle2, Search, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface NetworkZone {
  id: string;
  name: string;
  type: 'internal' | 'dmz' | 'cardholder' | 'restricted';
  description: string;
  device_count: number;
  access_rules: AccessRule[];
}

interface AccessRule {
  id: string;
  source_zone: string;
  target_zone: string;
  allowed: boolean;
  requires_mfa: boolean;
  session_recording: boolean;
}

interface Device {
  id: string;
  name: string;
  zone_id?: string;
  type: string;
  ip_address: string;
}

interface NetworkSegmentationPanelProps {
  zones: NetworkZone[];
  devices: Device[];
  onAssignZone: (deviceId: string, zoneId: string) => Promise<void>;
  onUpdateRule: (rule: AccessRule) => Promise<void>;
}

const ZONE_CONFIG = {
  internal: {
    name: 'Internal Network',
    color: 'bg-signal-blue/20 text-signal-blue border-signal-blue/30',
    icon: Network,
    description: 'General corporate network'
  },
  dmz: {
    name: 'DMZ',
    color: 'bg-amber-warning/20 text-amber-warning border-amber-warning/30',
    icon: Shield,
    description: 'Demilitarized zone for public-facing services'
  },
  cardholder: {
    name: 'Cardholder Data Environment',
    color: 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30',
    icon: Shield,
    description: 'PCI-DSS protected zone for payment data'
  },
  restricted: {
    name: 'Restricted Zone',
    color: 'bg-prediction-purple/20 text-prediction-purple border-prediction-purple/30',
    icon: Shield,
    description: 'Highly restricted access zone'
  }
};

export const NetworkSegmentationPanel: React.FC<NetworkSegmentationPanelProps> = ({
  zones,
  devices,
  onAssignZone,
  onUpdateRule
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [assigning, setAssigning] = useState<{ [key: string]: boolean }>({});
  const [selectedZone, setSelectedZone] = useState<NetworkZone | null>(null);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.ip_address.includes(searchTerm);
    const matchesZone = filterZone === 'all' || device.zone_id === filterZone;
    return matchesSearch && matchesZone;
  });

  const handleAssignZone = async (deviceId: string, zoneId: string) => {
    if (assigning[deviceId]) return;

    try {
      setAssigning(prev => ({ ...prev, [deviceId]: true }));
      await onAssignZone(deviceId, zoneId);
      
      toast.success('Zone assigned', {
        description: 'Computer has been assigned to network zone'
      });
    } catch (error) {
      toast.error('Failed to assign zone', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setAssigning(prev => ({ ...prev, [deviceId]: false }));
    }
  };

  const getDeviceZone = (device: Device) => {
    return zones.find(z => z.id === device.zone_id);
  };

  const unassignedDevices = devices.filter(d => !d.zone_id).length;

  return (
    <div className="space-y-6">
      {/* Zone Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        {zones.map((zone) => {
          const config = ZONE_CONFIG[zone.type];
          const IconComponent = config.icon;

          return (
            <Card
              key={zone.id}
              className={`
                bubo-glass cursor-pointer transition-all border
                ${selectedZone?.id === zone.id 
                  ? 'border-iq-neon-green/40 bg-iq-neon-green/5' 
                  : 'hover:border-electric-blue/40'}
              `}
              onClick={() => setSelectedZone(zone)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color.split(' ')[0]}`}>
                    <IconComponent className={`w-5 h-5 ${config.color.split(' ')[1]}`} />
                  </div>
                  <Badge className={config.color}>
                    {zone.device_count}
                  </Badge>
                </div>
                <CardTitle className="font-['Space_Grotesk'] text-sm text-pure-white">
                  {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-mist-gray">{config.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unassigned Warning */}
      {unassignedDevices > 0 && (
        <div className="bubo-glass-bright rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-warning mt-0.5" />
            <div>
              <h4 className="font-['Space_Grotesk'] text-pure-white mb-1">
                {unassignedDevices} Unassigned Computer{unassignedDevices !== 1 ? 's' : ''}
              </h4>
              <p className="text-sm text-mist-gray">
                Assign computers to network zones to enforce segmentation policies
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zone Detail View */}
      {selectedZone && (
        <Card className="bubo-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-['Space_Grotesk'] text-xl text-pure-white mb-2">
                  {selectedZone.name}
                </CardTitle>
                <p className="text-mist-gray">{ZONE_CONFIG[selectedZone.type].description}</p>
              </div>
              <Button
                onClick={() => setSelectedZone(null)}
                variant="outline"
                className="bubo-btn-ghost"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Access Rules */}
            <div>
              <h4 className="font-['Space_Grotesk'] text-pure-white mb-3">Access Rules</h4>
              <div className="space-y-2">
                {selectedZone.access_rules.map((rule) => (
                  <div key={rule.id} className="bubo-glass rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {rule.allowed ? (
                          <CheckCircle2 className="w-5 h-5 text-iq-neon-green" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-crimson-danger" />
                        )}
                        <div>
                          <p className="text-sm text-pure-white">
                            {rule.source_zone} → {rule.target_zone}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {rule.requires_mfa && (
                              <Badge className="bg-signal-blue/20 text-signal-blue text-xs">MFA Required</Badge>
                            )}
                            {rule.session_recording && (
                              <Badge className="bg-iq-neon-green/20 text-iq-neon-green text-xs">Recorded</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge className={rule.allowed ? 'bg-iq-neon-green/20 text-iq-neon-green' : 'bg-crimson-danger/20 text-crimson-danger'}>
                        {rule.allowed ? 'Allowed' : 'Blocked'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices in Zone */}
            <div>
              <h4 className="font-['Space_Grotesk'] text-pure-white mb-3">
                Computers in Zone ({devices.filter(d => d.zone_id === selectedZone.id).length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {devices.filter(d => d.zone_id === selectedZone.id).map((device) => (
                  <div key={device.id} className="bubo-glass rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-pure-white">{device.name}</p>
                      <p className="text-xs text-mist-gray">{device.ip_address} • {device.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Device Assignment */}
      <Card className="bubo-glass">
        <CardHeader>
          <CardTitle className="font-['Space_Grotesk'] text-xl text-pure-white">
            Computer Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                placeholder="Search computers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-dark border-slate-gray/30 text-cloud-white"
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              value={filterZone}
              onValueChange={setFilterZone}
            >
              <SelectTrigger className="bg-surface-dark border-slate-gray/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="">Unassigned</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Device List */}
          <div className="space-y-2">
            {filteredDevices.map((device) => {
              const currentZone = getDeviceZone(device);

              return (
                <div key={device.id} className="bubo-glass rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-pure-white mb-1">{device.name}</p>
                      <p className="text-xs text-mist-gray">{device.ip_address} • {device.type}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {currentZone && (
                        <Badge className={ZONE_CONFIG[currentZone.type].color}>
                          {currentZone.name}
                        </Badge>
                      )}
                      
                      <Select
                        value={device.zone_id || ''}
                        onValueChange={(zoneId) => handleAssignZone(device.id, zoneId)}
                        disabled={assigning[device.id]}
                      >
                        <SelectTrigger className="w-48 bg-surface-dark border-slate-gray/30">
                          <SelectValue placeholder="Assign zone..." />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map(zone => (
                            <SelectItem key={zone.id} value={zone.id}>
                              {zone.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {assigning[device.id] && (
                        <Loader2 className="w-4 h-4 text-iq-neon-green animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDevices.length === 0 && (
              <div className="text-center py-8 text-mist-gray">
                No computers found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};