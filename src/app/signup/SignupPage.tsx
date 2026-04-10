'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';
import s from '../auth.module.css';
import { EyeIcon, EyeOffIcon } from '../auth-icons';

/**
 * Nova Analytics — Signup page
 * Custom design (custom-styled). Editorial-brutalist, mobile-responsive.
 * Collects username + email + password + confirm. POSTs to /api/auth/signup,
 * which auto-logs the new user in and returns a JWT.
 */
export function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Honeypot — must stay empty. Bots fill every field; humans never see this.
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (username.trim().length < 3) errs.username = 'At least 3 characters';
    else if (!/^[A-Za-z0-9._-]+$/.test(username))
      errs.username = 'Letters, numbers, dots, underscores, hyphens only';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';

    if (password.length < 8) errs.password = 'At least 8 characters';

    if (confirm !== password) errs.confirm = 'Passwords do not match';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          company_website: companyWebsite,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const code = data?.error?.code;
        if (code === 'rate-limited') {
          setError(
            data?.error?.message || 'Too many attempts. Please wait a moment and try again.',
          );
        } else if (code === 'account-creation-failed') {
          setError('Could not create your account. Please try a different username.');
        } else {
          setError(data?.error?.message || 'Could not create your account. Please try again.');
        }
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
          <div className={s.eyebrow}>New account</div>
          <h1 className={s.title}>
            Create your <em>account.</em>
          </h1>
          <p className={s.subtitle}>Start tracking traffic in under a minute. No credit card.</p>

          <form onSubmit={handleSubmit} className={s.form} noValidate>
            {error && <div className={s.formError}>{error}</div>}

            {/*
              Honeypot field. Hidden from humans (off-screen + tab-skipped +
              aria-hidden + autocomplete off) but bots that auto-fill every
              input will populate it. Server silently rejects any submission
              where it's non-empty.
            */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-10000px',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
            >
              <label htmlFor="company_website">Company website (leave blank)</label>
              <input
                id="company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={companyWebsite}
                onChange={e => setCompanyWebsite(e.target.value)}
              />
            </div>

            <div className={s.field}>
              <label htmlFor="username" className={s.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={s.input}
                placeholder="janedoe"
                autoComplete="username"
                required
                disabled={loading}
              />
              {fieldErrors.username && <div className={s.fieldError}>{fieldErrors.username}</div>}
            </div>

            <div className={s.field}>
              <label htmlFor="email" className={s.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={s.input}
                placeholder="jane@company.com"
                autoComplete="email"
                required
                disabled={loading}
              />
              {fieldErrors.email && <div className={s.fieldError}>{fieldErrors.email}</div>}
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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
              {fieldErrors.password && <div className={s.fieldError}>{fieldErrors.password}</div>}
            </div>

            <div className={s.field}>
              <label htmlFor="confirm" className={s.label}>
                Confirm password
              </label>
              <div className={s.passwordWrap}>
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className={s.input}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {fieldErrors.confirm && <div className={s.fieldError}>{fieldErrors.confirm}</div>}
            </div>

            <button type="submit" className={s.submit} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account →'}
            </button>
          </form>

          <div className={s.altLink}>
            Already have an account?
            <Link href="/login">Log in</Link>
          </div>
        </div>

        <div className={s.formFooter}>© {new Date().getFullYear()} Nova Analytics</div>
      </div>

      {/* Right: visual panel */}
      <div className={s.visualPanel}>
        <div className={s.visualInner}>
          <div className={s.visualEyebrow}>Free forever tier</div>
          <h2 className={s.visualHeadline}>
            Join teams who care
            <br />
            about <em>both growth</em>
            <br />
            and privacy.
          </h2>
          <p className={s.visualSub}>
            Set up tracking on any number of sites. No cookies dropped, no personal data stored, no
            surprise overage charges.
          </p>

          <div className={s.visualStats}>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>60s</em>
              </span>
              <span className={s.visualStatLabel}>Time to first event</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>14</em>
              </span>
              <span className={s.visualStatLabel}>Built-in reports</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>∞</em>
              </span>
              <span className={s.visualStatLabel}>Sites tracked</span>
            </div>
            <div className={s.visualStat}>
              <span className={s.visualStatValue}>
                <em>0$</em>
              </span>
              <span className={s.visualStatLabel}>To get started</span>
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
