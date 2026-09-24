import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const nodeStyles = stylex.create({
  mainGroup: {
    cursor: 'pointer',
        fontSize: '10px',
        [theme.transitions.handleMotion('no-preference', 'reduce')]: {
          transition: 'opacity 300ms',
        },
        opacity: hovering === 'inactive' ? 0.5 : 1,
  },
  mainCircle: {
    fill: theme.components.panel.background,
  },
  filledCircle: {
    fill: highlightedNodeColor,
  },
  hoverCircle: {
    opacity: 0.5,
        fill: 'transparent',
        stroke: grafanaTokens.colors_primary_text,
  },
  text: {
    fill: grafanaTokens.colors_text_primary,
        pointerEvents: 'none',
  },
  titleText: {
    textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        backgroundColor: tinycolor(grafanaTokens.colors_background_primary).setAlpha(0.6).toHex8String(),
        width: '140px',
  },
  statsText: {
    textAlign: 'center',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '70px',
  },
  textHovering: {
    width: '200px',
        '& span': {
          backgroundColor: tinycolor(grafanaTokens.colors_background_primary).setAlpha(0.8).toHex8String(),
        },
  },
  clickTarget: {
    fill: 'none',
        stroke: 'none',
        pointerEvents: 'fill',
  },
});
