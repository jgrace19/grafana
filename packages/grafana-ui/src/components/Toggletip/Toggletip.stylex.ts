import * as stylex from '@stylexjs/stylex';


export const toggletipStyles = stylex.create({
  fitContent: {
    maxWidth: 'fit-content',
  },
});

export function toggletipStyleProps(key: keyof typeof toggletipStyles) {
  return stylex.props(toggletipStyles[key]);
}
