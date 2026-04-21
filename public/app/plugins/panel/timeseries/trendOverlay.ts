import { SimpleLinearRegression } from 'ml-regression-simple-linear';

import {
  colorManipulator,
  type DataFrame,
  type Field,
  FieldColorModeId,
  FieldType,
  getFieldDisplayName,
  getFieldSeriesColor,
  type GrafanaTheme2,
} from '@grafana/data';
import { GraphDrawStyle, LineInterpolation } from '@grafana/schema';

import { TrendOverlayMode, type TrendOverlayOptions } from './panelcfg.gen';

const MIN_WINDOW_FRACTION = 0.5;

/**
 * Compute a trailing moving average over `values` using the given window size.
 *
 * Non-finite inputs (null/NaN) are skipped. Output positions for which the
 * trailing window contains fewer than half of windowSize finite samples are
 * emitted as `null` so the overlay does not draw a misleading line during the
 * warm-up period.
 */
export function computeMovingAverage(values: Array<number | null>, windowSize: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  if (windowSize < 2 || values.length === 0) {
    return out;
  }

  const minCount = Math.max(1, Math.ceil(windowSize * MIN_WINDOW_FRACTION));

  let sum = 0;
  let count = 0;
  // track window contents so we can subtract the value leaving the window
  const ring: Array<number | null> = new Array(windowSize).fill(null);

  for (let i = 0; i < values.length; i++) {
    const incomingIdx = i % windowSize;
    const leaving = ring[incomingIdx];
    if (leaving != null && Number.isFinite(leaving)) {
      sum -= leaving;
      count--;
    }

    const v = values[i];
    if (v != null && Number.isFinite(v)) {
      sum += v;
      count++;
      ring[incomingIdx] = v;
    } else {
      ring[incomingIdx] = null;
    }

    if (count >= minCount) {
      out[i] = sum / count;
    }
  }

  return out;
}

/**
 * Compute a simple linear regression line over `xs`/`ys`. Returns an array of
 * the same length as xs, with null in positions whose x or y input is invalid.
 */
export function computeLinearRegression(xs: Array<number | null>, ys: Array<number | null>): Array<number | null> {
  const out: Array<number | null> = new Array(xs.length).fill(null);

  const xNorm: number[] = [];
  const yNorm: number[] = [];
  // Normalize against xMin to avoid huge magnitudes for time x values
  let xMin = Infinity;
  for (const x of xs) {
    if (x != null && Number.isFinite(x) && x < xMin) {
      xMin = x;
    }
  }
  if (!Number.isFinite(xMin)) {
    return out;
  }

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (x != null && Number.isFinite(x) && y != null && Number.isFinite(y)) {
      xNorm.push(x - xMin);
      yNorm.push(y);
    }
  }

  if (xNorm.length < 2) {
    return out;
  }

  const model = new SimpleLinearRegression(xNorm, yNorm);

  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (x != null && Number.isFinite(x)) {
      out[i] = model.predict(x - xMin);
    }
  }

  return out;
}

function buildOverlayField(
  sourceField: Field,
  sourceFrame: DataFrame,
  allFrames: DataFrame[],
  trendValues: Array<number | null>,
  suffix: string,
  opts: TrendOverlayOptions,
  theme: GrafanaTheme2
): Field {
  const baseColor = getFieldSeriesColor(sourceField, theme).color;
  const overlayColor = colorManipulator.alpha(baseColor, opts.opacity);
  const displayName = `${getFieldDisplayName(sourceField, sourceFrame, allFrames)} ${suffix}`;

  return {
    name: `${sourceField.name} ${suffix}`,
    type: FieldType.number,
    values: trendValues,
    labels: sourceField.labels,
    config: {
      displayName,
      color: {
        mode: FieldColorModeId.Fixed,
        fixedColor: overlayColor,
      },
      custom: {
        drawStyle: GraphDrawStyle.Line,
        lineInterpolation: LineInterpolation.Smooth,
        lineWidth: opts.lineWidth,
        fillOpacity: 0,
        lineStyle: { fill: 'dash', dash: [6, 4] },
        spanNulls: true,
        hideFrom: { tooltip: false, legend: false, viz: false },
      },
    },
  };
}

/**
 * Append a trend-overlay field for each numeric field in each frame. Returns a
 * new array of frames; input frames are not mutated. Safe to call with an
 * empty/disabled options object — returns `frames` unchanged when nothing to do.
 */
export function applyTrendOverlay(
  frames: DataFrame[],
  options: TrendOverlayOptions | undefined,
  theme: GrafanaTheme2
): DataFrame[] {
  if (!options?.enabled || !frames.length) {
    return frames;
  }

  const suffix = options.mode === TrendOverlayMode.MovingAverage ? `(MA ${options.windowSize})` : '(Trend)';

  return frames.map((frame) => {
    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      return frame;
    }

    const extraFields: Field[] = [];
    for (const field of frame.fields) {
      if (field.type !== FieldType.number || field === timeField) {
        continue;
      }
      // don't overlay a previously-added overlay (defensive if function runs twice)
      if (field.config?.custom?.__trendOverlay) {
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const ys = field.values as Array<number | null>;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const xs = timeField.values as Array<number | null>;

      let trendValues: Array<number | null>;
      if (options.mode === TrendOverlayMode.LinearRegression) {
        trendValues = computeLinearRegression(xs, ys);
      } else {
        trendValues = computeMovingAverage(ys, options.windowSize);
      }

      const overlay = buildOverlayField(field, frame, frames, trendValues, suffix, options, theme);
      // tag for defensive reentrancy check
      overlay.config.custom = { ...overlay.config.custom, __trendOverlay: true };
      extraFields.push(overlay);
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
