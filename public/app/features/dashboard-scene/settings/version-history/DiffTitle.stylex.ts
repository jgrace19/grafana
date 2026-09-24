import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const diffTitleStyles = stylex.create({
  embolden: {
    fontWeight: grafanaTokens.typography_fontWeightBold,
  },
  add: {
    color: grafanaTokens.colors_success_main,
  },
  replace: {
    color: grafanaTokens.colors_warning_main,
  },
  move: {
    color: grafanaTokens.colors_warning_main,
  },
  copy: {
    color: grafanaTokens.colors_success_main,
  },
  _get: {
    color: grafanaTokens.colors_success_main,
  },
  test: {
    color: grafanaTokens.colors_success_main,
  },
  remove: {
    color: grafanaTokens.colors_error_main,
  },
  withoutDiff: {
    marginBottom: themeSpacing(1),
  },
});
