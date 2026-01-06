import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const integrations = new Hono();

// CORS middleware
integrations.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization', 'X-BuboIQ-Signature', 'X-API-Key'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Get all supported integrations
integrations.get('/providers', async (c) => {
  return c.json({
    success: true,
    integrations: [
      {
        id: 'slack',
        name: 'Slack',
        category: 'popular',
        status: 'active'
      },
      {
        id: 'jira',
        name: 'Jira',
        category: 'popular',
        status: 'active'
      },
      {
        id: 'zendesk',
        name: 'Zendesk',
        category: 'popular',
        status: 'active'
      }
    ]
  });
});

// Handle incoming webhooks
integrations.post('/webhooks/:providerId', async (c) => {
  const providerId = c.req.param('providerId');
  const body = await c.req.json();
  
  console.log(`Received webhook from ${providerId}:`, body);
  
  return c.json({
    success: true,
    message: 'Webhook processed successfully'
  });
});

export default integrations;
