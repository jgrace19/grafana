import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const openTsdbQueryEditorStyles = stylex.create({
  container: {
    display: 'flex',
  },
  toggleButton: {
    marginLeft: themeSpacing(0.5),
  },
});
