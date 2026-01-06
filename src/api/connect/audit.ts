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
    return getAuditLogs(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getAuditLogs(req: NextApiRequest, res: NextApiResponse) {
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

    const limit = parseInt(req.query.limit as string) || 100;

    // Get audit logs using connect service
    const { data: logs, error } = await connectService.getAuditLogs(user.id, limit);

    if (error) {
      return res.status(400).json({ error: error.message || 'Failed to get audit logs' });
    }

    res.status(200).json(logs);
  } catch (error: any) {
    console.error('Error getting audit logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}