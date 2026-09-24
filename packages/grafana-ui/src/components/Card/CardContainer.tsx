import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing } from '../../themes/stylex/tokens.stylex';

/**
 * @public
 */
export interface CardInnerProps {
  href?: string;
  children?: React.ReactNode;
}

/** @deprecated This component will be removed in a future release */
const CardInner = ({ children, href }: CardInnerProps) => {
  return href ? (
    <a {...stylex.props(styles.inner)} href={href}>
      {children}
    </a>
  ) : (
    <>{children}</>
  );
};

/**
 * @public
 */
export interface CardContainerProps extends HTMLAttributes<HTMLOrSVGElement>, CardInnerProps {
  /** Disable pointer events for the Card, e.g. click events */
  disableEvents?: boolean;
  /** No style change on hover */
  disableHover?: boolean;
  /** Makes the card selectable, set to "true" to apply selected styles */
  isSelected?: boolean;
  /** Custom container styles */
  className?: string;
  /** Remove the bottom margin */
  noMargin?: boolean;
  hasDescriptionComponent?: boolean;
  /** @internal first-party StyleX overrides (Card's grid layout) */
  xstyle?: stylex.StyleXStyles;
}

/** @deprecated Using `CardContainer` directly is discouraged and should be replaced with `Card` */
export const CardContainer = ({
  children,
  disableEvents,
  disableHover,
  isSelected,
  className,
  style,
  href,
  noMargin,
  hasDescriptionComponent = false,
  xstyle,
  ...props
}: CardContainerProps) => {
  const theme = useTheme2();

  return (
    <div
      {...props}
      {...mergeStylexProps(
        stylex.props(
          styles.oldContainer,
          noMargin && styles.noMargin,
          disableEvents && styles.disableEvents,
          !disableHover && styles.hoverable,
          !disableHover && styles.hoverBackground(theme.colors.emphasize(theme.colors.background.secondary, 0.03)),
          xstyle
        ),
        { className, style }
      )}
    >
      <CardInner href={href}>{children}</CardInner>
    </div>
  );
};

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;
const cardTransitionProperty = 'background-color, box-shadow, border-color, color';
const focusTransitionProperty = 'outline, outline-offset, box-shadow';
const focusEasing = 'cubic-bezier(0.19, 1, 0.22, 1)';

const styles = stylex.create({
  inner: {
    display: 'flex',
    width: '100%',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  oldContainer: {
    display: 'flex',
    width: '100%',
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    pointerEvents: 'auto',
    marginBottom: spacing['--gf-spacing-x1'],
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: cardTransitionProperty },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: durations.short },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
  },
  noMargin: {
    marginBottom: spacing['--gf-spacing-x0'],
  },
  disableEvents: {
    pointerEvents: 'none',
  },
  // `'&:hover'` + `'&:focus': getFocusStyles(theme)`. The focus transition beats the motion-gated one, as it did
  // in Emotion (higher specificity), so it's nested inside the media condition.
  hoverable: {
    cursor: { default: null, ':hover': 'pointer' },
    zIndex: { default: null, ':hover': 1 },
    outlineStyle: { default: null, ':focus': 'dotted' },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    boxShadow: { default: null, ':focus': focusRing },
    transitionProperty: {
      default: null,
      ':focus': focusTransitionProperty,
      [motion.noPreferenceOrReduce]: { default: cardTransitionProperty, ':focus': focusTransitionProperty },
    },
    transitionDuration: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: durations.short, ':focus': '0.2s' },
    },
    transitionTimingFunction: {
      default: null,
      [motion.noPreferenceOrReduce]: { default: easings.easeInOut, ':focus': focusEasing },
    },
  },
  hoverBackground: (hoverColor: string) => ({
    backgroundColor: { default: colors['--gf-colors-background-secondary'], ':hover': hoverColor },
  }),
});
