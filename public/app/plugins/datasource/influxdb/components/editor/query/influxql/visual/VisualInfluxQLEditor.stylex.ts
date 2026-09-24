import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const visualInfluxQLEditorStyles = stylex.create({
  inlineLabel: {
    color: grafanaTokens.colors_primary_text,
  },
});
