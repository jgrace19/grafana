import * as stylex from '@stylexjs/stylex';

import { type RouteWithID } from '@grafana/alerting';
import { Trans } from '@grafana/i18n';
import { Icon, Stack, Text, Tooltip } from '@grafana/ui';
import { type ObjectMatcher } from 'app/plugins/datasource/alertmanager/types';

import { labelMatcherToObjectMatcher } from '../../../utils/routeAdapter';
import { Matchers } from '../../notification-policies/Matchers';
import { DefaultPolicyIndicator } from '../../notification-policies/Policy';

interface JourneyPolicyCardProps {
  route: RouteWithID;
  isRoot?: boolean;
  isFinalRoute?: boolean;
}

export function JourneyPolicyCard({ route, isRoot = false, isFinalRoute = false }: JourneyPolicyCardProps) {

  // Convert route matchers to ObjectMatcher format
  const matchers: ObjectMatcher[] = route.matchers?.map(labelMatcherToObjectMatcher) ?? [];

  const hasMatchers = matchers.length > 0;
  const continueMatching = route.continue ?? false;

  return (
    <article className={stylex.props(formStyles.policyWrapper)(isFinalRoute)} aria-current={isFinalRoute ? 'true' : 'false'}>
      {continueMatching && <ContinueMatchingIndicator />}
      <Stack direction="column" gap={0.5}>
        {/* root route indicator */}
        {isRoot && <DefaultPolicyIndicator />}

        {/* Matchers */}
        {hasMatchers ? (
          <Matchers matchers={matchers} formatter={undefined} />
        ) : (
          <Text variant="bodySmall" color="secondary">
            <Trans i18nKey="alerting.policies.no-matchers">No matchers</Trans>
          </Text>
        )}

        {/* Route metadata */}
        <Stack direction="row" alignItems="center" gap={1}>
          {route.receiver && (
            <Text variant="bodySmall" color="secondary">
              <Icon name="at" size="xs" /> {route.receiver}
            </Text>
          )}
          {route.group_by && route.group_by.length > 0 && (
            <Text variant="bodySmall" color="secondary">
              <Icon name="layer-group" size="xs" /> {route.group_by.join(', ')}
            </Text>
          )}
        </Stack>
      </Stack>
    </article>
  );
}

const ContinueMatchingIndicator = () => {

  return (
    <Tooltip
      placement="top"
      content={
        <Trans i18nKey="alerting.continue-matching-indicator.content-route-continue-matching-other-policies">
          This route will continue matching other policies
        </Trans>
      }
    >
      <div {...stylex.props(journeyPolicyCardStyles.gutterIcon)} data-testid="continue-matching">
        <Icon name="arrow-down" />
      </div>
    </Tooltip>
  );
};

