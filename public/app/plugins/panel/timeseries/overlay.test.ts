import { createTheme, FieldType, toDataFrame } from '@grafana/data';

import { appendTrendOverlays, linearRegression, movingAverage } from './overlay';
import { TrendOverlayType } from './panelcfg.gen';

describe('movingAverage', () => {
  it('returns null for indices before the first full window', () => {
    const out = movingAverage([1, 2, 3, 4, 5], 3);
    expect(out[0]).toBeNull();
    expect(out[1]).toBeNull();
    expect(out[2]).toBeCloseTo((1 + 2 + 3) / 3);
    expect(out[3]).toBeCloseTo((2 + 3 + 4) / 3);
    expect(out[4]).toBeCloseTo((3 + 4 + 5) / 3);
  });

  it('skips null values inside the window and averages the finite ones', () => {
    const out = movingAverage([1, null, 3, null, 5], 3);
    expect(out[2]).toBeCloseTo((1 + 3) / 2);
    expect(out[3]).toBeCloseTo((3) / 1);
    expect(out[4]).toBeCloseTo((3 + 5) / 2);
  });

  it('returns null when every value in the window is null', () => {
    const out = movingAverage([null, null, null, null], 2);
    expect(out).toEqual([null, null, null, null]);
  });

  it('clamps window sizes below the minimum', () => {
    const out = movingAverage([10, 20, 30], 1);
    // window clamped to 2, so first index null
    expect(out[0]).toBeNull();
    expect(out[1]).toBeCloseTo(15);
    expect(out[2]).toBeCloseTo(25);
  });

  it('handles empty input', () => {
    expect(movingAverage([], 5)).toEqual([]);
  });
});

describe('linearRegression', () => {
  it('fits a perfect line exactly', () => {
    const xs = [0, 1, 2, 3, 4];
    const ys = [1, 3, 5, 7, 9];
    const out = linearRegression(xs, ys);
    out.forEach((v, i) => expect(v).toBeCloseTo(2 * xs[i] + 1));
  });

  it('stays numerically stable with epoch-millisecond timestamps', () => {
    const start = 1_715_000_000_000;
    const xs = Array.from({ length: 30 }, (_, i) => start + i * 1000);
    const ys = Array.from({ length: 30 }, (_, i) => 10 + i * 3);
    const out = linearRegression(xs, ys);
    out.forEach((v, i) => expect(v).toBeCloseTo(ys[i], 8));
  });

  it('predicts a value at every x even when ys contain nulls', () => {
    const xs = [1000, 2000, 3000, 4000, 5000];
    const ys = [null, 4, null, 8, null];
    const out = linearRegression(xs, ys);
    // From the two finite points (2000,4) and (4000,8): slope=0.002, intercept=0
    out.forEach((v, i) => expect(v).toBeCloseTo(0.002 * xs[i]));
  });

  it('returns nulls when fewer than two finite samples exist', () => {
    expect(linearRegression([0, 1, 2], [null, null, null])).toEqual([null, null, null]);
    expect(linearRegression([0, 1, 2], [5, null, null])).toEqual([null, null, null]);
  });
});

describe('appendTrendOverlays', () => {
  const theme = createTheme();
  const baseFrame = () =>
    toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [1000, 2000, 3000, 4000, 5000] },
        { name: 'A', type: FieldType.number, values: [1, 2, 3, 4, 5] },
      ],
    });

  it('returns input unchanged when overlay is disabled', () => {
    const frames = [baseFrame()];
    const out = appendTrendOverlays(frames, { enabled: false, type: TrendOverlayType.MovingAverage }, theme);
    expect(out).toBe(frames);
    expect(out[0].fields).toHaveLength(2);
  });

  it('returns input unchanged when options are undefined', () => {
    const frames = [baseFrame()];
    const out = appendTrendOverlays(frames, undefined, theme);
    expect(out).toBe(frames);
  });

  it('appends a moving average overlay field per numeric field', () => {
    const frames = [baseFrame()];
    const out = appendTrendOverlays(
      frames,
      { enabled: true, type: TrendOverlayType.MovingAverage, windowSize: 3 },
      theme
    );
    expect(out).not.toBe(frames);
    const fields = out[0].fields;
    expect(fields).toHaveLength(3);

    const overlay = fields[2];
    expect(overlay.type).toBe(FieldType.number);
    expect(overlay.config.displayName).toBe('A (MA 3)');
    expect(overlay.values[0]).toBeNull();
    expect(overlay.values[1]).toBeNull();
    expect(overlay.values[2]).toBeCloseTo(2);
    expect(overlay.values[3]).toBeCloseTo(3);
    expect(overlay.values[4]).toBeCloseTo(4);
  });

  it('appends a linear regression overlay field per numeric field', () => {
    const frames = [baseFrame()];
    const out = appendTrendOverlays(
      frames,
      { enabled: true, type: TrendOverlayType.LinearRegression },
      theme
    );
    const overlay = out[0].fields[2];
    expect(overlay.config.displayName).toBe('A (Trend)');
    overlay.values.forEach((v, i) => expect(v).toBeCloseTo(i + 1));
  });

  it('does not mutate the source frames or fields', () => {
    const frames = [baseFrame()];
    const beforeFieldCount = frames[0].fields.length;
    const beforeFirstField = frames[0].fields[0];
    appendTrendOverlays(frames, { enabled: true, type: TrendOverlayType.MovingAverage, windowSize: 3 }, theme);
    expect(frames[0].fields).toHaveLength(beforeFieldCount);
    expect(frames[0].fields[0]).toBe(beforeFirstField);
  });

  it('skips frames without a time field', () => {
    const frame = toDataFrame({
      fields: [{ name: 'A', type: FieldType.number, values: [1, 2, 3] }],
    });
    const out = appendTrendOverlays(
      [frame],
      { enabled: true, type: TrendOverlayType.MovingAverage, windowSize: 2 },
      theme
    );
    expect(out[0].fields).toHaveLength(1);
  });

  it('handles multiple numeric series independently', () => {
    const frame = toDataFrame({
      fields: [
        { name: 'time', type: FieldType.time, values: [1000, 2000, 3000] },
        { name: 'A', type: FieldType.number, values: [10, 20, 30] },
        { name: 'B', type: FieldType.number, values: [100, 200, 300] },
      ],
    });
    const out = appendTrendOverlays(
      [frame],
      { enabled: true, type: TrendOverlayType.MovingAverage, windowSize: 2 },
      theme
    );
    expect(out[0].fields).toHaveLength(5);
    expect(out[0].fields[2].config.displayName).toBe('A (MA 2)');
    expect(out[0].fields[4].config.displayName).toBe('B (MA 2)');
    expect(out[0].fields[2].values[2]).toBeCloseTo(25);
    expect(out[0].fields[4].values[2]).toBeCloseTo(250);
  });
});
