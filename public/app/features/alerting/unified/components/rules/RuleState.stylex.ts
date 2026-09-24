import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const ruleStateStyles = stylex.create({
  for: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
        whiteSpace: 'nowrap',
        paddingTop: '2px',
  },
});
