import * as stylex from '@stylexjs/stylex';


export const dataLinksContextMenuStyles = stylex.create({
  itemWrapper: {
    fontSize: 12,
  },
});

export function dataLinksContextMenuStyleProps(key: keyof typeof dataLinksContextMenuStyles) {
  return stylex.props(dataLinksContextMenuStyles[key]);
}
