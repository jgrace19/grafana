import { type DataFrame, FieldType, toDataFrame } from '@grafana/data';

import { TrendOverlayType } from './panelcfg.gen';
import { applyTrendOverlay, linearRegression, movingAverage } from './trendOverlay';

describe('movingAverage', () => {
  it('computes trailing average once the window is filled', () => {
    const values = [1, 2, 3, 4, 5];
    expect(movingAverage(values, 3)).toEqual([null, null, 2, 3, 4]);
  });

  it('handles nulls inside the window by averaging available points', () => {
    const values = [1, null, 3, null, 5];
    const result = movingAverage(values, 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBeCloseTo(2, 5);
    expect(result[3]).toBeCloseTo(3, 5);
    expect(result[4]).toBeCloseTo(4, 5);
  });

  it('returns all nulls when window is larger than series length', () => {
    const values = [1, 2, 3];
    expect(movingAverage(values, 10)).toEqual([null, null, null]);
  });

  it('returns all nulls when window < 2', () => {
    expect(movingAverage([1, 2, 3], 1)).toEqual([null, null, null]);
  });

  it('returns all nulls for an empty array', () => {
    expect(movingAverage([], 3)).toEqual([]);
  });
});

describe('linearRegression', () => {
  it('fits a perfect line exactly', () => {
    const times = [0, 1, 2, 3, 4];
    const values = [1, 3, 5, 7, 9];
    const result = linearRegression(times, values);
    expect(result).toHaveLength(5);
    for (let i = 0; i < result.length; i++) {
      expect(result[i]).toBeCloseTo(values[i], 5);
    }
  });

  it('returns a straight line for noisy data', () => {
    const times = [0, 1, 2, 3, 4];
    const values = [0.9, 2.1, 3.0, 3.9, 5.2];
    const result = linearRegression(times, values);
    expect(result).toHaveLength(5);
    const diffs: number[] = [];
    for (let i = 1; i < result.length; i++) {
      diffs.push((result[i] as number) - (result[i - 1] as number));
    }
    const first = diffs[0];
    for (const d of diffs) {
      expect(d).toBeCloseTo(first, 5);
    }
  });

  it('ignores nulls', () => {
    const times = [0, 1, 2, 3, 4];
    const values = [1, null, 5, null, 9];
    const result = linearRegression(times, values);
    expect(result[0]).toBeCloseTo(1, 5);
    expect(result[4]).toBeCloseTo(9, 5);
  });

  it('returns nulls when fewer than 2 usable points', () => {
    expect(linearRegression([0, 1, 2], [null, null, 5])).toEqual([null, null, null]);
  });
});

describe('applyTrendOverlay', () => {
  const baseFrame: DataFrame = toDataFrame({
    name: 'A-series',
    refId: 'A',
    fields: [
      { name: 'time', type: FieldType.time, values: [0, 1000, 2000, 3000, 4000] },
      { name: 'value', type: FieldType.number, values: [1, 2, 3, 4, 5] },
    ],
  });

  it('returns the input untouched when disabled', () => {
    const result = applyTrendOverlay([baseFrame], {
      enabled: false,
      type: TrendOverlayType.MovingAverage,
      windowSize: 3,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(baseFrame);
  });

  it('appends a sibling frame with an overlay field per numeric field when enabled', () => {
    const result = applyTrendOverlay([baseFrame], {
      enabled: true,
      type: TrendOverlayType.MovingAverage,
      windowSize: 3,
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(baseFrame);

    const overlay = result[1];
    expect(overlay.fields).toHaveLength(2);
    expect(overlay.fields[0].type).toBe(FieldType.time);
    expect(overlay.fields[1].type).toBe(FieldType.number);
    expect(overlay.fields[1].name).toContain('(MA 3)');
    expect(overlay.fields[1].values).toEqual([null, null, 2, 3, 4]);
  });

  it('emits linear regression when configured', () => {
    const result = applyTrendOverlay([baseFrame], {
      enabled: true,
      type: TrendOverlayType.LinearRegression,
      windowSize: 10,
    });
    expect(result).toHaveLength(2);
    const overlay = result[1];
    expect(overlay.fields[1].name).toContain('(trend)');
    const overlayValues = overlay.fields[1].values;
    expect(overlayValues[0]).toBeCloseTo(1, 5);
    expect(overlayValues[overlayValues.length - 1]).toBeCloseTo(5, 5);
  });

  it('skips frames marked as time-compare to avoid double overlays', () => {
    const timeCompareFrame: DataFrame = {
      ...baseFrame,
      meta: { timeCompare: { diffMs: 60_000, isTimeShiftQuery: true } },
    };

    const result = applyTrendOverlay([timeCompareFrame], {
      enabled: true,
      type: TrendOverlayType.MovingAverage,
      windowSize: 3,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(timeCompareFrame);
  });

  it('leaves frames without numeric fields untouched', () => {
    const stringOnlyFrame: DataFrame = toDataFrame({
      name: 'Strings',
      fields: [
        { name: 'time', type: FieldType.time, values: [0, 1000] },
        { name: 'label', type: FieldType.string, values: ['a', 'b'] },
      ],
    });

    const result = applyTrendOverlay([stringOnlyFrame], {
      enabled: true,
      type: TrendOverlayType.MovingAverage,
      windowSize: 3,
    });
    expect(result).toHaveLength(1);
  });
});
