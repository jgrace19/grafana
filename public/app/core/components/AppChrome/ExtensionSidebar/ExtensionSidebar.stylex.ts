import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const extensionSidebarStyles = stylex.create({
  sidebarWrapper: {
    backgroundColor: grafanaTokens.colors_background_primary,
          borderLeft: `1px solid ${grafanaTokens.colors_border_weak}`,
          display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1),
          width: '100%',
          height: '100%',
          overflow: 'auto',
          // Temp fix for AI assistant, remove in a 1-2 months
          ' > div > div': {
            margin: 0,
          },
  },
  content: {
    flex: 1,
          minHeight: 0,
  },
});
