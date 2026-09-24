import * as stylex from '@stylexjs/stylex';

/** SidebarCard's outer wrapper: hovering it reveals the card's inline AddCardButton. */
export const sidebarCardMarker = stylex.defineMarker();

/** SidebarCard's card: hovering it reveals the card's hover actions. */
export const cardMarker = stylex.defineMarker();

/** DraggableList item, which carries `data-is-dragging` while its card is dragged. */
export const draggableItemMarker = stylex.defineMarker();
