import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const queryOperationRowStyles = stylex.create({
  wrapper: {
    marginBottom: themeSpacing(2),
  },
  content: {
    marginTop: themeSpacing(0.5),
          marginLeft: themeSpacing(3),
  },
});
