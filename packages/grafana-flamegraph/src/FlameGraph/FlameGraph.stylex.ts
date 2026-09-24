import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const flameGraphStyles = stylex.create({
  graph: {
    overflow: 'auto',
    flexGrow: 1,
    flexBasis: '50%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: grafanaTokens.spacing_x1,
  },
  buttonSpacing: {
    marginRight: grafanaTokens.spacing_x1,
  },
  sandwichCanvasWrapper: {
    display: 'flex',
  },
  sandwichMarker: {
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  sandwichMarkerCalees: {
    textAlign: 'right',
  },
  sandwichMarkerIcon: {
    verticalAlign: 'baseline',
  },
});
