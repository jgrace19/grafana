import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { useTheme2 } from '@grafana/ui';
import { colors, typography } from '@grafana/ui/stylex/tokens.stylex';
import grafanaTextLogoDarkSvg from 'img/grafana_text_logo_dark.svg';
import grafanaTextLogoLightSvg from 'img/grafana_text_logo_light.svg';

const FOOTER_URL = 'https://grafana.com/?src=grafananet&cnt=public-dashboards';
const GRAFANA_LOGO_LIGHT_URL = grafanaTextLogoLightSvg;
const GRAFANA_LOGO_DARK_URL = grafanaTextLogoDarkSvg;
const GRAFANA_LOGO_DEFAULT_VALUE = 'grafana-logo';

export interface PublicDashboardCfg {
  footerHide: boolean;
  footerText: React.ReactNode;
  footerLogo: string;
  footerLink: string;
  headerLogoHide: boolean;
}
const useGetConfig = (cfg?: PublicDashboardCfg) => {
  const theme = useTheme2();

  const { footerHide, footerText, footerLink, footerLogo, headerLogoHide } = cfg || {
    footerHide: false,
    footerText: 'Powered by',
    footerLogo: GRAFANA_LOGO_DEFAULT_VALUE,
    footerLink: FOOTER_URL,
    headerLogoHide: false,
  };

  return {
    footerHide,
    footerText: <span {...stylex.props(styles.text)}>{footerText}</span>,
    footerLogo:
      footerLogo === GRAFANA_LOGO_DEFAULT_VALUE
        ? theme.isDark
          ? GRAFANA_LOGO_LIGHT_URL
          : GRAFANA_LOGO_DARK_URL
        : footerLogo,
    footerLink,
    headerLogoHide,
  };
};
export let useGetPublicDashboardConfig = (): PublicDashboardCfg => useGetConfig();

export function setPublicDashboardConfigFn(cfg: PublicDashboardCfg) {
  useGetPublicDashboardConfig = (): PublicDashboardCfg => useGetConfig(cfg);
}

const styles = stylex.create({
  text: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-font-size'],
  },
});
