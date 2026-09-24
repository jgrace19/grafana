import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { Trans, t } from '@grafana/i18n';
import { config, useAppPluginInstalled } from '@grafana/runtime';
import { UserStorage } from '@grafana/runtime/internal';
import { Alert, LinkButton } from '@grafana/ui';
import { components, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';

const userStorage = new UserStorage('advisor-redirect-notice');

export function AdvisorRedirectNotice() {
  const hasAdminRights = contextSrv.hasRole('Admin') || contextSrv.isGrafanaAdmin;
  const [showNotice, setShowNotice] = useState(false);
  const { value: isAdvisorInstalled } = useAppPluginInstalled('grafana-advisor-app');

  const canUseAdvisor = hasAdminRights && config.featureToggles.grafanaAdvisor && Boolean(isAdvisorInstalled);

  useEffect(() => {
    if (!canUseAdvisor) {
      return;
    }

    userStorage.getItem('showNotice').then((showNotice) => {
      if (showNotice !== 'false') {
        setShowNotice(true);
      }
    });
  }, [canUseAdvisor]);

  if (!showNotice) {
    return <></>;
  }

  return (
    <Alert
      severity="info"
      title=""
      onRemove={() => {
        userStorage.setItem('showNotice', 'false');
        setShowNotice(false);
      }}
    >
      <div {...stylex.props(styles.alertContent)}>
        <p {...stylex.props(styles.alertParagraph)}>
          <Trans i18nKey="connections.advisor-redirect-notice.body">
            Try the new Advisor to uncover potential issues with your data sources and plugins.
          </Trans>
        </p>
        <LinkButton
          aria-label={t('connections.advisor-redirect-notice.aria-label-link-to-advisor', 'Link to Advisor')}
          icon="arrow-right"
          href="/a/grafana-advisor-app"
          fill="text"
        >
          <Trans i18nKey="connections.advisor-redirect-notice.go-to-advisor">Go to Advisor</Trans>
        </LinkButton>
      </div>
    </Alert>
  );
}

const styles = stylex.create({
  alertContent: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertParagraph: {
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-sm']})`,
  },
});
