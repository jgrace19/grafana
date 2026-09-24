import * as stylex from '@stylexjs/stylex';
import { useToggle } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Button, LinkButton, LoadingPlaceholder, Pagination, Spinner, Stack, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { type CombinedRuleNamespace } from 'app/types/unified-alerting';

import { DEFAULT_PER_PAGE_PAGINATION } from '../../../../../core/constants';
import { LogMessages, logInfo } from '../../Analytics';
import { AlertingAction, useAlertingAbility } from '../../hooks/useAbilities';
import { flattenGrafanaManagedRules } from '../../hooks/useCombinedRuleNamespaces';
import { usePagination } from '../../hooks/usePagination';
import { useUnifiedAlertingSelector } from '../../hooks/useUnifiedAlertingSelector';
import { useRulesAccess } from '../../utils/accessControlHooks';
import { GRAFANA_RULES_SOURCE_NAME } from '../../utils/datasource';
import { initialAsyncRequestState } from '../../utils/redux';
import { createRelativeUrl } from '../../utils/url';
import { GrafanaRulesExporter } from '../export/GrafanaRulesExporter';

import { RulesGroup } from './RulesGroup';
import { useCombinedGroupNamespace } from './useCombinedGroupNamespace';
import '../alertingPagination.css';

interface Props {
  namespaces: CombinedRuleNamespace[];
  expandAll: boolean;
}

export const GrafanaRules = ({ namespaces, expandAll }: Props) => {
  const [queryParams] = useQueryParams();

  const { prom, ruler } = useUnifiedAlertingSelector((state) => ({
    prom: state.promRules[GRAFANA_RULES_SOURCE_NAME] || initialAsyncRequestState,
    ruler: state.rulerRules[GRAFANA_RULES_SOURCE_NAME] || initialAsyncRequestState,
  }));

  const loading = prom.loading || ruler.loading;
  const hasResult = !!prom.result || !!ruler.result;

  const wantsListView = queryParams.view === 'list';
  const namespacesFormat = wantsListView ? flattenGrafanaManagedRules(namespaces) : namespaces;

  const groupsWithNamespaces = useCombinedGroupNamespace(namespacesFormat);

  const { numberOfPages, onPageChange, page, pageItems } = usePagination(
    groupsWithNamespaces,
    1,
    DEFAULT_PER_PAGE_PAGINATION
  );

  const [exportRulesSupported, exportRulesAllowed] = useAlertingAbility(AlertingAction.ExportGrafanaManagedRules);
  const canExportRules = exportRulesSupported && exportRulesAllowed;

  const [showExportDrawer, toggleShowExportDrawer] = useToggle(false);
  const hasGrafanaAlerts = namespaces.length > 0;
  const { canCreateGrafanaRules } = useRulesAccess();
  const grafanaRecordingRulesEnabled = config.unifiedAlerting.recordingRulesEnabled && canCreateGrafanaRules;

  return (
    <section {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.sectionHeader)}>
        <div {...stylex.props(styles.headerRow)}>
          <Text element="h2" variant="h5">
            <Trans i18nKey="alerting.list-view.section.grafanaManaged.title">Grafana-managed</Trans>
          </Text>
          {loading ? (
            <LoadingPlaceholder
              style={{ marginBottom: 0 }}
              text={t('alerting.list-view.section.grafanaManaged.loading', 'Loading...')}
            />
          ) : (
            <div />
          )}
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            {hasGrafanaAlerts && canExportRules && (
              <Button
                aria-label={t(
                  'alerting.grafana-rules.export-all-grafana-rules-aria-label-export-all-grafana-rules',
                  'export all grafana rules'
                )}
                data-testid="export-all-grafana-rules"
                icon="download-alt"
                tooltip={t(
                  'alerting.grafana-rules.export-all-grafana-rules-tooltip-export-all-grafanamanaged-rules',
                  'Export all Grafana-managed rules'
                )}
                onClick={toggleShowExportDrawer}
                variant="secondary"
              >
                <Trans i18nKey="alerting.list-view.section.grafanaManaged.export-rules">Export rules</Trans>
              </Button>
            )}
            {grafanaRecordingRulesEnabled && (
              <LinkButton
                href={createRelativeUrl('/alerting/new/grafana-recording', {
                  returnTo: '/alerting/list' + window.location.search,
                })}
                icon="plus"
                variant="secondary"
                tooltip={t(
                  'alerting.grafana-rules.tooltip-create-new-grafanamanaged-recording-rule',
                  'Create new Grafana-managed recording rule'
                )}
                onClick={() => logInfo(LogMessages.grafanaRecording)}
              >
                <Trans i18nKey="alerting.list-view.section.grafanaManaged.new-recording-rule">New recording rule</Trans>
              </LinkButton>
            )}
          </Stack>
        </div>
      </div>

      {pageItems.map(({ group, namespace }) => (
        <RulesGroup
          group={group}
          key={`${namespace.name}-${group.name}`}
          namespace={namespace}
          expandAll={expandAll}
          viewMode={wantsListView ? 'list' : 'grouped'}
        />
      ))}
      {hasResult && namespacesFormat?.length === 0 && (
        <p>
          <Trans i18nKey="alerting.grafana-rules.no-rules-found">No rules found.</Trans>
        </p>
      )}
      {!hasResult && loading && <Spinner size="xl" className={stylex.props(styles.spinner).className} />}
      <Pagination
        className="gf-alerting-pagination"
        currentPage={page}
        numberOfPages={numberOfPages}
        onNavigate={onPageChange}
        hideWhenSinglePage
      />
      {canExportRules && showExportDrawer && <GrafanaRulesExporter onClose={toggleShowExportDrawer} />}
    </section>
  );
};

const styles = stylex.create({
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: spacing['--gf-spacing-x1'],
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
    flexDirection: 'row',
  },
});
