import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const ungroupedViewStyles = stylex.create({
  icon: {
    marginTop: themeSpacing(2.5),
        alignSelf: 'flex-start',
  },
  good: {
    color: grafanaTokens.colors_success_main,
  },
  bad: {
    color: grafanaTokens.colors_error_main,
  },
  warning: {
    color: grafanaTokens.colors_warning_main,
  },
  neutral: {
    color: grafanaTokens.colors_secondary_main,
  },
  info: {
    color: grafanaTokens.colors_primary_main,
  },
});
