import * as stylex from '@stylexjs/stylex';

/**
 * Values shared by every log line of a list that depend on the theme (color math) or on the list options.
 * `getLogLineVarStyles` sets them once on the list root, so the line styles stay static.
 */
export const logLineVars = stylex.defineVars({
  defaultColor: 'inherit',
  bodyColor: 'inherit',
  hoverBackground: 'transparent',
  detailsBackground: 'transparent',
  highlightBackground: 'transparent',
  lineHeight: '22px',
  fieldsMinHeight: 'auto',
  gridTemplateColumns: 'none',
  unwrappedFieldOverflow: 'visible',
});
