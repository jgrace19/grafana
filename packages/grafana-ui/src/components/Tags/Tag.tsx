import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLAttributes } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';

import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, typography } from '../../themes/stylex/tokens.stylex';
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

const TagComponent = forwardRef<HTMLElement, Props>(
  ({ name, onClick, icon, className, colorIndex, style, ...rest }, ref) => {
    const { color } = colorIndex === undefined ? getTagColorsFromName(name) : getTagColor(colorIndex);
    const styleProps = mergeStylexProps(
      stylex.props(styles.wrapper, styles.background(color), onClick !== undefined && styles.hover),
      className,
      style
    );

    const onTagClick = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      onClick?.(name, event);
    };

    return onClick ? (
      <button {...rest} {...styleProps} onClick={onTagClick} ref={ref as React.ForwardedRef<HTMLButtonElement>}>
        {icon && <Icon name={icon} />}
        {name}
      </button>
    ) : (
      <span {...rest} {...styleProps} ref={ref}>
        {icon && <Icon name={icon} />}
        {name}
      </span>
    );
  }
);
TagComponent.displayName = 'Tag';

const TagSkeleton: SkeletonComponent = ({ rootProps }) => {
  return (
    <Skeleton
      width={60}
      height={22}
      containerClassName={stylex.props(styles.skeletonContainer).className}
      {...rootProps}
    />
  );
};

/**
 * Used for displaying metadata, for example to add more details to search results. Background and border colors are generated from the tag name.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-tag--docs
 */
export const Tag = attachSkeleton(TagComponent, TagSkeleton);

const styles = stylex.create({
  skeletonContainer: {
    lineHeight: 1,
  },
  wrapper: {
    appearance: 'none',
    borderStyle: 'none',
    fontWeight: typography['--grafana-typography-font-weight-medium'],
    fontSize: typography['--grafana-typography-size-sm'],
    lineHeight: typography['--grafana-typography-body-small-line-height'],
    verticalAlign: 'baseline',
    color: colors['--grafana-v1-palette-gray98'],
    whiteSpace: 'pre',
    textShadow: 'none',
    paddingBlock: '3px',
    paddingInline: '6px',
    borderRadius: shape['--grafana-shape-radius-sm'],
  },
  // Tag colors are derived from the tag name at runtime, so they are passed through a StyleX dynamic style.
  background: (color: string) => ({
    backgroundColor: color,
  }),
  hover: {
    opacity: {
      default: null,
      ':hover': 0.85,
    },
    cursor: {
      default: null,
      ':hover': 'pointer',
    },
  },
});
