import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardQueryEditorStyles = stylex.create({
  noQueriesText: {
    padding: themeSpacing(1.25),
  },
});
