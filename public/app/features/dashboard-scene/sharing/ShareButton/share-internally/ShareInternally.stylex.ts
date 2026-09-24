import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const shareInternallyStyles = stylex.create({
  configDescription: {
    marginBottom: themeSpacing(2),
  },
  copyButtonContainer: {
    marginTop: themeSpacing(2),
  },
});
