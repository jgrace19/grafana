import * as stylex from '@stylexjs/stylex';
import { memo, cloneElement, type FC, useMemo, useContext, type ReactNode } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { getCardStyles } from '../../themes/compat/cardStyles';

import { type CardContainerProps } from './CardContainer';
import { cardContainerStyles } from './CardContainer.stylex';
import { cardStyleProps, cardStyles } from './Card.stylex';

export { getCardStyles };

/**
 * @public
 */
export interface Props extends Omit<CardContainerProps, 'disableEvents' | 'disableHover'> {
  /** Indicates if the card and all its actions can be interacted with */
  disabled?: boolean;
  /** Link to redirect to on card click. If provided, the Card inner content will be rendered inside `a` */
  href?: string;
  /** On click handler for the Card */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** @deprecated Use `Card.Heading` instead */
  heading?: ReactNode;
  /** @deprecated Use `Card.Description` instead */
  description?: string;
  isSelected?: boolean;
  /** If true, the padding of the Card will be smaller */
  isCompact?: boolean;
  /** Remove the bottom margin */
  noMargin?: boolean;
}

export interface CardInterface extends FC<Props> {
  Heading: typeof Heading;
  Tags: typeof Tags;
  Figure: typeof Figure;
  Meta: typeof Meta;
  Actions: typeof Actions;
  SecondaryActions: typeof SecondaryActions;
  Description: typeof Description;
}

const CardContext = React.createContext<{
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  isSelected?: boolean;
} | null>(null);

/**
 * Generic card component
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-card--docs
 * @public
 */
export const Card: CardInterface = ({
  disabled,
  href,
  onClick,
  children,
  isSelected,
  isCompact,
  className,
  noMargin,
  ...htmlProps
}) => {
  const hasHeadingComponent = useMemo(
    () => React.Children.toArray(children).some((c) => React.isValidElement(c) && c.type === Heading),
    [children]
  );
  const hasDescriptionComponent = useMemo(
    () => React.Children.toArray(children).some((c) => React.isValidElement(c) && c.type === Description),
    [children]
  );

  const disableHover = disabled || (!onClick && !href);
  const onCardClick = onClick && !disabled ? onClick : undefined;
  const isSelectable = isSelected !== undefined;

  const containerProps = mergeStylexClassName(
    stylex.props(
      cardContainerStyles.containerBase,
      hasDescriptionComponent
        ? cardContainerStyles.containerWithDescription
        : cardContainerStyles.containerWithoutDescription,
      isCompact ? cardContainerStyles.containerCompact : cardContainerStyles.containerDefaultPadding,
      noMargin && cardContainerStyles.containerNoMargin,
      disabled && cardContainerStyles.containerDisabled,
      !disableHover && cardContainerStyles.containerHoverable,
      isSelectable && cardContainerStyles.containerSelectable,
      isSelected && cardContainerStyles.containerSelected
    ),
    className
  );

  return (
    <div {...containerProps} {...htmlProps}>
      <CardContext.Provider value={{ href, onClick: onCardClick, disabled, isSelected }}>
        {!hasHeadingComponent && <Heading />}
        {children}
      </CardContext.Provider>
    </div>
  );
};
Card.displayName = 'Card';

interface ChildProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** Main heading for the card */
const Heading = ({ children, className, 'aria-label': ariaLabel }: ChildProps & { 'aria-label'?: string }) => {
  const context = useContext(CardContext);
  const { href, onClick, isSelected } = context ?? {
    href: undefined,
    onClick: undefined,
    isSelected: undefined,
  };
  const optionLabel = t('grafana-ui.card.option', 'option');

  return (
    <div
      data-testid={selectors.components.Card.heading}
      {...mergeStylexClassName(cardStyleProps('heading'), className)}
    >
      {href ? (
        <a href={href} {...cardStyleProps('linkHack')} aria-label={ariaLabel} onClick={onClick}>
          {children}
        </a>
      ) : onClick ? (
        <button onClick={onClick} {...cardStyleProps('linkHack')} aria-label={ariaLabel} type="button">
          {children}
        </button>
      ) : (
        <>{children}</>
      )}
      {isSelected !== undefined && <input aria-label={optionLabel} type="radio" checked={isSelected} readOnly />}
    </div>
  );
};
Heading.displayName = 'Heading';

const Tags = ({ children, className }: ChildProps) => {
  return <div {...mergeStylexClassName(cardStyleProps('tagList'), className)}>{children}</div>;
};
Tags.displayName = 'Tags';

/** Card description text */
const Description = ({ children, className }: ChildProps) => {
  const Element = typeof children === 'string' ? 'p' : 'div';
  return (
    <Element {...mergeStylexClassName(cardStyleProps('description'), className)}>{children}</Element>
  );
};
Description.displayName = 'Description';

const Figure = ({ children, align = 'start', className }: ChildProps & { align?: 'start' | 'center' }) => {
  return (
    <div
      {...mergeStylexClassName(
        stylex.props(
          cardStyles.media,
          align === 'center' ? cardStyles.mediaAlignCenter : cardStyles.mediaAlignStart
        ),
        className
      )}
    >
      {children}
    </div>
  );
};
Figure.displayName = 'Figure';

const Meta = memo(({ children, className, separator = '|' }: ChildProps & { separator?: string }) => {
  let meta = children;

  const filtered = React.Children.toArray(children).filter(Boolean);
  if (!filtered.length) {
    return null;
  }
  meta = filtered.map((element, i) => (
    <div key={`element_${i}`} {...cardStyleProps('metadataItem')}>
      {element}
    </div>
  ));
  if (filtered.length > 1 && separator) {
    meta = filtered.reduce((prev, curr, i) => [
      prev,
      <span key={`separator_${i}`} {...cardStyleProps('separator')}>
        {separator}
      </span>,
      curr,
    ]);
  }
  return <div {...mergeStylexClassName(cardStyleProps('metadata'), className)}>{meta}</div>;
});
Meta.displayName = 'Meta';

interface ActionsProps extends ChildProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const BaseActions = ({ children, disabled, variant, className }: ActionsProps) => {
  const context = useContext(CardContext);
  const isDisabled = context?.disabled || disabled;

  const actionProps =
    variant === 'primary' ? cardStyleProps('actions') : cardStyleProps('secondaryActions');
  return (
    <div {...mergeStylexClassName(actionProps, className)}>
      {React.Children.map(children, (child) => {
        return React.isValidElement<Record<string, unknown>>(child)
          ? cloneElement(child, child.type !== React.Fragment ? { disabled: isDisabled, ...child.props } : undefined)
          : null;
      })}
    </div>
  );
};

const Actions = ({ children, disabled, className }: ChildProps) => {
  return (
    <BaseActions variant="primary" disabled={disabled} className={className}>
      {children}
    </BaseActions>
  );
};
Actions.displayName = 'Actions';

const SecondaryActions = ({ children, disabled, className }: ChildProps) => {
  return (
    <BaseActions variant="secondary" disabled={disabled} className={className}>
      {children}
    </BaseActions>
  );
};
SecondaryActions.displayName = 'SecondaryActions';

Card.Heading = Heading;
Card.Tags = Tags;
Card.Figure = Figure;
Card.Meta = Meta;
Card.Actions = Actions;
Card.SecondaryActions = SecondaryActions;
Card.Description = Description;
