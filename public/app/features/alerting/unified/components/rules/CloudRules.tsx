import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { urlUtil } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Badge, LinkButton, LoadingPlaceholder, Pagination, Spinner, Stack, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';
import { AccessControlAction } from 'app/types/accessControl';
import { type CombinedRuleNamespace } from 'app/types/unified-alerting';

import { DEFAULT_PER_PAGE_PAGINATION } from '../../../../../core/constants';
import { AlertingAction, useAlertingAbility } from '../../hooks/useAbilities';
import { usePagination } from '../../hooks/usePagination';
import { useUnifiedAlertingSelector } from '../../hooks/useUnifiedAlertingSelector';
import { getRulesDataSources, getRulesSourceUid } from '../../utils/datasource';
import { isAsyncRequestStatePending } from '../../utils/redux';
import { createRelativeUrl } from '../../utils/url';

import { RulesGroup } from './RulesGroup';
import { useCombinedGroupNamespace } from './useCombinedGroupNamespace';
import '../alertingPagination.css';

interface Props {
  namespaces: CombinedRuleNamespace[];
  expandAll: boolean;
}

export const CloudRules = ({ namespaces, expandAll }: Props) => {
  const promRules = useUnifiedAlertingSelector((state) => state.promRules);
  const rulesDataSources = useMemo(getRulesDataSources, []);
  const groupsWithNamespaces = useCombinedGroupNamespace(namespaces);

  const dataSourcesLoading = useMemo(
    () => rulesDataSources.filter((ds) => isAsyncRequestStatePending(promRules[ds.name])),
    [promRules, rulesDataSources]
  );

  const hasSomeResults = rulesDataSources.some((ds) => Boolean(promRules[ds.name]?.result?.length));
  const hasDataSourcesConfigured = rulesDataSources.length > 0;
  const hasDataSourcesLoading = dataSourcesLoading.length > 0;
  const hasNamespaces = namespaces.length > 0;

  const { numberOfPages, onPageChange, page, pageItems } = usePagination(
    groupsWithNamespaces,
    1,
    DEFAULT_PER_PAGE_PAGINATION
  );

  const canMigrateToGMA =
    hasDataSourcesConfigured &&
    config.featureToggles.alertingMigrationUI &&
    contextSrv.hasPermission(AccessControlAction.AlertingRuleCreate) &&
    contextSrv.hasPermission(AccessControlAction.AlertingProvisioningSetStatus);

  return (
    <section {...stylex.props(styles.wrapper)}>
      <Stack gap={2} direction="column">
        <div {...stylex.props(styles.sectionHeader)}>
          <div {...stylex.props(styles.headerRow)}>
            <Text element="h2" variant="h5">
              <Trans i18nKey="alerting.list-view.section.dataSourceManaged.title">Data source-managed</Trans>
            </Text>
            {dataSourcesLoading.length ? (
              <LoadingPlaceholder
                style={{ marginBottom: 0 }}
                text={t('alerting.list-view.section.loading-rules', 'Loading rules from {{count}} sources', {
                  count: dataSourcesLoading.length,
                })}
              />
            ) : (
              <div />
            )}
            <Stack gap={1}>
              {canMigrateToGMA && hasSomeResults && <MigrateToGMAButton />}
              <CreateRecordingRuleButton />
            </Stack>
          </div>
        </div>
      </Stack>

      {pageItems.map(({ group, namespace }) => (
        <RulesGroup
          group={group}
          key={`${getRulesSourceUid(namespace.rulesSource)}-${namespace.name}-${group.name}`}
          namespace={namespace}
          expandAll={expandAll}
          viewMode={'grouped'}
        />
      ))}

      {!hasDataSourcesConfigured && (
        <p>
          <Trans i18nKey="alerting.list-view.no-prom-or-loki-rules">
            There are no Prometheus or Loki data sources configured
          </Trans>
        </p>
      )}
      {hasDataSourcesConfigured && !hasDataSourcesLoading && !hasNamespaces && (
        <p>
          <Trans i18nKey="alerting.list-view.no-rules">No rules found.</Trans>
        </p>
      )}
      {!hasSomeResults && hasDataSourcesLoading && (
        <Spinner size="xl" className={stylex.props(styles.spinner).className} />
      )}

      <Pagination
        className="gf-alerting-pagination"
        currentPage={page}
        numberOfPages={numberOfPages}
        onNavigate={onPageChange}
        hideWhenSinglePage
      />
    </section>
  );
};

const styles = stylex.create({
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  wrapper: {
    marginBottom: spacing['--gf-spacing-x4'],
  },
  spinner: {
    textAlign: 'center',
    padding: spacing['--gf-spacing-x2'],
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing['--gf-spacing-x1'],
  },
});

export function CreateRecordingRuleButton() {
  const [createCloudRuleSupported, createCloudRuleAllowed] = useAlertingAbility(AlertingAction.CreateExternalAlertRule);
  const location = useLocation();

  const canCreateCloudRules = createCloudRuleSupported && createCloudRuleAllowed;

  if (canCreateCloudRules) {
    return (
      <LinkButton
        key="new-recording-rule"
        href={urlUtil.renderUrl(`alerting/new/recording`, {
          returnTo: location.pathname + location.search,
        })}
        icon="plus"
        variant="secondary"
      >
        <Trans i18nKey="alerting.list-view.empty.new-ds-managed-recording-rule">
          New data source-managed recording rule
        </Trans>
      </LinkButton>
    );
  }
  return null;
}

function MigrateToGMAButton() {
  const importUrl = createRelativeUrl('/alerting/import-datasource-managed-rules');

  return (
    <LinkButton variant="secondary" href={importUrl} icon="arrow-up">
      <Stack direction="row" gap={1} alignItems="center">
        <Trans i18nKey="alerting.rule-list.import-to-gma.text">Import to Grafana-managed rules</Trans>
        <Badge
          text={t('alerting.rule-list.import-to-gma.new-badge', 'New!')}
          aria-label={t('alerting.migrate-to-gmabutton.aria-label-new', 'new')}
          color="blue"
          icon="rocket"
        />
      </Stack>
    </LinkButton>
  );
}
