import type { Context, Next } from 'hono';
import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthorisationError } from './app';
import { createUser, findUserByUsername, findUserById, User } from './users';
import bcrypt from 'bcryptjs';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h';

export async function registerHandler(c: Context) {
  const { username, password, email } = await c.req.json<{
    username: string;
    password: string;
    email?: string;
  }>();

  if (!username || !password) {
    return c.json({ error: 'username and password are required' }, 400);
  }

  const existing = await findUserByUsername(username);
  if (existing) {
    return c.json({ error: 'User already exists' }, 409);
  }

  const user = await createUser(username, password, email);
  return c.json({ id: user.id, username: user.username, email: user.email }, 201);
}

export async function loginHandler(c: Context) {
  const { username, password } = await c.req.json<{ username: string; password: string }>();

  const user = await findUserByUsername(username);
  if (!user) {
    throw new AuthorisationError('Invalid credentials');
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    throw new AuthorisationError('Invalid credentials');
  }

  const payload = { sub: user.id, username: user.username };

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  const token = jwt.sign(payload, JWT_SECRET, signOptions);

  return c.json({ token });
}

// middleware authentificate
export async function authenticate(c: Context, next: Next) {
  const authHeader = c.req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthorisationError('Not authenticated');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!payload.sub) {
      throw new AuthorisationError('Invalid token payload');
    }

    const userId = Number(payload.sub);
    const user: User | undefined = await findUserById(userId);
    if (!user) {
      throw new AuthorisationError('User not found');
    }

    c.set('user', user);

    await next();
  } catch (err) {
    throw new AuthorisationError('Invalid or expired token');
  }
}
