import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/dashboard', async (c) => {
  // Return empty success structure since the frontend calculates metrics from other endpoints
  // The frontend expects this call to succeed to consider the dashboard loaded.
  return c.json({ 
    success: true,
    timestamp: new Date().toISOString()
  });
});

app.get('/tickets', async (c) => {
  // Mock metrics
  return c.json({ 
    total: 0,
    open: 0,
    resolved: 0
  });
});

app.get('/devices', async (c) => {
  // Mock metrics
  return c.json({ 
    total: 0,
    online: 0,
    offline: 0
  });
});

app.get('/system', async (c) => {
  return c.json({ 
    status: 'healthy',
    uptime: 99.9
  });
});

export default app;
