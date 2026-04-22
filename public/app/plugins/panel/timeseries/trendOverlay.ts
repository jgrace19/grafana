import { SimpleLinearRegression } from 'ml-regression-simple-linear';

import {
  type DataFrame,
  type Field,
  FieldColorModeId,
  FieldType,
  getFieldSeriesColor,
  type GrafanaTheme2,
} from '@grafana/data';
import { type GraphFieldConfig, StackingMode } from '@grafana/schema';

import { type TrendOverlayOptions, TrendOverlayMode } from './panelcfg.gen';

const DEFAULT_WINDOW_SIZE = 10;

function isSourceGraphableFieldType(field: Field): boolean {
  return (
    field.type === FieldType.time ||
    field.type === FieldType.number ||
    field.type === FieldType.string ||
    field.type === FieldType.enum ||
    field.type === FieldType.boolean
  );
}

function isSourceGraphableFrame(frame: DataFrame): boolean {
  let hasTimeField = false;
  let hasValueField = false;

  for (const field of frame.fields) {
    if (field.type === FieldType.time) {
      hasTimeField = true;
    } else if (
      field.type === FieldType.number ||
      field.type === FieldType.string ||
      field.type === FieldType.enum ||
      field.type === FieldType.boolean
    ) {
      hasValueField = true;
    }

    if (hasTimeField && hasValueField) {
      return true;
    }
  }

  return false;
}

/**
 * Add trend-overlay frames (moving average or linear regression) to a set of
 * graphable frames.
 *
 * Overlay output is emitted as brand-new DataFrames (one per source frame) to
 * avoid breaking downstream invariants (e.g. setClassicPaletteIdxs expects
 * main/compare frames to have matching `fields.length`; compareDiffMs is a
 * parallel array built against source fields).
 *
 * When `mode === 'none'`, options is undefined, or there are no frames, the
 * input array is returned unchanged (same reference).
 */
export function applyTrendOverlay(
  frames: DataFrame[],
  sourceSeries: DataFrame[],
  options: TrendOverlayOptions | undefined,
  theme: GrafanaTheme2
): DataFrame[] {
  if (!options || options.mode === TrendOverlayMode.None || !frames.length) {
    return frames;
  }

  const mode = options.mode;
  const windowSize = Math.max(2, Math.floor(options.windowSize ?? DEFAULT_WINDOW_SIZE));
  const graphableSourceSeries = sourceSeries.filter(isSourceGraphableFrame);

  const overlayFrames: DataFrame[] = [];

  for (let frameIdx = 0; frameIdx < frames.length; frameIdx++) {
    const frame = frames[frameIdx];
    const sourceFrame = graphableSourceSeries[frameIdx];
    const sourceFields = sourceFrame?.fields.filter(isSourceGraphableFieldType);

    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      continue;
    }

    const overlayFields: Field[] = [
      {
        name: timeField.name,
        type: FieldType.time,
        values: timeField.values,
        config: {},
      },
    ];

    for (let fieldIdx = 0; fieldIdx < frame.fields.length; fieldIdx++) {
      const field = frame.fields[fieldIdx];
      if (field.type !== FieldType.number) {
        continue;
      }

      // Skip fields that were coerced from boolean/enum by prepareGraphableFields.
      // We check the pre-prep source to tell apart "real numeric" from "coerced".
      const sourceField = sourceFields?.[fieldIdx];
      if (
        sourceField != null &&
        (sourceField.type === FieldType.boolean || sourceField.type === FieldType.enum)
      ) {
        continue;
      }

      const values = field.values;
      const times = timeField.values;

      let overlayValues: Array<number | null>;
      let overlayLabel: string;

      if (mode === TrendOverlayMode.MovingAverage) {
        overlayValues = computeMovingAverage(values, windowSize);
        overlayLabel = `${field.name} (MA${windowSize})`;
      } else if (mode === TrendOverlayMode.LinearRegression) {
        overlayValues = computeLinearRegression(times, values);
        overlayLabel = `${field.name} (trend)`;
      } else {
        continue;
      }

      const seriesColor = getFieldSeriesColor(field, theme).color;

      const overlayField: Field = {
        name: overlayLabel,
        type: FieldType.number,
        values: overlayValues,
        config: {
          displayName: overlayLabel,
          color: {
            mode: FieldColorModeId.Fixed,
            fixedColor: seriesColor,
          },
          custom: {
            lineStyle: { fill: 'dash' },
            lineWidth: 2,
            fillOpacity: 0,
            stacking: { mode: StackingMode.None },
            hideFrom: { legend: true, tooltip: false, viz: false },
          } satisfies Partial<GraphFieldConfig>,
        },
      };

      overlayFields.push(overlayField);
    }

    if (overlayFields.length < 2) {
      continue;
    }

    const overlayFrame: DataFrame = {
      name: `${frame.name ?? ''} trend`,
      refId: `${frame.refId ?? 'A'}-trend`,
      length: timeField.values.length,
      fields: overlayFields,
      meta: frame.meta?.timeCompare ? { timeCompare: frame.meta.timeCompare } : undefined,
    };

    overlayFrames.push(overlayFrame);
  }

  if (overlayFrames.length === 0) {
    return frames;
  }

  return [...frames, ...overlayFrames];
}

/**
 * Trailing moving average with O(n) running sum. Null/NaN values are skipped
 * in the window (do not participate in sum/count). Emits null until the
 * window has fully filled (i >= windowSize - 1) and at least
 * `ceil(windowSize / 2)` non-null samples are in the window. The second
 * clause prevents fabricating a trend from a single sample when the window
 * happens to straddle a long stretch of nulls.
 */
function computeMovingAverage(values: unknown[], windowSize: number): Array<number | null> {
  const n = values.length;
  const out: Array<number | null> = new Array(n);
  const minObs = Math.max(1, Math.ceil(windowSize / 2));

  let sum = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const v = values[i];
    if (typeof v === 'number' && Number.isFinite(v)) {
      sum += v;
      count++;
    }

    if (i >= windowSize) {
      const drop = values[i - windowSize];
      if (typeof drop === 'number' && Number.isFinite(drop)) {
        sum -= drop;
        count--;
      }
    }

    if (i >= windowSize - 1 && count >= minObs) {
      out[i] = sum / count;
    } else {
      out[i] = null;
    }
  }

  return out;
}

/**
 * Fit `y = a * (t - tMin) + b` using the finite (t, y) pairs, then predict at
 * every original timestamp. If fewer than 2 finite points are available,
 * returns an all-null series of the right length.
 */
function computeLinearRegression(times: unknown[], values: unknown[]): Array<number | null> {
  const n = values.length;
  const out: Array<number | null> = new Array(n).fill(null);

  if (n === 0 || times.length === 0) {
    return out;
  }

  const t0 = times[0];
  if (typeof t0 !== 'number') {
    return out;
  }
  const tMin = t0;

  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = values[i];
    const t = times[i];
    if (typeof v === 'number' && Number.isFinite(v) && typeof t === 'number') {
      xs.push(t - tMin);
      ys.push(v);
    }
  }

  if (xs.length < 2) {
    return out;
  }

  const model = new SimpleLinearRegression(xs, ys);
  for (let i = 0; i < n; i++) {
    const t = times[i];
    if (typeof t === 'number') {
      out[i] = model.predict(t - tMin);
    }
  }

  return out;
}
