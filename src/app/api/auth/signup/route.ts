import { z } from 'zod';
import { saveAuth } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { secret, uuid } from '@/lib/crypto';
import { createSecureToken } from '@/lib/jwt';
import { hashPassword } from '@/lib/password';
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit';
import redis from '@/lib/redis';
import { parseRequest } from '@/lib/request';
import { json, ok, serverError } from '@/lib/response';
import { createUser, getUserByUsername } from '@/queries/prisma';

/**
 * POST /api/auth/signup
 *
 * Public self-service signup. Layered defenses (in order):
 *
 *   1. Per-IP rate limit         → blocks credential / signup spam
 *   2. Honeypot field            → silently rejects bot form-fills
 *   3. Zod schema validation     → rejects malformed input
 *   4. Generic error responses   → prevents username enumeration
 *   5. bcrypt password hashing   → never stores plaintext
 *   6. Server-side JWT signing   → tokens signed with HASH_SALT
 */
export async function POST(request: Request) {
  // 1. Rate limit per IP — separate bucket from /login so a flood of one
  //    doesn't lock out the other.
  const ip = getClientIp(request);
  const limit = checkRateLimit(`signup:${ip}`);
  if (!limit.ok) {
    return rateLimitedResponse(limit.retryAfterSeconds);
  }

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
    // Honeypot field — must be empty for a real submission. Bots fill
    // every input on a form; humans never see this one (it's hidden via
    // off-screen positioning + aria-hidden + tabIndex=-1 on the client).
    company_website: z.string().max(0).optional().or(z.literal('')),
  });

  const { body, error } = await parseRequest(request, schema, { skipAuth: true });

  if (error) {
    return error();
  }

  const { username, email, password, company_website } = body;

  // 2. Honeypot trap — if a bot filled the hidden field, return a fake
  //    success so they don't learn they've been caught. Log the IP for
  //    later analysis.
  if (typeof company_website === 'string' && company_website.length > 0) {
    console.warn(`[signup] honeypot triggered for ip=${ip}`);
    return ok();
  }

  // 3. Uniqueness check (still done, but the response below stays generic)
  const existing = await getUserByUsername(username, { includePassword: false });
  if (existing) {
    // 4. Generic error — don't leak whether the username is taken or
    //    whether validation failed for some other reason. Username
    //    enumeration is a real attack vector.
    return serverError({
      code: 'account-creation-failed',
      message: 'Could not create your account. Please try a different username.',
    });
  }

  // 5. Create the user — bcrypt-hash the password before insertion.
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
    return serverError({
      code: 'account-creation-failed',
      message: 'Could not create your account. Please try a different username.',
    });
  }

  // 6. Issue a server-signed JWT (Redis-backed if Redis is configured)
  let token: string;
  if (redis.enabled) {
    token = await saveAuth({ userId: user.id, role: user.role });
  } else {
    token = createSecureToken({ userId: user.id, role: user.role }, secret());
  }

  // Same shape as POST /api/auth/login so the client can reuse its handler
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
