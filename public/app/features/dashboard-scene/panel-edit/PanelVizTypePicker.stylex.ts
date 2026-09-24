import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelVizTypePickerStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
  },
  searchField: {
    margin: themeSpacingShorthand(2, 1.5, 0, 0),
        width: '100%',
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        paddingBottom: themeSpacing(0.75),
  },
  stickySearchWrapper: {
    boxShadow: grafanaTokens.shadows_z1,
        zIndex: 1,
  },
  tabs: {
    width: '100%',
  },
  tab: {
    flexGrow: 1,
        justifyContent: 'center',
        textAlign: 'center',
  },
  tabContent: {
    paddingTop: themeSpacing(1),
        paddingInline: themeSpacing(2),
  },
  backButton: {
    marginLeft: themeSpacing(1), // shift button to the right
  },
  filter: {
    minHeight: themeSpacing(4),
        marginBottom: themeSpacing(1),
        marginRight: themeSpacing(1),
        marginLeft: themeSpacing(1),
  },
});
