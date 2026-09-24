import * as stylex from '@stylexjs/stylex';

import { Trans } from '@grafana/i18n';
import { LinkButton, CallToActionCard, Icon } from '@grafana/ui';
import { breakpointWidths } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';
import { AccessControlAction } from 'app/types/accessControl';

export const NoDataSourceCallToAction = () => {
  const canCreateDataSource =
    contextSrv.hasPermission(AccessControlAction.DataSourcesCreate) &&
    contextSrv.hasPermission(AccessControlAction.DataSourcesWrite);

  const message =
    'Explore requires at least one data source. Once you have added a data source, you can query it here.';
  const footer = (
    <>
      <Icon name="rocket" />
      <>
        <Trans i18nKey="explore.no-data-source-call-to-action.footer.pro-tip-define-sources-through-configuration-files">
          {' '}
          ProTip: You can also define data sources through configuration files.{' '}
        </Trans>
      </>
      <a
        href="http://docs.grafana.org/administration/provisioning/?utm_source=explore#data-sources"
        target="_blank"
        rel="noreferrer"
        className="text-link"
      >
        <Trans i18nKey="explore.no-data-source-call-to-action.footer.learn-more">Learn more</Trans>
      </a>
    </>
  );

  const ctaElement = (
    <LinkButton size="lg" href="datasources/new" icon="database" disabled={!canCreateDataSource}>
      <Trans i18nKey="explore.no-data-source-call-to-action.cta-element.add-data-source">Add data source</Trans>
    </LinkButton>
  );

  return (
    <CallToActionCard
      callToActionElement={ctaElement}
      className={stylex.props(styles.card).className}
      footer={footer}
      message={message}
    />
  );
};

const styles = stylex.create({
  card: {
    maxWidth: breakpointWidths.lg,
    marginTop: spacing['--gf-spacing-x2'],
    alignSelf: 'center',
  },
});
