import * as stylex from '@stylexjs/stylex';

import { AlertLabel, type LabelMatchDetails } from '@grafana/alerting/unstable';
import { Trans } from '@grafana/i18n';
import { Box, Text } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { labelMatcherToObjectMatcher } from '../../../utils/routeAdapter';
import { MatcherBadge } from '../../notification-policies/Matchers';

interface MatchDetailsProps {
  matchDetails: LabelMatchDetails[];
  labels: Array<[string, string]>;
}

export function MatchDetails({ matchDetails, labels }: MatchDetailsProps) {
  const matchingLabels = matchDetails.filter((detail) => detail.match);

  const noMatchingLabels = matchingLabels.length === 0;

  return (
    <div {...stylex.props(styles.container)}>
      {noMatchingLabels ? (
        <Text variant="bodySmall" color="secondary">
          <Trans i18nKey="alerting.match-details.no-matchers-matched">Policy matches all labels</Trans>
        </Text>
      ) : (
        matchingLabels.map((detail) => (
          <Box key={detail.labelIndex} display="flex" alignItems="center" gap={1}>
            <AlertLabel labelKey={labels[detail.labelIndex][0]} value={labels[detail.labelIndex][1]} />
            <Text variant="bodySmall" color="secondary">
              <Trans i18nKey="alerting.match-details.matched">matched</Trans>
            </Text>
            {detail.matcher && <MatcherBadge matcher={labelMatcherToObjectMatcher(detail.matcher)} />}
          </Box>
        ))
      )}
    </div>
  );
}

const styles = stylex.create({
  container: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-pill'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    width: 'fit-content',
    alignSelf: 'center',
  },
});
