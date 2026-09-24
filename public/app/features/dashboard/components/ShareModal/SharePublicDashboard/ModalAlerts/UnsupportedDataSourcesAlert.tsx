import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { unsupportedDataSourcesAlertStyles } from './UnsupportedDataSourcesAlert.stylex';
import cx from 'classnames';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Alert, useStyles2 } from '@grafana/ui';

const selectors = e2eSelectors.pages.ShareDashboardModal.PublicDashboard;

export const UnsupportedDataSourcesAlert = ({ unsupportedDataSources }: { unsupportedDataSources: string }) => {

  return (
    <Alert
      severity="warning"
      title={t('public-dashboard.modal-alerts.unsupported-data-source-alert-title', 'Unsupported data sources')}
      data-testid={selectors.UnsupportedDataSourcesWarningAlert}
      bottomSpacing={0}
    >
      <p {...stylex.props(unsupportedDataSourcesAlertStyles.unsupportedDataSourceDescription)}>
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
        {...mergeStylexClassName(stylex.props(unsupportedDataSourcesAlertStyles.unsupportedDataSourceDescription, 'text-link', ), undefined)}
      >
        <Trans i18nKey="public-dashboard.modal-alerts.unsupport-data-source-alert-readmore-link">
          Read more about supported data sources
        </Trans>
      </a>
    </Alert>
  );
};

