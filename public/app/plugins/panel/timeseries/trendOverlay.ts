import { type DataFrame, type Field, FieldColorModeId, FieldType } from '@grafana/data';
import { GraphDrawStyle, LineInterpolation, VisibilityMode } from '@grafana/schema';

import { type TrendOverlayOptions, TrendOverlayType } from './panelcfg.gen';

const OVERLAY_MARKER = '__trendOverlay__';

function isOverlayField(field: Field): boolean {
  return Boolean(field.config.custom && field.config.custom[OVERLAY_MARKER]);
}

export function isOverlayFrame(frame: DataFrame): boolean {
  return frame.fields.some(isOverlayField);
}

function toFiniteNumber(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) {
    return v;
  }
  return null;
}

export function movingAverage(values: unknown[], windowSize: number): Array<number | null> {
  const n = values.length;
  const out: Array<number | null> = new Array(n).fill(null);

  if (windowSize < 2 || n === 0) {
    return out;
  }

  for (let i = windowSize - 1; i < n; i++) {
    let sum = 0;
    let count = 0;
    const start = i - windowSize + 1;
    for (let j = start; j <= i; j++) {
      const v = toFiniteNumber(values[j]);
      if (v !== null) {
        sum += v;
        count++;
      }
    }

    if (count > 0) {
      out[i] = sum / count;
    }
  }

  return out;
}

export function linearRegression(times: unknown[], values: unknown[]): Array<number | null> {
  const n = Math.min(times.length, values.length);
  const out: Array<number | null> = new Array(values.length).fill(null);

  let sumX = 0;
  let sumY = 0;
  let count = 0;

  for (let i = 0; i < n; i++) {
    const x = toFiniteNumber(times[i]);
    const y = toFiniteNumber(values[i]);
    if (x === null || y === null) {
      continue;
    }
    sumX += x;
    sumY += y;
    count++;
  }

  if (count < 2) {
    return out;
  }

  const meanX = sumX / count;
  const meanY = sumY / count;
  let sumDXDX = 0;
  let sumDXDY = 0;

  for (let i = 0; i < n; i++) {
    const x = toFiniteNumber(times[i]);
    const y = toFiniteNumber(values[i]);
    if (x === null || y === null) {
      continue;
    }

    const dx = x - meanX;
    sumDXDX += dx * dx;
    sumDXDY += dx * (y - meanY);
  }

  let slope: number;
  let intercept: number;

  if (sumDXDX === 0) {
    slope = 0;
    intercept = meanY;
  } else {
    slope = sumDXDY / sumDXDX;
    intercept = meanY - slope * meanX;
  }

  for (let i = 0; i < n; i++) {
    const x = toFiniteNumber(times[i]);
    if (x !== null) {
      out[i] = slope * x + intercept;
    }
  }

  return out;
}

function buildOverlayField(sourceField: Field, overlayValues: Array<number | null>, suffix: string): Field {
  const baseName = sourceField.config.displayNameFromDS ?? sourceField.config.displayName ?? sourceField.name;
  const overlayName = `${baseName} ${suffix}`;

  const overlayField: Field = {
    name: overlayName,
    type: FieldType.number,
    values: overlayValues,
    config: {
      ...sourceField.config,
      displayName: overlayName,
      displayNameFromDS: undefined,
      custom: {
        ...(sourceField.config.custom ?? {}),
        [OVERLAY_MARKER]: true,
        drawStyle: GraphDrawStyle.Line,
        lineInterpolation: LineInterpolation.Linear,
        lineStyle: { fill: 'dash', dash: [10, 10] },
        lineWidth: 2,
        fillOpacity: 0,
        pointSize: 0,
        showPoints: VisibilityMode.Never,
        stacking: { mode: 'none' },
      },
      color: {
        mode: FieldColorModeId.PaletteClassic,
      },
    },
    state: undefined,
    labels: sourceField.labels,
  };

  return overlayField;
}

/**
 * Compute a trend overlay (moving average or linear regression) for each numeric field in each frame.
 * Returns a new array of frames. Each source frame is returned as-is, followed by an extra overlay
 * frame containing the original time field plus one number field per numeric source field.
 * Frames marked as time-compare (meta.timeCompare.diffMs > 0) are skipped to avoid double overlays.
 */
export function applyTrendOverlay(series: DataFrame[], options: TrendOverlayOptions): DataFrame[] {
  if (!options?.enabled || !series?.length) {
    return series;
  }

  const windowSize = Math.max(2, Math.floor(options.windowSize ?? 10));
  const type = options.type ?? TrendOverlayType.MovingAverage;
  const suffix = type === TrendOverlayType.LinearRegression ? '(trend)' : `(MA ${windowSize})`;

  const result: DataFrame[] = [];

  for (const frame of series) {
    result.push(frame);

    if (frame.meta?.timeCompare?.diffMs) {
      continue;
    }

    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      continue;
    }

    const numericFields = frame.fields.filter((f) => f.type === FieldType.number && !isOverlayField(f));
    if (numericFields.length === 0) {
      continue;
    }

    const overlayFields: Field[] = [timeField];

    for (const numericField of numericFields) {
      const overlayValues =
        type === TrendOverlayType.LinearRegression
          ? linearRegression(timeField.values, numericField.values)
          : movingAverage(numericField.values, windowSize);

      overlayFields.push(buildOverlayField(numericField, overlayValues, suffix));
    }

    if (overlayFields.length > 1) {
      const existingCustom: Record<string, unknown> =
        frame.meta?.custom && typeof frame.meta.custom === 'object' ? { ...frame.meta.custom } : {};

      result.push({
        ...frame,
        refId: frame.refId != null ? `${frame.refId}__trend` : undefined,
        name: frame.name != null ? `${frame.name} ${suffix}` : undefined,
        fields: overlayFields,
        meta: {
          ...(frame.meta ?? {}),
          custom: {
            ...existingCustom,
            trendOverlay: true,
          },
        },
      });
    }
  }

  return result;
}
