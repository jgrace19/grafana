import {
  type DataFrame,
  type Field,
  FieldType,
  getDisplayProcessor,
  getFieldDisplayName,
  type GrafanaTheme2,
} from '@grafana/data';
import {
  AxisPlacement,
  GraphDrawStyle,
  type GraphFieldConfig,
  LineInterpolation,
  VisibilityMode,
} from '@grafana/schema';

import { type TrendOverlayOptions, TrendOverlayType } from './panelcfg.gen';

const DEFAULT_WINDOW_SIZE = 10;
const MIN_WINDOW_SIZE = 2;

/**
 * Compute a trailing simple moving average over `values` using `windowSize` points.
 * Nulls inside the window are skipped; if a window has no finite values, the output
 * is null at that index. Indices before the first full window are also null.
 */
export function movingAverage(values: ArrayLike<unknown>, windowSize: number): Array<number | null> {
  const n = values.length;
  const out = new Array<number | null>(n).fill(null);

  if (n === 0) {
    return out;
  }

  const w = Math.max(MIN_WINDOW_SIZE, Math.floor(windowSize));

  for (let i = 0; i < n; i++) {
    if (i < w - 1) {
      out[i] = null;
      continue;
    }
    let sum = 0;
    let count = 0;
    for (let j = i - w + 1; j <= i; j++) {
      const v = values[j];
      if (typeof v === 'number' && Number.isFinite(v)) {
        sum += v;
        count += 1;
      }
    }
    out[i] = count > 0 ? sum / count : null;
  }

  return out;
}

/**
 * Fit a simple linear regression y = a*x + b over (xs, ys) using ordinary least
 * squares, ignoring null/non-finite values. Returns predicted y for every x — even
 * indices where the original value was null — so the trendline is defined across
 * the full visible range. If fewer than two finite samples exist, returns nulls.
 */
export function linearRegression(xs: ArrayLike<unknown>, ys: ArrayLike<unknown>): Array<number | null> {
  const n = ys.length;
  const out = new Array<number | null>(n).fill(null);

  let count = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const y = ys[i];
    const x = xs[i];
    if (typeof y !== 'number' || typeof x !== 'number' || !Number.isFinite(y) || !Number.isFinite(x)) {
      continue;
    }
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    count += 1;
  }

  if (count < 2) {
    return out;
  }

  const denom = count * sumXX - sumX * sumX;
  if (denom === 0) {
    return out;
  }

  const slope = (count * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / count;

  for (let i = 0; i < n; i++) {
    const x = xs[i];
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      out[i] = null;
    } else {
      out[i] = slope * x + intercept;
    }
  }

  return out;
}

interface BuildOverlayFieldOptions {
  source: Field;
  frame: DataFrame;
  data: DataFrame[];
  values: Array<number | null>;
  suffix: string;
  theme: GrafanaTheme2;
}

function buildOverlayField({ source, frame, data, values, suffix, theme }: BuildOverlayFieldOptions): Field {
  const sourceDisplay = getFieldDisplayName(source, frame, data);
  const displayName = `${sourceDisplay} (${suffix})`;
  const sourceCustom: GraphFieldConfig = source.config?.custom ?? {};
  const overlayCustom: GraphFieldConfig = {
    ...sourceCustom,
    drawStyle: GraphDrawStyle.Line,
    lineInterpolation: sourceCustom.lineInterpolation ?? LineInterpolation.Smooth,
    lineWidth: 2,
    fillOpacity: 0,
    showPoints: VisibilityMode.Never,
    pointSize: 0,
    spanNulls: true,
    lineStyle: { fill: 'dash', dash: [10, 6] },
    axisPlacement: sourceCustom.axisPlacement ?? AxisPlacement.Auto,
    hideFrom: sourceCustom.hideFrom,
    stacking: undefined,
    thresholdsStyle: undefined,
  };

  const overlay: Field = {
    name: `${source.name}__overlay__${suffix}`,
    type: FieldType.number,
    values,
    labels: source.labels,
    config: {
      ...source.config,
      displayName,
      displayNameFromDS: undefined,
      custom: overlayCustom,
      noValue: undefined,
      thresholds: undefined,
      mappings: undefined,
      links: undefined,
    },
    state: {
      ...source.state,
      displayName,
      multipleFrames: source.state?.multipleFrames,
      origin: undefined,
    },
  };

  overlay.display = getDisplayProcessor({ field: overlay, theme });
  return overlay;
}

/**
 * Append derived overlay fields (moving average or linear regression) to each
 * frame in `frames`. The overlay fields share the frame's existing time field so
 * uPlot draws them as additional series with no extra config wiring.
 *
 * `frames` is treated as immutable input; this returns a new array of frames
 * with new field arrays. The original frames/fields are not mutated.
 */
export function appendTrendOverlays(
  frames: DataFrame[],
  options: TrendOverlayOptions | undefined,
  theme: GrafanaTheme2
): DataFrame[] {
  if (!frames?.length || !options?.enabled) {
    return frames;
  }

  const overlayType = options.type ?? TrendOverlayType.MovingAverage;
  const windowSize = Math.max(MIN_WINDOW_SIZE, Math.floor(options.windowSize ?? DEFAULT_WINDOW_SIZE));
  const suffix = overlayType === TrendOverlayType.MovingAverage ? `MA ${windowSize}` : 'Trend';

  return frames.map((frame) => {
    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      return frame;
    }

    const xs = timeField.values;
    const newFields: Field[] = [];

    for (const field of frame.fields) {
      newFields.push(field);
      if (field.type !== FieldType.number || field === timeField) {
        continue;
      }
      const sourceValues = field.values;
      const overlayValues =
        overlayType === TrendOverlayType.MovingAverage
          ? movingAverage(sourceValues, windowSize)
          : linearRegression(xs, sourceValues);

      newFields.push(
        buildOverlayField({
          source: field,
          frame,
          data: frames,
          values: overlayValues,
          suffix,
          theme,
        })
      );
    }

    return {
      ...frame,
      fields: newFields,
    };
  });
}
