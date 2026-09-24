import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const publicDashboardScenePageStyles = stylex.create({
  loadingPage: {
    justifyContent: 'center',
  },
  page: {
    padding: themeSpacingShorthand(0, 2),
  },
  controls: {
    display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: grafanaTokens.zIndex_navbarFixed,
          background: grafanaTokens.colors_background_canvas,
          padding: themeSpacingShorthand(2, 0),
          ['@media (max-width: 543.95px)']: {
            flexDirection: 'column',
            gap: themeSpacing(1),
            alignItems: 'stretch',
          },
  },
  iconTitle: {
    display: 'none',
          ['@media (min-width: 544px)']: {
            display: 'flex',
            alignItems: 'center',
          },
  },
  title: {
    overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'flex',
          fontSize: grafanaTokens.typography_h4_fontSize,
          margin: 0,
  },
  body: {
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          overflowY: 'auto',
  },
});
