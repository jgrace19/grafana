import * as stylex from '@stylexjs/stylex';

import { FALLBACK_COLOR } from '@grafana/data';
import { type LineStyle } from '@grafana/schema';

import { shape, spacing } from '../../themes/stylex/tokens.stylex';
import { SeriesIcon } from '../VizLegend/SeriesIcon';

import { ColorIndicator, DEFAULT_COLOR_INDICATOR } from './types';

export enum ColorIndicatorPosition {
  Leading,
  Trailing,
}

interface Props {
  color?: string;
  colorIndicator?: ColorIndicator;
  position?: ColorIndicatorPosition;
  lineStyle?: LineStyle;
  isHollow?: boolean;
}

export const VizTooltipColorIndicator = ({
  color = FALLBACK_COLOR,
  colorIndicator = DEFAULT_COLOR_INDICATOR,
  position = ColorIndicatorPosition.Leading,
  lineStyle,
  isHollow,
}: Props) => {
  if (colorIndicator === ColorIndicator.series && !isHollow) {
    return (
      <SeriesIcon
        color={color}
        lineStyle={lineStyle}
        xstyle={[
          position === ColorIndicatorPosition.Leading ? styles.leading : styles.trailing,
          styles.seriesIndicator,
        ]}
      />
    );
  }

  return (
    <div
      {...stylex.props(
        position === ColorIndicatorPosition.Leading ? styles.leading : styles.trailing,
        colorIndicatorStyles[colorIndicator] ?? colorIndicatorStyles.value
      )}
      style={isHollow ? { border: `1px solid ${color}` } : { backgroundColor: color }}
    />
  );
};

// @TODO Update classes/add svgs
const styles = stylex.create({
  leading: {
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  trailing: {
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  seriesIndicator: {
    position: 'relative',
    top: -2, // half the height of the color indicator, since the top is aligned with flex center.
  },
});

const colorIndicatorStyles = stylex.create({
  series: {
    width: '14px',
    height: '4px',
    borderRadius: shape['--gf-shape-radius-pill'],
    minWidth: '14px',
  },
  value: {
    width: '12px',
    height: '12px',
    borderRadius: shape['--gf-shape-radius-default'],
    fontWeight: 500,
    minWidth: '12px',
  },
  hexagon: {},
  pie_1_4: {},
  pie_2_4: {},
  pie_3_4: {},
  marker_sm: {
    width: '4px',
    height: '4px',
    borderRadius: shape['--gf-shape-radius-circle'],
    minWidth: '4px',
  },
  marker_md: {
    width: '8px',
    height: '8px',
    borderRadius: shape['--gf-shape-radius-circle'],
    minWidth: '8px',
  },
  marker_lg: {
    width: '12px',
    height: '12px',
    borderRadius: shape['--gf-shape-radius-circle'],
    minWidth: '12px',
  },
});
