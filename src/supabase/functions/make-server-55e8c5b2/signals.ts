import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', async (c) => {
  try {
    const signals = await kv.getByPrefix('signal:');
    return c.json({ signals: signals || [] });
  } catch (error) {
    console.error('Error fetching signals:', error);
    return c.json({ signals: [] });
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const signal = {
      id,
      created_at: new Date().toISOString(),
      status: 'open',
      ...body
    };
    await kv.set(`signal:${id}`, signal);
    return c.json({ signal });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const signal = await kv.get(`signal:${id}`);
  if (!signal) return c.json({ error: 'Not found' }, 404);
  return c.json({ signal });
});

export default app;
