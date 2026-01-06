import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', async (c) => {
  try {
    const devices = await kv.getByPrefix('device:');
    return c.json({ devices: devices || [] });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return c.json({ devices: [] });
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const device = {
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'offline',
      health_score: 100,
      is_online: false,
      ...body
    };
    await kv.set(`device:${id}`, device);
    return c.json({ device });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const device = await kv.get(`device:${id}`);
  if (!device) return c.json({ error: 'Not found' }, 404);
  return c.json({ device });
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const device = await kv.get(`device:${id}`);
  if (!device) return c.json({ error: 'Not found' }, 404);
  
  const updatedDevice = { ...device, ...updates, updated_at: new Date().toISOString() };
  await kv.set(`device:${id}`, updatedDevice);
  return c.json({ device: updatedDevice });
});

app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await kv.del(`device:${id}`);
  return c.json({ success: true });
});

export default app;
