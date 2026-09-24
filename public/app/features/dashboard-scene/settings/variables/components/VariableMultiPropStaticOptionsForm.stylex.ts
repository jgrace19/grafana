import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const variableMultiPropStaticOptionsFormStyles = stylex.create({
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
  },
  grid: {
    display: 'grid',
          gap: themeSpacing(0.5),
          width: '100%',
  },
  headerRow: {
    display: 'grid',
          gridTemplateColumns,
          alignItems: 'end',
          background: grafanaTokens.colors_background_primary,
          borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  headerCell: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
          color: grafanaTokens.colors_text_primary,
          textAlign: 'left',
          padding: themeSpacingShorthand(0, 0.5, 1, 0.5),
  },
  deletePropertyButton: {
    position: 'absolute',
          right: '2px',
          zIndex: 1,
  },
  body: {
    display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(0.5),
  },
  row: {
    display: 'grid',
          gridTemplateColumns,
          alignItems: 'center',
          position: 'relative',
  },
  cell: {
    padding: themeSpacing(0.5),
  },
  dragIcon: {
    cursor: 'grab',
  },
  addNewOptionButton: {
    margin: themeSpacingShorthand(1, 0, 1, 0),
  },
});
