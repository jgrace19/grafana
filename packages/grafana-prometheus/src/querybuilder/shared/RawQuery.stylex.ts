import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const rawQueryStyles = stylex.create({
  editorField: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
