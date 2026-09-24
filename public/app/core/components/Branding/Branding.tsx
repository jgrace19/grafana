import * as stylex from '@stylexjs/stylex';
import { type FC, type JSX } from 'react';

import { type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Tooltip, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp, motion } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import g8LoginDarkSvg from 'img/g8_login_dark.svg';
import g8LoginLightSvg from 'img/g8_login_light.svg';
import grafanaIconSvg from 'img/grafana_icon.svg';

import { LoginBoxBackground } from './LoginBoxBackground.compat';

import './Branding.css';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return <img className={className} src={`${logo ? logo : grafanaIconSvg}`} alt="Grafana" />;
};

/** Adding the `gf-login-anim` class fades the background image in. */
const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();
  // A url() inside a custom property resolves against the stylesheet that uses it, not the document, so the
  // relative asset path has to be made absolute first.
  const backgroundImage = `url(${new URL(theme.isDark ? g8LoginDarkSvg : g8LoginLightSvg, document.baseURI).href})`;

  return (
    <div {...mergeStylexProps(stylex.props(styles.background, styles.backgroundImage(backgroundImage)), { className })}>
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
  const homeLinkClassName = `gf-home-link ${stylex.props(styles.homeLink).className}`;

  const onHomeClicked = () => {
    reportInteraction('grafana_home_clicked');
  };

  if (inMegaMenuOverlay) {
    return (
      <div className={homeLinkClassName}>
        <Branding.MenuLogo />
      </div>
    );
  }

  return (
    <Tooltip placement="bottom" content={homeNav?.text || 'Home'}>
      <a
        onClick={onHomeClicked}
        data-testid={selectors.components.Breadcrumbs.breadcrumb('Home')}
        className={homeLinkClassName}
        title={homeNav?.text || 'Home'}
        href={homeNav?.url}
      >
        <Branding.MenuLogo />
      </a>
    </Tooltip>
  );
}

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

const styles = stylex.create({
  homeLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: spacing['--gf-spacing-x3'],
    width: spacing['--gf-spacing-x3'],
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  background: {
    '::before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundPosition: { default: 'top center', [bp.mdUp]: 'center' },
      backgroundSize: { default: 'auto', [bp.mdUp]: 'cover' },
      backgroundRepeat: 'no-repeat',
      opacity: { default: 0, ':is(.gf-login-anim)': 1 },
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '3s' },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-in-out' },
    },
  },
  backgroundImage: (backgroundImage: string) => ({
    '::before': {
      backgroundImage,
    },
  }),
});
