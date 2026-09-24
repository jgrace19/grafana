
import { Trans } from '@grafana/i18n';
import { Icon, Stack, Text, } from '@grafana/ui';

import { QuotaLimitMessage } from './QuotaLimitMessage';

interface QuotaLimitNoteProps {
  maxRepositories?: number;
  maxResourcesPerRepository?: number;
}

export function QuotaLimitNote({ maxRepositories = 0, maxResourcesPerRepository = 0 }: QuotaLimitNoteProps) {
  const styles = (getStyles);

  if (maxRepositories <= 0 && maxResourcesPerRepository <= 0) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="flex-start">
      <Icon name="exclamation-triangle" {...stylex.props(quotaLimitNoteStyles.warningIcon)} size="sm" />
      <Text variant="bodySmall">
        <Trans i18nKey="provisioning.quota-limit.note">Note:</Trans>{' '}
        <QuotaLimitMessage maxRepositories={maxRepositories} maxResourcesPerRepository={maxResourcesPerRepository} />
      </Text>
    </Stack>
  );
}

;
