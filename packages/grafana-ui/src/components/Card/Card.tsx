import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { memo, cloneElement, type FC, useMemo, useContext, type ReactNode } from 'react';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

import { CardContainer, type CardContainerProps } from './CardContainer';

import './Card.css';

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

  return (
    <CardContainer
      disableEvents={disabled}
      disableHover={disableHover}
      isSelected={isSelected}
      className={className}
      xstyle={[
        styles.container,
        hasDescriptionComponent ? styles.gridWithDescription : styles.grid,
        isCompact && styles.compact,
        isSelectable && styles.selectable,
        isSelected && (disableHover ? styles.selected : styles.selectedHoverable),
      ]}
      noMargin={noMargin}
      hasDescriptionComponent={hasDescriptionComponent}
      {...htmlProps}
    >
      <CardContext.Provider value={{ href, onClick: onCardClick, disabled, isSelected }}>
        {!hasHeadingComponent && <Heading />}
        {children}
      </CardContext.Provider>
    </CardContainer>
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
  const linkHackClassName = clsx('gf-card-link-hack', stylex.props(headingStyles.linkHack).className);

  return (
    <div
      data-testid={selectors.components.Card.heading}
      {...mergeStylexProps(stylex.props(headingStyles.heading), { className: clsx('gf-card-heading', className) })}
    >
      {href ? (
        <a href={href} className={linkHackClassName} aria-label={ariaLabel} onClick={onClick}>
          {children}
        </a>
      ) : onClick ? (
        <button onClick={onClick} className={linkHackClassName} aria-label={ariaLabel} type="button">
          {children}
        </button>
      ) : (
        <>{children}</>
      )}
      {/* Input must be readonly because we are providing a value for the checked prop with no onChange handler */}
      {isSelected !== undefined && <input aria-label={optionLabel} type="radio" checked={isSelected} readOnly />}
    </div>
  );
};
Heading.displayName = 'Heading';

const Tags = ({ children, className }: ChildProps) => {
  return <div {...mergeStylexProps(stylex.props(tagStyles.tagList), { className })}>{children}</div>;
};
Tags.displayName = 'Tags';

/** Card description text */
const Description = ({ children, className }: ChildProps) => {
  const Element = typeof children === 'string' ? 'p' : 'div';
  return (
    <Element {...mergeStylexProps(stylex.props(descriptionStyles.description), { className })}>{children}</Element>
  );
};
Description.displayName = 'Description';

const Figure = ({ children, align = 'start', className }: ChildProps & { align?: 'start' | 'center' }) => {
  return (
    <div
      {...mergeStylexProps(stylex.props(figureStyles.media, figureAlignStyles[align]), {
        className: clsx('gf-card-figure', className),
      })}
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
    <div key={`element_${i}`} {...stylex.props(metaStyles.metadataItem)}>
      {element}
    </div>
  ));
  // Join meta data elements by separator
  if (filtered.length > 1 && separator) {
    meta = filtered.reduce((prev, curr, i) => [
      prev,
      <span key={`separator_${i}`} {...stylex.props(metaStyles.separator)}>
        {separator}
      </span>,
      curr,
    ]);
  }
  return <div {...mergeStylexProps(stylex.props(metaStyles.metadata), { className })}>{meta}</div>;
});
Meta.displayName = 'Meta';

interface ActionsProps extends ChildProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const BaseActions = ({ children, disabled, variant, className }: ActionsProps) => {
  const context = useContext(CardContext);
  const isDisabled = context?.disabled || disabled;

  return (
    <div
      {...mergeStylexProps(stylex.props(variant === 'primary' ? actionStyles.actions : actionStyles.secondaryActions), {
        className,
      })}
    >
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

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;

const styles = stylex.create({
  container: {
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'row',
    width: '100%',
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  grid: {
    gridTemplateAreas: '"Figure Heading Tags" "Figure Meta Tags" "Figure Actions Secondary"',
    gridTemplateRows: '1fr auto auto',
    gridTemplateColumns: 'auto 1fr auto',
  },
  gridWithDescription: {
    gridTemplateAreas: '"Figure Heading Tags" "Figure Meta Tags" "Figure Description Tags" "Figure Actions Secondary"',
    gridTemplateRows: 'auto auto 1fr auto',
    gridTemplateColumns: 'auto 1fr auto',
  },
  compact: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  selectable: {
    cursor: 'pointer',
  },
  selected: {
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineColor: colors['--gf-colors-primary-border'],
  },
  // CardContainer's `:focus` ring still wins over the selected outline.
  selectedHoverable: {
    outlineStyle: { default: 'solid', ':focus': 'dotted' },
    outlineWidth: '2px',
    outlineColor: { default: colors['--gf-colors-primary-border'], ':focus': 'transparent' },
  },
});

// `all: unset`, the heading's `input[readonly]` cursor and the figure's `> img` rule are in Card.css.
const headingStyles = stylex.create({
  heading: {
    gridColumnEnd: 'Heading',
    gridColumnStart: 'Heading',
    gridRowEnd: 'Heading',
    gridRowStart: 'Heading',
    justifySelf: 'start',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    fontSize: typography['--gf-typography-size-md'],
    letterSpacing: 'inherit',
    lineHeight: typography['--gf-typography-body-line-height'],
    color: colors['--gf-colors-text-primary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
  },
  linkHack: {
    '::after': {
      position: 'absolute',
      content: '""',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: shape['--gf-shape-radius-default'],
      outlineStyle: { default: null, ':focus-visible': 'dotted' },
      outlineWidth: { default: null, ':focus-visible': '2px' },
      outlineColor: { default: null, ':focus-visible': 'transparent' },
      outlineOffset: { default: null, ':focus-visible': '2px' },
      boxShadow: { default: null, ':focus-visible': focusRing },
      transitionProperty: { default: null, ':focus-visible': 'outline, outline-offset, box-shadow' },
      transitionDuration: { default: null, ':focus-visible': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
      transitionTimingFunction: {
        default: null,
        ':focus-visible': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
      },
      zIndex: { default: null, ':focus-visible': 1 },
    },
  },
});

const tagStyles = stylex.create({
  tagList: {
    position: 'relative',
    gridColumnEnd: 'Tags',
    gridColumnStart: 'Tags',
    gridRowEnd: 'Tags',
    gridRowStart: 'Tags',
    alignSelf: 'center',
  },
});

const descriptionStyles = stylex.create({
  description: {
    width: '100%',
    gridColumnEnd: 'Description',
    gridColumnStart: 'Description',
    gridRowEnd: 'Description',
    gridRowStart: 'Description',
    marginTop: spacing['--gf-spacing-x1'],
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: colors['--gf-colors-text-secondary'],
    lineHeight: typography['--gf-typography-body-line-height'],
  },
});

const figureStyles = stylex.create({
  media: {
    position: 'relative',
    gridColumnEnd: 'Figure',
    gridColumnStart: 'Figure',
    gridRowEnd: 'Figure',
    gridRowStart: 'Figure',
    marginRight: spacing['--gf-spacing-x2'],
    width: '40px',
    display: { default: null, ':empty': 'none' },
  },
});

const figureAlignStyles = stylex.create({
  start: { alignSelf: 'start' },
  center: { alignSelf: 'center' },
});

const metaStyles = stylex.create({
  metadata: {
    gridColumnEnd: 'Meta',
    gridColumnStart: 'Meta',
    gridRowEnd: 'Meta',
    gridRowStart: 'Meta',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: typography['--gf-typography-size-sm'],
    color: colors['--gf-colors-text-secondary'],
    marginTop: spacing['--gf-spacing-x0-5'],
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    lineHeight: typography['--gf-typography-body-small-line-height'],
    overflowWrap: 'anywhere',
  },
  metadataItem: {
    // Needed to allow for clickable children in metadata
    zIndex: 0,
  },
  separator: {
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x1'],
  },
});

const actionStyles = stylex.create({
  actions: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x1'],
    gridColumnEnd: 'Actions',
    gridColumnStart: 'Actions',
    gridRowEnd: 'Actions',
    gridRowStart: 'Actions',
    marginTop: spacing['--gf-spacing-x2'],
  },
  secondaryActions: {
    alignSelf: 'center',
    color: colors['--gf-colors-text-secondary'],
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x1'],
    gridColumnEnd: 'Secondary',
    gridColumnStart: 'Secondary',
    gridRowEnd: 'Secondary',
    gridRowStart: 'Secondary',
    marginTop: spacing['--gf-spacing-x2'],
  },
});
