import * as stylex from '@stylexjs/stylex';
import { type HTMLAttributes, useMemo } from 'react';
import * as React from 'react';
import Skeleton from 'react-loading-skeleton';
import tinycolor from 'tinycolor2';

import { type GrafanaTheme2 } from '@grafana/data';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
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
}

const BadgeComponent = React.memo<BadgeProps>(({ icon, color, text, tooltip, className, style, ...otherProps }) => {
  const theme = useTheme2();
  const paletteStyle = useMemo(() => {
    if (color === 'brand') {
      return styles.brand;
    }
    const { background, border, text } = getPaletteColors(theme, color);
    return styles.palette(background, border, text);
  }, [theme, color]);

  const badge = (
    <div {...mergeStylexProps(stylex.props(styles.wrapper, paletteStyle), className, style)} {...otherProps}>
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
});
BadgeComponent.displayName = 'Badge';

const BadgeSkeleton: SkeletonComponent = ({ rootProps }) => {
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
 * The badge component adds meta information to other content, for example about release status or new elements. You can add any `Icon` component or use the badge without an icon.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/information-badge--docs
 */
export const Badge = attachSkeleton(BadgeComponent, BadgeSkeleton);

function getPaletteColors(theme: GrafanaTheme2, color: Exclude<BadgeColor, 'brand'>) {
  const sourceColor = theme.visualization.getColorByName(color);
  return {
    background: tinycolor(sourceColor).setAlpha(0.15).toString(),
    border: tinycolor(sourceColor).setAlpha(0.25).toString(),
    text: theme.isDark ? tinycolor(sourceColor).lighten(15).toString() : tinycolor(sourceColor).darken(25).toString(),
  };
}

const styles = stylex.create({
  skeletonContainer: {
    lineHeight: 1,
  },
  wrapper: {
    display: 'inline-flex',
    paddingBlock: '1px',
    paddingInline: '4px',
    borderRadius: shape['--grafana-shape-radius-sm'],
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: typography['--grafana-typography-font-weight-regular'],
    gap: spacing['--grafana-spacing-0-5'],
    fontSize: typography['--grafana-typography-body-small-font-size'],
    lineHeight: typography['--grafana-typography-body-small-line-height'],
    alignItems: 'center',
  },
  // Palette colors are derived with tinycolor from the theme's visualization palette at runtime.
  palette: (background: string, borderColor: string, color: string) => ({
    backgroundColor: background,
    borderColor,
    color,
  }),
  brand: {
    backgroundImage: colors['--grafana-colors-gradients-brand-horizontal'],
    borderColor: 'transparent',
    color: colors['--grafana-colors-primary-contrast-text'],
  },
});
