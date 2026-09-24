import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../core/stylex/spacing';

export const sidebarStyles = stylex.create({
  container: {
    height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderRadius: grafanaTokens.shape_radius_default,
          background: grafanaTokens.colors_background_primary,
  },
  content: {
    background: grafanaTokens.colors_background_primary,
          paddingLeft: themeSpacing(1),
          paddingRight: themeSpacing(1),
  },
});
