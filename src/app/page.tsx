'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AUTH_TOKEN } from '@/lib/constants';
import { getItem } from '@/lib/storage';
import s from './landing.module.css';

/**
 * Nova Analytics — public marketing landing page.
 *
 * Aesthetic: editorial-brutalist analytics product. Dark warm background,
 * chartreuse accent, Instrument Serif display + IBM Plex Sans body +
 * IBM Plex Mono data labels. Asymmetric hero with a fake live dashboard
 * card on the right. Built without any UI library so the marketing surface
 * has its own visual identity, distinct from the dashboard.
 */
export default function LandingPage() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(Boolean(getItem(AUTH_TOKEN)));
  }, []);

  // Fake "live" bar chart heights for the hero card
  const bars = [42, 58, 36, 71, 54, 89, 65, 78, 51, 92, 74, 83];

  return (
    <div className={s.landing}>
      {/* ─── Top nav ─── */}
      <nav className={s.nav}>
        <div className={s.container}>
          <div className={s.navInner}>
            <Link href="/" className={s.brand}>
              <span className={s.brandMark}>
                <BrandIcon />
              </span>
              <span className={s.brandName}>
                Nova<em> Analytics</em>
              </span>
            </Link>
            <div className={s.navLinks}>
              <a href="#features" className={s.navLink}>
                Features
              </a>
              <a href="#how" className={s.navLink}>
                How it works
              </a>
              {isAuthed ? (
                <Link href="/websites" className={`${s.btn} ${s.btnPrimary}`}>
                  Open dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className={`${s.btn} ${s.btnGhost}`}>
                    Log in
                  </Link>
                  <Link href="/signup" className={`${s.btn} ${s.btnPrimary}`}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className={s.hero}>
        <div className={s.container}>
          <div className={s.heroGrid}>
            <div>
              <div className={s.heroEyebrow}>Now in public beta</div>
              <h1 className={s.heroHeadline}>
                The numbers behind <em>your traffic.</em>
                <br />
                Without the noise.
              </h1>
              <p className={s.heroSub}>
                Nova Analytics gives you the insights of Google Analytics with none of the cookie
                banners, none of the bloat, and none of the data harvesting. Built for teams who
                care about both growth and the people behind it.
              </p>
              <div className={s.heroCtas}>
                {isAuthed ? (
                  <Link href="/websites" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
                    Open your dashboard →
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
                      Sign up — free
                    </Link>
                    <Link href="/login" className={`${s.btn} ${s.btnGhost} ${s.btnLg}`}>
                      Log in
                    </Link>
                  </>
                )}
              </div>
              <div className={s.heroMeta}>No credit card · 60-second setup · GDPR-ready</div>
            </div>

            {/* Hero data card — fake live dashboard preview */}
            <div className={s.heroCard}>
              <div className={s.heroCardHead}>
                <span className={s.heroCardLabel}>nova-analytics.io / live</span>
                <span className={s.heroCardLive}>238 online</span>
              </div>
              <div className={s.heroCardMetrics}>
                <div className={s.heroMetric}>
                  <span className={s.heroMetricLabel}>Visitors / 24h</span>
                  <span className={s.heroMetricValue}>15,806</span>
                  <span className={s.heroMetricDelta}>↑ 12.4%</span>
                </div>
                <div className={s.heroMetric}>
                  <span className={s.heroMetricLabel}>Page views</span>
                  <span className={s.heroMetricValue}>45,729</span>
                  <span className={s.heroMetricDelta}>↑ 8.1%</span>
                </div>
                <div className={s.heroMetric}>
                  <span className={s.heroMetricLabel}>Avg. duration</span>
                  <span className={s.heroMetricValue}>1m 49s</span>
                  <span className={s.heroMetricDelta}>↑ 4.2%</span>
                </div>
              </div>
              <div className={s.heroChart}>
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className={s.heroBar}
                    style={{
                      height: `${h}%`,
                      animationDelay: `${0.5 + i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
              <div className={s.heroChartFooter}>
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section className={s.statsStrip}>
        <div className={s.container}>
          <div className={s.statsStripInner}>
            <div className={s.stat}>
              <span className={s.statValue}>
                <em>2k</em>
              </span>
              <span className={s.statLabel}>Tracker size — gzipped</span>
            </div>
            <div className={s.stat}>
              <span className={s.statValue}>
                <em>0</em>
              </span>
              <span className={s.statLabel}>Cookies dropped</span>
            </div>
            <div className={s.stat}>
              <span className={s.statValue}>
                <em>14</em>
              </span>
              <span className={s.statLabel}>Built-in report types</span>
            </div>
            <div className={s.stat}>
              <span className={s.statValue}>
                <em>60s</em>
              </span>
              <span className={s.statLabel}>Time to first event</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className={s.section} id="features">
        <div className={s.container}>
          <div className={s.sectionHead}>
            <div className={s.sectionLabel}>001 / Features</div>
            <h2 className={s.sectionTitle}>
              Everything you need.
              <br />
              <em>Nothing you don&apos;t.</em>
            </h2>
            <p className={s.sectionLede}>
              A focused analytics toolkit that respects your visitors and gives your team the
              answers they actually need — not 80 metrics you&apos;ll never read.
            </p>
          </div>

          <div className={s.featureGrid}>
            <FeatureCard
              num="01"
              title="Real-time dashboard"
              body="Live visitor counts, top pages, referrers, and conversions — updated as it happens, not in 24 hours."
              icon={<IconChart />}
            />
            <FeatureCard
              num="02"
              title="Geo & device intelligence"
              body="Country maps, browser breakdowns, OS, screen size — every dimension you need to understand who&apos;s actually visiting."
              icon={<IconGlobe />}
            />
            <FeatureCard
              num="03"
              title="Sessions & journeys"
              body="Drill into individual session paths, funnels, cohorts, and retention to see how people really use your product."
              icon={<IconActivity />}
            />
            <FeatureCard
              num="04"
              title="Privacy by design"
              body="No cookies. No personal data. GDPR, CCPA, and PECR compliant out of the box. Your visitors stay anonymous."
              icon={<IconLock />}
              wide
            />
            <FeatureCard
              num="05"
              title="UTM, links, pixels"
              body="Campaign attribution, short-link tracking, and email pixels — all in one place, no extra subscriptions."
              icon={<IconLink />}
            />
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className={s.section} id="how">
        <div className={s.container}>
          <div className={s.sectionHead}>
            <div className={s.sectionLabel}>002 / How it works</div>
            <h2 className={s.sectionTitle}>
              Three lines of code.
              <br />
              <em>That&apos;s the install.</em>
            </h2>
          </div>

          <div className={s.howGrid}>
            <div className={s.steps}>
              <div className={s.step}>
                <div className={s.stepNum}>i.</div>
                <div>
                  <h3 className={s.stepTitle}>Create your account</h3>
                  <p className={s.stepBody}>
                    Sign up in seconds — no payment details, no setup call.
                  </p>
                </div>
              </div>
              <div className={s.step}>
                <div className={s.stepNum}>ii.</div>
                <div>
                  <h3 className={s.stepTitle}>Add your website</h3>
                  <p className={s.stepBody}>
                    Tell us the domain you want to track. We generate a unique tracking script for
                    it.
                  </p>
                </div>
              </div>
              <div className={s.step}>
                <div className={s.stepNum}>iii.</div>
                <div>
                  <h3 className={s.stepTitle}>Drop in the snippet</h3>
                  <p className={s.stepBody}>
                    Paste it into your site&apos;s &lt;head&gt;. Refresh the page. You&apos;re
                    collecting analytics.
                  </p>
                </div>
              </div>
            </div>

            <div className={s.codeBlock}>
              <div className={s.codeContent}>
                <span className="tk-com">{`// Add to <head> on every page`}</span>
                <br />
                <span className="tk-tag">&lt;script</span>
                <br />
                {'  '}
                <span className="tk-attr">defer</span>
                <br />
                {'  '}
                <span className="tk-attr">src</span>=
                <span className="tk-str">&quot;https://nova-analytics.io/script.js&quot;</span>
                <br />
                {'  '}
                <span className="tk-attr">data-website-id</span>=
                <span className="tk-str">&quot;a8f3c4e2-...&quot;</span>
                <br />
                <span className="tk-tag">&gt;&lt;/script&gt;</span>
                <br />
                <br />
                <span className="tk-com">{`// That's it. Visit your dashboard.`}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quote ─── */}
      <section className={s.quote}>
        <div className={s.container}>
          <div className={s.quoteInner}>
            <div className={s.quoteMark}>&ldquo;</div>
            <p className={s.quoteText}>
              We replaced three different analytics tools with Nova and cut our monthly bill by{' '}
              <em>78%</em> — without losing a single insight that actually drove decisions.
            </p>
            <div className={s.quoteAuthor}>
              Maya Okafor — Head of Growth, Linear-style fictional company
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className={s.finalCta}>
        <div className={s.container}>
          <h2 className={s.finalCtaTitle}>
            See your traffic
            <br />
            <em>like it&apos;s 2026.</em>
          </h2>
          <p className={s.finalCtaSub}>
            Sign up, paste a snippet, watch the data flow. No setup call, no sales pitch, no
            twelve-tab onboarding.
          </p>
          {isAuthed ? (
            <Link href="/websites" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              Open your dashboard →
            </Link>
          ) : (
            <Link href="/signup" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
              Create your free account →
            </Link>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerInner}>
            <div className={s.footerCopy}>
              © {new Date().getFullYear()} Nova Analytics. All rights reserved.
            </div>
            <div className={s.footerLinks}>
              <Link href="/login" className={s.footerLink}>
                Log in
              </Link>
              <Link href="/signup" className={s.footerLink}>
                Sign up
              </Link>
              <a href="#features" className={s.footerLink}>
                Features
              </a>
              <a href="#how" className={s.footerLink}>
                How it works
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-components                                                             */
/* -------------------------------------------------------------------------- */

function FeatureCard({
  num,
  title,
  body,
  icon,
  wide,
}: {
  num: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`${s.featureCard} ${wide ? s.featureCardWide : ''}`}>
      <span className={s.featureNum}>{num} —</span>
      <div className={s.featureIcon}>{icon}</div>
      <h3 className={s.featureTitle}>{title}</h3>
      <p className={s.featureBody}>{body}</p>
    </div>
  );
}

/* ─── Inline icons (so the page is self-contained, no lucide dep) ─── */

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

function IconChart() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 2 5-7" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
