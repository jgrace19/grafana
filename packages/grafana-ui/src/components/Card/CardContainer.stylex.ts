import * as stylex from '@stylexjs/stylex';

import { cssVar } from '../../themes/stylex/cssVar';
import { spacingToken } from '../../themes/stylex/spacingTokens';

const focusRing = {
  outline: '2px dotted transparent',
  outlineOffset: '2px',
  boxShadow: `0 0 0 2px ${cssVar('colors.background.canvas')}, 0 0 0px 4px ${cssVar('colors.primary.main')}`,
} as const;

const motionTransition = {
  '@media (prefers-reduced-motion: no-preference)': {
    transitionProperty: ['background-color', 'box-shadow', 'border-color', 'color'],
    transitionDuration: cssVar('transitions.duration.short'),
  },
} as const;

export const cardContainerStyles = stylex.create({
  containerBase: {
    display: 'grid',
    position: 'relative',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'row',
    width: '100%',
    background: cssVar('colors.background.secondary'),
    borderRadius: cssVar('shape.radius.default'),
    marginBottom: spacingToken(1),
    pointerEvents: 'auto',
    ...motionTransition,
  },
  containerNoMargin: {
    marginBottom: 0,
  },
  containerCompact: {
    padding: spacingToken(1),
  },
  containerDefaultPadding: {
    padding: spacingToken(2),
  },
  containerWithDescription: {
    gridTemplate: `
        "Figure Heading Tags"
        "Figure Meta Tags"
        "Figure Description Tags" 1fr
        "Figure Actions Secondary" / auto 1fr auto
      `,
  },
  containerWithoutDescription: {
    gridTemplate: `
        "Figure Heading Tags" 1fr
        "Figure Meta Tags"
        "Figure Actions Secondary" / auto 1fr auto
      `,
  },
  containerDisabled: {
    pointerEvents: 'none',
  },
  containerHoverable: {
    ':hover': {
      background: `color-mix(in srgb, ${cssVar('colors.background.secondary')} 97%, white)`,
      cursor: 'pointer',
      zIndex: 1,
    },
    ':focus': focusRing,
  },
  containerSelectable: {
    cursor: 'pointer',
  },
  containerSelected: {
    outline: `solid 2px ${cssVar('colors.primary.border')}`,
  },
  oldContainer: {
    display: 'flex',
    width: '100%',
    background: cssVar('colors.background.secondary'),
    borderRadius: cssVar('shape.radius.default'),
    position: 'relative',
    pointerEvents: 'auto',
    marginBottom: spacingToken(1),
    ...motionTransition,
  },
  oldContainerNoMargin: {
    marginBottom: 0,
  },
  oldContainerDisabled: {
    pointerEvents: 'none',
  },
  oldContainerHoverable: {
    ':hover': {
      background: `color-mix(in srgb, ${cssVar('colors.background.secondary')} 97%, white)`,
      cursor: 'pointer',
      zIndex: 1,
    },
    ':focus': focusRing,
  },
  inner: {
    display: 'flex',
    width: '100%',
    padding: spacingToken(2),
  },
});

export function cardContainerStyleProps(key: keyof typeof cardContainerStyles) {
  return stylex.props(cardContainerStyles[key]);
}
