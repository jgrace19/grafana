import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import tinycolor from 'tinycolor2';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { type IconName } from '../../types/icon';
import { type SkeletonComponent, attachSkeleton } from '../../utils/skeleton';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent } from '../Tooltip/types';

export type BadgeColor = 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'darkgrey' | 'brand';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  text?: React.ReactNode;
  color: BadgeColor;
  icon?: IconName;
  tooltip?: PopoverContent;
  /** @internal first-party StyleX overrides, applied last */
  xstyle?: stylex.StyleXStyles;
}

const BadgeComponent = React.memo<BadgeProps>(
  ({ icon, color, text, tooltip, className, style, xstyle, ...otherProps }) => {
    const theme = useTheme2();
    const badgeColors = getBadgeColors(theme, color);
    const badge = (
      <div
        {...mergeStylexProps(stylex.props(styles.wrapper, styles.colors(...badgeColors), xstyle), { className, style })}
        {...otherProps}
      >
        {icon && <Icon name={icon} size="sm" />}
        {text}
      </div>
    );

    return tooltip ? (
      <Tooltip content={tooltip} placement="auto">
        {badge}
      </Tooltip>
    ) : (
      badge
    );
  }
);
BadgeComponent.displayName = 'Badge';

const BadgeSkeleton: SkeletonComponent = ({ rootProps }) => {
  return (
    <Skeleton width={60} height={22} containerClassName={stylex.props(styles.skeleton).className} {...rootProps} />
  );
};

/**
 * The badge component adds meta information to other content, for example about release status or new elements. You can add any `Icon` component or use the badge without an icon.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-badge--docs
 */
export const Badge = attachSkeleton(BadgeComponent, BadgeSkeleton);

/** [background-color, background-image, border-color, color]: colour math on the visualization palette. */
function getBadgeColors(theme: GrafanaTheme2, color: BadgeColor): [string, string, string, string] {
  if (color === 'brand') {
    return ['transparent', theme.colors.gradients.brandHorizontal, 'transparent', theme.colors.primary.contrastText];
  }
  const sourceColor = theme.visualization.getColorByName(color);
  const textColor = theme.isDark
    ? tinycolor(sourceColor).lighten(15).toString()
    : tinycolor(sourceColor).darken(25).toString();
  return [
    tinycolor(sourceColor).setAlpha(0.15).toString(),
    'none',
    tinycolor(sourceColor).setAlpha(0.25).toString(),
    textColor,
  ];
}

const styles = stylex.create({
  skeleton: {
    lineHeight: 1,
  },
  wrapper: {
    display: 'inline-flex',
    paddingTop: '1px',
    paddingRight: '4px',
    paddingBottom: '1px',
    paddingLeft: '4px',
    borderRadius: shape['--gf-shape-radius-sm'],
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: typography['--gf-typography-font-weight-regular'],
    gap: spacing['--gf-spacing-x0-5'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    alignItems: 'center',
  },
  colors: (backgroundColor: string, backgroundImage: string, borderColor: string, color: string) => ({
    backgroundColor,
    backgroundImage,
    borderColor,
    color,
  }),
});
