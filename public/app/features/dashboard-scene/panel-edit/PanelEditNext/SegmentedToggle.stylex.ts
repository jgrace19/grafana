import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const segmentedToggleStyles = stylex.create({
  toggle: {
    position: 'relative',
    display: 'inline-flex',
    background: grafanaTokens.colors_background_secondary,
    borderRadius: grafanaTokens.shape_radius_default,
    padding: 2,
  },
  noBackground: {
    background: 'none',
  },
  slider: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    background: grafanaTokens.colors_background_canvas,
    borderRadius: grafanaTokens.shape_radius_default,
    pointerEvents: 'none',
    ['@media (prefers-reduced-motion: no-preference)']: {
      transitionProperty: 'left, width',
      transitionDuration: '200ms',
    },
  },
  tab: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: themeSpacing(0.5),
    background: 'transparent',
    border: 'none',
    borderRadius: grafanaTokens.shape_radius_default,
    padding: themeSpacingShorthand(0.5, 1.25),
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    color: grafanaTokens.colors_text_disabled,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ['@media (prefers-reduced-motion: no-preference)']: {
      transitionProperty: 'color',
      transitionDuration: '200ms',
    },
    ':focus-visible': {
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: grafanaTokens.colors_primary_main,
      outlineOffset: 2,
    },
  },
  tabActive: {
    color: grafanaTokens.colors_primary_text,
  },
});
