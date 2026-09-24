import { createTheme } from '@grafana/data';

import { autoColor } from './Theme';
import { getTraceColorVars, traceColorInputs } from './traceColorVars';
import { traceColors } from './traceColors.stylex';

describe('trace colour vars', () => {
  it('has an autoColor input for every traceColors var', () => {
    const varNames = Object.keys(traceColors).filter((key) => key.startsWith('--'));
    expect(Object.keys(traceColorInputs).sort()).toEqual(varNames.sort());
  });

  it('uses the input colours in light themes', () => {
    const vars = getTraceColorVars(createTheme({ colors: { mode: 'light' } }));
    for (const [name, [color]] of Object.entries(traceColorInputs)) {
      expect(vars[name]).toBe(color);
    }
  });

  it('matches autoColor in dark themes', () => {
    const theme = createTheme({ colors: { mode: 'dark' } });
    const vars = getTraceColorVars(theme);
    expect(vars['--gf-trace-ddd']).toBe(autoColor(theme, '#ddd'));
    expect(vars['--gf-trace-blue-on-black']).toBe(autoColor(theme, 'blue', 'black'));
    expect(vars['--gf-trace-ddd']).not.toBe('#ddd');
  });
});
