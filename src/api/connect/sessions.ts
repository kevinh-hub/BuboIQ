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
  if (req.method === 'POST') {
    return createSession(req, res);
  } else if (req.method === 'GET') {
    return getSessions(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function createSession(req: NextApiRequest, res: NextApiResponse) {
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

    const { device_id, ticket_id, provider = 'rustdesk' } = req.body;

    if (!device_id) {
      return res.status(400).json({ error: 'device_id is required' });
    }

    // Create session using connect service
    const { data: session, error } = await connectService.createSession(
      user.id,
      device_id,
      ticket_id,
      provider
    );

    if (error) {
      if (error.code === 'SUBSCRIPTION_REQUIRED') {
        return res.status(403).json({ error: 'Pro subscription required for Connect access' });
      }
      return res.status(400).json({ error: error.message || 'Failed to create session' });
    }

    res.status(201).json(session);
  } catch (error: any) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getSessions(req: NextApiRequest, res: NextApiResponse) {
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

    const limit = parseInt(req.query.limit as string) || 50;

    // Get sessions using connect service
    const { data: sessions, error } = await connectService.getSessions(user.id, limit);

    if (error) {
      return res.status(400).json({ error: error.message || 'Failed to get sessions' });
    }

    res.status(200).json(sessions);
  } catch (error: any) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}