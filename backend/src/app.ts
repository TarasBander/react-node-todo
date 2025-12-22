import { getDB, Todo } from './db';

export class DBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DBError';
  }
}

export class AuthorisationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorisationError';
  }
}

interface TodoRow {
  id: number;
  title: string;
  completed: number;
}

export async function getTodos(): Promise<Todo[]> {
  try {
    const db = getDB();
    const rows = await db.all<TodoRow[]>('SELECT * FROM todos');
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      completed: !!row.completed,
    }));
  } catch (err: any) {
    throw new DBError(err?.message || 'Failed to fetch todos');
  }
}

export async function createTodo(title: string): Promise<Todo> {
  if (!title || !title.trim()) {
    throw new DBError('Title is required');
  }

  try {
    const db = getDB();
    const result = await db.run(
      'INSERT INTO todos (title, completed) VALUES (?, ?)',
      title,
      0
    );
    const id = result.lastID!;
    return { id, title, completed: false };
  } catch (err: any) {
    throw new DBError(err?.message || 'Failed to create todo');
  }
}

export async function deleteTodo(id: string): Promise<void> {
  try {
    const db = getDB();
    const result = await db.run('DELETE FROM todos WHERE id = ?', id);
    if (result.changes === 0) {
      throw new DBError('Todo not found');
    }
  } catch (err: any) {
    if (err instanceof DBError) throw err;
    throw new DBError(err?.message || 'Failed to delete todo');
  }
}
