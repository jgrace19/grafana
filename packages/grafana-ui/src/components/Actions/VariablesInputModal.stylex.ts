import * as stylex from '@stylexjs/stylex';


export const variablesInputModalStyles = stylex.create({
  variablesModal: {
    zIndex: 10000,
  },
});

export function variablesInputModalStyleProps(key: keyof typeof variablesInputModalStyles) {
  return stylex.props(variablesInputModalStyles[key]);
}
