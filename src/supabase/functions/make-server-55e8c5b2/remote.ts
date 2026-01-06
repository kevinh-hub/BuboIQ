import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const remote = new Hono();

// CORS middleware
remote.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Basic remote support endpoints
remote.get('/providers', async (c) => {
  return c.json({
    success: true,
    providers: [
      {
        id: 'splashtop',
        name: 'Splashtop',
        status: 'available',
        capabilities: ['adhoc', 'managed', 'recording']
      },
      {
        id: 'screenconnect',
        name: 'ScreenConnect',
        status: 'available',
        capabilities: ['session_control', 'audit_logs', 'recording']
      }
    ]
  });
});

remote.post('/providers/:providerId/sessions', async (c) => {
  const providerId = c.req.param('providerId');
  
  return c.json({
    success: true,
    message: `Remote session initiated with ${providerId}`,
    sessionId: `session_${Date.now()}`
  });
});

export default remote;
