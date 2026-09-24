import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const rowItemRendererStyles = stylex.create({
  rowHeader: {
    display: 'flex',
    gap: themeSpacing(1),
    padding: themeSpacingShorthand(0.5, 0.5, 0.5, 0),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: themeSpacing(1),
    ' .dashboard-row-header-drag-handle': {
      opacity: 0,
      ['@media (prefers-reduced-motion: no-preference), @media (prefers-reduced-motion: reduce)']: {
        transition: 'opacity 0.25s',
      },
    },
    ':hover .dashboard-row-header-drag-handle': {
      opacity: 1,
    },
  },
  rowTitleButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    minWidth: 0,
    gap: themeSpacing(1),
  },
  rowTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: themeSpacing(2),
    fontSize: grafanaTokens.typography_h5_fontSize,
    lineHeight: grafanaTokens.typography_h5_lineHeight,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    flexGrow: 1,
    minWidth: 0,
  },
  rowTitleHidden: {
    textDecoration: 'line-through',
    opacity: 0.6,
    ':hover': {
      opacity: 1,
    },
  },
  rowTitleNested: {
    fontSize: grafanaTokens.typography_body_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightRegular,
  },
  rowTitleCollapsed: {
    color: grafanaTokens.colors_text_secondary,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: themeSpacing(2.75 + 1 + 1 + 0.125),
    ':hover .dashboard-canvas-controls': {
      opacity: 1,
    },
    ':hover .dashboard-row-wrapper .dashboard-canvas-controls': {
      opacity: 0,
    },
    ':hover .dashboard-row-wrapper:hover .dashboard-canvas-controls': {
      opacity: 1,
    },
  },
  wrapperNotCollapsed: {
    ' > div:nth-child(2)': {
      marginLeft: themeSpacing(3),
      position: 'relative',
      width: 'auto',
      '::before': {
        content: '""',
        position: 'absolute',
        top: -8,
        bottom: 0,
        left: -16,
        width: 1,
        backgroundColor: grafanaTokens.colors_border_weak,
      },
    },
  },
  dragging: {
    cursor: 'move',
    backgroundColor: grafanaTokens.colors_background_canvas,
  },
  wrapperGrow: {
    flexGrow: 1,
  },
  wrapperCollapsed: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_weak,
    minHeight: 'unset',
    '.dashboard-row-header': {
      marginBottom: themeSpacing(0),
    },
  },
  rowActions: {
    display: 'flex',
    opacity: 0,
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: themeSpacing(1),
  },
});
