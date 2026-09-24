import * as stylex from '@stylexjs/stylex';

/** Scrubber handle group: hovering it highlights its handle rects. */
export const scrubberHandlesMarker = stylex.defineMarker();

/** The span graph's viewing layer: hovering it shows the reset-zoom button. */
export const viewingLayerMarker = stylex.defineMarker();

/** A span bar row: hovering it highlights its name, view cell and bar label. */
export const spanBarRowMarker = stylex.defineMarker();

/** A span bar row's name button: hovering it darkens the endpoint name. */
export const spanNameMarker = stylex.defineMarker();
