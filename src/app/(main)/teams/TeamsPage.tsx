'use client';
import { TeamsDataTable } from '@/app/(main)/teams/TeamsDataTable';
import { TeamsHeader } from '@/app/(main)/teams/TeamsHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Column } from '@/lib/ui';

export function TeamsPage() {
  return (
    <PageBody>
      <Column gap="6">
        <TeamsHeader />
        <Panel>
          <TeamsDataTable />
        </Panel>
      </Column>
    </PageBody>
  );
}
