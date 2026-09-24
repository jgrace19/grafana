import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import * as React from 'react';

import { colorManipulator } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { Branding } from '../Branding/Branding';
import { type BrandingSettings } from '../Branding/types';
import { Footer } from '../Footer/Footer';

import { loginLayoutStyles } from './LoginLayout.stylex';

interface InnerBoxProps {
  enterAnimation?: boolean;
}
export const InnerBox = ({ children, enterAnimation = true }: React.PropsWithChildren<InnerBoxProps>) => {
  return (
    <div
      {...stylex.props(loginLayoutStyles.loginInnerBox, enterAnimation && loginLayoutStyles.enterAnimation)}
    >
      {children}
    </div>
  );
};

export interface LoginLayoutProps {
  /** Custom branding settings that can be used e.g. for previewing the Login page changes */
  branding?: BrandingSettings;
  isChangingPassword?: boolean;
}

export const LoginLayout = ({ children, branding, isChangingPassword }: React.PropsWithChildren<LoginLayoutProps>) => {
  const theme = useTheme2();
  const [startAnim, setStartAnim] = useState(false);
  const subTitle = branding?.loginSubtitle ?? Branding.GetLoginSubTitle();
  const loginTitle = branding?.loginTitle ?? Branding.LoginTitle;
  const loginLogo = branding?.loginLogo;
  const hideEdition = branding?.hideEdition ?? Branding.HideEdition;

  useEffect(() => setStartAnim(true), []);

  const customLoginBoxBackground = branding?.loginBoxBackground;
  const loginBoxBackgroundStyle =
    customLoginBoxBackground == null
      ? { background: colorManipulator.alpha(theme.colors.background.primary, 0.7), backgroundSize: 'cover' as const }
      : undefined;

  return (
    <Branding.LoginBackground
      {...mergeStylexClassName(
        stylex.props(loginLayoutStyles.container, startAnim && loginLayoutStyles.loginAnim),
        clsx(branding?.loginBackground)
      )}
    >
      <div {...stylex.props(loginLayoutStyles.loginMain)}>
        <div
          className={clsx('login-content-box', customLoginBoxBackground)}
          {...mergeStylexClassName(
            stylex.props(loginLayoutStyles.loginContent, startAnim && loginLayoutStyles.loginAnimContent),
            undefined
          )}
          style={loginBoxBackgroundStyle}
        >
          <div {...stylex.props(loginLayoutStyles.loginLogoWrapper)}>
            <Branding.LoginLogo {...stylex.props(loginLayoutStyles.loginLogo)} logo={loginLogo} />
            <div {...stylex.props(loginLayoutStyles.titleWrapper)}>
              {isChangingPassword ? (
                <h1 {...stylex.props(loginLayoutStyles.mainTitle)}>
                  <Trans i18nKey="login.layout.update-password">Update your password</Trans>
                </h1>
              ) : (
                <>
                  <h1 {...stylex.props(loginLayoutStyles.mainTitle)}>{loginTitle}</h1>
                  {subTitle && <h3 {...stylex.props(loginLayoutStyles.subTitle)}>{subTitle}</h3>}
                </>
              )}
            </div>
          </div>
          <div {...stylex.props(loginLayoutStyles.loginOuterBox)}>{children}</div>
        </div>
      </div>
      {branding?.hideFooter ? <></> : <Footer hideEdition={hideEdition} customLinks={branding?.footerLinks} />}
    </Branding.LoginBackground>
  );
};
