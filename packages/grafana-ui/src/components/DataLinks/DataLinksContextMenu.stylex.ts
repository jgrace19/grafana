import * as stylex from '@stylexjs/stylex';


export const dataLinksContextMenuStyles = stylex.create({
  itemWrapper: {
    fontSize: 12,
  },
  target: {
    cursor: 'context-menu',
  },
});

export function dataLinksContextMenuStyleProps(key: keyof typeof dataLinksContextMenuStyles) {
  return stylex.props(dataLinksContextMenuStyles[key]);
}
