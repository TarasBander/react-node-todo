import { getDB, Todo } from './db';

export async function getTodos(): Promise<Todo[]> {
  const db = getDB();
  return await db.all<Todo[]>('SELECT * FROM todos');
}

export async function createTodo(title: string): Promise<Todo> {
  const db = getDB();
  const result = await db.run('INSERT INTO todos (title) VALUES (?)', [title]);
  return { id: result.lastID!, title, completed: 0 };
}

export async function deleteTodo(id: string): Promise<void> {
  const db = getDB();
  await db.run('DELETE FROM todos WHERE id = ?', [id]);
}
