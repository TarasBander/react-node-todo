import type { Context, Next } from 'hono';
import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthorisationError } from './app';

dotenv.config();

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev_secret';
const AUTH_USERNAME = process.env.AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] =
  (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1h';

export async function loginHandler(c: Context) {
  const { username, password } = await c.req.json<{ username: string; password: string }>();

  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    throw new AuthorisationError('Invalid credentials');
  }

  const payload = { sub: username };

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
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload | string;
    c.set('user', payload);
    await next();
  } catch (err) {
    throw new AuthorisationError('Invalid or expired token');
  }
}
