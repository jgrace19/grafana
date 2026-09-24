import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardEditPaneSplitterStyles = stylex.create({
  canvasWrappperOld: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
  },
  container: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
  },
  bodyWrapper: {
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          flex: '1 1 0',
          overflow: 'hidden',
    
          ['@media (max-width: 543.95px)']: {
            flex: 1,
    
            ' > div:nth-child(2)': {
              zIndex: grafanaTokens.zIndex_activePanel,
            },
          },
  },
  bodyWrapperKiosk: {
    padding: themeSpacingShorthand(0, 2, 2, 2),
          overflow: 'unset',
  },
  scrollContainer: {
    display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
          overflow: 'auto',
          scrollbarWidth: 'thin',
          scrollbarGutter: 'stable',
          // without top padding the fixed controls headers is rendered over the selection outline.
          padding: themeSpacingShorthand(0.125, 1, 2, 2),
  },
  scrollContainerNoSidebar: {
    paddingRight: themeSpacing(2),
  },
  body: {
          display: 'flex',
          flexGrow: 1,
          gap: themeSpacing(1),
          boxSizing: 'border-box',
          flexDirection: 'column',
          // without top padding the fixed controls headers is rendered over the selection outline.
          padding: themeSpacingShorthand(0.125, 2, 2, 2),
  },
  bodyEditing: {
    position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto',
          scrollbarWidth: 'thin',
          scrollbarGutter: 'stable',
          // Because the edit pane splitter handle area adds padding we can reduce it here
          paddingRight: themeSpacing(1),
  },
  controlsWrapperSticky: {
    ['@media (min-width: 769px)']: {
            position: 'sticky',
            // above docked dashboard edit Sidebar (zIndex navBarFixed); otherwise time picker popover stays under it.
            zIndex: grafanaTokens.zIndex_sidemenu,
            background: grafanaTokens.colors_background_canvas,
            top: 0,
          },
  },
});
