import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const visualMetricQueryEditorStyles = stylex.create({
  root: {
    fontWeight: 'normal',
        fontStyle: 'italic',
        color: grafanaTokens.colors_text_secondary,
  },
});
