import * as stylex from '@stylexjs/stylex';

/**
 * Theme-derived colors (color math) of the log rows below `LogRows`, set once on its root by
 * `getLogRowStyles(theme).vars`. Stable names, because `LogRows.css` reads them too.
 */
export const logRowVars = stylex.defineVars({
  '--gf-logs-row-hover-background': 'transparent',
  '--gf-logs-row-highlight-background': 'transparent',
  '--gf-logs-copy-button-hover-background': 'transparent',
});
