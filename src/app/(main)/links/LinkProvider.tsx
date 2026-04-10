'use client';
import { createContext, type ReactNode } from 'react';
import { useLinkQuery } from '@/components/hooks/queries/useLinkQuery';
import type { Link } from '@/generated/prisma/client';
import { Loading } from '@/lib/ui';

export const LinkContext = createContext<Link>(null);

export function LinkProvider({ linkId, children }: { linkId?: string; children: ReactNode }) {
  const { data: link, isLoading, isFetching } = useLinkQuery(linkId);

  if (isFetching && isLoading) {
    return <Loading placement="absolute" />;
  }

  if (!link) {
    return null;
  }

  return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>;
}
