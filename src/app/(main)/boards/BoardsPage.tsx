'use client';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Column } from '@/lib/ui';
import { BoardAddButton } from './BoardAddButton';

export function BoardsPage() {
  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title="My Boards">
          <BoardAddButton />
        </PageHeader>
      </Column>
    </PageBody>
  );
}
