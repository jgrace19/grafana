import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLAttributes } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { shape, typography, v1 } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { type SkeletonComponent, attachSkeleton } from '../../utils/skeleton';
import { getTagColor, getTagColorsFromName } from '../../utils/tags';
import { Icon } from '../Icon/Icon';

/**
 * @public
 */
export type OnTagClick = (name: string, event: React.MouseEvent<HTMLElement>) => void;

export interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Name of the tag to display */
  name: string;
  icon?: IconName;
  /** Use constant color from TAG_COLORS. Using index instead of color directly so we can match other styling. */
  colorIndex?: number;
  onClick?: OnTagClick;
}

const TagComponent = forwardRef<HTMLElement, Props>(({ name, onClick, icon, className, colorIndex, ...rest }, ref) => {
  const colors = colorIndex === undefined ? getTagColorsFromName(name) : getTagColor(colorIndex);

  const onTagClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onClick?.(name, event);
  };

  const { style, ...domProps } = rest;
  const classes = mergeStylexProps(
    stylex.props(styles.wrapper, styles.color(colors.color), onClick !== undefined && styles.hover),
    { className, style }
  );

  return onClick ? (
    <button {...domProps} {...classes} onClick={onTagClick} ref={ref as React.ForwardedRef<HTMLButtonElement>}>
      {icon && <Icon name={icon} />}
      {name}
    </button>
  ) : (
    <span {...domProps} {...classes} ref={ref}>
      {icon && <Icon name={icon} />}
      {name}
    </span>
  );
});
TagComponent.displayName = 'Tag';

const TagSkeleton: SkeletonComponent = ({ rootProps }) => {
  return (
    <Skeleton width={60} height={22} containerClassName={stylex.props(styles.skeleton).className} {...rootProps} />
  );
};

/**
 * Used for displaying metadata, for example to add more details to search results. Background and border colors are generated from the tag name.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-tag--docs
 */
export const Tag = attachSkeleton(TagComponent, TagSkeleton);

const styles = stylex.create({
  skeleton: {
    lineHeight: 1,
  },
  wrapper: {
    appearance: 'none',
    borderStyle: 'none',
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-sm'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    verticalAlign: 'baseline',
    color: v1['--gf-v1-palette-gray98'],
    whiteSpace: 'pre',
    textShadow: 'none',
    paddingTop: '3px',
    paddingRight: '6px',
    paddingBottom: '3px',
    paddingLeft: '6px',
    borderRadius: shape['--gf-shape-radius-sm'],
  },
  color: (backgroundColor: string) => ({
    backgroundColor,
  }),
  hover: {
    opacity: { default: null, ':hover': 0.85 },
    cursor: { default: null, ':hover': 'pointer' },
  },
});
