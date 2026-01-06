import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { createConnectService } from '../../supabase/functions/server/connect';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const connectService = createConnectService(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getDevices(req, res);
  } else if (req.method === 'POST') {
    return addDevice(req, res);
  } else if (req.method === 'PUT') {
    return updateDevice(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getDevices(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    // Get devices using connect service
    const { data: devices, error } = await connectService.getDevices(user.id);

    if (error) {
      if (error.code === 'SUBSCRIPTION_REQUIRED') {
        return res.status(403).json({ error: 'Pro subscription required for Connect access' });
      }
      return res.status(400).json({ error: error.message || 'Failed to get devices' });
    }

    res.status(200).json(devices);
  } catch (error: any) {
    console.error('Error getting devices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addDevice(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    const deviceData = req.body;

    if (!deviceData.display_name) {
      return res.status(400).json({ error: 'display_name is required' });
    }

    // Add device using connect service
    const { data: device, error } = await connectService.addDevice(user.id, deviceData);

    if (error) {
      if (error.code === 'SUBSCRIPTION_REQUIRED') {
        return res.status(403).json({ error: 'Pro subscription required for Connect access' });
      }
      return res.status(400).json({ error: error.message || 'Failed to add device' });
    }

    res.status(201).json(device);
  } catch (error: any) {
    console.error('Error adding device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDevice(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get user from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization required' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    const { device_id, ...updates } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    // Update device using connect service
    const { data: device, error } = await connectService.updateDevice(user.id, device_id, updates);

    if (error) {
      return res.status(400).json({ error: error.message || 'Failed to update device' });
    }

    res.status(200).json(device);
  } catch (error: any) {
    console.error('Error updating device:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}