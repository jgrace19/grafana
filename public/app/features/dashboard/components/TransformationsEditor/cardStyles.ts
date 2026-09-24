import * as stylex from '@stylexjs/stylex';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import './TransformationCard.css';

/** Classes for the Card itself, whose own Emotion styles a StyleX override can't beat (see TransformationCard.css). */
export const cardClassNames = {
  baseCard: 'gf-transformation-card',
  baseCardFullWidth: 'gf-transformation-card gf-transformation-card--full-width',
  cardDisabled: 'gf-transformation-card--disabled',
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
