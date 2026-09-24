import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const pageHeaderStyles = stylex.create({
  topRow: {
    alignItems: 'flex-start',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: themeSpacingShorthand(1, 3),
  },
  title: {
    display: 'flex',
          flexDirection: 'row',
          maxWidth: '100%',
          flex: 1,
          h1: {
            marginBottom: 0,
          },
  },
  actions: {
    display: 'flex',
          flexDirection: 'row',
          gap: themeSpacing(1),
  },
  titleInfoContainer: {
    display: 'flex',
          label: 'title-info-container',
          flex: 1,
          flexWrap: 'wrap',
          gap: themeSpacingShorthand(1, 4),
          justifyContent: 'space-between',
          maxWidth: '100%',
          minWidth: '200px',
  },
  pageHeader: {
    label: 'page-header',
          display: 'flex',
          flexDirection: 'column',
          gap: themeSpacing(1),
          marginBottom: themeSpacing(2),
  },
  subTitle: {
    position: 'relative',
          color: grafanaTokens.colors_text_secondary,
  },
  img: {
    width: '32px',
          height: '32px',
          marginRight: themeSpacing(2),
  },
});
