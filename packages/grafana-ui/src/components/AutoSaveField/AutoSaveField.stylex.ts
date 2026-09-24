import * as stylex from '@stylexjs/stylex';


export const autoSaveFieldStyles = stylex.create({
  widthFitContent: {
    width: 'fit-content',
  },
});

export function autoSaveFieldStyleProps(key: keyof typeof autoSaveFieldStyles) {
  return stylex.props(autoSaveFieldStyles[key]);
}
