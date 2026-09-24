import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing } from '../../../../core/stylex/spacing';

export const getCardStylesStyles = stylex.create({
  baseCard: {
    maxWidth: '200px',
    width: 'auto',
    marginBottom: 0,
  },
  baseCardFullWidth: {
    maxWidth: 'none',
    width: '100%',
  },
  image: {
    display: 'block',
    maxWidth: '100%',
    marginTop: themeSpacing(2),
  },
  cardDisabled: {
    backgroundColor: grafanaTokens.colors_action_disabledBackground,
  },
  cardDisabledImage: {
    filter: 'grayscale(100%)',
    opacity: 0.33,
  },
  applicableInfoButton: {
    position: 'absolute',
    bottom: themeSpacing(1),
    right: themeSpacing(1),
  },
  tagsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: themeSpacing(0.5),
    marginTop: themeSpacing(0.5),
  },
});
