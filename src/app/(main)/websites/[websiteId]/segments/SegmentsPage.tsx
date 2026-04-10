'use client';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { Panel } from '@/components/common/Panel';
import { Column } from '@/lib/ui';
import { SegmentsDataTable } from './SegmentsDataTable';

export function SegmentsPage({ websiteId }) {
  return (
    <Column gap="3">
      <WebsiteControls websiteId={websiteId} allowFilter={false} allowDateFilter={false} />
      <Panel>
        <SegmentsDataTable websiteId={websiteId} />
      </Panel>
    </Column>
  );
}
