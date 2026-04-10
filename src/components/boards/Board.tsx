import { Column } from '@/lib/ui';

export interface BoardProps {
  children?: React.ReactNode;
}

export function Board({ children }: BoardProps) {
  return <Column>{children}</Column>;
}
