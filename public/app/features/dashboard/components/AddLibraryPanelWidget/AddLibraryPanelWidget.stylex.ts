import * as stylex from '@stylexjs/stylex';

/** Set per theme at runtime: the pulse colour is JS colour math on `theme.colors.primary.main`. */
export const pulsateVars = stylex.defineVars({
  darkPrimary: 'transparent',
});
