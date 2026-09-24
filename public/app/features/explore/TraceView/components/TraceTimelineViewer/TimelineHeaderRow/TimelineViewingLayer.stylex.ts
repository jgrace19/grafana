import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const timelineViewingLayerStyles = stylex.create({
  TimelineViewingLayer: {
    label: 'TimelineViewingLayer',
          bottom: 0,
          cursor: 'vertical-text',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
  },
  TimelineViewingLayerCursorGuide: {
    label: 'TimelineViewingLayerCursorGuide',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '1px',
          backgroundColor: 'red',
  },
  TimelineViewingLayerDragged: {
    label: 'TimelineViewingLayerDragged',
          position: 'absolute',
          top: 0,
          bottom: 0,
  },
  TimelineViewingLayerDraggedDraggingLeft: {
    label: 'TimelineViewingLayerDraggedDraggingLeft',
          borderLeft: '1px solid',
  },
  TimelineViewingLayerDraggedDraggingRight: {
    label: 'TimelineViewingLayerDraggedDraggingRight',
          borderRight: '1px solid',
  },
  TimelineViewingLayerDraggedShiftDrag: {
    label: 'TimelineViewingLayerDraggedShiftDrag',
          backgroundColor: 'rgba(68, 68, 255, 0.2)',
          borderColor: '#44f',
  },
  TimelineViewingLayerDraggedReframeDrag: {
    label: 'TimelineViewingLayerDraggedReframeDrag',
          backgroundColor: 'rgba(255, 68, 68, 0.2)',
          borderColor: '#f44',
  },
  TimelineViewingLayerFullOverlay: {
    label: 'TimelineViewingLayerFullOverlay',
          bottom: 0,
          cursor: 'col-resize',
          left: 0,
          position: 'fixed',
          right: 0,
          top: 0,
          userSelect: 'none',
  },
});
