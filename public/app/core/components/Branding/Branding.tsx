import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, type FC, type JSX } from 'react';

import { colorManipulator, type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Tooltip, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import g8LoginDarkSvg from 'img/g8_login_dark.svg';
import g8LoginLightSvg from 'img/g8_login_light.svg';
import grafanaIconSvg from 'img/grafana_icon.svg';

import { brandingStyles } from './Branding.stylex';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo, ...rest }) => {
  return <img className={className} src={`${logo ? logo : grafanaIconSvg}`} alt="Grafana" {...rest} />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();
  const bgImage = theme.isDark ? g8LoginDarkSvg : g8LoginLightSvg;

  return (
    <div
      {...mergeStylexClassName(stylex.props(brandingStyles.loginBackground), className)}
      style={{ '--grafana-login-bg-image': `url(${bgImage})` } as CSSProperties}
    >
      {children}
    </div>
  );
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  return <img className={className} src={grafanaIconSvg} alt="Grafana" />;
};

/**
 * inMegaMenuOverlay = true we just render the logo without link (used in mega menu)
 */
export function HomeLink({ homeNav, inMegaMenuOverlay }: { homeNav?: NavModelItem; inMegaMenuOverlay?: boolean }) {
  const onHomeClicked = () => {
    reportInteraction('grafana_home_clicked');
  };

  const linkProps = stylex.props(brandingStyles.homeLink);

  if (inMegaMenuOverlay) {
    return (
      <div {...linkProps}>
        <Branding.MenuLogo {...stylex.props(brandingStyles.homeLinkImage)} />
      </div>
    );
  }

  return (
    <Tooltip placement="bottom" content={homeNav?.text || 'Home'}>
      <a
        onClick={onHomeClicked}
        data-testid={selectors.components.Breadcrumbs.breadcrumb('Home')}
        {...linkProps}
        title={homeNav?.text || 'Home'}
        href={homeNav?.url}
      >
        <Branding.MenuLogo {...stylex.props(brandingStyles.homeLinkImage)} />
      </a>
    </Tooltip>
  );
}

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return colorManipulator.alpha(theme.colors.background.primary, 0.7);
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'Grafana';
  static LoginTitle = 'Welcome to Grafana';
  static HideEdition = false;
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
