import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const ruleHealthStyles = stylex.create({
  warn: {
    display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: themeSpacing(1),
    
        color: grafanaTokens.colors_warning_text,
  },
});
