import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
import { initDB } from './db';
import { getTodos, createTodo, deleteTodo } from './app';

const app = new Hono();

// --- Middleware ---
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

// --- Routes ---
app.get('/todos', async (c) => {
  try {
    const todos = await getTodos();
    return c.json(todos);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/todos', async (c) => {
  try {
    const body = await c.req.json<{ title?: string }>();
    if (!body.title) return c.json({ error: 'Title is required' }, 400);

    const newTodo = await createTodo(body.title);
    return c.json(newTodo, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/todos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await deleteTodo(id);
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

const PORT = 4000;
(async () => {
  await initDB();
  serve({ fetch: app.fetch, port: PORT });
  console.log(`Hono backend running on http://localhost:${PORT}`);
})();
