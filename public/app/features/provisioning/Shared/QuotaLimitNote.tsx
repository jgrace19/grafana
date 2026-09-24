import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { Icon, Stack, Text } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { QuotaLimitMessage } from './QuotaLimitMessage';

interface QuotaLimitNoteProps {
  maxRepositories?: number;
  maxResourcesPerRepository?: number;
}

export function QuotaLimitNote({ maxRepositories = 0, maxResourcesPerRepository = 0 }: QuotaLimitNoteProps) {
  if (maxRepositories <= 0 && maxResourcesPerRepository <= 0) {
    return null;
  }

  return (
    <Stack direction="row" alignItems="flex-start">
      <Icon name="exclamation-triangle" xstyle={styles.warningIcon} size="sm" />
      <Text variant="bodySmall">
        <Trans i18nKey="provisioning.quota-limit.note">Note:</Trans>{' '}
        <QuotaLimitMessage maxRepositories={maxRepositories} maxResourcesPerRepository={maxResourcesPerRepository} />
      </Text>
    </Stack>
  );
}

const styles = stylex.create({
  warningIcon: {
    color: colors['--gf-colors-warning-text'],
    marginTop: spacing['--gf-spacing-x0-25'],
  },
});
