import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryHeaderSwitchStyles = stylex.create({
  switchLabel: {
    color: grafanaTokens.colors_text_secondary,
    cursor: 'pointer',
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    ':hover': {
      color: grafanaTokens.colors_text_primary,
    },
  },
});
