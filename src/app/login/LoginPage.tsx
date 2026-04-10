'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import s from '../auth.module.css';
import { EyeIcon, EyeOffIcon } from '../auth-icons';

/**
 * Nova Analytics — Login page
 * Custom design (custom-styled). Editorial-brutalist, mobile-responsive,
 * matches the landing page aesthetic.
 */
export function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Map API error codes to friendly messages instead of leaking
        // raw codes like "Unauthorized" to the user.
        const code = data?.error?.code;
        const friendly =
          code === 'rate-limited'
            ? data?.error?.message || 'Too many login attempts. Please wait a moment and try again.'
            : code === 'incorrect-username-password'
              ? 'Wrong username or password. Please try again.'
              : res.status === 401 || res.status === 403
                ? 'Wrong username or password. Please try again.'
                : code === 'bad-request'
                  ? 'Please fill in both fields.'
                  : 'Something went wrong. Please try again.';
        setError(friendly);
        return;
      }

      setClientAuthToken(data.token);
      setUser(data.user);
      router.push('/websites');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.shell}>
      {/* Left: form */}
      <div className={s.formPanel}>
        <div className={s.formNav}>
          <Link href="/" className={s.brand}>
            <span className={s.brandMark}>
              <BrandIcon />
            </span>
            <span className={s.brandName}>
              Nova<em> Analytics</em>
            </span>
          </Link>
          <Link href="/" className={s.backHome}>
            ← Back home
          </Link>
        </div>

        <div className={s.formCard}>
          <div className={s.eyebrow}>Account access</div>
          <h1 className={s.title}>
            Welcome <em>back.</em>
          </h1>
          <p className={s.subtitle}>Log in to your Nova Analytics dashboard.</p>

          <form onSubmit={handleSubmit} className={s.form} noValidate>
            {error && <div className={s.formError}>{error}</div>}

            <div className={s.field}>
              <label htmlFor="username" className={s.label}>
                Username or email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={s.input}
                placeholder="Enter your username or email"
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>

            <div className={s.field}>
              <label htmlFor="password" className={s.label}>
                Password
              </label>
              <div className={s.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={s.input}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type="submit" className={s.submit} disabled={loading}>
              {loading ? 'Logging in…' : 'Log in →'}
            </button>
          </form>

          <div className={s.altLink}>
            Don&apos;t have an account?
            <Link href="/signup">Sign up</Link>
          </div>
        </div>

        <div className={s.formFooter}>© {new Date().getFullYear()} Nova Analytics</div>
      </div>

      {/* Right: visual panel */}
      <div className={s.visualPanel}>
        <div className={s.visualInner}>
          <div className={s.visualEyebrow}>The product</div>
          <h2 className={s.visualHeadline}>
            Real numbers.
            <br />
            <em>Real privacy.</em>
          </h2>
          <p className={s.visualSub}>
            Every metric you need to understand your traffic, with none of the cookie banners or
            data harvesting your visitors hate.
          </p>

          <div className={s.visualStats}>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>15.8k</em>
              </span>
              <span className={s.visualStatLabel}>Sessions / 30d</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>0</em>
              </span>
              <span className={s.visualStatLabel}>Cookies set</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>238</em>
              </span>
              <span className={s.visualStatLabel}>Live right now</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>2k</em>
              </span>
              <span className={s.visualStatLabel}>Tracker (gzip)</span>
            </div>
          </div>
        </div>

        <div className={s.visualChart}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

function BrandIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none">
      <path
        d="M8 22V13M14 22V9M20 22V15M26 22V11"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </svg>
  );
}
