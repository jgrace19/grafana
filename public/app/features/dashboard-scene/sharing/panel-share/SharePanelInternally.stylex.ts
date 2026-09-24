import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const sharePanelInternallyStyles = stylex.create({
  configurationContainer: {
    marginTop: themeSpacing(2),
  },
});
