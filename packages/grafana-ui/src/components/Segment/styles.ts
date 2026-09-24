import * as stylex from '@stylexjs/stylex';

import { colors } from '../../themes/stylex/tokens.stylex';

export const segmentStyles = stylex.create({
  segment: {
    cursor: 'pointer',
  },

  disabled: {
    cursor: 'not-allowed',
    opacity: 0.65,
    boxShadow: 'none',
  },

  placeholder: {
    color: colors['--gf-colors-text-disabled'],
  },

  sectionLabel: {
    color: colors['--gf-colors-primary-text'],
  },
});
