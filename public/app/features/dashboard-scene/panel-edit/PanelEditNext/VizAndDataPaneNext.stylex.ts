import * as stylex from '@stylexjs/stylex';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const vizAndDataPaneNextStyles = stylex.create({
  pageContainer: {
    display: 'grid',
    gap: themeSpacing(2),
    overflow: 'hidden',
    paddingBottom: themeSpacing(2),
  },
  versionToggle: {
    gridArea: 'version-toggle',
    minWidth: 0,
    overflow: 'hidden',
  },
  versionToggleMini: {
    marginLeft: themeSpacing(2),
  },
  sidebar: {
    gridArea: 'sidebar',
    position: 'relative',
    paddingLeft: themeSpacing(2),
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
  },
  sidebarContent: {
    height: '100%',
  },
  viz: {
    gridArea: 'viz',
    overflow: 'visible',
    position: 'relative',
    minHeight: 0,
  },
  vizMini: {
    paddingLeft: themeSpacing(2),
  },
  dataPane: {
    gridArea: 'data-pane',
    overflow: 'hidden',
    minHeight: 0,
  },
  controlsWrapper: {
    gridArea: 'controls',
    display: 'flex',
    flexDirection: 'column',
  },
  controlsWrapperMini: {
    paddingLeft: themeSpacing(2),
  },
  fixedSizeViz: {
    height: '100vh',
  },
  vizResizeHandle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sidebarResizeHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
  resizeHandlePill: {
    height: '100%',
    width: 2,
  },
});
