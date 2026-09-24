import clsx from 'clsx';

import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { publicDashboardNotAvailableStyles } from './PublicDashboardNotAvailable.stylex';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';

import { Branding } from '../../../../core/components/Branding/Branding';
import { getLoginStyles } from '../../../../core/components/Login/LoginLayout';

const selectors = e2eSelectors.pages.PublicDashboard.NotAvailable;

export const PublicDashboardNotAvailable = ({ paused }: { paused?: boolean }) => {
  const loginStyles = useStyles2(getLoginStyles);

  const loginBoxBackground = Branding.LoginBoxBackground();

  return (
    <Branding.LoginBackground {...stylex.props(publicDashboardNotAvailableStyles.container)} data-testid={selectors.container}>
      <div {...mergeStylexClassName(stylex.props(publicDashboardNotAvailableStyles.box, , loginBoxBackground), undefined)}>
        <Branding.LoginLogo className={loginStyles.loginLogo} />
        <p {...stylex.props(publicDashboardNotAvailableStyles.title)} data-testid={selectors.title}>
          {paused
            ? t(
                'dashboard.public-dashboard-not-available.paused',
                'This dashboard has been paused by the administrator'
              )
            : t(
                'dashboard.public-dashboard-not-available.does-not-exist',
                'The dashboard you are trying to access does not exist'
              )}
        </p>
        {paused && (
          <p {...stylex.props(publicDashboardNotAvailableStyles.description)} data-testid={selectors.pausedDescription}>
            <Trans i18nKey="dashboard.public-dashboard-not-available.try-again-later">Try again later</Trans>
          </p>
        )}
      </div>
    </Branding.LoginBackground>
  );
};

