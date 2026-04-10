'use client';
import { WebsitesDataTable } from '@/app/(main)/websites/WebsitesDataTable';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useMessages } from '@/components/hooks';
import { Column } from '@/lib/ui';

export function WebsitesSettingsPage({ teamId }: { teamId: string }) {
  const { formatMessage, labels } = useMessages();

  return (
    <Column gap>
      <SectionHeader title={formatMessage(labels.websites)} />
      <WebsitesDataTable teamId={teamId} />
    </Column>
  );
}
