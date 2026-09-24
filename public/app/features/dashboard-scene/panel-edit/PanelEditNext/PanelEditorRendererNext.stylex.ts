import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelEditorRendererNextStyles = stylex.create({
  container: {
    height: '100%',
  },
  content: {
    position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'unset',
          paddingTop: themeSpacing(2),
          [scrollReflowMediaQuery]: {
            height: 'auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(470px, 1fr) 330px',
            gridTemplateRows: '1fr',
            gap: themeSpacing(1),
            position: 'static',
            width: '100%',
          },
  },
  body: {
    label: 'body',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
  },
  optionsPane: {
    flexDirection: 'column',
          borderLeft: `1px solid ${grafanaTokens.colors_border_weak}`,
          background: grafanaTokens.colors_background_primary,
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderTopLeftRadius: grafanaTokens.shape_radius_default,
  },
  expandOptionsWrapper: {
    display: 'flex',
          flexDirection: 'column',
          padding: themeSpacingShorthand(2, 1),
  },
  rotate180: {
    rotate: '180deg',
  },
});
