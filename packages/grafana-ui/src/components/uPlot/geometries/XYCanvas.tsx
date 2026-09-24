import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

interface XYCanvasProps {
  top: number; // css pxls
  left: number; // css pxls
}

/**
 * Renders absolutely positioned element on top of the uPlot's plotting area (axes are not included!).
 * Useful when you want to render some overlay with canvas-independent elements on top of the plot.
 */
export const XYCanvas = ({ children, left, top }: React.PropsWithChildren<XYCanvasProps>) => {
  return <div {...stylex.props(styles.canvas, styles.offset(left, top))}>{children}</div>;
};

const styles = stylex.create({
  canvas: {
    position: 'absolute',
    overflow: 'visible',
  },
  offset: (left: number, top: number) => ({
    left: `${left}px`,
    top: `${top}px`,
  }),
});
