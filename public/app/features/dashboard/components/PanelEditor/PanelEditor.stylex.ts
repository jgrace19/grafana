import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const panelEditorStyles = stylex.create({
  wrapper: {
    width: '100%',
    flexGrow: 1,
    minHeight: 0,
    display: 'flex',
    paddingTop: themeSpacing(2),
  },
  verticalSplitPanesWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  mainPaneWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    paddingRight: 0,
  },
  mainPaneWrapperPadRight: {
    paddingRight: themeSpacing(2),
  },
  variablesWrapper: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    gap: themeSpacingShorthand(1, 2),
  },
  panelWrapper: {
    flex: '1 1 0',
    minHeight: 0,
    width: '100%',
    paddingLeft: themeSpacing(2),
  },
  tabsWrapper: {
    height: '100%',
    width: '100%',
  },
  panelToolbar: {
    display: 'flex',
    padding: themeSpacingShorthand(0, 0, 2, 2),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  angularWarning: {
    display: 'flex',
    height: themeSpacing(4),
    alignItems: 'center',
  },
  toolbarLeft: {
    paddingLeft: themeSpacing(1),
  },
  centeringContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexDirection: 'column',
  },
  onlyPanel: {
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    width: '100%',
  },
});
