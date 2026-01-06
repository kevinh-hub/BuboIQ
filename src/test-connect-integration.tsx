import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { connectApi } from './utils/supabase/client';
import { 
  Monitor, 
  Play, 
  Square, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export const ConnectIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testDeviceId, setTestDeviceId] = useState<string | null>(null);
  const [testSessionId, setTestSessionId] = useState<string | null>(null);

  const updateTestResult = (name: string, status: 'pending' | 'success' | 'error', message: string, data?: any) => {
    setTestResults(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.data = data;
        return [...prev];
      }
      return [...prev, { name, status, message, data }];
    });
  };

  const runConnectTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Verify Pro access
      updateTestResult('Pro Access Check', 'pending', 'Checking Pro subscription...');
      try {
        const hasProAccess = await connectApi.verifyProAccess();
        if (hasProAccess) {
          updateTestResult('Pro Access Check', 'success', 'Pro access verified');
        } else {
          updateTestResult('Pro Access Check', 'error', 'Pro subscription required for Connect features');
          return; // Stop testing if no Pro access
        }
      } catch (error: any) {
        updateTestResult('Pro Access Check', 'error', `Access check failed: ${error.message}`);
        return;
      }

      // Test 2: Get devices
      updateTestResult('Device List', 'pending', 'Fetching devices...');
      try {
        const devicesResponse = await connectApi.getDevices();
        if (devicesResponse?.devices) {
          updateTestResult('Device List', 'success', `Found ${devicesResponse.devices.length} devices`, devicesResponse.devices);
        } else {
          updateTestResult('Device List', 'error', 'No devices found or invalid response');
        }
      } catch (error: any) {
        updateTestResult('Device List', 'error', `Failed to fetch devices: ${error.message}`);
      }

      // Test 3: Add test device
      updateTestResult('Add Device', 'pending', 'Adding test device...');
      try {
        const testDevice = {
          display_name: `Test Device ${Date.now()}`,
          device_type: 'workstation' as const,
          hostname: 'test.buboiq.local',
          ip_address: '192.168.1.100',
          operating_system: 'Windows 11 Pro',
          tags: ['test', 'automated'],
          location: 'Test Lab',
          department: 'QA Testing',
          owner_email: 'test@buboiq.com',
          metadata: {
            test: true,
            created_by: 'integration_test'
          }
        };

        const deviceResponse = await connectApi.addDevice(testDevice);
        if (deviceResponse?.device) {
          setTestDeviceId(deviceResponse.device.id);
          updateTestResult('Add Device', 'success', `Device created with ID: ${deviceResponse.device.id}`, deviceResponse.device);
        } else {
          updateTestResult('Add Device', 'error', 'Failed to create device - no response data');
        }
      } catch (error: any) {
        updateTestResult('Add Device', 'error', `Failed to create device: ${error.message}`);
      }

      // Test 4: Create session (if device was created)
      if (testDeviceId) {
        updateTestResult('Create Session', 'pending', 'Creating remote session...');
        try {
          const sessionResponse = await connectApi.createSession({
            device_id: testDeviceId,
            ticket_id: 'TEST-001',
            session_type: 'remote_desktop',
            provider: 'rustdesk'
          });

          if (sessionResponse?.session) {
            setTestSessionId(sessionResponse.session.id);
            updateTestResult('Create Session', 'success', `Session created: ${sessionResponse.session.id}`, sessionResponse.session);
          } else {
            updateTestResult('Create Session', 'error', 'Failed to create session - no response data');
          }
        } catch (error: any) {
          updateTestResult('Create Session', 'error', `Failed to create session: ${error.message}`);
        }
      }

      // Test 5: Get session details (if session was created)
      if (testSessionId) {
        updateTestResult('Session Details', 'pending', 'Fetching session details...');
        try {
          const sessionResponse = await connectApi.getSession(testSessionId);
          if (sessionResponse?.session) {
            updateTestResult('Session Details', 'success', `Session details retrieved`, sessionResponse.session);
          } else {
            updateTestResult('Session Details', 'error', 'Failed to get session details');
          }
        } catch (error: any) {
          updateTestResult('Session Details', 'error', `Failed to get session: ${error.message}`);
        }
      }

      // Test 6: Get all sessions
      updateTestResult('Sessions List', 'pending', 'Fetching all sessions...');
      try {
        const sessionsResponse = await connectApi.getSessions();
        if (sessionsResponse?.sessions) {
          updateTestResult('Sessions List', 'success', `Found ${sessionsResponse.sessions.length} sessions`, sessionsResponse.sessions);
        } else {
          updateTestResult('Sessions List', 'error', 'Failed to fetch sessions list');
        }
      } catch (error: any) {
        updateTestResult('Sessions List', 'error', `Failed to fetch sessions: ${error.message}`);
      }

      // Test 7: Get audit logs
      updateTestResult('Audit Logs', 'pending', 'Fetching audit logs...');
      try {
        const auditResponse = await connectApi.getAuditLogs(10, 0);
        if (auditResponse?.audit_logs) {
          updateTestResult('Audit Logs', 'success', `Found ${auditResponse.audit_logs.length} audit entries`, auditResponse.audit_logs);
        } else {
          updateTestResult('Audit Logs', 'error', 'Failed to fetch audit logs');
        }
      } catch (error: any) {
        updateTestResult('Audit Logs', 'error', `Failed to fetch audit logs: ${error.message}`);
      }

      // Test 8: End session (if session was created)
      if (testSessionId) {
        updateTestResult('End Session', 'pending', 'Ending remote session...');
        try {
          const endResponse = await connectApi.endSession(testSessionId, 'test_completed');
          updateTestResult('End Session', 'success', 'Session ended successfully', endResponse);
        } catch (error: any) {
          updateTestResult('End Session', 'error', `Failed to end session: ${error.message}`);
        }
      }

      // Test 9: Update device (if device was created)
      if (testDeviceId) {
        updateTestResult('Update Device', 'pending', 'Updating device...');
        try {
          const updateResponse = await connectApi.updateDevice(testDeviceId, {
            tags: ['test', 'automated', 'updated'],
            metadata: {
              test: true,
              updated_by: 'integration_test',
              updated_at: new Date().toISOString()
            }
          });
          if (updateResponse?.device) {
            updateTestResult('Update Device', 'success', 'Device updated successfully', updateResponse.device);
          } else {
            updateTestResult('Update Device', 'error', 'Failed to update device');
          }
        } catch (error: any) {
          updateTestResult('Update Device', 'error', `Failed to update device: ${error.message}`);
        }
      }

      // Test 10: Delete device (cleanup)
      if (testDeviceId) {
        updateTestResult('Delete Device', 'pending', 'Cleaning up test device...');
        try {
          await connectApi.deleteDevice(testDeviceId);
          updateTestResult('Delete Device', 'success', 'Test device deleted successfully');
          setTestDeviceId(null);
        } catch (error: any) {
          updateTestResult('Delete Device', 'error', `Failed to delete device: ${error.message}`);
        }
      }

    } catch (error: any) {
      updateTestResult('General Error', 'error', `Test suite failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 text-amber-warning animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-iq-neon-green" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-crimson-danger" />;
      default:
        return <Monitor className="w-4 h-4 text-mist-gray" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-iq-neon-green/20 text-iq-neon-green border-iq-neon-green/30';
      case 'error':
        return 'bg-crimson-danger/20 text-crimson-danger border-crimson-danger/30';
      case 'pending':
        return 'bg-amber-warning/20 text-amber-warning border-amber-warning/30';
      default:
        return 'bg-mist-gray/20 text-mist-gray border-mist-gray/30';
    }
  };

  const successCount = testResults.filter(t => t.status === 'success').length;
  const errorCount = testResults.filter(t => t.status === 'error').length;
  const pendingCount = testResults.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-dark-midnight p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bubo-glass border-iq-neon-green/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="w-8 h-8 text-iq-neon-green" />
                <div>
                  <CardTitle className="text-pure-white font-space-grotesk text-2xl">
                    Bubo<span className="text-iq-neon-green">IQ</span> Connect Integration Test
                  </CardTitle>
                  <p className="text-mist-gray mt-1">
                    Complete testing of Connect API functionality
                  </p>
                </div>
              </div>
              <Button
                onClick={runConnectTests}
                disabled={isRunning}
                className="bubo-btn-neon-primary"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bubo-glass border-iq-neon-green/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-iq-neon-green/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-iq-neon-green" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pure-white">{successCount}</div>
                    <div className="text-sm text-mist-gray">Passed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bubo-glass border-iq-neon-green/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-crimson-danger/20 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-crimson-danger" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pure-white">{errorCount}</div>
                    <div className="text-sm text-mist-gray">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bubo-glass border-iq-neon-green/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-warning/20 rounded-lg flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-amber-warning" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pure-white">{pendingCount}</div>
                    <div className="text-sm text-mist-gray">Running</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bubo-glass border-iq-neon-green/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-electric-blue/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-pure-white">{testResults.length}</div>
                    <div className="text-sm text-mist-gray">Total Tests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Results */}
        <Card className="bubo-glass border-iq-neon-green/20">
          <CardHeader>
            <CardTitle className="text-pure-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-iq-neon-green" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 text-mist-gray mx-auto mb-4" />
                <h3 className="font-space-grotesk text-xl font-bold text-pure-white mb-2">
                  Ready to Test
                </h3>
                <p className="text-mist-gray">
                  Click "Run Tests" to start the BuboIQ Connect integration test suite
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-surface-dark/50 rounded-xl">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(result.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-pure-white font-medium">{result.name}</h4>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-mist-gray text-sm">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-iq-neon-green text-sm cursor-pointer hover:underline">
                            View Data
                          </summary>
                          <pre className="mt-2 p-3 bg-neural-black/50 rounded-lg text-xs text-cloud-white overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="bubo-glass border-iq-neon-green/20">
          <CardHeader>
            <CardTitle className="text-pure-white">API Endpoints Tested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-iq-neon-green font-medium mb-2">Device Management</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>• GET /connect/devices - List devices</li>
                  <li>• POST /connect/devices - Add device</li>
                  <li>• PUT /connect/devices/:id - Update device</li>
                  <li>• DELETE /connect/devices/:id - Remove device</li>
                </ul>
              </div>
              <div>
                <h4 className="text-iq-neon-green font-medium mb-2">Session Management</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>• POST /connect/sessions - Create session</li>
                  <li>• GET /connect/sessions/:id - Get session</li>
                  <li>• GET /connect/sessions - List sessions</li>
                  <li>• DELETE /connect/sessions/:id - End session</li>
                </ul>
              </div>
              <div>
                <h4 className="text-iq-neon-green font-medium mb-2">Security & Audit</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>• GET /connect/audit - Audit logs</li>
                  <li>• POST /auth/me - Verify Pro access</li>
                </ul>
              </div>
              <div>
                <h4 className="text-iq-neon-green font-medium mb-2">Features Tested</h4>
                <ul className="space-y-1 text-mist-gray">
                  <li>• Pro tier verification</li>
                  <li>• RLS security policies</li>
                  <li>• Audit logging</li>
                  <li>• Session lifecycle</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectIntegrationTest;