import { css, keyframes } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import * as React from 'react';

import { type GrafanaTheme2 } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { bp, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { Branding } from '../Branding/Branding';
import { type BrandingSettings } from '../Branding/types';
import { Footer } from '../Footer/Footer';

interface InnerBoxProps {
  enterAnimation?: boolean;
}
export const InnerBox = ({ children, enterAnimation = true }: React.PropsWithChildren<InnerBoxProps>) => {
  return <div {...stylex.props(styles.loginInnerBox, enterAnimation && styles.enterAnimation)}>{children}</div>;
};

export interface LoginLayoutProps {
  /** Custom branding settings that can be used e.g. for previewing the Login page changes */
  branding?: BrandingSettings;
  isChangingPassword?: boolean;
}

export const LoginLayout = ({ children, branding, isChangingPassword }: React.PropsWithChildren<LoginLayoutProps>) => {
  const [startAnim, setStartAnim] = useState(false);
  const subTitle = branding?.loginSubtitle ?? Branding.GetLoginSubTitle();
  const loginTitle = branding?.loginTitle ?? Branding.LoginTitle;
  const loginBoxBackground = branding?.loginBoxBackground || Branding.LoginBoxBackground();
  const loginLogo = branding?.loginLogo;
  const hideEdition = branding?.hideEdition ?? Branding.HideEdition;

  useEffect(() => setStartAnim(true), []);

  return (
    <Branding.LoginBackground
      className={clsx(
        stylex.props(styles.container).className,
        startAnim && 'gf-login-anim',
        branding?.loginBackground
      )}
    >
      <div {...stylex.props(styles.loginMain)}>
        <div
          className={clsx(
            stylex.props(styles.loginContent, startAnim && styles.loginContentVisible).className,
            loginBoxBackground,
            'login-content-box'
          )}
        >
          <div {...stylex.props(styles.loginLogoWrapper)}>
            <Branding.LoginLogo className={stylex.props(styles.loginLogo).className} logo={loginLogo} />
            <div {...stylex.props(styles.titleWrapper)}>
              {isChangingPassword ? (
                <h1 {...stylex.props(styles.mainTitle)}>
                  <Trans i18nKey="login.layout.update-password">Update your password</Trans>
                </h1>
              ) : (
                <>
                  <h1 {...stylex.props(styles.mainTitle)}>{loginTitle}</h1>
                  {subTitle && <h3 {...stylex.props(styles.subTitle)}>{subTitle}</h3>}
                </>
              )}
            </div>
          </div>
          <div {...stylex.props(styles.loginOuterBox)}>{children}</div>
        </div>
      </div>
      {branding?.hideFooter ? <></> : <Footer hideEdition={hideEdition} customLinks={branding?.footerLinks} />}
    </Branding.LoginBackground>
  );
};

const flyInAnimation = stylex.keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-60px, 0px)',
  },
  to: {
    opacity: 1,
    transform: 'translate(0px, 0px)',
  },
});

const styles = stylex.create({
  loginMain: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },
  container: {
    minHeight: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    flex: '1',
    minWidth: '100%',
    marginLeft: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLogo: {
    width: '100%',
    maxWidth: { default: 60, [bp.smUp]: 100 },
    marginBottom: spacing['--gf-spacing-x2'],
  },
  loginLogoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: spacing['--gf-spacing-x3'],
    paddingRight: spacing['--gf-spacing-x3'],
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: spacing['--gf-spacing-x3'],
  },
  titleWrapper: {
    textAlign: 'center',
  },
  mainTitle: {
    fontSize: { default: 22, [bp.smUp]: 32 },
  },
  subTitle: {
    fontSize: typography['--gf-typography-size-md'],
    color: colors['--gf-colors-text-secondary'],
  },
  loginContent: {
    maxWidth: 478,
    width: 'calc(100% - 2rem)',
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    position: 'relative',
    justifyContent: { default: 'flex-start', [bp.smUp]: 'center' },
    zIndex: 1,
    minHeight: { default: 320, [bp.smUp]: `calc(${spacing['--gf-spacing-grid-size']} * 40)` },
    borderRadius: shape['--gf-shape-radius-lg'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x0'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x0'],
    opacity: { default: 0, [motion.reduce]: 1 },
    transitionProperty: { default: null, [motion.noPreference]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreference]: '0.5s' },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease-in-out' },
  },
  loginContentVisible: {
    opacity: 1,
  },
  loginOuterBox: {
    display: 'flex',
    overflowY: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginInnerBox: {
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    maxWidth: 415,
    width: '100%',
    transform: 'translate(0px, 0px)',
    transitionProperty: { default: null, [motion.noPreference]: 'all' },
    transitionDuration: { default: null, [motion.noPreference]: '0.25s' },
    transitionTimingFunction: { default: null, [motion.noPreference]: 'ease' },
  },
  enterAnimation: {
    animationName: { default: null, [motion.noPreference]: flyInAnimation },
    animationDuration: { default: null, [motion.noPreference]: '0.2s' },
    animationTimingFunction: { default: null, [motion.noPreference]: 'ease-out' },
  },
});

const legacyFlyInAnimation = keyframes`
from{
  opacity: 0;
  transform: translate(-60px, 0px);
}

to{
  opacity: 1;
  transform: translate(0px, 0px);
}`;

/**
 * @deprecated Emotion compat for PublicDashboardNotAvailable (outside `core`), which still builds on the login
 * page styles. stylex: pending PublicDashboardNotAvailable migration. LoginLayout itself uses StyleX.
 */
export const getLoginStyles = (theme: GrafanaTheme2) => {
  return {
    loginMain: css({
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '100%',
    }),
    container: css({
      minHeight: '100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      flex: '1',
      minWidth: '100%',
      marginLeft: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    loginAnim: css({
      ['&:before']: {
        opacity: 1,
      },

      ['.login-content-box']: {
        opacity: 1,
      },
    }),
    submitButton: css({
      justifyContent: 'center',
      width: '100%',
    }),
    loginLogo: css({
      width: '100%',
      maxWidth: 60,
      marginBottom: theme.spacing(2),

      [theme.breakpoints.up('sm')]: {
        maxWidth: 100,
      },
    }),
    loginLogoWrapper: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: theme.spacing(3),
    }),
    titleWrapper: css({
      textAlign: 'center',
    }),
    mainTitle: css({
      fontSize: 22,

      [theme.breakpoints.up('sm')]: {
        fontSize: 32,
      },
    }),
    subTitle: css({
      fontSize: theme.typography.size.md,
      color: theme.colors.text.secondary,
    }),
    loginContent: css({
      maxWidth: 478,
      width: 'calc(100% - 2rem)',
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'column',
      position: 'relative',
      justifyContent: 'flex-start',
      zIndex: 1,
      minHeight: 320,
      borderRadius: theme.shape.radius.lg,
      padding: theme.spacing(2, 0),
      opacity: 0,
      [theme.transitions.handleMotion('no-preference')]: {
        transition: 'opacity 0.5s ease-in-out',
      },
      [theme.transitions.handleMotion('reduce')]: {
        opacity: 1,
      },

      [theme.breakpoints.up('sm')]: {
        minHeight: theme.spacing(40),
        justifyContent: 'center',
      },
    }),
    loginOuterBox: css({
      display: 'flex',
      overflowY: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    loginInnerBox: css({
      padding: theme.spacing(0, 2, 2, 2),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
      maxWidth: 415,
      width: '100%',
      transform: 'translate(0px, 0px)',
      [theme.transitions.handleMotion('no-preference')]: {
        transition: '0.25s ease',
      },
    }),
    enterAnimation: css({
      [theme.transitions.handleMotion('no-preference')]: {
        animation: `${legacyFlyInAnimation} ease-out 0.2s`,
      },
    }),
  };
};
