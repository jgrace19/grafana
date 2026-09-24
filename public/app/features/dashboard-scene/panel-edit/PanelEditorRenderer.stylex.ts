import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelEditorRendererStyles = stylex.create({
  pageContainer: {
    display: 'grid',
          gridTemplateAreas: `
            "panels"`,
          gridTemplateColumns: `1fr`,
          gridTemplateRows: '1fr',
          height: '100%',
          [scrollReflowMediaQuery]: {
            gridTemplateColumns: `100%`,
          },
  },
  pageContainerWithControls: {
    gridTemplateAreas: `
            "controls"
            "panels"`,
          gridTemplateRows: 'auto 1fr',
  },
  container: {
    gridArea: 'panels',
          height: '100%',
  },
  canvasContent: {
    label: 'canvas-content',
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '100%',
          flexGrow: 1,
          minHeight: 0,
          width: '100%',
  },
  content: {
    position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'unset',
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
          marginTop: themeSpacing(2),
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderTopLeftRadius: grafanaTokens.shape_radius_default,
  },
  expandOptionsWrapper: {
    display: 'flex',
          flexDirection: 'column',
          padding: themeSpacingShorthand(2, 1),
  },
  expandDataPane: {
    display: 'flex',
          flexDirection: 'row',
          padding: themeSpacing(1),
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderRight: `1px solid ${grafanaTokens.colors_border_weak}`,
          background: grafanaTokens.colors_background_primary,
          flexGrow: 1,
          justifyContent: 'space-around',
  },
  rotate180: {
    rotate: '180deg',
  },
  controlsWrapper: {
    display: 'flex',
          flexDirection: 'column',
          flexGrow: 0,
          gridArea: 'controls',
  },
  openDataPaneButton: {
    width: themeSpacing(8),
          justifyContent: 'center',
          svg: {
            rotate: '-90deg',
          },
  },
  vizWrapper: {
    height: '100%',
          width: '100%',
          paddingLeft: themeSpacing(2),
  },
  fixedSizeViz: {
    height: '100vh',
  },
  fullSizeEditor: {
    height: 'max-content',
  },
});
