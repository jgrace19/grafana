import * as stylex from '@stylexjs/stylex';

import './Segment.css';

export const segmentStyles = stylex.create({
  segment: {
    cursor: 'pointer',
  },

  disabled: {
    cursor: 'not-allowed',
    opacity: 0.65,
    boxShadow: 'none',
  },
});

/** Recolours InlineLabel, which sets its own colour: see Segment.css. */
export const SEGMENT_PLACEHOLDER_CLASS = 'gf-segment-placeholder';
