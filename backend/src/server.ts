import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

import { initDB } from './db';
import { getTodos, createTodo, deleteTodo, DBError, AuthorisationError } from './app';
import { loginHandler, authenticate } from './auth';

dotenv.config();

const app = new Hono();

// --- Middleware ---
app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

app.get('/health', (c) => c.json({ status: 'ok' }));

app.post('/login', async (c) => {
  try {
    return await loginHandler(c);
  } catch (err) {
    return handleError(c, err);
  }
});

// --- Routes ---
app.get('/todos', authenticate, async (c) => {
  try {
    const todos = await getTodos();
    return c.json(todos);
  } catch (err) {
    return handleError(c, err);
  }
});

app.post('/todos', authenticate, async (c) => {
  try {
    const { title } = await c.req.json<{ title: string }>();
    const todo = await createTodo(title);
    return c.json(todo, 201);
  } catch (err) {
    return handleError(c, err);
  }
});

app.delete('/todos/:id', authenticate, async (c) => {
  try {
    const id = c.req.param('id');
    await deleteTodo(id);
    return c.body(null, 204);
  } catch (err) {
    return handleError(c, err);
  }
});

const PORT = Number(process.env.PORT) || 4000;

(async () => {
  await initDB();
  serve({ fetch: app.fetch, port: PORT });
  console.log(`Hono backend running on http://localhost:${PORT}`);
})();

function handleError(c: any, err: unknown) {
  if (err instanceof AuthorisationError) {
    return c.json({ error: err.message }, 401);
  } else if (err instanceof DBError) {
    return c.json({ error: err.message }, 400);
  } else {
    return c.json({ error: 'unknown error' }, 500);
  }
}
