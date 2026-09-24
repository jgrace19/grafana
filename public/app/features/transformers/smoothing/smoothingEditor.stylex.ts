import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const smoothingEditorStyles = stylex.create({
  root: {
    marginLeft: '8px',
                        color: grafanaTokens.colors_text_secondary,
                        fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
