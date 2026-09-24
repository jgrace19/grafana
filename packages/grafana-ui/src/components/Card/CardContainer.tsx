import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { getCardContainerStyles } from '../../themes/compat/cardStyles';

import { cardContainerStyleProps, cardContainerStyles } from './CardContainer.stylex';

export { getCardContainerStyles };

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
    <a {...cardContainerStyleProps('inner')} href={href}>
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
  isCompact?: boolean;
}

/** @deprecated Using `CardContainer` directly is discouraged and should be replaced with `Card` */
export const CardContainer = ({
  children,
  disableEvents,
  disableHover,
  isSelected,
  className,
  href,
  noMargin,
  hasDescriptionComponent = false,
  isCompact,
  ...props
}: CardContainerProps) => {
  const containerProps = mergeStylexClassName(
    stylex.props(
      cardContainerStyles.oldContainer,
      noMargin && cardContainerStyles.oldContainerNoMargin,
      disableEvents && cardContainerStyles.oldContainerDisabled,
      !disableHover && cardContainerStyles.oldContainerHoverable
    ),
    className
  );

  return (
    <div {...props} {...containerProps}>
      <CardInner href={href}>{children}</CardInner>
    </div>
  );
};
