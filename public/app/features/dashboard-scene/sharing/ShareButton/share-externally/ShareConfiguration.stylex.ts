import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const shareConfigurationStyles = stylex.create({
  timeRange: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        fontWeight: grafanaTokens.typography_bodySmall_fontWeight,
  },
  timeRangeValue: {
    color: grafanaTokens.colors_text_secondary,
  },
});
