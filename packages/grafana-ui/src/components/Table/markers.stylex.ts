import * as stylex from '@stylexjs/stylex';

/** TableRT cell container: its hover reveals the cell actions. */
export const cellContainerMarker = stylex.defineMarker();

/** TableNG: every react-data-grid body cell, for `.rdg-cell:hover &`. */
export const rdgCellMarker = stylex.defineMarker();

/** TableNG: every react-data-grid body cell and row, for `[aria-selected=true] &`. */
export const rdgSelectableMarker = stylex.defineMarker();

/** TableNG: elements with the default cell styles; their hover reveals the cell actions. */
export const defaultCellMarker = stylex.defineMarker();
