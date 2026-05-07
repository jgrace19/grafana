import {
  type DataFrame,
  type Field,
  FieldType,
  getDisplayProcessor,
  type GrafanaTheme2,
  isBooleanUnit,
  type TimeRange,
  type PanelData,
  cacheFieldDisplayNames,
  applyNullInsertThreshold,
  nullToValue,
  getFieldDisplayName,
} from '@grafana/data';
import { convertFieldType } from '@grafana/data/internal';
import {
  type GraphFieldConfig,
  GraphDrawStyle,
  GraphGradientMode,
  LineInterpolation,
  TooltipDisplayMode,
  type VizTooltipOptions,
} from '@grafana/schema';
import { type AdHocFilterItem } from '@grafana/ui';
import { buildScaleKey, FILTER_FOR_OPERATOR } from '@grafana/ui/internal';

import { type HeatmapTooltip } from '../heatmap/panelcfg.gen';

import { type TrendOverlayOptions, TrendOverlayType } from './panelcfg.gen';

type ScaleKey = string;

// this will re-enumerate all enum fields on the same scale to create one ordinal progression
// e.g. ['a','b'][0,1,0] + ['c','d'][1,0,1] -> ['a','b'][0,1,0] + ['c','d'][3,2,3]
function reEnumFields(frames: DataFrame[]): DataFrame[] {
  let allTextsByKey: Map<ScaleKey, string[]> = new Map();

  let frames2: DataFrame[] = frames.map((frame) => {
    return {
      ...frame,
      fields: frame.fields.map((field) => {
        if (field.type === FieldType.enum) {
          let scaleKey = buildScaleKey(field.config, field.type);
          let allTexts = allTextsByKey.get(scaleKey);

          if (!allTexts) {
            allTexts = [];
            allTextsByKey.set(scaleKey, allTexts);
          }

          let idxs: number[] = field.values.slice();
          let txts = field.config.type!.enum!.text!;

          // by-reference incrementing
          if (allTexts.length > 0) {
            for (let i = 0; i < idxs.length; i++) {
              idxs[i] += allTexts.length;
            }
          }

          allTexts.push(...txts);

          // shared among all enum fields on same scale
          field.config.type!.enum!.text! = allTexts;

          return {
            ...field,
            values: idxs,
          };

          // TODO: update displayProcessor?
        }

        return field;
      }),
    };
  });

  return frames2;
}

/**
 * Returns null if there are no graphable fields
 */
export function prepareGraphableFields(
  series: DataFrame[],
  theme: GrafanaTheme2,
  timeRange?: TimeRange,
  // numeric X requires a single frame where the first field is numeric
  xNumFieldIdx?: number
): DataFrame[] | null {
  if (!series?.length) {
    return null;
  }

  cacheFieldDisplayNames(series);

  let useNumericX = xNumFieldIdx != null;

  // Make sure the numeric x field is first in the frame
  if (xNumFieldIdx != null && xNumFieldIdx > 0) {
    series = [
      {
        ...series[0],
        fields: [series[0].fields[xNumFieldIdx], ...series[0].fields.filter((f, i) => i !== xNumFieldIdx)],
      },
    ];
  }

  // some datasources simply tag the field as time, but don't convert to milli epochs
  // so we're stuck with doing the parsing here to avoid Moment slowness everywhere later
  // this mutates (once)
  for (let frame of series) {
    for (let field of frame.fields) {
      if (field.type === FieldType.time && typeof field.values[0] !== 'number') {
        field.values = convertFieldType(field, { destinationType: FieldType.time }).values;
      }
    }
  }

  let enumFieldsCount = 0;

  loopy: for (let frame of series) {
    for (let field of frame.fields) {
      if (field.type === FieldType.enum && ++enumFieldsCount > 1) {
        series = reEnumFields(series);
        break loopy;
      }
    }
  }

  let copy: Field;

  const frames: DataFrame[] = [];

  for (let frame of series) {
    const fields: Field[] = [];

    let hasTimeField = false;
    let hasValueField = false;

    let nulledFrame = useNumericX
      ? frame
      : applyNullInsertThreshold({
          frame,
          refFieldPseudoMin: timeRange?.from.valueOf(),
          refFieldPseudoMax: timeRange?.to.valueOf(),
        });

    const frameFields = nullToValue(nulledFrame).fields;

    for (let fieldIdx = 0; fieldIdx < (frameFields?.length || 0); fieldIdx++) {
      const field = frameFields[fieldIdx];

      switch (field.type) {
        case FieldType.time:
          hasTimeField = true;
          fields.push(field);
          break;
        case FieldType.number:
          hasValueField = useNumericX ? fieldIdx > 0 : true;

          // we need to make sure all values in the array are numbers or null
          // so, check all values and if we encounter a bad one, copy the array and
          // replace all further-occuring non-numbers with null to make safe values array
          let values = field.values;
          let safeValues: unknown[] | undefined = undefined;

          for (let i = 0; i < values.length; i++) {
            let v = values[i];

            if (!(Number.isFinite(v) || v == null)) {
              safeValues ??= values.slice();
              safeValues[i] = null;
            }
          }

          safeValues ??= values;

          copy = {
            ...field,
            values: safeValues,
          };

          fields.push(copy);
          break; // ok
        case FieldType.enum:
          hasValueField = true;
        case FieldType.string:
          copy = {
            ...field,
            values: field.values,
          };

          fields.push(copy);
          break; // ok
        case FieldType.boolean:
          hasValueField = true;
          const custom: GraphFieldConfig = field.config?.custom ?? {};
          const config = {
            ...field.config,
            max: 1,
            min: 0,
            custom: { ...custom },
          };

          // smooth and linear do not make sense
          if (config.custom.lineInterpolation !== LineInterpolation.StepBefore) {
            config.custom.lineInterpolation = LineInterpolation.StepAfter;
          }

          copy = {
            ...field,
            config,
            type: FieldType.number,
            values: field.values.map((v) => {
              if (v == null) {
                return v;
              }
              return Boolean(v) ? 1 : 0;
            }),
          };

          if (!isBooleanUnit(config.unit)) {
            config.unit = 'bool';
            copy.display = getDisplayProcessor({ field: copy, theme });
          }

          fields.push(copy);
          break;
      }
    }

    if ((useNumericX || hasTimeField) && hasValueField) {
      frames.push({
        ...frame,
        length: nulledFrame.length,
        fields,
      });
    }
  }

  if (frames.length) {
    setClassicPaletteIdxs(frames, theme, 0);
    matchEnumColorToSeriesColor(frames, theme);
    return frames;
  }

  return null;
}

const matchEnumColorToSeriesColor = (frames: DataFrame[], theme: GrafanaTheme2) => {
  const { palette } = theme.visualization;
  for (const frame of frames) {
    for (const field of frame.fields) {
      if (field.type === FieldType.enum) {
        const namedColor = palette[field.state?.seriesIndex! % palette.length];
        const hexColor = theme.visualization.getColorByName(namedColor);
        const enumConfig = field.config.type!.enum!;

        enumConfig.color = Array(enumConfig.text!.length).fill(hexColor);
        field.display = getDisplayProcessor({ field, theme });
      }
    }
  }
};

export const setClassicPaletteIdxs = (frames: DataFrame[], theme: GrafanaTheme2, skipFieldIdx?: number) => {
  let seriesIndex = 0;

  const updateFieldDisplay = (field: Field, idx: number) => {
    field.state = { ...field.state, seriesIndex: idx };
    field.display = getDisplayProcessor({ field, theme });
  };

  const shouldProcessField = (field: Field, fieldIdx: number) => {
    return (
      fieldIdx !== skipFieldIdx &&
      (field.type === FieldType.number || field.type === FieldType.boolean || field.type === FieldType.enum)
    );
  };

  // Pre-pass to group main frames by refId
  const mainFramesByRefId = new Map<string, DataFrame[]>();
  for (const frame of frames) {
    if (!frame.meta?.timeCompare?.isTimeShiftQuery && frame.refId) {
      if (!mainFramesByRefId.has(frame.refId)) {
        mainFramesByRefId.set(frame.refId, []);
      }
      mainFramesByRefId.get(frame.refId)!.push(frame);
    }
  }

  // Counter for comparison indices per baseRefId
  const compareIndicesByRefId = new Map<string, number>();

  for (const frame of frames) {
    const isCompareFrame = frame.meta?.timeCompare?.isTimeShiftQuery;

    if (isCompareFrame) {
      const baseRefId = frame.refId?.replace('-compare', '');

      if (baseRefId) {
        // Get and increment the comparison index
        let compareIndex = compareIndicesByRefId.get(baseRefId) ?? 0;
        compareIndicesByRefId.set(baseRefId, compareIndex + 1);

        // Get the matching main frame using the index
        const mainFrames = mainFramesByRefId.get(baseRefId);
        const mainFrame = mainFrames?.[compareIndex];

        if (mainFrame && mainFrame.fields.length === frame.fields.length) {
          // Match series indices with main frame
          frame.fields.forEach((field, fieldIdx) => {
            if (shouldProcessField(field, fieldIdx)) {
              const mainField = mainFrame.fields[fieldIdx];
              updateFieldDisplay(field, mainField.state?.seriesIndex ?? seriesIndex++);
            }
          });
        } else {
          // Fallback
          frame.fields.forEach((field, fieldIdx) => {
            if (shouldProcessField(field, fieldIdx)) {
              updateFieldDisplay(field, seriesIndex++);
            }
          });
        }
      } else {
        // Fallback when no baseRefId
        frame.fields.forEach((field, fieldIdx) => {
          if (shouldProcessField(field, fieldIdx)) {
            updateFieldDisplay(field, seriesIndex++);
          }
        });
      }
    } else {
      // Main frames
      frame.fields.forEach((field, fieldIdx) => {
        if (shouldProcessField(field, fieldIdx)) {
          updateFieldDisplay(field, seriesIndex++);
        }
      });
    }
  }
};

export function getTimezones(timezones: string[] | undefined, defaultTimezone: string): string[] {
  if (!timezones || !timezones.length) {
    return [defaultTimezone];
  }
  return timezones.map((v) => (v?.length ? v : defaultTimezone));
}

export const isTooltipScrollable = (tooltipOptions: VizTooltipOptions | HeatmapTooltip) => {
  return tooltipOptions.mode === TooltipDisplayMode.Multi && tooltipOptions.maxHeight != null;
};

export function getGroupedFilters(
  frame: DataFrame,
  seriesIdx: number,
  getFiltersBasedOnGrouping: (filters: AdHocFilterItem[]) => AdHocFilterItem[]
) {
  const groupingFilters: AdHocFilterItem[] = [];
  const xField = frame.fields[seriesIdx];

  if (xField && xField.labels && xField.config.filterable) {
    const seriesFilters: AdHocFilterItem[] = [];

    Object.entries(xField.labels).forEach(([key, value]) => {
      seriesFilters.push({
        key,
        operator: FILTER_FOR_OPERATOR,
        value,
      });
    });

    groupingFilters.push(...getFiltersBasedOnGrouping(seriesFilters));
  }

  return groupingFilters;
}

export const LTTB_THRESHOLD = 150;

// adapted from https://github.com/pingec/downsample-lttb
function lttbIndices(xs: number[], ys: number[], threshold: number): number[] {
  const len = xs.length;
  if (threshold >= len) {
    return Array.from({ length: len }, (_, i) => i);
  }

  const indices = new Array(threshold);
  indices[0] = 0;
  indices[threshold - 1] = len - 1;

  const bucketSize = (len - 2) / (threshold - 2);
  let prevIdx = 0;

  for (let i = 1; i < threshold - 1; i++) {
    const bucketStart = Math.floor((i - 1) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor(i * bucketSize) + 1, len - 1);
    const nextEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, len - 1);

    let avgX = 0,
      avgY = 0,
      count = 0;
    for (let j = bucketEnd; j < nextEnd; j++) {
      avgX += xs[j];
      avgY += ys[j];
      count++;
    }
    if (count > 0) {
      avgX /= count;
      avgY /= count;
    }

    let maxArea = -1,
      maxIdx = bucketStart;
    for (let j = bucketStart; j < bucketEnd; j++) {
      const area =
        Math.abs((xs[prevIdx] - avgX) * (ys[j] - ys[prevIdx]) - (xs[prevIdx] - xs[j]) * (avgY - ys[prevIdx])) * 0.5;
      if (area > maxArea) {
        maxArea = area;
        maxIdx = j;
      }
    }
    indices[i] = maxIdx;
    prevIdx = maxIdx;
  }

  return indices;
}

// Downsamples each frame using the first numeric field to compute LTTB indices,
// then applies those indices to all fields. For frames with multiple numeric fields
// the sampling is optimal for the first field only, which is acceptable for small
// preview cards where pixel density already limits visible detail.
export function lttbPreviewData(data: PanelData, threshold = LTTB_THRESHOLD): PanelData {
  return {
    ...data,
    series: data.series.map((frame) => {
      const timeField = frame.fields.find((f) => f.type === FieldType.time);
      const numericField = frame.fields.find((f) => f.type === FieldType.number);
      if (!timeField || !numericField || frame.length <= threshold) {
        return frame;
      }
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const indices = lttbIndices(timeField.values as number[], numericField.values as number[], threshold);

      return {
        ...frame,
        length: indices.length,
        fields: frame.fields.map((field) => ({
          ...field,
          values: indices.map((i) => field.values[i]),
          ...(field.type === FieldType.time && {
            // since lttb may pick points further apart than timeField.config.interval, we clear it out to avoid gap insertion
            config: { ...field.config, interval: undefined },
          }),
        })),
      };
    }),
  };
}

// Minimum trailing window for the moving-average overlay
const MIN_MOVING_AVERAGE_WINDOW = 2;
// Minimum number of valid samples required to fit a regression line
const MIN_REGRESSION_SAMPLES = 2;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

// Trailing point-count moving average that includes the current point.
// Skips null/non-finite values inside the window; emits null when the window
// has zero valid samples.
export function computeTrailingMovingAverage(values: ReadonlyArray<number | null>, window: number): Array<number | null> {
  if (window < MIN_MOVING_AVERAGE_WINDOW) {
    window = MIN_MOVING_AVERAGE_WINDOW;
  }

  const out: Array<number | null> = new Array(values.length);
  let sum = 0;
  let count = 0;

  for (let i = 0; i < values.length; i++) {
    const current = values[i];
    if (isFiniteNumber(current)) {
      sum += current;
      count++;
    }
    if (i >= window) {
      const dropped = values[i - window];
      if (isFiniteNumber(dropped)) {
        sum -= dropped;
        count--;
      }
    }
    out[i] = count > 0 ? sum / count : null;
  }

  return out;
}

// Simple linear regression y = m*x + b over paired (x, y) points, ignoring
// pairs where either side is non-finite. Time x values are normalized to the
// first valid x to avoid floating-point precision loss with epoch ms.
// Returns predicted y values aligned to the input xs (null where the
// corresponding x is non-finite or when fitting is not possible).
export function computeLinearRegression(
  xs: ReadonlyArray<number | null>,
  ys: ReadonlyArray<number | null>
): Array<number | null> | null {
  if (xs.length !== ys.length || xs.length < MIN_REGRESSION_SAMPLES) {
    return null;
  }

  let xOrigin: number | null = null;
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i];
    const y = ys[i];
    if (isFiniteNumber(x) && isFiniteNumber(y)) {
      xOrigin = x;
      break;
    }
  }
  if (xOrigin === null) {
    return null;
  }

  let n = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < xs.length; i++) {
    const rawX = xs[i];
    const y = ys[i];
    if (!isFiniteNumber(rawX) || !isFiniteNumber(y)) {
      continue;
    }
    const x = rawX - xOrigin;
    n++;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  if (n < MIN_REGRESSION_SAMPLES) {
    return null;
  }

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) {
    // All x values are equal — slope is undefined; fall back to a flat line at
    // the mean y so the overlay still renders something useful.
    const meanY = sumY / n;
    return xs.map((x) => (isFiniteNumber(x) ? meanY : null));
  }

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return xs.map((x) => (isFiniteNumber(x) ? slope * (x - xOrigin!) + intercept : null));
}

function buildOverlayField(
  source: Field,
  values: Array<number | null>,
  overlayName: string,
  type: TrendOverlayType,
  theme: GrafanaTheme2
): Field {
  const sourceCustom: GraphFieldConfig = source.config?.custom ?? {};

  // Keep numeric formatting (unit, decimals, axis placement, scale) consistent
  // with the source series, but force a plain line with no fill or points so
  // the overlay reads as a derived trendline instead of another data series.
  const custom: GraphFieldConfig = {
    ...sourceCustom,
    drawStyle: GraphDrawStyle.Line,
    lineInterpolation: LineInterpolation.Linear,
    lineWidth: sourceCustom.lineWidth ?? 1,
    fillOpacity: 0,
    gradientMode: GraphGradientMode.None,
    showPoints: undefined,
    stacking: undefined,
    thresholdsStyle: undefined,
    pointSize: undefined,
    spanNulls: type === TrendOverlayType.LinearRegression ? true : sourceCustom.spanNulls,
  };

  if (type === TrendOverlayType.LinearRegression) {
    custom.lineStyle = { ...(sourceCustom.lineStyle ?? {}), fill: 'dash', dash: [10, 6] };
  } else {
    custom.lineStyle = { ...(sourceCustom.lineStyle ?? {}), fill: 'dash', dash: [4, 4] };
  }

  const overlay: Field = {
    name: overlayName,
    type: FieldType.number,
    config: {
      ...source.config,
      displayName: overlayName,
      displayNameFromDS: undefined,
      links: undefined,
      custom,
    },
    values,
    labels: source.labels,
    // Share palette color with the source by reusing its seriesIndex so users
    // can visually pair an overlay with its data series.
    state: {
      seriesIndex: source.state?.seriesIndex,
      displayName: overlayName,
    },
  };

  overlay.display = getDisplayProcessor({ field: overlay, theme });

  return overlay;
}

function buildOverlayFrame(
  source: DataFrame,
  timeField: Field,
  overlayFields: Field[],
  type: TrendOverlayType
): DataFrame {
  const suffix = type === TrendOverlayType.MovingAverage ? 'trend-overlay-mavg' : 'trend-overlay-linreg';
  return {
    name: source.name ? `${source.name} ${suffix}` : suffix,
    refId: source.refId ? `${source.refId}-${suffix}` : suffix,
    length: source.length,
    fields: [timeField, ...overlayFields],
    meta: {
      ...source.meta,
      // Mark the frame as a UI-derived overlay so it cannot be confused with
      // datasource results during inspection or downstream transforms.
      custom: {
        ...source.meta?.custom,
        trendOverlay: { sourceRefId: source.refId, type },
      },
    },
  };
}

/**
 * Returns the input frames plus one derived overlay frame per source frame,
 * containing one trend series for each numeric field in the source. When
 * disabled or when no overlays can be produced, the original frames are
 * returned untouched (same array reference).
 */
export function appendTrendOverlayFrames(
  frames: DataFrame[],
  options: TrendOverlayOptions | undefined,
  theme: GrafanaTheme2,
  allFrames?: DataFrame[]
): DataFrame[] {
  if (!options?.enabled || !frames.length) {
    return frames;
  }

  // The generated TrendOverlayType union still includes the literal default
  // value, so normalize to the enum so downstream comparisons line up.
  const type: TrendOverlayType =
    options.type === TrendOverlayType.LinearRegression
      ? TrendOverlayType.LinearRegression
      : TrendOverlayType.MovingAverage;
  const window = Math.max(MIN_MOVING_AVERAGE_WINDOW, Math.floor(options.windowSize ?? 0));
  const namingFrames = allFrames ?? frames;

  const out: DataFrame[] = [];
  let added = false;

  for (const frame of frames) {
    out.push(frame);

    // Skip time-compare frames so each compare frame doesn't double up the
    // overlay; the base frame's overlay already covers the period.
    if (frame.meta?.timeCompare?.isTimeShiftQuery) {
      continue;
    }

    const timeField = frame.fields.find((f) => f.type === FieldType.time);
    if (!timeField) {
      continue;
    }

    const overlayFields: Field[] = [];

    for (const field of frame.fields) {
      if (field.type !== FieldType.number) {
        continue;
      }

      const baseName = getFieldDisplayName(field, frame, namingFrames);

      let values: Array<number | null> | null = null;
      let overlayName: string;

      if (type === TrendOverlayType.MovingAverage) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        values = computeTrailingMovingAverage(field.values as Array<number | null>, window);
        overlayName = `${baseName} (moving avg, ${window}pt)`;
      } else {
        values = computeLinearRegression(
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          timeField.values as Array<number | null>,
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          field.values as Array<number | null>
        );
        overlayName = `${baseName} (trend)`;
      }

      if (!values) {
        continue;
      }

      overlayFields.push(buildOverlayField(field, values, overlayName, type, theme));
    }

    if (overlayFields.length === 0) {
      continue;
    }

    out.push(buildOverlayFrame(frame, timeField, overlayFields, type));
    added = true;
  }

  return added ? out : frames;
}
