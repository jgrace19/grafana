import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const graphiteQueryEditorStyles = stylex.create({
  container: {
    display: 'flex',
  },
  visualEditor: {
    flexGrow: 1,
  },
  toggleButton: {
    marginLeft: themeSpacing(0.5),
  },
});
