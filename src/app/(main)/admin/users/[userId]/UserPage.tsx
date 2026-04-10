'use client';
import { UserHeader } from '@/app/(main)/admin/users/[userId]/UserHeader';
import { Panel } from '@/components/common/Panel';
import { Column } from '@/lib/ui';
import { UserProvider } from './UserProvider';
import { UserSettings } from './UserSettings';

export function UserPage({ userId }: { userId: string }) {
  return (
    <UserProvider userId={userId}>
      <Column gap="6">
        <UserHeader />
        <Panel>
          <UserSettings userId={userId} />
        </Panel>
      </Column>
    </UserProvider>
  );
}
