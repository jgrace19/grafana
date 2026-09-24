import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const embeddedDashboardStyles = stylex.create({
  canvas: {
          display: 'grid',
          gridTemplateAreas: `
            "panels"`,
          gridTemplateColumns: `1fr`,
          gridTemplateRows: '1fr',
          flexBasis: '100%',
          flexGrow: 1,
  },
  canvasWithControls: {
    gridTemplateAreas: `
            "controls"
            "panels"`,
          gridTemplateRows: 'auto 1fr',
  },
  body: {
          flexGrow: 1,
          display: 'flex',
          gap: '8px',
          gridArea: 'panels',
          marginBottom: themeSpacing(2),
  },
  controlsWrapper: {
    display: 'flex',
          flexDirection: 'column',
          flexGrow: 0,
          gridArea: 'controls',
          padding: themeSpacingShorthand(2, 0, 2, 2),
  },
});
