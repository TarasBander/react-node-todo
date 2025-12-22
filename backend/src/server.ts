import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

import { initDB } from './db';
import { getTodos, createTodo, deleteTodo, DBError, AuthorisationError } from './app';
import { loginHandler, registerHandler, authenticate } from './auth';

dotenv.config();

const app = new Hono();

app.onError((err, c) => {
  if (err instanceof AuthorisationError) {
    return c.json({ error: err.message }, 401);
  }
  if (err instanceof DBError) {
    return c.json({ error: err.message }, 400);
  }
  console.error(err);
  return c.json({ error: 'unknown error' }, 500);
});

app.use('*', cors());
app.use('*', logger());
app.use('*', prettyJSON());

app.get('/health', (c) => c.json({ status: 'ok' }));

app.post('/register', async (c) => {
  return await registerHandler(c);
});

app.post('/login', async (c) => {
  return await loginHandler(c);
});

app.get('/todos', authenticate, async (c) => {
  const todos = await getTodos();
  return c.json(todos);
});

app.post('/todos', authenticate, async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  const todo = await createTodo(title);
  return c.json(todo, 201);
});

app.delete('/todos/:id', authenticate, async (c) => {
  const id = c.req.param('id');
  await deleteTodo(id);
  return c.body(null, 204);
});

const PORT = Number(process.env.PORT) || 4000;

(async () => {
  await initDB();
  serve({ fetch: app.fetch, port: PORT });
  console.log(`Hono backend running on http://localhost:${PORT}`);
})();
