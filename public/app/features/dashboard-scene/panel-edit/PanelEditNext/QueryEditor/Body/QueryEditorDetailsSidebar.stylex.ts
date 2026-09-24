import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const queryEditorDetailsSidebarStyles = stylex.create({
  container: {
    position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: grafanaTokens.colors_background_primary,
          borderRight: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  content: {
    flex: 1,
          padding: themeSpacing(1.5),
          overflow: 'auto',
  },
});
