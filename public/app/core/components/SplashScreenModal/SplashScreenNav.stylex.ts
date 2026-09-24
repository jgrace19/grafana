import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const splashScreenNavStyles = stylex.create({
  nav: {
    display: 'flex',
        alignItems: 'center',
        gap: themeSpacing(1),
  },
  navButton: {
    width: themeSpacing(3),
        minWidth: themeSpacing(3),
        padding: 0,
        justifyContent: 'center',
  },
  dots: {
    display: 'flex',
        alignItems: 'center',
        // 5px gap matches design's 9px center-to-center dot spacing
        gap: 5,
  },
  dotBase: {
    borderRadius: grafanaTokens.shape_radius_circle,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
  },
  dotInactive: {
    width: 4,
    height: 4,
    backgroundColor: grafanaTokens.colors_text_disabled,
    opacity: 0.65,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'background-color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-in-out',
    },
    ':hover': {
      opacity: 1,
    },
  },
  dotActive: {
    width: 6,
        height: 6,
        backgroundColor: grafanaTokens.colors_warning_text,
  },
});
