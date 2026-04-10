import { CURRENT_VERSION, HOMEPAGE_URL } from '@/lib/constants';
import { Row, Text } from '@/lib/ui';

export function Footer() {
  return (
    <Row as="footer" paddingY="6" justifyContent="flex-end">
      <a href="/" target="_self">
        <Text weight="bold">Nova Analytics</Text> {`v${CURRENT_VERSION}`}
      </a>
    </Row>
  );
}
