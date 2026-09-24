import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryInspectorStyles = stylex.create({
  refId: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    color: grafanaTokens.colors_info_text,
    marginRight: '8px',
  },
});
