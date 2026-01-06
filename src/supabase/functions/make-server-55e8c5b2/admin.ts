import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/metrics', async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    const devices = await kv.getByPrefix('device:');
    
    const metrics = {
      totalUsers: users.length,
      totalOrgs: 1, // Single org for now
      mrr: users.length * 50 + devices.length * 10, // Mock calc
      activeSessions: Math.floor(Math.random() * 20)
    };
    
    return c.json(metrics);
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return c.json({
      totalUsers: 0,
      totalOrgs: 0,
      mrr: 0,
      activeSessions: 0
    });
  }
});

export default app;
