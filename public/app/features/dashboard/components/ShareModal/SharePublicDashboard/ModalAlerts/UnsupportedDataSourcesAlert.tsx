import * as stylex from '@stylexjs/stylex';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Alert } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

const selectors = e2eSelectors.pages.ShareDashboardModal.PublicDashboard;

export const UnsupportedDataSourcesAlert = ({ unsupportedDataSources }: { unsupportedDataSources: string }) => {
  return (
    <Alert
      severity="warning"
      title={t('public-dashboard.modal-alerts.unsupported-data-source-alert-title', 'Unsupported data sources')}
      data-testid={selectors.UnsupportedDataSourcesWarningAlert}
      bottomSpacing={0}
    >
      <p {...stylex.props(styles.unsupportedDataSourceDescription)}>
        <Trans i18nKey="public-dashboard.share-externally.unsupported-data-source-alert-desc">
          There are data sources in this dashboard that are unsupported for shared dashboards. Panels that use these
          data sources may not function properly: {{ unsupportedDataSources }}.
        </Trans>
      </p>
      <a
        href={
          'https://grafana.com/docs/grafana/next/dashboards/share-dashboards-panels/shared-dashboards/#supported-data-sources'
        }
        target="blank"
        {...mergeStylexProps(stylex.props(styles.unsupportedDataSourceDescription), { className: 'text-link' })}
      >
        <Trans i18nKey="public-dashboard.modal-alerts.unsupport-data-source-alert-readmore-link">
          Read more about supported data sources
        </Trans>
      </a>
    </Alert>
  );
};

const styles = stylex.create({
  unsupportedDataSourceDescription: {
    color: colors['--gf-colors-text-secondary'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
});
