import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

export interface Todo {
  id: number;
  title: string;
  completed: number;
}

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initDB() {
  db = await open({
    filename: process.env.DATABASE_PATH ?? './database.db',
    driver: sqlite3.Database,
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    )
  `);

  console.log('Database initialized');
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
