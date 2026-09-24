import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const tutorialCardStyles = stylex.create({
  card: {
    width: '460px',
    minWidth: '460px',
    ':hover': {
      backgroundColor: grafanaTokens.colors_action_hover,
    },
    '@media (max-width: 1199.95px)': {
      minWidth: '368px',
    },
    '@media (max-width: 991.95px)': {
      minWidth: '272px',
    },
  },
  type: {
    color: grafanaTokens.colors_primary_text,
    textTransform: 'uppercase',
  },
  heading: {
    textTransform: 'uppercase',
    color: grafanaTokens.colors_primary_text,
    marginBottom: themeSpacing(1),
  },
  cardTitle: {
    marginBottom: themeSpacing(2),
  },
  info: {
    marginBottom: themeSpacing(2),
  },
});
