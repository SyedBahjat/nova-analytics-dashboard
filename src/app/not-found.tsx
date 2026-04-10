'use client';
import { useMessages } from '@/components/hooks';
import { Flexbox } from '@/lib/ui';

export default function () {
  const { formatMessage, labels } = useMessages();

  return (
    <Flexbox alignItems="center" justifyContent="center" flexGrow="1" minHeight="600px">
      <h1>{formatMessage(labels.pageNotFound)}</h1>
    </Flexbox>
  );
}
