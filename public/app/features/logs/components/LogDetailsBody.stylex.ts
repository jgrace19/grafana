import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const logDetailsBodyStyles = stylex.create({
  buttonRow: {
    display: 'flex',
          flexDirection: 'row',
          gap: themeSpacing(0.5),
          marginLeft: themeSpacing(0.5),
  },
});
