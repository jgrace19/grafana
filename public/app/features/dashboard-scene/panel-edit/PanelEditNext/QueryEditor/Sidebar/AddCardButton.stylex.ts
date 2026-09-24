import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../../../core/stylex/spacing';

export const addCardButtonStyles = stylex.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: themeSpacing(2.5),
    height: themeSpacing(2.5),
    borderRadius: grafanaTokens.shape_radius_sm,
    border: 'none',
    background: grafanaTokens.colors_primary_main,
    color: grafanaTokens.colors_primary_contrastText,
    cursor: 'pointer',
    padding: 0,
    willChange: 'transform',
    ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
      transitionProperty: 'background-color, opacity, transform',
      transitionDuration: '100ms, 250ms',
      transitionTimingFunction: 'ease-in-out, cubic-bezier(0.25, 1, 0.5, 1)',
    },
    ':hover': {
      background: grafanaTokens.colors_primary_shade,
    },
  },
  buttonAlwaysVisible: {
    display: 'inline-flex',
    transform: 'translateZ(0)',
  },
  buttonAlwaysVisibleActive: {
    transform: 'scale(0.97)',
  },
  buttonHoverReveal: {
    display: 'flex',
    position: 'absolute',
    top: `calc(100% + ${themeSpacing(0.25)})`,
    left: themeSpacing(-2.5),
    zIndex: 1,
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(-50%) translateZ(0)',
    ':focus-visible': {
      opacity: 1,
      pointerEvents: 'auto',
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: grafanaTokens.colors_primary_border,
      outlineOffset: '2px',
    },
  },
  buttonHoverRevealActive: {
    transform: 'translateY(-50%) scale(0.97)',
  },
  buttonFocusVisible: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: grafanaTokens.colors_primary_border,
    outlineOffset: '2px',
  },
  buttonFocusVisibleHoverReveal: {
    opacity: 1,
    pointerEvents: 'auto',
  },
});
