import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { redirectToRuleViewerStyles } from './RedirectToRuleViewer.stylex';
import { type JSX, useMemo } from 'react';
import { Navigate } from 'react-router-dom-v5-compat';
import { useLocation } from 'react-use';

import { AlertLabels } from '@grafana/alerting/unstable';
import { Trans, t } from '@grafana/i18n';
import { config, isFetchError } from '@grafana/runtime';
import { Alert, Card, Icon, LoadingPlaceholder } from '@grafana/ui';

import { RuleViewerLayout } from './components/rule-viewer/RuleViewerLayout';
import { useCloudCombinedRulesMatching } from './hooks/useCombinedRule';
import { getRulesSourceByName } from './utils/datasource';
import { createViewLink } from './utils/misc';
import { unescapePathSeparators } from './utils/rule-id';
import { withPageErrorBoundary } from './withPageErrorBoundary';

const pageTitle = 'Find rule';
const subUrl = config.appSubUrl;

function useRuleFindParams() {
  // DO NOT USE REACT-ROUTER HOOKS FOR THIS CODE
  // React-router's useLocation/useParams/props.match are broken and don't preserve original param values when parsing location
  // so, they cannot be used to parse name and sourceName path params
  // React-router messes the pathname up resulting in a string that is neither encoded nor decoded
  // Relevant issue: https://github.com/remix-run/history/issues/505#issuecomment-453175833
  // It was probably fixed in React-Router v6
  const location = useLocation();

  return useMemo(() => {
    const segments = location.pathname?.replace(subUrl, '').split('/') ?? []; // ["", "alerting", "{sourceName}", "{name}]
    const name = unescapePathSeparators(decodeURIComponent(unescapePathSeparators(segments[3])));
    const sourceName = decodeURIComponent(segments[2]);

    const searchParams = new URLSearchParams(location.search);

    return {
      name,
      sourceName,
      namespace: searchParams.get('namespace') ?? undefined,
      group: searchParams.get('group') ?? undefined,
    };
  }, [location]);
}

export function RedirectToRuleViewer(): JSX.Element | null {

  const { name, sourceName, namespace, group } = useRuleFindParams();
  const {
    error,
    loading,
    rules = [],
  } = useCloudCombinedRulesMatching(name, sourceName, { namespace, groupName: group });

  if (!name || !sourceName) {
    return <Navigate replace to="/notfound" />;
  }

  if (error) {
    return (
      <RuleViewerLayout title={pageTitle}>
        <Alert
          title={t(
            'alerting.redirect-to-rule-viewer.title-failed-to-load',
            'Failed to load rules from {{sourceName}}',
            { sourceName }
          )}
        >
          {isFetchError(error) && (
            <details {...stylex.props(redirectToRuleViewerStyles.errorMessage)}>
              {error.message}
              <br />
              {/* {!!error?.stack && error.stack} */}
            </details>
          )}
        </Alert>
      </RuleViewerLayout>
    );
  }

  if (loading) {
    return (
      <RuleViewerLayout title={pageTitle}>
        <LoadingPlaceholder text={t('alerting.redirect-to-rule-viewer.text-loading-rule', 'Loading rule...')} />
      </RuleViewerLayout>
    );
  }

  const rulesSource = getRulesSourceByName(sourceName);

  if (!rulesSource) {
    return (
      <RuleViewerLayout title={pageTitle}>
        <Alert title={t('alerting.redirect-to-rule-viewer.title-could-not-view-rule', 'Could not view rule')}>
          <details {...stylex.props(redirectToRuleViewerStyles.errorMessage)}>{`Could not find data source with name: ${sourceName}.`}</details>
        </Alert>
      </RuleViewerLayout>
    );
  }

  if (rules.length === 1) {
    const [rule] = rules;
    const to = createViewLink(rulesSource, rule, '/alerting/list').replace(subUrl, '');
    return <Navigate replace to={to} />;
  }

  if (rules.length === 0) {
    return (
      <RuleViewerLayout title={pageTitle}>
        <div data-testid="no-rules">
          <Trans i18nKey="alerting.redirect-to-rule-viewer.no-rules-found" values={{ sourceName, name }}>
            No rules in <span {...stylex.props(redirectToRuleViewerStyles.param)}>{'{{sourceName}}'}</span> matched the name{' '}
            <span {...stylex.props(redirectToRuleViewerStyles.param)}>{'{{name}}'}</span>
          </Trans>
        </div>
      </RuleViewerLayout>
    );
  }

  return (
    <RuleViewerLayout title={pageTitle}>
      <div>
        <Trans i18nKey="alerting.redirect-to-rule-viewer.several-rules-found" values={{ sourceName, name }}>
          Several rules in <span {...stylex.props(redirectToRuleViewerStyles.param)}>{'{{sourceName}}'}</span> matched the name{' '}
          <span {...stylex.props(redirectToRuleViewerStyles.param)}>{'{{name}}'}</span>, please select the rule you want to view.
        </Trans>
      </div>
      <div {...stylex.props(redirectToRuleViewerStyles.rules)}>
        {rules.map((rule, index) => {
          return (
            <Card noMargin key={`${rule.name}-${index}`} href={createViewLink(rulesSource, rule, '/alerting/list')}>
              <Card.Heading>{rule.name}</Card.Heading>
              <Card.Meta separator={''}>
                <Icon name="folder" />
                <span {...stylex.props(redirectToRuleViewerStyles.namespace)}>{`${rule.namespace.name} / ${rule.group.name}`}</span>
              </Card.Meta>
              <Card.Tags>
                <AlertLabels labels={rule.labels} />
              </Card.Tags>
            </Card>
          );
        })}
      </div>
    </RuleViewerLayout>
  );
}


export default withPageErrorBoundary(RedirectToRuleViewer);
