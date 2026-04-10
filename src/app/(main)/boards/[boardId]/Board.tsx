import { Column, Heading } from '@/lib/ui';

export function Board({ boardId }: { boardId: string }) {
  return (
    <Column>
      <Heading>Board title</Heading>
      <div>{boardId}</div>
    </Column>
  );
}
