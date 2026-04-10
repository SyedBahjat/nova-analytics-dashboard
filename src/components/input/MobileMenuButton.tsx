import { Menu } from '@/components/icons';
import { Button, Dialog, type DialogProps, DialogTrigger, Icon, Modal } from '@/lib/ui';

export function MobileMenuButton(props: DialogProps) {
  return (
    <DialogTrigger>
      <Button>
        <Icon>
          <Menu />
        </Icon>
      </Button>
      <Modal placement="left" offset="80px">
        <Dialog variant="sheet" {...props} />
      </Modal>
    </DialogTrigger>
  );
}
