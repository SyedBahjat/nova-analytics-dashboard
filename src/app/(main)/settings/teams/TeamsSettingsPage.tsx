'use client';
import { TeamsDataTable } from '@/app/(main)/teams/TeamsDataTable';
import { TeamsHeader } from '@/app/(main)/teams/TeamsHeader';
import { Panel } from '@/components/common/Panel';
import { Column } from '@/lib/ui';

export function TeamsSettingsPage() {
  return (
    <Column gap="6">
      <TeamsHeader />
      <Panel>
        <TeamsDataTable />
      </Panel>
    </Column>
  );
}
