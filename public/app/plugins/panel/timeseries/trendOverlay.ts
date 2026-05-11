import { SimpleLinearRegression } from 'ml-regression-simple-linear';

import { type DataFrame, type Field, FieldType, getFieldDisplayName } from '@grafana/data';

import { TrendOverlayType, type TrendOverlayOptions } from './panelcfg.gen';

const OVERLAY_FRAME_META_KEY = 'trendOverlay';

/**
 * Compute a trailing moving average over `values` using `windowSize`.
 * - Null / non-finite samples do not contribute to the window sum/count.
 * - If a window has zero valid samples, the output is `null`.
 *
 * This mirrors the trailing-window semantics used by the `calculateField`
 * transformer's WindowFunctions mode.
 */
export function trailingMovingAverage(values: Array<number | null>, windowSize: number): Array<number | null> {
  const out: Array<number | null> = new Array(values.length).fill(null);
  if (windowSize <= 0) {
    return out;
  }

  let sum = 0;
  let count = 0;
  const ring: Array<number | null> = new Array(windowSize).fill(null);

  for (let i = 0; i < values.length; i++) {
    const incoming = values[i];
    const slot = i % windowSize;
    const outgoing = ring[slot];

    if (outgoing != null && Number.isFinite(outgoing)) {
      sum -= outgoing;
      count -= 1;
    }

    if (incoming != null && Number.isFinite(incoming)) {
      ring[slot] = incoming;
      sum += incoming;
      count += 1;
    } else {
      ring[slot] = null;
    }

    out[i] = count > 0 ? sum / count : null;
  }

  return out;
}

/**
 * Fit a simple linear regression `y = m*x + b` to (xs, ys) ignoring null/NaN
 * pairs, then predict for `predictionCount` evenly spaced X samples that span
 * the original X domain. Returns both the prediction X column and Y column.
 *
 * The `xs` field is treated as a time field; values are normalized to the
 * series minimum to keep coefficients numerically stable, matching the
 * existing regression transformer behavior.
 */
export function linearRegressionTrend(
  xs: number[],
  ys: Array<number | null>,
  predictionCount: number
): { xs: number[]; ys: number[] } | null {
  if (predictionCount < 2 || xs.length === 0) {
    return null;
  }

  let xMin = Infinity;
  let xMax = -Infinity;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    if (Number.isFinite(x)) {
      if (x < xMin) {
        xMin = x;
      }
      if (x > xMax) {
        xMax = x;
      }
    }
  }
  if (!Number.isFinite(xMin) || !Number.isFinite(xMax) || xMin === xMax) {
    return null;
  }

  const validX: number[] = [];
  const validY: number[] = [];
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (Number.isFinite(x) && y != null && Number.isFinite(y)) {
      validX.push(x - xMin);
      validY.push(y);
    }
  }
  if (validX.length < 2) {
    return null;
  }

  const model = new SimpleLinearRegression(validX, validY);
  const step = (xMax - xMin) / (predictionCount - 1);
  const outX: number[] = new Array(predictionCount);
  const outY: number[] = new Array(predictionCount);
  for (let i = 0; i < predictionCount; i++) {
    const x = i === predictionCount - 1 ? xMax : xMin + i * step;
    outX[i] = x;
    outY[i] = model.predict(x - xMin);
  }
  return { xs: outX, ys: outY };
}

const MAX_FIELD_VALUE = (field: Field): Array<number | null> => field.values as Array<number | null>;

/**
 * Append trend-overlay derived series to a list of prepared frames.
 *
 * The overlay is generated per source frame to keep behaviour predictable
 * across time-compare/multi-frame setups. One overlay frame is appended
 * per input frame, carrying the same time field and one derived numeric
 * field per visible numeric field in the source frame.
 *
 * Returns the original `frames` array reference unchanged when overlay is
 * disabled, missing, or yields nothing to render.
 */
export function appendTrendOverlayFrames(
  frames: DataFrame[],
  options: TrendOverlayOptions | undefined
): DataFrame[] {
  if (!options?.enabled || !frames.length) {
    return frames;
  }

  const result: DataFrame[] = frames.slice();

  for (const frame of frames) {
    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      continue;
    }
    const numericFields = frame.fields.filter(
      (f) => f.type === FieldType.number && f.config.custom?.hideFrom?.viz !== true
    );
    if (numericFields.length === 0) {
      continue;
    }

    if (options.type === TrendOverlayType.MovingAverage) {
      const windowSize = Math.max(2, Math.floor(options.windowSize ?? 10));
      const overlayFields: Field[] = [{ ...timeField, state: undefined, display: undefined }];

      for (const numericField of numericFields) {
        const sourceName = getFieldDisplayName(numericField, frame, frames);
        const movingAvg = trailingMovingAverage(MAX_FIELD_VALUE(numericField), windowSize);
        overlayFields.push({
          name: `${sourceName} (MA${windowSize})`,
          type: FieldType.number,
          values: movingAvg,
          config: { ...numericField.config, custom: { ...(numericField.config.custom ?? {}) } },
        });
      }

      if (overlayFields.length > 1) {
        result.push({
          name: frame.name ? `${frame.name} (trend)` : 'trend',
          refId: frame.refId,
          length: timeField.values.length,
          fields: overlayFields,
          meta: { ...(frame.meta ?? {}), custom: { ...(frame.meta?.custom ?? {}), [OVERLAY_FRAME_META_KEY]: true } },
        });
      }
    } else if (options.type === TrendOverlayType.LinearRegression) {
      const predictionCount = Math.max(2, Math.floor(options.predictionCount ?? 100));
      const xs = timeField.values as number[];

      const trendsByField = numericFields
        .map((numericField) => ({
          numericField,
          trend: linearRegressionTrend(xs, MAX_FIELD_VALUE(numericField), predictionCount),
        }))
        .filter((t) => t.trend != null) as Array<{ numericField: Field; trend: { xs: number[]; ys: number[] } }>;

      if (trendsByField.length === 0) {
        continue;
      }

      const overlayXs = trendsByField[0].trend.xs;
      const overlayFields: Field[] = [
        {
          name: timeField.name,
          type: FieldType.time,
          values: overlayXs,
          config: { ...timeField.config },
        },
      ];

      for (const { numericField, trend } of trendsByField) {
        const sourceName = getFieldDisplayName(numericField, frame, frames);
        overlayFields.push({
          name: `${sourceName} (trend)`,
          type: FieldType.number,
          values: trend.ys,
          config: { ...numericField.config, custom: { ...(numericField.config.custom ?? {}) } },
        });
      }

      result.push({
        name: frame.name ? `${frame.name} (trend)` : 'trend',
        refId: frame.refId,
        length: overlayXs.length,
        fields: overlayFields,
        meta: { ...(frame.meta ?? {}), custom: { ...(frame.meta?.custom ?? {}), [OVERLAY_FRAME_META_KEY]: true } },
      });
    }
  }

  return result.length === frames.length ? frames : result;
}

export const __TESTING__ = { OVERLAY_FRAME_META_KEY };
