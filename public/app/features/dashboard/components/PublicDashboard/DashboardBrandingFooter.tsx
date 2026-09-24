import * as stylex from '@stylexjs/stylex';
import i18n from 'i18next';

import { textUtil } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { useTheme2 } from '@grafana/ui';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import grafanaTextLogoDarkSvg from 'img/grafana_text_logo_dark.svg';
import grafanaTextLogoLightSvg from 'img/grafana_text_logo_light.svg';

import { useGetPublicDashboardConfig } from './usePublicDashboardConfig';

const selectors = e2eSelectors.pages.PublicDashboard;
const DEFAULT_GRAFANA_LOGO_TOKEN = 'grafana-logo';
const DEFAULT_KIOSK_FOOTER_LINK_URL = 'https://grafana.com/?src=grafananet&cnt=kiosk-dashboard';

export enum DashboardBrandingFooterVariant {
  Public = 'public',
  Kiosk = 'kiosk',
}

export interface DashboardBrandingFooterProps {
  /**
   * Variant presets:
   * - `Public`: uses public dashboard config defaults.
   * - `Kiosk`: uses Grafana defaults (doesn't inherit public dashboard branding overrides).
   */
  variant?: DashboardBrandingFooterVariant;

  /**
   * Horizontal padding for layouts without page padding (for example kiosk mode).
   */
  paddingX?: number;
  /**
   * Use a min height instead of fixed height to avoid clipping in `overflow: hidden` containers.
   */
  useMinHeight?: boolean;
  /**
   * Override the CTA link URL.
   */
  linkUrl?: string;

  /**
   * Override the footer text.
   */
  text?: React.ReactNode;

  /**
   * Override the logo URL.
   * - Use `'grafana-logo'` for the default Grafana text logo (light/dark via theme).
   * - Use `''` to hide the logo.
   */
  logo?: string;

  /**
   * Hide the footer (regardless of config).
   */
  hide?: boolean;
}

export const DashboardBrandingFooter = function ({
  variant = DashboardBrandingFooterVariant.Public,
  paddingX,
  useMinHeight,
  linkUrl,
  text,
  logo,
  hide,
}: DashboardBrandingFooterProps) {
  const theme = useTheme2();
  const conf = useGetPublicDashboardConfig();

  const isKioskVariant = variant === DashboardBrandingFooterVariant.Kiosk;

  // `conf.footerHide` only applies to the Public variant.
  if (hide || (!isKioskVariant && conf.footerHide)) {
    return null;
  }

  const href = textUtil.sanitizeUrl(linkUrl ?? (isKioskVariant ? DEFAULT_KIOSK_FOOTER_LINK_URL : conf.footerLink));
  const defaultText =
    variant === DashboardBrandingFooterVariant.Kiosk
      ? i18n.t('dashboard.kiosk.footerPoweredBy', 'Powered by')
      : undefined;
  const defaultLogo = variant === DashboardBrandingFooterVariant.Kiosk ? DEFAULT_GRAFANA_LOGO_TOKEN : undefined;

  // `conf.footerText` is already styled by `useGetPublicDashboardConfig()`. Avoid double-wrapping styles.
  const resolvedText = text !== undefined ? text : defaultText;
  const footerText =
    resolvedText !== undefined ? <span {...stylex.props(styles.text)}>{resolvedText}</span> : conf.footerText;

  // `logo=""` intentionally hides the logo, so we check `!== undefined` (not `??`).
  const footerLogo = logo !== undefined ? logo : (defaultLogo ?? conf.footerLogo);
  const resolvedLogo =
    footerLogo === DEFAULT_GRAFANA_LOGO_TOKEN
      ? theme.isDark
        ? grafanaTextLogoLightSvg
        : grafanaTextLogoDarkSvg
      : footerLogo;
  const logoSrc = resolvedLogo ? textUtil.sanitizeUrl(resolvedLogo) : '';

  return (
    <div
      {...stylex.props(
        styles.footer,
        paddingX !== undefined && styles.footerPaddingX(`calc(${spacing['--gf-spacing-grid-size']} * ${paddingX})`),
        useMinHeight && styles.footerMinHeight
      )}
      data-testid={selectors.footer}
    >
      <a {...stylex.props(styles.link)} href={href} target="_blank" rel="noreferrer noopener">
        {footerText} {logoSrc ? <img {...stylex.props(styles.logoImg)} alt="" src={logoSrc} /> : null}
      </a>
    </div>
  );
};

const styles = stylex.create({
  footer: {
    display: 'flex',
    justifyContent: 'end',
    height: '30px',
    backgroundColor: colors['--gf-colors-background-canvas'],
    position: 'sticky',
    bottom: 0,
    zIndex: zIndex.navbarFixed,
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: 0,
  },
  footerPaddingX: (padding: string) => ({
    boxSizing: 'border-box',
    paddingLeft: padding,
    paddingRight: padding,
  }),
  footerMinHeight: {
    height: 'auto',
    minHeight: '30px',
    alignItems: 'center',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    height: '16px',
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  text: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-font-size'],
  },
});
