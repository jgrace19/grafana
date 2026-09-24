import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardEditPaneRendererStyles = stylex.create({
  editGroup: {
    width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: themeSpacing(2),
          paddingTop: themeSpacing(1),
          paddingBottom: themeSpacing(2),
          borderBottom: `1px solid ${grafanaTokens.colors_border_medium}`,
          borderTopLeftRadius: grafanaTokens.shape_radius_default,
          borderTopRightRadius: grafanaTokens.shape_radius_default,
  },
  viewGroup: {
    width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: themeSpacing(2),
          paddingTop: isEditing ? 0 : themeSpacing(1),
  },
});
