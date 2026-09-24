// eslint-disable-next-line no-restricted-imports -- stylex: pending Card migration (see cardOverrides)
import { css } from '@emotion/css';
import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

// stylex: pending Card migration. Card's own Emotion width, margin and background would beat a StyleX override.
export const cardOverrides = {
  baseCard: css({
    maxWidth: '200px',
    width: 'auto',
    marginBottom: 0,
  }),
  baseCardFullWidth: css({
    maxWidth: 'none',
    width: '100%',
    marginBottom: 0,
  }),
  cardDisabled: css({
    backgroundColor: colors['--gf-colors-action-disabled-background'],
  }),
};

export const cardStyles = stylex.create({
  image: {
    display: 'block',
    maxWidth: '100%',
    marginTop: spacing['--gf-spacing-x2'],
  },
  imageDisabled: {
    filter: 'grayscale(100%)',
    opacity: 0.33,
  },
  tagsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x0-5'],
    marginTop: spacing['--gf-spacing-x0-5'],
  },
});
