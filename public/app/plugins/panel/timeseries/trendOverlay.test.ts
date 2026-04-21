import { createTheme, FieldType, toDataFrame } from '@grafana/data';

import { TrendOverlayMode, type TrendOverlayOptions } from './panelcfg.gen';
import { applyTrendOverlay, computeLinearRegression, computeMovingAverage } from './trendOverlay';

const theme = createTheme();

const defaults: TrendOverlayOptions = {
  enabled: true,
  mode: TrendOverlayMode.MovingAverage,
  windowSize: 3,
  lineWidth: 2,
  opacity: 0.7,
};

describe('computeMovingAverage', () => {
  it('returns all nulls when windowSize < 2', () => {
    expect(computeMovingAverage([1, 2, 3, 4], 1)).toEqual([null, null, null, null]);
  });

  it('produces trailing averages once the min-count threshold is reached', () => {
    // windowSize=4, minCount=ceil(4*0.5)=2, so position 0 is null until 2 samples seen
    const out = computeMovingAverage([2, 4, 6, 8, 10], 4);
    expect(out[0]).toBeNull();
    expect(out[1]).toBeCloseTo((2 + 4) / 2);
    expect(out[2]).toBeCloseTo((2 + 4 + 6) / 3);
    expect(out[3]).toBeCloseTo((2 + 4 + 6 + 8) / 4);
    expect(out[4]).toBeCloseTo((4 + 6 + 8 + 10) / 4);
  });

  it('skips null/NaN values inside the window', () => {
    const out = computeMovingAverage([2, null, 4, null, 6], 3);
    // minCount = ceil(3 * 0.5) = 2
    // position 0: count=1 -> null
    // position 1: count=1 -> null
    // position 2: window=[2,null,4], count=2 -> avg=(2+4)/2=3
    // position 3: window=[null,4,null], count=1 -> null
    // position 4: window=[4,null,6], count=2 -> avg=(4+6)/2=5
    expect(out).toEqual([null, null, 3, null, 5]);
  });

  it('handles empty arrays', () => {
    expect(computeMovingAverage([], 5)).toEqual([]);
  });
});

describe('computeLinearRegression', () => {
  it('fits a perfect line to exactly linear data', () => {
    const xs = [1000, 2000, 3000, 4000, 5000];
    const ys = [10, 20, 30, 40, 50];
    const out = computeLinearRegression(xs, ys);
    out.forEach((v, i) => expect(v).toBeCloseTo(ys[i], 6));
  });

  it('fits a least-squares trend to noisy data', () => {
    // y = 2x + noise
    const xs = [0, 1, 2, 3, 4, 5];
    const ys = [0.1, 1.9, 4.2, 5.8, 8.1, 9.9];
    const out = computeLinearRegression(xs, ys);
    // slope should be ~2, so out[5] - out[0] ~= 10
    expect(out[5]! - out[0]!).toBeGreaterThan(9);
    expect(out[5]! - out[0]!).toBeLessThan(11);
  });

  it('returns nulls when fewer than 2 valid samples', () => {
    expect(computeLinearRegression([1], [5])).toEqual([null]);
    expect(computeLinearRegression([1, 2, 3], [null, null, null])).toEqual([null, null, null]);
  });

  it('skips invalid samples but still fits remaining points', () => {
    const xs = [0, 1, 2, 3, 4];
    const ys: Array<number | null> = [0, null, 4, NaN, 8];
    const out = computeLinearRegression(xs, ys);
    // line through (0,0),(2,4),(4,8) is y=2x
    expect(out[0]).toBeCloseTo(0, 5);
    expect(out[1]).toBeCloseTo(2, 5);
    expect(out[2]).toBeCloseTo(4, 5);
    expect(out[3]).toBeCloseTo(6, 5);
    expect(out[4]).toBeCloseTo(8, 5);
  });
});

describe('applyTrendOverlay', () => {
  const frame = () =>
    toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [1000, 2000, 3000, 4000, 5000] },
        { name: 'a', type: FieldType.number, values: [1, 2, 3, 4, 5] },
      ],
    });

  it('is a no-op when disabled', () => {
    const frames = [frame()];
    const out = applyTrendOverlay(frames, { ...defaults, enabled: false }, theme);
    expect(out).toBe(frames);
  });

  it('is a no-op when options is undefined', () => {
    const frames = [frame()];
    const out = applyTrendOverlay(frames, undefined, theme);
    expect(out).toBe(frames);
  });

  it('appends a trend field per numeric field in moving-average mode', () => {
    const out = applyTrendOverlay([frame()], defaults, theme);
    expect(out[0].fields).toHaveLength(3);
    const overlay = out[0].fields[2];
    expect(overlay.name).toBe('a (MA 3)');
    expect(overlay.config.custom?.drawStyle).toBeDefined();
    expect(overlay.config.color?.mode).toBe('fixed');
    expect(overlay.values).toHaveLength(5);
  });

  it('uses linear regression when configured', () => {
    const out = applyTrendOverlay([frame()], { ...defaults, mode: TrendOverlayMode.LinearRegression }, theme);
    const overlay = out[0].fields[2];
    expect(overlay.name).toBe('a (Trend)');
    // input y = x/1000 so regression is a perfect line
    const values = overlay.values as Array<number | null>;
    expect(values[0]).toBeCloseTo(1, 5);
    expect(values[4]).toBeCloseTo(5, 5);
  });

  it('skips frames without a time field', () => {
    const noTime = toDataFrame({
      fields: [{ name: 'a', type: FieldType.number, values: [1, 2, 3] }],
    });
    const out = applyTrendOverlay([noTime], defaults, theme);
    expect(out[0].fields).toHaveLength(1);
  });

  it('skips frames with no numeric fields', () => {
    const noNumeric = toDataFrame({
      fields: [{ name: 'time', type: FieldType.time, values: [1, 2, 3] }],
    });
    const out = applyTrendOverlay([noNumeric], defaults, theme);
    expect(out[0].fields).toHaveLength(1);
  });

  it('does not mutate the original frames', () => {
    const orig = frame();
    const originalFieldCount = orig.fields.length;
    applyTrendOverlay([orig], defaults, theme);
    expect(orig.fields).toHaveLength(originalFieldCount);
  });
});
