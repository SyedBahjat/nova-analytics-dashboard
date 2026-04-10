import { useDeleteQuery, useMessages } from '@/components/hooks';
import { X } from '@/components/icons';
import { Icon, LoadingButton, Text } from '@/lib/ui';

export function TeamWebsiteRemoveButton({ teamId, websiteId, onSave }) {
  const { formatMessage, labels } = useMessages();
  const { mutateAsync } = useDeleteQuery(`/teams/${teamId}/websites/${websiteId}`);

  const handleRemoveTeamMember = async () => {
    await mutateAsync(null, {
      onSuccess: () => {
        onSave();
      },
    });
  };

  return (
    <LoadingButton variant="quiet" onClick={() => handleRemoveTeamMember()}>
      <Icon>
        <X />
      </Icon>
      <Text>{formatMessage(labels.remove)}</Text>
    </LoadingButton>
  );
}
