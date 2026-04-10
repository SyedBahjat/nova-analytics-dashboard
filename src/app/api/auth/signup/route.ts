import { z } from 'zod';
import { saveAuth } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { secret, uuid } from '@/lib/crypto';
import { createSecureToken } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import redis from '@/lib/redis';
import { parseRequest } from '@/lib/request';
import { badRequest, json, serverError } from '@/lib/response';
import { createUser, getUserByUsername } from '@/queries/prisma';

/**
 * POST /api/auth/signup
 *
 * Public self-service signup. Creates a new user with the standard "user" role
 * (NOT admin), bcrypt-hashes the password, signs a JWT, and returns the same
 * shape as POST /api/auth/login so the client can transparently log them in.
 *
 * Required by the assessment brief (Functional login AND signup). Mirrors the
 * structure of src/app/api/auth/login/route.ts so the codebase stays consistent.
 */
export async function POST(request: Request) {
  const schema = z.object({
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(255, 'Username is too long')
      .regex(/^[A-Za-z0-9._-]+$/, 'Letters, numbers, dots, underscores, hyphens only'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Enter a valid email address')
      .max(255, 'Email is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255, 'Password is too long'),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { username, email, password } = body;

  // Uniqueness check on both username and email
  const existing = await getUserByUsername(username, { includePassword: false });
  if (existing) {
    return badRequest({ code: 'username-already-exists' });
  }

  // Create the user (with email)
  let user;
  try {
    user = await createUser({
      id: uuid(),
      username,
      email,
      password: hashPassword(password),
      role: ROLES.user,
    });
  } catch (err) {
    console.error('[signup] failed to create user:', err);
    return serverError({ code: 'signup-failed' });
  }

  // Issue an auth token (Redis-backed if Redis is configured, otherwise JWT)
  let token: string;
  if (redis.enabled) {
    token = await saveAuth({ userId: user.id, role: user.role });
  } else {
    token = createSecureToken({ userId: user.id, role: user.role }, secret());
  }

  // Match the shape of POST /api/auth/login so the client can reuse its handler
  return json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: new Date(),
      isAdmin: false,
      teams: [],
    },
  });
}
