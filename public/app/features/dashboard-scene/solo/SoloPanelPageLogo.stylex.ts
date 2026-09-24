import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const soloPanelPageLogoStyles = stylex.create({
  logoContainer: {
    position: 'absolute',
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          lineHeight: 1.2,
  },
  logoHidden: {
    opacity: 0,
  },
  text: {
    lineHeight: 1.2, display: 'block',
  },
  logo: {
    display: 'block', flexShrink: 0,
  },
});
