import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelDataPaneStyles = stylex.create({
  dataPane: {
    display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: 0,
          height: '100%',
          width: '100%',
  },
  tabBorder: {
    background: grafanaTokens.colors_background_primary,
          border: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderLeft: 'none',
          borderBottom: 'none',
          borderTopRightRadius: grafanaTokens.shape_radius_default,
          flexGrow: 1,
          overflow: 'hidden',
  },
  tabContent: {
    padding: themeSpacing(2),
          height: '100%',
  },
  tabsBar: {
    flexShrink: 0,
          paddingLeft: themeSpacing(2),
  },
  tryNewEditorWrapper: {
    marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          paddingRight: themeSpacing(1),
  },
});
