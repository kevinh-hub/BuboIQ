import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', async (c) => {
  try {
    // For MVP/KV store, we might store users individually
    // But we also have 'user_email:...' mappings.
    // Ideally we should have a list.
    // Since KV doesn't support list well without prefixes, let's try prefix.
    const users = await kv.getByPrefix('user:');
    // Filter out index keys if any (keys that are not user objects)
    // The 'user:ID' keys store the profile.
    
    return c.json({ users: users || [] });
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ users: [] });
  }
});

app.get('/profile', async (c) => {
  // Profile update logic would go here
  return c.json({ message: "Profile endpoint" });
});

export default app;
