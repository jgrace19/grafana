import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const functionParamEditorStyles = stylex.create({
  segment: {
    margin: 0,
        padding: 0,
        overflowWrap: 'anywhere',
        height: '100%',
  },
  input: {
    margin: 0,
        padding: 0,
        input: {
          height: '25px',
        },
        overflowWrap: 'anywhere',
        height: '100%',
  },
});
