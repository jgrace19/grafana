import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const fileExportPreviewStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: themeSpacing(2),
  },
  content: {
    flex: '1 1 100%',
  },
  actions: {
    flex: 0,
        justifyContent: 'flex-end',
        display: 'flex',
        gap: themeSpacing(1),
  },
});
