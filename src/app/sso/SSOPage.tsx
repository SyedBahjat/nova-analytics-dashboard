'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { setClientAuthToken } from '@/lib/client';
import { Loading } from '@/lib/ui';

export function SSOPage() {
  const router = useRouter();
  const search = useSearchParams();
  const url = search.get('url');
  const token = search.get('token');

  useEffect(() => {
    if (url && token) {
      setClientAuthToken(token);

      router.push(url);
    }
  }, [router, url, token]);

  return <Loading placement="absolute" />;
}
