import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

const motionNoPreference = '@media (prefers-reduced-motion: no-preference)';

export const panelAssistantHintStyles = stylex.create({
  hintButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 20,
    height: 20,
    cursor: 'pointer',
    opacity: 0,
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    [motionNoPreference]: {
      transition: 'opacity 150ms ease-in-out',
    },
    'section[class*="panel-container"]:hover &': {
      opacity: 1,
    },
  },
  hintCircle: {
    position: 'absolute',
    inset: 0,
    borderRadius: grafanaTokens.shape_radius_circle,
    background: 'linear-gradient(135deg, rgb(168, 85, 247), rgb(249, 115, 22))',
  },
  hintSparkle: {
    position: 'relative',
    color: '#fff',
    zIndex: 1,
  },
});
