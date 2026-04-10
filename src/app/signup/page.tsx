import type { Metadata } from 'next';
import { SignupPage } from './SignupPage';

export default async function () {
  // Honor the same flags as /login — if logins are disabled or running in
  // hosted "cloud mode", signup also goes away.
  if (process.env.DISABLE_LOGIN || process.env.CLOUD_MODE) {
    return null;
  }

  return <SignupPage />;
}

export const metadata: Metadata = {
  title: 'Sign up',
};
