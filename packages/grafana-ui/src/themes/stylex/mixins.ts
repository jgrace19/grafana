import * as stylex from '@stylexjs/stylex';

import { motion } from './constants.stylex';
import { colors } from './tokens.stylex';

const focusRingShadow = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

/**
 * Shared style fragments that replace the Emotion-era mixins. Pass them before the component's own styles,
 * `stylex.props(mixins.focusRing, styles.button)`, so a component can still override single properties.
 */
export const mixins = stylex.create({
  /** `'&:focus-visible': getFocusStyles(theme)` */
  focusRing: {
    outlineStyle: { default: null, ':focus-visible': 'dotted' },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineColor: { default: null, ':focus-visible': 'transparent' },
    outlineOffset: { default: null, ':focus-visible': '2px' },
    boxShadow: { default: null, ':focus-visible': focusRingShadow },
    transitionProperty: { default: null, ':focus-visible': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus-visible': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus-visible': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
  },
  /** `'&:focus:not(:focus-visible)': getMouseFocusStyles(theme)`. Beats `:hover` like the Emotion rule did. */
  mouseFocusNone: {
    outlineStyle: { default: null, ':focus': { default: null, ':not(:focus-visible)': 'none' } },
    boxShadow: { default: null, ':focus': { default: null, ':not(:focus-visible)': 'none' } },
  },
});
