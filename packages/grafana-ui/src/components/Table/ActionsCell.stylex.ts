import * as stylex from '@stylexjs/stylex';


export const actionsCellStyles = stylex.create({
  buttonsGap: {
    gap: 6,
  },
});

export function actionsCellStyleProps(key: keyof typeof actionsCellStyles) {
  return stylex.props(actionsCellStyles[key]);
}
