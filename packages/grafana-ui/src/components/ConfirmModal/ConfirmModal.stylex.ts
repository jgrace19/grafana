import * as stylex from '@stylexjs/stylex';


export const confirmModalStyles = stylex.create({
  modal: {
    width: '500px',
  },
});

export function confirmModalStyleProps(key: keyof typeof confirmModalStyles) {
  return stylex.props(confirmModalStyles[key]);
}
