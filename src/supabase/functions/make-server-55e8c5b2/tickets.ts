import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());

app.get('/', async (c) => {
  try {
    const tickets = await kv.getByPrefix('ticket:');
    // Sort by created_at desc
    tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return c.json({ tickets: tickets || [] });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return c.json({ tickets: [] });
  }
});

app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const ticket = {
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'open',
      ...body
    };
    await kv.set(`ticket:${id}`, ticket);
    return c.json({ ticket });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

app.get('/:id', async (c) => {
  const id = c.req.param('id');
  const ticket = await kv.get(`ticket:${id}`);
  if (!ticket) return c.json({ error: 'Not found' }, 404);
  return c.json({ ticket });
});

app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const updates = await c.req.json();
  const ticket = await kv.get(`ticket:${id}`);
  if (!ticket) return c.json({ error: 'Not found' }, 404);
  
  const updatedTicket = { ...ticket, ...updates, updated_at: new Date().toISOString() };
  await kv.set(`ticket:${id}`, updatedTicket);
  return c.json({ ticket: updatedTicket });
});

export default app;
