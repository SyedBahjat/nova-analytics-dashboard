import { useDateRange, useMessages } from '@/components/hooks';
import { RefreshCw } from '@/components/icons';
import { Icon, LoadingButton, Tooltip, TooltipTrigger } from '@/lib/ui';
import { setWebsiteDateRange } from '@/store/websites';

export function RefreshButton({
  websiteId,
  isLoading,
}: {
  websiteId: string;
  isLoading?: boolean;
}) {
  const { formatMessage, labels } = useMessages();
  const { dateRange } = useDateRange();

  function handleClick() {
    if (!isLoading && dateRange) {
      setWebsiteDateRange(websiteId, dateRange);
    }
  }

  return (
    <TooltipTrigger>
      <LoadingButton isLoading={isLoading} onPress={handleClick}>
        <Icon>
          <RefreshCw />
        </Icon>
      </LoadingButton>
      <Tooltip>{formatMessage(labels.refresh)}</Tooltip>
    </TooltipTrigger>
  );
}
