import * as stylex from '@stylexjs/stylex';

import { FeatureState } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { Box, FeatureBadge, LinkButton, Stack, Text, TextLink } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { QuotaLimitMessage } from '../Shared/QuotaLimitMessage';
import { RepositoryTypeCards } from '../Shared/RepositoryTypeCards';
import { isOnPrem } from '../utils/isOnPrem';

interface FeaturesListProps {
  hasRequiredFeatures: boolean;
  isConnectionLimitExceeded?: boolean;
  maxRepositories?: number;
  onSetupFeatures: () => void;
}

export const FeaturesList = ({
  hasRequiredFeatures,
  isConnectionLimitExceeded,
  maxRepositories = 0,
  onSetupFeatures,
}: FeaturesListProps) => {
  return (
    <Stack direction="column" gap={3}>
      <Text variant="h2">
        <Trans i18nKey="provisioning.features-list.manage-your-dashboards-with-remote-provisioning">
          Get started with Git Sync
        </Trans>{' '}
        {!isOnPrem() && <FeatureBadge featureState={FeatureState.preview} />}
      </Text>
      <ul {...stylex.props(styles.featuresList)}>
        <li {...stylex.props(styles.item)}>
          <Trans i18nKey="provisioning.features-list.manage-dashboards-provision-updates-automatically">
            Manage dashboards as code in Git and provision updates automatically
          </Trans>
        </li>
        <li {...stylex.props(styles.item)}>
          <Trans i18nKey="provisioning.features-list.store-dashboards-in-version-controlled-storage">
            Store dashboards in version-controlled storage for better organization and history tracking
          </Trans>
        </li>
        {!!maxRepositories && (
          <li {...stylex.props(styles.item)}>
            <QuotaLimitMessage maxRepositories={maxRepositories} showActionLink={false} />
          </li>
        )}
      </ul>
      <Text>
        <Trans i18nKey="provisioning.features-list.learn-more-documentation">
          Want to learn more? See our{' '}
          <TextLink external href={'https://grafana.com/docs/grafana/latest/as-code/observability-as-code/git-sync/'}>
            documentation
          </TextLink>
          .
        </Trans>
      </Text>
      {!hasRequiredFeatures ? (
        <Box>
          <LinkButton fill="outline" onClick={onSetupFeatures}>
            <Trans i18nKey="provisioning.features-list.actions.set-up-required-feature-toggles">
              Set up required feature toggles
            </Trans>
          </LinkButton>
        </Box>
      ) : (
        <Stack direction="row" alignItems="center" gap={2}>
          <RepositoryTypeCards disabled={isConnectionLimitExceeded} />
        </Stack>
      )}
    </Stack>
  );
};

const styles = stylex.create({
  featuresList: {
    listStyleType: 'none',
    paddingLeft: 0,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
  },
  item: {
    position: 'relative',
    paddingLeft: spacing['--gf-spacing-x4'],
    marginBottom: spacing['--gf-spacing-x1'],
    '::before': {
      content: '"✓"',
      position: 'absolute',
      left: spacing['--gf-spacing-x1'],
      top: '0',
      color: colors['--gf-colors-text-secondary'],
      fontWeight: typography['--gf-typography-font-weight-bold'],
    },
  },
});
