import * as stylex from '@stylexjs/stylex';

import { AlertLabels, type RouteMatchResult, type RouteWithID } from '@grafana/alerting';
import { Trans } from '@grafana/i18n';
import { Text } from '@grafana/ui';
import { components, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { Stack } from '../../../../../../plugins/datasource/parca/QueryEditor/Stack';
import { arrayLabelsToObject } from '../../../utils/labels';
import { Spacer } from '../../Spacer';

import { NotificationPolicyDrawer } from './NotificationPolicyDrawer';

type TreeMeta = {
  name?: string;
};

type InstanceMatchProps = {
  matchedInstance: RouteMatchResult<RouteWithID>;
  policyTreeSpec: RouteWithID;
  policyTreeMetadata: TreeMeta;
};

export function InstanceMatch({ matchedInstance, policyTreeSpec, policyTreeMetadata }: InstanceMatchProps) {
  const { labels, matchingJourney, route } = matchedInstance;

  // Get all match details from the final matched route in the journey
  const finalRouteMatchInfo = matchingJourney.at(-1);
  const routeMatchLabels = arrayLabelsToObject(
    finalRouteMatchInfo?.matchDetails.map((detail) => labels[detail.labelIndex]) ?? []
  );
  const matchedRootRoute = route.id === policyTreeSpec.id;

  return (
    <div {...stylex.props(styles.instanceListItem)}>
      <Stack direction="row" gap={2} alignItems="center">
        {labels.length > 0 ? (
          <AlertLabels size="sm" labels={routeMatchLabels} />
        ) : (
          <Text color="secondary">
            <Trans i18nKey="alerting.notification-route.no-labels">No labels</Trans>
          </Text>
        )}
        <Spacer />
        <NotificationPolicyDrawer
          labels={labels}
          policyName={policyTreeMetadata.name}
          matchedRootRoute={matchedRootRoute}
          journey={matchingJourney}
        />
      </Stack>
    </div>
  );
}

const styles = stylex.create({
  instanceListItem: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    backgroundColor: {
      default: null,
      ':hover': components['--gf-components-table-row-hover-background'],
    },
  },
});
