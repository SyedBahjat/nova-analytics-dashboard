<div align="center">

# Nova Analytics

**Privacy-first web analytics for modern teams.**

</div>

---

## What this is

Nova Analytics is a self-hostable, privacy-first web analytics product. Drop a tiny tracking script on any website, and Nova starts collecting page views, sessions, geographic data, browsers, devices, custom events, funnels, journeys, and more — without setting a single cookie or storing any personal data about your visitors.

The repository contains the full Nova Analytics application: a marketing landing page, a complete authentication flow (login + signup), an admin dashboard with real-time analytics, public shareable dashboards, and a lightweight browser tracking script.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | Postgres (hosted on [Supabase](https://supabase.com)) |
| **ORM** | Prisma 6 |
| **Auth** | JWT signed with bcryptjs-hashed passwords (no third-party auth provider) |
| **Styling** | CSS Modules, custom design system, Instrument Serif + IBM Plex typography |
| **Deployment** | Render / Vercel (any Node host that runs Next.js) |
| **Schema isolation** | Postgres named schema (`nova_analytics`) so the app safely shares a Supabase project with other apps |

---

## What's included

### Marketing landing page (`/`)
- Hero with animated live-data preview card
- Stats strip
- Six-card features grid
- "How it works" with code-snippet install demo
- Customer quote section
- Final CTA + footer
- Fully responsive (980 px and 768 px breakpoints)
- Editorial-brutalist aesthetic — dark warm background, lime accent, serif display + mono data labels

### Authentication
- **`/login`** — custom login page with show/hide password toggle and friendly error messages
- **`/signup`** — custom signup page collecting username, email, password, and password confirmation, with client-side and server-side validation
- After login or signup, the user is auto-redirected to the dashboard at `/websites`
- Default admin credentials are seeded on first build (see "Demo credentials" below)

### Auth security architecture
Layered defenses on every auth endpoint:

| Layer | What it prevents | Implementation |
| --- | --- | --- |
| **JWT** signed with a 96-character `HASH_SALT` server-side secret | Token forgery | `src/lib/jwt.ts` + `HASH_SALT` env var |
| **bcrypt** password hashing (10 salt rounds) | Plaintext password leaks | `src/lib/password.ts` |
| **Per-IP sliding-window rate limit** (5/min, 30/hour) on `/api/auth/login` and `/api/auth/signup` | Credential stuffing, brute force, signup spam | `src/lib/rate-limit.ts` |
| **Honeypot field** (invisible `company_website` input) on signup | Bot form-fill spam | `SignupPage.tsx` + signup route check |
| **Generic error responses** on signup (`account-creation-failed` instead of `username-already-exists`) | Username enumeration | `src/app/api/auth/signup/route.ts` |
| **`Retry-After` header** on 429 responses | RFC-compliant rate limit UX | `src/lib/rate-limit.ts` |
| **HSTS** (`Strict-Transport-Security`) header (when `FORCE_SSL=1`) | SSL downgrade attacks | `next.config.ts` |
| **Zod schema validation** on every input field | Type confusion, injection | Both auth route handlers |
| **CORS** headers scoped to `/api/*` | Cross-origin abuse | `next.config.ts` |

Stops short of 2FA and account lockout — those are the next layer for production-grade auth and would be added before a real launch.

### Dashboard (`/websites`)
A complete production-grade analytics product including:
- Real-time visitor view
- Sessions, events, page views, top pages, top referrers
- Geo + device + browser breakdowns with interactive country map
- Funnels, journeys, cohorts, retention
- Revenue tracking, UTM attribution
- Multi-team support
- Per-website settings + tracking script generation
- Public shareable dashboards

### Multi-tenancy
- Each user gets a fully isolated workspace
- New signups land on an empty `/websites` page (no data leakage from other accounts)
- Optional team workspaces let multiple users share the same set of websites

---

## Demo credentials

After running the build, an admin user is seeded automatically:

```
Username: admin@novaanalytics.io
Password: NovaAnalytics2026!
```

> ⚠️ **Change this password immediately** in any production deployment. The seeded credentials are only meant for trial-review demo purposes.

---

## Running locally

### Prerequisites

- **Node.js 20+**
- **pnpm** (install with `npm install -g pnpm` if you don't have it)
- A **Postgres database** — [Supabase](https://supabase.com) is recommended (free tier, 5-minute setup, no credit card)

### Setup

```bash
# 1. Clone
git clone https://github.com/SyedBahjat/nova-analytics-dashboard.git
cd nova-analytics-dashboard

# 2. Install
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Then edit .env.local — see "Environment variables" below

# 4. Build (this also runs Prisma migrations into your database)
pnpm run build

# 5. Run the dev server
pnpm run dev
```

Open <http://localhost:3001>. You should see the Nova Analytics landing page. Click "Log in" and use the demo credentials above.

### Loading sample data (optional, recommended for demos)

Nova ships a seed script that populates the database with two demo websites and 31 days of realistic-looking traffic so the dashboard isn't empty on a fresh install:

```bash
pnpm run seed-data
```

This creates **Demo Blog** (~94 sessions) and **Demo SaaS** (~15,800 sessions, 45,000+ events).

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. The full template lives in [`.env.example`](./.env.example), but here's the short version:

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | **Yes** | Postgres connection string for the running app. Use the Supabase Transaction pooler (port 6543). Append `&schema=nova_analytics&options=-c%20search_path%3Dnova_analytics` for schema isolation. |
| `DIRECT_URL` | **Yes** | Direct Postgres connection (port 5432) used by `prisma migrate` only. Same options as above. |
| `HASH_SALT` | **Yes** | Strong random string used to sign JWT auth tokens. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. |
| `DISABLE_TELEMETRY` | No | Set to `1` to disable any version-check pings. |
| `DISABLE_UPDATES` | No | Set to `1` to disable update notifications. |

### Why two database URLs?

Supabase (and most managed Postgres providers) use **PgBouncer in transaction-pool mode** for the production connection. PgBouncer doesn't support the advisory locks that Prisma migrations need, so:

- **`DATABASE_URL`** → pooler URL (port 6543) → used by every API request at runtime
- **`DIRECT_URL`** → direct URL (port 5432) → used only by `prisma migrate` during build / deploy

If you only set one, migrations will hang silently.

### Why the `search_path` connection option?

Nova isolates its tables inside a Postgres schema called `nova_analytics` so it can safely share a Supabase project with other apps. Prisma's `?schema=` query parameter handles this for the ORM's structured queries, but the analytics dashboards use raw SQL queries (`prisma.$queryRawUnsafe()`), which don't honor that parameter on their own. The `options=-c search_path=nova_analytics` connection option tells Postgres to set the search path at the session level, so raw SQL also resolves table names correctly.

To create the schema, run this once in the Supabase SQL editor before your first build:

```sql
CREATE SCHEMA IF NOT EXISTS nova_analytics;
```

---

## Project structure

```
nova-analytics-dashboard/
├── src/
│   ├── app/                          # Next.js App Router routes
│   │   ├── page.tsx                  # Marketing landing page
│   │   ├── landing.module.css        # Landing page design system
│   │   ├── auth.module.css           # Login/signup design system
│   │   ├── auth-icons.tsx            # Eye icons for password show/hide
│   │   ├── login/                    # Custom login page
│   │   ├── signup/                   # Custom signup page (4 fields)
│   │   ├── (main)/                   # Protected dashboard routes
│   │   ├── share/                    # Public shareable dashboards
│   │   └── api/
│   │       └── auth/
│   │           ├── login/            # JWT login endpoint
│   │           └── signup/           # Public self-service signup endpoint
│   ├── components/
│   │   └── svg/Logo.tsx              # Brand mark (used everywhere)
│   ├── lib/                          # Shared helpers (auth, prisma, jwt, etc.)
│   ├── queries/prisma/               # Prisma query layer
│   └── tracker/                      # Browser tracking script source
├── prisma/
│   ├── schema.prisma                 # Data model
│   └── migrations/                   # Versioned SQL migrations
├── public/
│   └── favicon.svg                   # Nova brand favicon
├── .env.example                      # Env variable template (safe to commit)
└── README.md                         # You are here
```

---

## Deployment

Nova runs anywhere that supports Node 20+. Recommended hosts:

| Host | Notes |
| --- | --- |
| **Render** | Free tier works; pick the region closest to your Supabase region (e.g. Singapore for `ap-southeast-2`). Build command: `corepack enable && pnpm install --frozen-lockfile=false && pnpm run build`. Start command: `pnpm run start`. |
| **Vercel** | Hobby tier works. Connect the GitHub repo, add the env vars under Settings → Environment Variables. No special config needed. |
| **Self-hosted** | Any VPS with Node 20+ and Postgres. Use `pnpm run build` once, then `pnpm run start` (or PM2 / systemd / Docker). |

For all hosts, set the same environment variables described above. Make sure to **generate a fresh `HASH_SALT`** for production rather than reusing the dev one.

---

## Assumptions made

- **Auth method**: JWT with bcrypt password hashing, signed with a server-side secret. The brief lists JWT as one of the accepted methods, and the implementation is production-grade out of the box. No third-party auth provider needed.
- **Database**: Supabase Postgres, sharing an existing Supabase project but isolated in a `nova_analytics` schema so the new tables don't collide with existing tables in `public`.
- **Email field**: Stored as a nullable unique column on the existing `user` table rather than a separate auth-providers table — the simplest path that satisfies the brief's "username + email + password + confirm" form.
- **Demo data**: Two demo websites are seeded so a reviewer logging in sees a populated dashboard immediately. They can be deleted from Settings → Websites at any time.
- **Multi-tenant model**: Each new signup gets a fresh isolated workspace with zero websites. New users cannot see admin's data. The brief doesn't explicitly require this, but it's the right default for a hosted analytics product.
- **No public OAuth**: The signup form is username + email + password + confirm. Adding "Sign in with Google / GitHub" was out of scope for the time budget.

---

## Tradeoffs and known limitations

- **No password reset flow** — if a user forgets their password, an admin currently has to reset it manually. Production would need a "forgot password" email flow.
- **No 2FA, no account lockout** — covered by per-IP rate limiting at the current threat level, but real production should add both.
- **In-memory rate limiter** — per-IP limits live in process memory, so the effective threshold is "5/min per (IP, function instance)." Vercel can spin up multiple instances under load. For a globally consistent limit, swap the in-memory map for Upstash Redis or Vercel KV — `src/lib/rate-limit.ts` is structured so this is a one-function change.
- **Single-region database** — single Supabase Postgres in `aws-1-ap-southeast-2`. A high-traffic production deployment would want read replicas + ClickHouse for the heaviest analytics aggregations.
- **No automated tests in this build** — the existing test scaffolding is configured but not exercised. Would add E2E coverage of the signup → login → add-website → see analytics flow with more time.

---

## What I'd improve with more time

- Add NextAuth + Google / GitHub OAuth as additional sign-in options
- Implement password reset via transactional email
- Add 2FA (TOTP) and account lockout after N failed login attempts
- Swap the in-memory rate limiter for Upstash Redis / Vercel KV (globally consistent across instances)
- Write E2E tests for the full signup → login → tracking → reporting flow
- Add a billing tab with a pricing page (would round out the SaaS feel)
- Build a custom email templates system for invites and password resets
- Replace the seeded demo websites with seed data branded specifically for Nova

---

## License

Released under the **MIT License**. See [`LICENSE`](./LICENSE) for the full text.

---

**Built for the DCM Moguls AI Agent Engineer take-home technical assignment.**
