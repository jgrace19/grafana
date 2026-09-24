import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const stateDotStyles = stylex.create({
  dot: {
    width: grafanaTokens.spacing_x1_25,
    height: grafanaTokens.spacing_x1_25,
    borderRadius: grafanaTokens.shape_radius_circle,
    backgroundColor: grafanaTokens.colors_secondary_shade,
    outlineStyle: 'solid',
    outlineWidth: '4px',
    outlineColor: grafanaTokens.colors_secondary_transparent,
    margin: '4px',
  },
  success: {
    backgroundColor: grafanaTokens.colors_success_main,
    outlineColor: grafanaTokens.colors_success_transparent,
  },
  warning: {
    backgroundColor: grafanaTokens.colors_warning_main,
    outlineColor: grafanaTokens.colors_warning_transparent,
  },
  error: {
    backgroundColor: grafanaTokens.colors_error_main,
    outlineColor: grafanaTokens.colors_error_transparent,
  },
  info: {
    backgroundColor: grafanaTokens.colors_info_main,
    outlineColor: grafanaTokens.colors_info_transparent,
  },
});

const stateIconSpin = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '50%': { transform: 'rotate(180deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const stateIconStyles = stylex.create({
  iconsContainer: {
    position: 'relative',
    width: 15,
    height: 15,
  },
  iconOverlay: {
    position: 'absolute',
  },
  spinning: {
    '@media (prefers-reduced-motion: no-preference)': {
      animationName: stateIconSpin,
      animationIterationCount: 'infinite',
      animationDuration: '1s',
      animationTimingFunction: 'linear',
    },
  },
});

export const alertLabelsStyles = stylex.create({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  wrapperMd: {
    gap: grafanaTokens.spacing_x1,
  },
  wrapperSm: {
    gap: grafanaTokens.spacing_x0_5,
  },
});

export const alertLabelStaticStyles = stylex.create({
  labelText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px',
  },
  clickable: {
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    boxShadow: 'none',
    padding: 0,
    margin: 0,
    ':hover': {
      opacity: 0.8,
      cursor: 'pointer',
    },
  },
  value: {
    borderLeftWidth: 0,
    borderLeftStyle: 'none',
    whiteSpace: 'pre',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px',
  },
});
