import { getDB } from './db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  email?: string | null;
}

export async function createUser(username: string, password: string, email?: string): Promise<User> {
  const db = getDB();
  const password_hash = await bcrypt.hash(password, 10);

  const result = await db.run(
    `INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)`,
    username,
    password_hash,
    email || null
  );

  const id = result.lastID!;
  const row = await db.get<User>('SELECT * FROM users WHERE id = ?', id);
  if (!row) {
    throw new Error('Failed to fetch created user');
  }
  return row;
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  const db = getDB();
  const row = await db.get<User>('SELECT * FROM users WHERE username = ?', username);
  return row || undefined;
}

export async function findUserById(id: number): Promise<User | undefined> {
  const db = getDB();
  const row = await db.get<User>('SELECT * FROM users WHERE id = ?', id);
  return row || undefined;
}
