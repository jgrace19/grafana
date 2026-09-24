import * as stylex from '@stylexjs/stylex';
import { type CSSProperties } from 'react';
import * as React from 'react';

import { fieldColorModeRegistry } from '@grafana/data';
import { type LineStyle } from '@grafana/schema';

import { useTheme2 } from '../../themes/ThemeContext';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: string;
  gradient?: string;
  lineStyle?: LineStyle;
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
}

export const SeriesIcon = React.memo(
  React.forwardRef<HTMLDivElement, Props>(({ color, className, gradient, lineStyle, xstyle, ...restProps }, ref) => {
    const theme = useTheme2();

    let cssColor: string;

    if (gradient) {
      const colors = fieldColorModeRegistry.get(gradient).getColors?.(theme);
      if (colors?.length) {
        cssColor = `linear-gradient(90deg, ${colors.join(', ')})`;
      } else {
        // Not sure what to default to, this will return gray, this should not happen though.
        cssColor = theme.visualization.getColorByName('');
      }
    } else {
      cssColor = color!;
    }

    let customStyle: CSSProperties;

    if (lineStyle?.fill === 'dot' && !gradient) {
      // make a circle bg image and repeat it
      customStyle = {
        backgroundImage: `radial-gradient(circle at 2px 2px, ${color} 2px, transparent 0)`,
        backgroundSize: '4px 4px',
        backgroundRepeat: 'space',
      };
    } else if (lineStyle?.fill === 'dash' && !gradient) {
      // make a rectangle bg image and repeat it
      customStyle = {
        backgroundImage: `linear-gradient(to right, ${color} 100%, transparent 0%)`,
        backgroundSize: '6px 4px',
        backgroundRepeat: 'space',
      };
    } else {
      customStyle = {
        background: cssColor,
        borderRadius: theme.shape.radius.pill,
      };
    }

    return (
      <div
        data-testid="series-icon"
        ref={ref}
        {...mergeStylexProps(stylex.props(styles.forcedColors, styles.container, xstyle), { className })}
        style={customStyle}
        {...restProps}
      />
    );
  })
);

SeriesIcon.displayName = 'SeriesIcon';

const styles = stylex.create({
  container: {
    display: 'inline-block',
    width: '14px',
    height: '4px',
  },
  forcedColors: {
    forcedColorAdjust: { default: null, '@media (forced-colors: active)': 'none' },
  },
});
