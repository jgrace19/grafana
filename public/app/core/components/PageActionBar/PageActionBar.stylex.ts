import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const pageActionBarStyles = stylex.create({
  container: {
    display: 'flex',
          alignItems: 'center',
          gap: themeSpacing(2),
          marginBottom: themeSpacing(2),
  },
});
