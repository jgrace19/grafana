import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const editNotificationPolicyFormStyles = stylex.create({
  addMatcherBtn: {
    marginBottom: commonSpacing,
  },
  matchersContainer: {
    backgroundColor: grafanaTokens.colors_background_secondary,
          padding: `${themeSpacing(1.5)} ${themeSpacing(2)}`,
          paddingBottom: 0,
          width: 'fit-content',
  },
  matchersOperator: {
    minWidth: '120px',
  },
  noMatchersWarning: {
    padding: `${themeSpacing(1)} ${themeSpacing(2)}`,
          marginBottom: themeSpacing(1),
  },
});
