import * as stylex from '@stylexjs/stylex';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { Branding } from '../../../../core/components/Branding/Branding';

const selectors = e2eSelectors.pages.PublicDashboard.NotAvailable;

export const PublicDashboardNotAvailable = ({ paused }: { paused?: boolean }) => {
  const loginBoxBackground = Branding.LoginBoxBackground();

  return (
    <Branding.LoginBackground
      // `gf-login-anim` shows LoginBackground's image straight away.
      className={`${stylex.props(styles.container).className} gf-login-anim`}
      data-testid={selectors.container}
    >
      <div {...mergeStylexProps(stylex.props(styles.box), { className: loginBoxBackground })}>
        <Branding.LoginLogo className={stylex.props(styles.loginLogo).className} />
        <p {...stylex.props(styles.title)} data-testid={selectors.title}>
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
          <p {...stylex.props(styles.description)} data-testid={selectors.pausedDescription}>
            <Trans i18nKey="dashboard.public-dashboard-not-available.try-again-later">Try again later</Trans>
          </p>
        )}
      </div>
    </Branding.LoginBackground>
  );
};

const styles = stylex.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  loginLogo: {
    width: '100%',
    maxWidth: { default: 60, [bp.smUp]: 100 },
    marginBottom: spacing['--gf-spacing-x2'],
  },
  box: {
    width: '608px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x4'],
    zIndex: 1,
    borderRadius: `calc(${shape['--gf-shape-radius-default']} * 4)`,
    paddingTop: spacing['--gf-spacing-x6'],
    paddingRight: spacing['--gf-spacing-x8'],
    paddingBottom: spacing['--gf-spacing-x6'],
    paddingLeft: spacing['--gf-spacing-x8'],
    opacity: 1,
  },
  title: {
    fontSize: typography['--gf-typography-h3-font-size'],
    textAlign: 'center',
    margin: 0,
  },
  description: {
    fontSize: typography['--gf-typography-h5-font-size'],
    margin: 0,
  },
});
