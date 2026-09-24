import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../stylex/spacing';

export const forgottenPasswordStyles = stylex.create({
  paragraph: {
    color: grafanaTokens.colors_text_secondary,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightRegular,
    marginTop: themeSpacing(1),
    display: 'block',
  },
});
