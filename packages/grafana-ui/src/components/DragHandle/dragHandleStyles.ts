import * as stylex from '@stylexjs/stylex';

import { type DragHandlePosition } from '../../compat/emotion/getDragStyles';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

/**
 * StyleX drag handle: a full-length hairline (`::before`) plus a pill-shaped grip (`::after`). Combine `base`,
 * one direction, its grip (omit it for a hairline-only handle) and one of its offsets. The grip colour is
 * `--gf-global-drag-handle-grip-color`, written on `<html>` by GlobalStyles.
 */
export const dragHandleStyles = stylex.create({
  base: {
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'border-color' },
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.standard },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
      transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
      zIndex: 1,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background' },
      transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.standard },
      transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
      transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
      transform: 'translate(-50%, -50%)',
      borderRadius: shape['--gf-shape-radius-pill'],
      zIndex: 1,
      backgroundColor: {
        default: 'var(--gf-global-drag-handle-grip-color)',
        ':hover': colors['--gf-colors-primary-border'],
      },
    },
  },
  vertical: {
    cursor: 'col-resize',
    width: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    '::before': {
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: { default: 'transparent', ':hover': colors['--gf-colors-primary-border'] },
      height: '100%',
      transform: 'translateX(-50%)',
    },
  },
  verticalGrip: {
    '::after': {
      top: '50%',
      height: '200px',
      width: '4px',
    },
  },
  horizontal: {
    height: `calc(${spacing['--gf-spacing-grid-size']} * 2)`,
    cursor: 'row-resize',
    '::before': {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: { default: 'transparent', ':hover': colors['--gf-colors-primary-border'] },
      transform: 'translateY(-50%)',
    },
  },
  horizontalGrip: {
    '::after': {
      left: '50%',
      height: '4px',
      width: '200px',
    },
  },
});

/** Where a vertical handle's line and grip sit across its width (`DragHandlePosition`). */
export const verticalOffsetStyles = stylex.create({
  start: {
    '::before': { left: '0%' },
    '::after': { left: '0%' },
  },
  middle: {
    '::before': { left: '50%' },
    '::after': { left: '50%' },
  },
  end: {
    '::before': { left: '100%' },
    '::after': { left: '100%' },
  },
});

/** Where a horizontal handle's line and grip sit across its height (`DragHandlePosition`). */
export const horizontalOffsetStyles = stylex.create({
  start: {
    '::before': { top: '0%' },
    '::after': { top: '0%' },
  },
  middle: {
    '::before': { top: '50%' },
    '::after': { top: '50%' },
  },
  end: {
    '::before': { top: '100%' },
    '::after': { top: '100%' },
  },
});

/**
 * Drag handle class names, the StyleX replacement for the Emotion `getDragStyles(theme, position)` with the
 * same keys. The styles are static, so the class names are all a handle needs (e.g. re-resizable
 * `handleClasses`).
 *
 * @internal
 */
export function getDragHandleClassNames(handlePosition: DragHandlePosition = 'middle') {
  const { base, vertical, verticalGrip, horizontal, horizontalGrip } = dragHandleStyles;
  const verticalOffset = verticalOffsetStyles[handlePosition];
  const horizontalOffset = horizontalOffsetStyles[handlePosition];
  return {
    dragHandleVertical: stylex.props(base, vertical, verticalGrip, verticalOffset).className ?? '',
    dragHandleHorizontal: stylex.props(base, horizontal, horizontalGrip, horizontalOffset).className ?? '',
    dragHandleBaseVertical: stylex.props(base, vertical, verticalOffset).className ?? '',
    dragHandleBaseHorizontal: stylex.props(base, horizontal, horizontalOffset).className ?? '',
  };
}
