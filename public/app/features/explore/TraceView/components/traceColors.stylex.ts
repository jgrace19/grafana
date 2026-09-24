import * as stylex from '@stylexjs/stylex';

/**
 * TraceView's `autoColor(theme, color)` values: the colour itself in light themes, a luminosity-inverted variant in
 * dark ones. The defaults are the light values; `useTraceColorVars()` (traceColorVars.ts) writes the active theme's
 * values on a subtree root. Each key is `--gf-trace-` plus its input colour.
 */
export const traceColors = stylex.defineVars({
  '--gf-trace-000': '#000',
  '--gf-trace-2c3235': '#2c3235',
  '--gf-trace-44f': '#44f',
  '--gf-trace-464c54': '#464c54',
  '--gf-trace-484848': '#484848',
  '--gf-trace-666': '#666',
  '--gf-trace-68b9ff': '#68b9ff',
  '--gf-trace-777': '#777',
  '--gf-trace-888': '#888',
  '--gf-trace-999': '#999',
  '--gf-trace-aaa': '#aaa',
  '--gf-trace-bbb': '#bbb',
  '--gf-trace-blue-on-black': 'blue',
  '--gf-trace-cbe7ff': '#cbe7ff',
  '--gf-trace-ccc': '#ccc',
  '--gf-trace-d8d8d8': '#d8d8d8',
  '--gf-trace-ddd': '#ddd',
  '--gf-trace-ececec': '#ececec',
  '--gf-trace-eee': '#eee',
  '--gf-trace-f0f0f0': '#f0f0f0',
  '--gf-trace-f1f1f1': '#f1f1f1',
  '--gf-trace-f44': '#f44',
  '--gf-trace-f5f5f5': '#f5f5f5',
  '--gf-trace-f7f1c6': '#f7f1c6',
  '--gf-trace-f8f8f8': '#f8f8f8',
  '--gf-trace-fafafa': '#fafafa',
  '--gf-trace-ffeccf': '#ffeccf',
  '--gf-trace-fff': '#fff',
  '--gf-trace-fff3d7': '#fff3d7',
  '--gf-trace-fffbde': '#fffbde',
  '--gf-trace-fffce4': '#fffce4',
  '--gf-trace-firebrick': 'firebrick',
  '--gf-trace-lightgrey': 'lightgrey',
  '--gf-trace-rgba-214-214-214-0-5': 'rgba(214, 214, 214, 0.5)',
  '--gf-trace-rgba-25-25-25-0-25': 'rgba(25, 25, 25, 0.25)',
  '--gf-trace-rgba-32-32-32-0': 'rgba(32, 32, 32, 0)',
  '--gf-trace-teal': 'teal',
});
