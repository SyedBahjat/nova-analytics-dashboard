import { useMessages } from '@/components/hooks';
import { AlertTriangle } from '@/components/icons';
import { Icon, Row, Text } from '@/lib/ui';

export function ErrorMessage() {
  const { formatMessage, messages } = useMessages();

  return (
    <Row alignItems="center" justifyContent="center" gap>
      <Icon>
        <AlertTriangle />
      </Icon>
      <Text>{formatMessage(messages.error)}</Text>
    </Row>
  );
}
