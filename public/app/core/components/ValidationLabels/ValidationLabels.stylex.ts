import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const validationLabelsStyles = stylex.create({
  style: {
    marginRight: themeSpacing(1),
  },
  valid: {
    color: grafanaTokens.colors_success_text,
  },
  pending: {
    color: grafanaTokens.colors_secondary_text,
  },
  error: {
    color: grafanaTokens.colors_error_text,
  },
});
