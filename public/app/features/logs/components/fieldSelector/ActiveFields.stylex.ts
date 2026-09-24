import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const activeFieldsStyles = stylex.create({
  wrap: {
    marginTop: themeSpacing(1),
          marginBottom: themeSpacing(1),
          display: 'flex',
          background: grafanaTokens.colors_background_primary,
  },
  dragging: {
    background: grafanaTokens.colors_background_secondary,
  },
  columnHeader: {
    display: 'flex',
          justifyContent: 'space-between',
          fontSize: grafanaTokens.typography_h6_fontSize,
          background: grafanaTokens.colors_background_secondary,
          position: 'sticky',
          top: 0,
          left: 0,
          paddingTop: themeSpacing(0.75),
          paddingRight: themeSpacing(0.75),
          paddingBottom: themeSpacing(0.75),
          paddingLeft: themeSpacing(1.5),
          zIndex: 3,
          marginBottom: themeSpacing(2),
  },
  columnSubHeader: {
    padding: themeSpacingShorthand(0, 0, 0.75, 0.5),
          color: grafanaTokens.colors_text_secondary,
  },
  columnHeaderButton: {
    appearance: 'none',
          background: 'none',
          border: 'none',
          fontSize: 9.625rem,
  },
  columnWrapper: {
    marginBottom: themeSpacing(1.5),
          // need some space or the outline of the checkbox is cut off
          paddingLeft: themeSpacing(0.5),
  },
});
