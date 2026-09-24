import * as stylex from '@stylexjs/stylex';

import { type GrafanaTheme2 } from '@grafana/data';

import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

/**
 * StyleX drag handle: a full-length hairline (`::before`) plus a pill-shaped grip (`::after`). Combine `base`,
 * one direction and one of its offsets, e.g.
 * `stylex.props(dragHandleStyles.base, dragHandleStyles.vertical, verticalOffsetStyles.middle)`, and set
 * `--gf-drag-handle-grip-color` inline on the handle to
 * `theme.colors.emphasize(theme.colors.background.secondary, 0.15)` (`getDragHandleGripColor`). It's a plain
 * custom property because StyleX dynamic values don't inherit into pseudo-elements.
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
      backgroundColor: { default: 'var(--gf-drag-handle-grip-color)', ':hover': colors['--gf-colors-primary-border'] },
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
    '::after': {
      left: '50%',
      height: '4px',
      width: '200px',
    },
  },
});

/** Where a vertical handle's line and grip sit across its width (`DragHandlePosition`). */
export const verticalOffsetStyles = stylex.create({
  start: { '::before': { left: '0%' }, '::after': { left: '0%' } },
  middle: { '::before': { left: '50%' }, '::after': { left: '50%' } },
  end: { '::before': { left: '100%' }, '::after': { left: '100%' } },
});

/** Where a horizontal handle's line and grip sit across its height (`DragHandlePosition`). */
export const horizontalOffsetStyles = stylex.create({
  start: { '::before': { top: '0%' }, '::after': { top: '0%' } },
  middle: { '::before': { top: '50%' }, '::after': { top: '50%' } },
  end: { '::before': { top: '100%' }, '::after': { top: '100%' } },
});

export function getDragHandleGripColor(theme: GrafanaTheme2) {
  return theme.colors.emphasize(theme.colors.background.secondary, 0.15);
}
