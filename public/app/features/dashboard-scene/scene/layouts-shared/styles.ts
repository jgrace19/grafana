import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

// The add/paste/ungroup actions shown on the canvas while editing. Their visibility (`.dashboard-canvas-controls`)
// is handled by canvasControls.global.css.
export const layoutControlsStyles = stylex.create({
  controls: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    height: spacing['--gf-spacing-x5'],
    bottom: 0,
    left: 0,
    minWidth: 'min-content',
  },
});
