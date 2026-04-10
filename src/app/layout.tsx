import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Providers } from './Providers';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@/styles/zen.css';
import '@/styles/global.css';
import '@/styles/variables.css';

export default function ({ children }) {
  if (process.env.DISABLE_UI) {
    return (
      <html>
        <body></body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        {/* Nova Analytics favicon — modern SVG (scales perfectly, theme-aware) */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0a0908" />
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Nova Analytics',
    default: 'Nova Analytics',
  },
  description: 'Nova Analytics — privacy-first web analytics for modern teams.',
};
