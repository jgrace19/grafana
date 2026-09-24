import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const versionHistoryComparisonStyles = stylex.create({
  versionInfo: {
    color: grafanaTokens.colors_text_secondary,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  noMarginBottom: {
    marginBottom: 0,
  },
});
