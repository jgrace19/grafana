import { type Placement } from '@floating-ui/react';
import * as stylex from '@stylexjs/stylex';

import { type TooltipPlacement } from '../components/Tooltip/types';
import { motion, zIndex } from '../themes/stylex/constants.stylex';
import { colors, shadows, shape, spacing, typography } from '../themes/stylex/tokens.stylex';

export function getPlacement(placement?: TooltipPlacement): Placement {
  switch (placement) {
    case 'auto':
      return 'bottom';
    case 'auto-start':
      return 'bottom-start';
    case 'auto-end':
      return 'bottom-end';
    default:
      return placement ?? 'bottom';
  }
}

/**
 * Styles shared by Tooltip and Toggletip. Each component adds its own colours and padding per theme variant.
 */
export const tooltipStyles = stylex.create({
  container: {
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    boxShadow: shadows['--gf-shadows-z2'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'opacity' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '0.3s' },
    zIndex: zIndex.tooltip,
    maxWidth: '400px',
    overflowWrap: 'break-word',
    pointerEvents: { default: null, ':is([data-popper-interactive="false"])': 'none' },
  },
  headerClose: {
    color: colors['--gf-colors-text-secondary'],
    position: 'absolute',
    right: spacing['--gf-spacing-x0-5'],
    top: spacing['--gf-spacing-x1'],
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  header: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  body: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  footer: {
    paddingTop: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
  },
});
