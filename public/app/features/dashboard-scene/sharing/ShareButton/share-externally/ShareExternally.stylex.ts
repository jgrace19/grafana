import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const shareExternallyStyles = stylex.create({
  container: {
    paddingBottom: themeSpacing(2),
  },
  actionsContainer: {
    width: '100%',
  },
});
