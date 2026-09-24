import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const stepStyles = stylex.create({
  setup: {
    display: 'flex',
          width: '95%',
  },
  info: {
    width: '172px',
          marginRight: '5%',
        '@media /* down xxl */': {
            marginRight: themeSpacing(4),
          },
        '@media (max-width: 543.95px)': {
            display: 'none',
          },
  },
  title: {
    color: theme.v1.palette.blue95,
  },
  cards: {
    overflowX: 'auto',
          overflowY: 'hidden',
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
  },
});
