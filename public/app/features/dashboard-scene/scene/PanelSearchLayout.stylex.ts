import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelSearchLayoutStyles = stylex.create({
  grid: {
    display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: themeSpacing(1),
          gridAutoRows: '320px',
  },
  perRow: {
    gridTemplateColumns: `repeat(var(${panelsPerRowCSSVar}, 3), 1fr)`,
  },
  noHits: {
    display: 'grid',
          placeItems: 'center',
  },
});
