import {
  type DataFrame,
  type Field,
  FieldColorModeId,
  FieldType,
  getFieldDisplayName,
  type GrafanaTheme2,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { GraphDrawStyle, type GraphFieldConfig, VisibilityMode } from '@grafana/schema';

import { TrendOverlayMode, type TrendOverlayOptions } from './panelcfg.gen';

const DEFAULT_WINDOW = 10;
const DEFAULT_LINE_WIDTH = 2;

/**
 * Compute a simple moving average. The window is trailing (right-aligned) and
 * null/non-finite values are ignored without breaking the window.
 */
export function computeMovingAverage(values: Array<number | null>, windowSize: number): Array<number | null> {
  const n = values.length;
  const out: Array<number | null> = new Array(n).fill(null);
  if (windowSize < 1 || n === 0) {
    return out;
  }

  const buf: number[] = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (v != null && Number.isFinite(v)) {
      buf.push(v);
      sum += v;
      if (buf.length > windowSize) {
        sum -= buf.shift()!;
      }
      if (buf.length > 0) {
        out[i] = sum / buf.length;
      }
    } else {
      // Carry forward the most recent window average so the line stays continuous.
      out[i] = buf.length > 0 ? sum / buf.length : null;
    }
  }

  return out;
}

/**
 * Compute a simple least-squares linear regression over (time, value) pairs and
 * return the predicted y for every provided time, including rows where the
 * source value was null.
 */
export function computeLinearRegression(
  times: number[],
  values: Array<number | null>
): Array<number | null> {
  const n = Math.min(times.length, values.length);
  const out: Array<number | null> = new Array(n).fill(null);

  if (n === 0) {
    return out;
  }

  // Normalize x by first timestamp to preserve float precision.
  const x0 = times[0] ?? 0;

  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXX = 0;
  let sumXY = 0;

  for (let i = 0; i < n; i++) {
    const y = values[i];
    if (y == null || !Number.isFinite(y)) {
      continue;
    }
    const x = times[i] - x0;
    count++;
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
  }

  if (count < 2) {
    return out;
  }

  const denom = count * sumXX - sumX * sumX;
  if (denom === 0) {
    const mean = sumY / count;
    for (let i = 0; i < n; i++) {
      out[i] = mean;
    }
    return out;
  }

  const slope = (count * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / count;

  for (let i = 0; i < n; i++) {
    const x = times[i] - x0;
    out[i] = intercept + slope * x;
  }

  return out;
}

function getParentColor(field: Field, theme: GrafanaTheme2): string | undefined {
  const mode = field.config.color?.mode;
  if (mode === FieldColorModeId.Fixed && field.config.color?.fixedColor) {
    return theme.visualization.getColorByName(field.config.color.fixedColor);
  }

  const seriesIndex = field.state?.seriesIndex;
  if (seriesIndex != null) {
    const palette = theme.visualization.palette;
    const name = palette[seriesIndex % palette.length];
    return theme.visualization.getColorByName(name);
  }

  return undefined;
}

function buildOverlayField(
  parent: Field,
  frame: DataFrame,
  overlayValues: Array<number | null>,
  options: Required<Pick<TrendOverlayOptions, 'mode' | 'lineWidth'>>,
  theme: GrafanaTheme2
): Field {
  const baseCustom: GraphFieldConfig = parent.config.custom ?? {};
  const color = getParentColor(parent, theme);

  const parentName = getFieldDisplayName(parent, frame);
  const suffix =
    options.mode === TrendOverlayMode.LinearRegression
      ? t('timeseries.trend-overlay.regression-suffix', 'trend')
      : t('timeseries.trend-overlay.ma-suffix', 'MA');
  const name = `${parentName} (${suffix})`;

  const overlayCustom: GraphFieldConfig = {
    ...baseCustom,
    drawStyle: GraphDrawStyle.Line,
    lineWidth: options.lineWidth,
    fillOpacity: 0,
    lineStyle: { fill: 'dash', dash: [8, 4] },
    showPoints: VisibilityMode.Never,
    gradientMode: undefined,
    stacking: undefined,
    thresholdsStyle: undefined,
    hideFrom: { legend: false, tooltip: false, viz: false },
  };

  return {
    name,
    type: FieldType.number,
    values: overlayValues,
    config: {
      ...parent.config,
      displayName: name,
      displayNameFromDS: undefined,
      custom: overlayCustom,
      color: color
        ? { mode: FieldColorModeId.Fixed, fixedColor: color }
        : { mode: FieldColorModeId.Fixed, fixedColor: 'text' },
      // Avoid inheriting thresholds / decimals overrides that don't suit a trend line.
      mappings: undefined,
    },
    state: {
      // Inherit seriesIndex so palette-based coloring in downstream consumers
      // (legend, tooltip) stays consistent with the parent series.
      seriesIndex: parent.state?.seriesIndex,
      // Clear cached displayName so getFieldDisplayName uses our new name.
      displayName: undefined,
    },
  };
}

/**
 * Append a moving-average or linear-regression overlay field for every numeric
 * series in the supplied frames. Pure: never mutates input frames/fields.
 *
 * No-op (returns the original frames reference) when mode === Off.
 */
export function applyTrendOverlay(
  frames: DataFrame[],
  options: TrendOverlayOptions | undefined,
  theme: GrafanaTheme2
): DataFrame[] {
  const mode = options?.mode ?? TrendOverlayMode.Off;
  if (mode === TrendOverlayMode.Off || !frames?.length) {
    return frames;
  }

  const windowSize = Math.max(2, Math.floor(options?.windowSize ?? DEFAULT_WINDOW));
  const lineWidth = Math.max(1, Math.floor(options?.lineWidth ?? DEFAULT_LINE_WIDTH));

  return frames.map((frame) => {
    // Skip time-compare shifted frames – overlaying them would double up series.
    if (frame.meta?.timeCompare?.isTimeShiftQuery) {
      return frame;
    }

    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      return frame;
    }

    const times: number[] = timeField.values;

    const extraFields: Field[] = [];
    for (const field of frame.fields) {
      if (field.type !== FieldType.number) {
        continue;
      }
      const custom: GraphFieldConfig | undefined = field.config.custom;
      if (custom?.hideFrom?.viz) {
        continue;
      }

      const values: Array<number | null> = field.values;
      const overlayValues =
        mode === TrendOverlayMode.MovingAverage
          ? computeMovingAverage(values, windowSize)
          : computeLinearRegression(times, values);

      extraFields.push(
        buildOverlayField(field, frame, overlayValues, { mode, lineWidth }, theme)
      );
    }

    if (extraFields.length === 0) {
      return frame;
    }

    return {
      ...frame,
      fields: [...frame.fields, ...extraFields],
    };
  });
}
