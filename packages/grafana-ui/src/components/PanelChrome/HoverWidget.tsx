import * as stylex from '@stylexjs/stylex';
import { type ReactElement, useCallback, useRef } from 'react';
import * as React from 'react';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';

import { bp, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { Icon } from '../Icon/Icon';

import { PanelMenu } from './PanelMenu';

interface Props {
  children?: React.ReactNode;
  menu?: ReactElement | (() => ReactElement);
  title?: string;
  offset?: number;
  dragClass?: string;
  onDragStart?: (event: React.PointerEvent<HTMLDivElement>) => void;
  onOpenMenu?: () => void;
}

export function HoverWidget({ menu, title, dragClass, children, offset = -32, onOpenMenu, onDragStart }: Props) {
  const draggableRef = useRef<HTMLDivElement>(null);
  const selectors = e2eSelectors.components.Panels.Panel.HoverWidget;
  // Capture the pointer to keep the widget visible while dragging
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggableRef.current?.setPointerCapture(e.pointerId);
      onDragStart?.(e);
    },
    [onDragStart]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggableRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  if (children === undefined || React.Children.count(children) === 0) {
    return null;
  }

  return (
    <div
      {...mergeStylexProps(stylex.props(styles.container), { className: 'show-on-hover' })}
      style={{ top: offset === 0 ? -1 : offset }}
      data-testid={selectors.container}
    >
      {dragClass && (
        <div
          {...mergeStylexProps(stylex.props(styles.square, styles.draggable), { className: dragClass })}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          ref={draggableRef}
          data-testid={selectors.dragIcon}
        >
          <Icon name="expand-arrows" xstyle={styles.draggableIcon} />
        </div>
      )}
      {children}
      {menu && (
        <PanelMenu
          menu={menu}
          title={title}
          placement="bottom"
          menuButtonXstyle={styles.menuButton}
          onOpenMenu={onOpenMenu}
        />
      )}
    </div>
  );
}

// Button's own hover, focus and active backgrounds still apply on top, as they did over the Emotion class.
const styles = stylex.create({
  menuButton: {
    backgroundColor: {
      default: 'inherit',
      ':hover': colors['--gf-colors-secondary-shade'],
      ':focus': colors['--gf-colors-secondary-shade'],
      ':active': colors['--gf-colors-secondary-main'],
    },
    backgroundImage: 'inherit',
    borderStyle: 'none',
  },
  container: {
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'all' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '.1s' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'linear' },
    display: 'flex',
    position: 'absolute',
    zIndex: 1,
    right: -1,
    top: -1,
    boxSizing: 'content-box',
    alignItems: 'center',
    backgroundColor: colors['--gf-colors-background-secondary'],
    color: colors['--gf-colors-text-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderBottomLeftRadius: shape['--gf-shape-radius-default'],
    height: `calc(${spacing['--gf-spacing-grid-size']} * 4)`,
    boxShadow: shadows['--gf-shadows-z1'],
    gap: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingTop: 0,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 1)`,
  },
  square: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: `calc(${spacing['--gf-spacing-grid-size']} * 4)`,
    height: '100%',
  },
  // Replaces square's `display` (a later namespace wins the whole property), so it repeats `flex`.
  draggable: {
    cursor: 'move',
    // mobile do not support draggable panels
    display: { default: 'flex', [bp.mdDown]: 'none' },
  },
  draggableIcon: {
    transform: 'rotate(45deg)',
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
});
