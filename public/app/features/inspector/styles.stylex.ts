import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../core/stylex/spacing';

export const panelInspectorStyles = stylex.create({
  heading: {
    fontSize: grafanaTokens.typography_body_fontSize,
    marginBottom: themeSpacing(1),
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    flex: '1 1 0',
    minHeight: 0,
  },
  toolbar: {
    display: 'flex',
    width: '100%',
    flexGrow: 0,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: themeSpacing(1),
  },
  toolbarItem: {
    marginLeft: themeSpacing(2),
  },
  content: {
    flexGrow: 1,
    height: '100%',
  },
  editor: {
    fontFamily: 'monospace',
    height: '100%',
    flexGrow: 1,
  },
  viewer: {
    overflow: 'scroll',
  },
  dataFrameSelect: {
    flexGrow: 2,
  },
  leftActions: {
    display: 'flex',
    flexGrow: 1,
    maxWidth: '85%',
    '@media (max-width: 1345px)': {
      maxWidth: '75%',
    },
  },
  options: {
    paddingTop: themeSpacing(1),
  },
  dataDisplayOptions: {
    flexGrow: 1,
    minWidth: '300px',
    marginRight: themeSpacing(1),
  },
  selects: {
    display: 'flex',
    '> *': {
      marginRight: themeSpacing(1),
    },
  },
});
