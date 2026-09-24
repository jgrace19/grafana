import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const serviceAccountProfileStyles = stylex.create({
  section: {
    marginBottom: themeSpacing(4),
  },
});
