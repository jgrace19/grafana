import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

export const cardStyles = stylex.create({
  baseCard: {
    maxWidth: '200px',
    width: 'auto',
    marginBottom: 0,
  },
  baseCardFullWidth: {
    maxWidth: 'none',
    width: '100%',
    marginBottom: 0,
  },
  // Replaces Card's background, so Card's own :hover background is passed in.
  cardDisabled: (hoverBackground: string) => ({
    backgroundColor: { default: colors['--gf-colors-action-disabled-background'], ':hover': hoverBackground },
  }),
  infoButton: {
    position: 'absolute',
    bottom: spacing['--gf-spacing-x1'],
    right: spacing['--gf-spacing-x1'],
  },
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
