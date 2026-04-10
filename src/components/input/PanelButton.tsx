import { useGlobalState } from '@/components/hooks';
import { PanelLeft } from '@/components/icons';
import { Button, type ButtonProps, Icon } from '@/lib/ui';

export function PanelButton(props: ButtonProps) {
  const [isCollapsed, setIsCollapsed] = useGlobalState('sidenav-collapsed');
  return (
    <Button
      onPress={() => setIsCollapsed(!isCollapsed)}
      variant="zero"
      {...props}
      style={{ padding: 0 }}
    >
      <Icon strokeColor="muted">
        <PanelLeft />
      </Icon>
    </Button>
  );
}
