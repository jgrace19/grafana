import * as stylex from '@stylexjs/stylex';

/** On Switch's root: its hidden checkbox's state drives the visible track and thumb. */
export const switchMarker = stylex.defineMarker();

/** On InlineSwitch's container: hovering it highlights the label. */
export const inlineSwitchMarker = stylex.defineMarker();
