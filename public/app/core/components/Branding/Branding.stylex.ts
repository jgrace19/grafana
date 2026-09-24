import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

const motionBoth = '@media (prefers-reduced-motion: no-preference), (prefers-reduced-motion: reduce)';
const upMd = '@media (min-width: 769px)';

export const brandingStyles = stylex.create({
  loginBackground: {
    '::before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      backgroundImage: 'var(--grafana-login-bg-image)',
      backgroundPosition: 'top center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',
      opacity: 0,
      [motionBoth]: {
        transitionProperty: 'opacity',
        transitionDuration: '3s',
        transitionTimingFunction: 'ease-in-out',
      },
      [upMd]: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      },
    },
  },
  homeLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: themeSpacing(3),
    width: themeSpacing(3),
    margin: themeSpacingShorthand(0, 0.5),
  },
  homeLinkImage: {
    maxHeight: '100%',
    maxWidth: '100%',
  },
});
