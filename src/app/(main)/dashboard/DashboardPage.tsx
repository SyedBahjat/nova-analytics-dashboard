'use client';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { Column } from '@/lib/ui';

export function DashboardPage() {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title={formatMessage(labels.dashboard)}></PageHeader>
      </Column>
    </PageBody>
  );
}
