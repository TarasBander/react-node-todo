import { getDB, Todo } from './db';

export async function getTodos(): Promise<Todo[]> {
  const db = getDB();
  try {
    return await db.all<Todo[]>('SELECT * FROM todos');
  } catch (err) {
    throw new DBError(`can't select`);
  }
}

export async function createTodo(title: string): Promise<Todo> {
  const db = getDB();
  try {
    const result = await 
    db.run('INSERT INTO todos (title) VALUES (?)', [title]);
    return { id: result.lastID!, title, completed: 0 };
  } catch (err) {
    throw new DBError(`can't insert`);
  }
}

export async function deleteTodo(id: string): Promise<void> {
  const db = getDB();
  try {
    await db.run('DELETE FROM todos WHERE id = ?', [id]);
  } catch (err) {
    throw new DBError(`can't delete`);
  }
}

export class DBError extends Error {}

export class AuthorisationError extends Error {}

