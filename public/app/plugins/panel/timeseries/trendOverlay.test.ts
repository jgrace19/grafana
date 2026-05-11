import { FieldType, toDataFrame } from '@grafana/data';

import { TrendOverlayType, type TrendOverlayOptions } from './panelcfg.gen';
import { appendTrendOverlayFrames, linearRegressionTrend, trailingMovingAverage } from './trendOverlay';

const baseFrame = () =>
  toDataFrame({
    refId: 'A',
    fields: [
      { name: 'time', type: FieldType.time, values: [1000, 2000, 3000, 4000, 5000] },
      { name: 'A-series', type: FieldType.number, values: [1, 2, 3, 4, 5] },
      { name: 'B-series', type: FieldType.number, values: [10, 20, 30, 40, 50] },
    ],
  });

describe('trailingMovingAverage', () => {
  it('returns same length output as input', () => {
    const result = trailingMovingAverage([1, 2, 3, 4, 5], 3);
    expect(result.length).toBe(5);
  });

  it('computes trailing window averages over a constant series', () => {
    expect(trailingMovingAverage([5, 5, 5, 5, 5], 3)).toEqual([5, 5, 5, 5, 5]);
  });

  it('computes trailing window averages over a linear series', () => {
    // window of 2: [1, (1+2)/2, (2+3)/2, (3+4)/2, (4+5)/2]
    expect(trailingMovingAverage([1, 2, 3, 4, 5], 2)).toEqual([1, 1.5, 2.5, 3.5, 4.5]);
  });

  it('skips null/NaN samples and returns null when window has no valid samples', () => {
    const result = trailingMovingAverage([null, null, 2, 4, null], 2);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBe(2);
    expect(result[3]).toBe(3);
    // window slot for index 4 evicts index 2 (idx 2 % 2 == 0, idx 4 % 2 == 0)
    // both samples (idx 3 value 4, idx 4 value null) -> count=1, sum=4
    expect(result[4]).toBe(4);
  });

  it('returns all nulls for non-positive window size', () => {
    expect(trailingMovingAverage([1, 2, 3], 0)).toEqual([null, null, null]);
  });
});

describe('linearRegressionTrend', () => {
  it('fits a perfect line y = x', () => {
    const result = linearRegressionTrend([0, 1, 2, 3, 4], [0, 1, 2, 3, 4], 5);
    expect(result).not.toBeNull();
    expect(result!.xs).toEqual([0, 1, 2, 3, 4]);
    result!.ys.forEach((y, i) => expect(y).toBeCloseTo(i, 5));
  });

  it('fits a flat line y = 7 ignoring nulls', () => {
    const result = linearRegressionTrend([0, 1, 2, 3, 4], [7, null, 7, null, 7], 5);
    expect(result).not.toBeNull();
    result!.ys.forEach((y) => expect(y).toBeCloseTo(7, 5));
  });

  it('returns null when fewer than 2 valid samples exist', () => {
    expect(linearRegressionTrend([0, 1, 2], [null, null, 1], 5)).toBeNull();
  });

  it('returns null when X domain is degenerate', () => {
    expect(linearRegressionTrend([5, 5, 5], [1, 2, 3], 5)).toBeNull();
  });

  it('returns null when valid X values become degenerate after filtering nulls', () => {
    expect(linearRegressionTrend([0, 1, 1, 2], [null, 5, 6, null], 5)).toBeNull();
  });

  it('honors predictionCount and spans full X domain', () => {
    const result = linearRegressionTrend([0, 10], [0, 10], 11);
    expect(result).not.toBeNull();
    expect(result!.xs[0]).toBe(0);
    expect(result!.xs[result!.xs.length - 1]).toBe(10);
    expect(result!.xs.length).toBe(11);
  });
});

describe('appendTrendOverlayFrames', () => {
  const baseOptions: TrendOverlayOptions = {
    enabled: false,
    type: TrendOverlayType.MovingAverage,
    windowSize: 3,
    predictionCount: 100,
  };

  it('is a no-op when overlay is disabled', () => {
    const frames = [baseFrame()];
    const result = appendTrendOverlayFrames(frames, baseOptions);
    expect(result).toBe(frames);
  });

  it('is a no-op when options are undefined', () => {
    const frames = [baseFrame()];
    expect(appendTrendOverlayFrames(frames, undefined)).toBe(frames);
  });

  it('appends one moving-average overlay frame per source frame with one derived field per numeric input', () => {
    const frames = [baseFrame()];
    const result = appendTrendOverlayFrames(frames, { ...baseOptions, enabled: true, windowSize: 2 });

    expect(result.length).toBe(2);
    const overlay = result[1];
    expect(overlay.meta?.custom?.trendOverlay).toBe(true);
    expect(overlay.fields[0].type).toBe(FieldType.time);
    expect(overlay.fields).toHaveLength(3);
    expect(overlay.fields[1].name).toBe('A-series (MA2)');
    expect(overlay.fields[2].name).toBe('B-series (MA2)');
    expect(overlay.fields[1].values).toEqual([1, 1.5, 2.5, 3.5, 4.5]);
  });

  it('appends a linear regression trend frame matching prediction count', () => {
    const frames = [baseFrame()];
    const result = appendTrendOverlayFrames(frames, {
      ...baseOptions,
      enabled: true,
      type: TrendOverlayType.LinearRegression,
      predictionCount: 6,
    });

    expect(result.length).toBe(2);
    const overlay = result[1];
    expect(overlay.length).toBe(6);
    expect(overlay.fields[0].values[0]).toBe(1000);
    expect(overlay.fields[0].values[overlay.fields[0].values.length - 1]).toBe(5000);
    expect(overlay.fields[1].name).toBe('A-series (trend)');
    expect(overlay.fields[2].name).toBe('B-series (trend)');
    // perfectly linear input should yield same start/end
    const aTrend = overlay.fields[1].values as number[];
    expect(aTrend[0]).toBeCloseTo(1, 5);
    expect(aTrend[aTrend.length - 1]).toBeCloseTo(5, 5);
  });

  it('skips frames without a time field', () => {
    const noTime = toDataFrame({
      fields: [{ name: 'val', type: FieldType.number, values: [1, 2, 3] }],
    });
    const result = appendTrendOverlayFrames([noTime], { ...baseOptions, enabled: true });
    expect(result).toEqual([noTime]);
  });

  it('skips frames with no numeric fields', () => {
    const onlyTime = toDataFrame({
      fields: [{ name: 'time', type: FieldType.time, values: [1, 2, 3] }],
    });
    const result = appendTrendOverlayFrames([onlyTime], { ...baseOptions, enabled: true });
    expect(result).toEqual([onlyTime]);
  });

  it('preserves refId on overlay frame for downstream alignment', () => {
    const frames = [baseFrame()];
    const result = appendTrendOverlayFrames(frames, { ...baseOptions, enabled: true });
    expect(result[1].refId).toBe('A');
  });

  it('produces an overlay per source frame for multi-frame inputs (time-compare safe)', () => {
    const f1 = toDataFrame({
      refId: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1000, 2000, 3000] },
        { name: 'value', type: FieldType.number, values: [1, 2, 3] },
      ],
    });
    const f2 = toDataFrame({
      refId: 'A-compare',
      meta: { timeCompare: { diffMs: 60_000, isTimeShiftQuery: true } },
      fields: [
        { name: 'time', type: FieldType.time, values: [940, 1940, 2940] },
        { name: 'value', type: FieldType.number, values: [10, 20, 30] },
      ],
    });

    const result = appendTrendOverlayFrames([f1, f2], { ...baseOptions, enabled: true });
    expect(result.length).toBe(4);
    expect(result[2].refId).toBe('A');
    expect(result[3].refId).toBe('A-compare');
  });
});
