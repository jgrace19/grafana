import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const lokiContextUiStyles = stylex.create({
  labels: {
    display: 'flex',
          gap: themeSpacing(0.5),
  },
  wrapper: {
    display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: themeSpacing(0.5),
          position: 'relative',
  },
  textWrapper: {
    display: 'flex',
          alignItems: 'center',
  },
  hidden: {
    visibility: 'hidden',
  },
  label: {
    maxWidth: '100%',
          '&:first-of-type': {
            marginBottom: themeSpacing(2),
          },
          '&:not(:first-of-type)': {
            margin: themeSpacingShorthand(2, 0),
          },
  },
  rawQueryContainer: {
    textAlign: 'start',
          lineBreak: 'anywhere',
          marginTop: themeSpacing(-0.25),
          marginRight: themeSpacing(6),
          minHeight: themeSpacing(4),
  },
  ui: {
    backgroundColor: grafanaTokens.colors_background_secondary,
          padding: themeSpacing(2),
  },
  notification: {
    position: 'absolute',
          zIndex: grafanaTokens.zIndex_portal,
          top: 0,
          right: 0,
  },
  rawQuery: {
    display: 'inline',
  },
  queryDescription: {
    marginLeft: themeSpacing(0.5),
  },
  iconButton: {
    position: 'absolute',
          top: themeSpacing(1),
          right: themeSpacing(1),
          zIndex: grafanaTokens.zIndex_navbarFixed,
  },
  operationsToggle: {
    margin: themeSpacingShorthand(1, 0, -1, 0),
          ' > div': {
            margin: 0,
            '& > label': {
              padding: 0,
            },
          },
  },
});
