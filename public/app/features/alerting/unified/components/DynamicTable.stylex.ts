import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const dynamicTableStyles = stylex.create({
  container: {
    border: `1px solid ${grafanaTokens.colors_border_weak}`,
    borderRadius: grafanaTokens.shape_radius_default,
    color: grafanaTokens.colors_text_secondary,
  },
  row: {
    display: 'grid',
    gridTemplateRows: '1fr auto',
  },
  rowOdd: {
    backgroundColor: grafanaTokens.colors_background_secondary,
  },
  rowEven: {
    backgroundColor: grafanaTokens.colors_background_primary,
  },
  footerRow: {
    display: 'flex',
    padding: themeSpacing(1),
  },
  cell: {
    display: 'flex',
    alignItems: 'center',
    padding: themeSpacing(1),
  },
  bodyCell: {
    overflow: 'hidden',
  },
  expandCell: {
    justifyContent: 'center',
  },
  expandedContentRow: {
    gridRow: 2,
    padding: themeSpacingShorthand(0, 3, 0, 1),
    position: 'relative',
  },
});
