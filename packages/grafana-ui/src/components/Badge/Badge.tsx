import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, type HTMLAttributes } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import tinycolor from 'tinycolor2';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';
import { type IconName } from '../../types/icon';
import { type SkeletonComponent, attachSkeleton } from '../../utils/skeleton';
import { Icon } from '../Icon/Icon';
import { Tooltip } from '../Tooltip/Tooltip';
import { type PopoverContent } from '../Tooltip/types';

import { badgeStyles } from './Badge.stylex';

export type BadgeColor = 'blue' | 'red' | 'green' | 'orange' | 'purple' | 'darkgrey' | 'brand';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  text?: React.ReactNode;
  color: BadgeColor;
  icon?: IconName;
  tooltip?: PopoverContent;
}

function badgeColorVars(theme: GrafanaTheme2, color: BadgeColor): CSSProperties {
  if (color === 'brand') return {};
  const sourceColor = theme.visualization.getColorByName(color);
  if (theme.isDark) {
    return {
      '--grafana-badge-bg': tinycolor(sourceColor).setAlpha(0.15).toString(),
      '--grafana-badge-border': tinycolor(sourceColor).setAlpha(0.25).toString(),
      '--grafana-badge-text': tinycolor(sourceColor).lighten(15).toString(),
    } as CSSProperties;
  }
  return {
    '--grafana-badge-bg': tinycolor(sourceColor).setAlpha(0.15).toString(),
    '--grafana-badge-border': tinycolor(sourceColor).setAlpha(0.25).toString(),
    '--grafana-badge-text': tinycolor(sourceColor).darken(25).toString(),
  } as CSSProperties;
}

const BadgeComponent = React.memo<BadgeProps>(({ icon, color, text, tooltip, className, style, ...otherProps }) => {
  const theme = useTheme2();
  const styleProps = mergeStylexClassName(
    stylex.props(badgeStyles.wrapper, color === 'brand' && badgeStyles.brand),
    className
  );
  const badge = (
    <div {...styleProps} style={{ ...badgeColorVars(theme, color), ...style }} {...otherProps}>
      {icon && <Icon name={icon} size="sm" />}
      {text}
    </div>
  );
  return tooltip ? <Tooltip content={tooltip} placement="auto">{badge}</Tooltip> : badge;
});
BadgeComponent.displayName = 'Badge';

const BadgeSkeleton: SkeletonComponent = ({ rootProps }) => {
  const { className } = stylex.props(badgeStyles.skeletonContainer);
  return <Skeleton width={60} height={22} containerClassName={className} {...rootProps} />;
};

export const Badge = attachSkeleton(BadgeComponent, BadgeSkeleton);
