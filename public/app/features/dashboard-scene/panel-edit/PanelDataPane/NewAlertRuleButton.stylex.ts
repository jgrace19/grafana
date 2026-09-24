import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const newAlertRuleButtonStyles = stylex.create({
  compactAlert: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_maxContrast,
  },
});
