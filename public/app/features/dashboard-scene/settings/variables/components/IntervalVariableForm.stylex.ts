import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const intervalVariableFormStyles = stylex.create({
  autoFields: {
    marginTop: themeSpacing(2),
          display: 'flex',
          flexDirection: 'column',
  },
});
