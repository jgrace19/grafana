import * as stylex from '@stylexjs/stylex';
import { useCallback, useRef } from 'react';

import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

import { useSidebarContext } from './useSidebar';

export function SidebarResizer() {
  const sidebarContext = useSidebarContext();
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef<number | null>(null);

  if (!sidebarContext) {
    throw new Error('Sidebar.Resizer must be used within a Sidebar component');
  }

  const { onResize, position } = sidebarContext;

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (resizerRef.current === null) {
        return;
      }

      resizerRef.current.setPointerCapture(e.pointerId);
      dragStart.current = e.clientX;
    },
    [resizerRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragStart.current === null) {
        return;
      }

      // mouse is moving with no buttons pressed
      if (!e.buttons) {
        dragStart.current = null;
        return;
      }

      const diff = e.clientX - dragStart.current;
      dragStart.current = e.clientX;

      onResize(position === 'right' ? -diff : diff);
    },
    [dragStart, onResize, position]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragStart.current = null;
    },
    [dragStart]
  );

  return (
    <div
      ref={resizerRef}
      {...stylex.props(styles.resizer, positionStyles[sidebarContext.position])}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    />
  );
}

const styles = stylex.create({
  resizer: {
    position: 'absolute',
    width: spacing['--gf-spacing-grid-size'],
    top: shape['--gf-shape-radius-default'],
    bottom: shape['--gf-shape-radius-default'],
    cursor: 'col-resize',
    zIndex: 1,
  },
});

const positionStyles = stylex.create({
  right: {
    left: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    borderRightWidth: { default: null, ':hover': '1px' },
    borderRightStyle: { default: null, ':hover': 'solid' },
    borderRightColor: { default: null, ':hover': colors['--gf-colors-primary-border'] },
  },
  left: {
    right: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
    borderLeftWidth: { default: null, ':hover': '1px' },
    borderLeftStyle: { default: null, ':hover': 'solid' },
    borderLeftColor: { default: null, ':hover': colors['--gf-colors-primary-border'] },
  },
});
