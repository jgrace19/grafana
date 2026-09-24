import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const inlineEditStyles = stylex.create({
  inlineEditorContainer: {
    display: 'flex',
        flexDirection: 'column',
        background: theme.components.panel.background,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z3,
        zIndex: 1000,
        opacity: 1,
        minWidth: '400px',
  },
  draggableWrapper: {
    width: 0,
        height: 0,
  },
  inlineEditorHeader: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: grafanaTokens.colors_background_canvas,
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        height: '40px',
        cursor: 'move',
  },
  inlineEditorContent: {
    whiteSpace: 'pre-wrap',
        padding: '10px',
  },
  inlineEditorClose: {
    marginLeft: 'auto',
  },
  placeholder: {
    width: '24px',
        height: '24px',
        visibility: 'hidden',
        marginRight: 'auto',
  },
  inlineEditorContentWrapper: {
    overflow: 'scroll',
  },
});
