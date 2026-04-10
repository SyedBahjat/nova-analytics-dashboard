'use client';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { Panel } from '@/components/common/Panel';
import { Column } from '@/lib/ui';
import { CohortsDataTable } from './CohortsDataTable';

export function CohortsPage({ websiteId }) {
  return (
    <Column gap="3">
      <WebsiteControls websiteId={websiteId} allowFilter={false} allowDateFilter={false} />
      <Panel>
        <CohortsDataTable websiteId={websiteId} />
      </Panel>
    </Column>
  );
}
