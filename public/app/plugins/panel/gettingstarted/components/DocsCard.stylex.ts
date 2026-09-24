import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const docsCardStyles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '230px',
    '@media (max-width: 768.95px)': {
      minWidth: '192px',
    },
  },
  content: {
    flexGrow: 1,
  },
  title: {
    marginBottom: themeSpacing(2),
  },
  url: {
    display: 'inline-block',
    height: '100%',
  },
  learnUrlLink: {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: grafanaTokens.colors_border_weak,
    display: 'inline-block',
    padding: themeSpacingShorthand(1, 2),
    width: '100%',
  },
});
