import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const promCheatSheetStyles = stylex.create({
  cheatSheetItem: {
    marginTop: grafanaTokens.spacing_x3,
    marginRight: 0,
    marginBottom: grafanaTokens.spacing_x3,
    marginLeft: 0,
  },
  cheatSheetItemTitle: {
    fontSize: grafanaTokens.typography_h3_fontSize,
  },
  cheatSheetExample: {
    marginTop: grafanaTokens.spacing_x0_5,
    marginRight: 0,
    marginBottom: grafanaTokens.spacing_x0_5,
    marginLeft: 0,
    textAlign: 'left',
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    display: 'block',
  },
});
