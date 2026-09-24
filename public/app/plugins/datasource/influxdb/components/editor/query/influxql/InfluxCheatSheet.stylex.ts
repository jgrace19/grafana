import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const influxCheatSheetStyles = stylex.create({
  cheatSheetItem: {
    margin: themeSpacingShorthand(3, 0),
  },
  cheatSheetItemTitle: {
    fontSize: grafanaTokens.typography_h3_fontSize,
  },
});
