import { createTheme, FieldType, toDataFrame } from '@grafana/data';
import { GraphDrawStyle } from '@grafana/schema';

import { TrendOverlayMode } from './panelcfg.gen';
import { applyTrendOverlay, computeLinearRegression, computeMovingAverage } from './trendOverlay';

describe('computeMovingAverage', () => {
  it('returns an all-null array for an empty input', () => {
    expect(computeMovingAverage([], 3)).toEqual([]);
  });

  it('produces a trailing moving average', () => {
    // window=3 trailing over [1,2,3,4,5]:
    // i=0 -> 1, i=1 -> 1.5, i=2 -> 2, i=3 -> 3, i=4 -> 4
    expect(computeMovingAverage([1, 2, 3, 4, 5], 3)).toEqual([1, 1.5, 2, 3, 4]);
  });

  it('skips nulls without breaking the window and carries forward on gaps', () => {
    // window=3 over [1, null, 3, 5]:
    // i=0 (v=1) -> 1
    // i=1 (null) -> carry forward 1
    // i=2 (v=3) -> (1+3)/2 = 2
    // i=3 (v=5) -> (1+3+5)/3 = 3
    expect(computeMovingAverage([1, null, 3, 5], 3)).toEqual([1, 1, 2, 3]);
  });

  it('returns null for leading nulls before any data', () => {
    expect(computeMovingAverage([null, null, 4, 6], 2)).toEqual([null, null, 4, 5]);
  });
});

describe('computeLinearRegression', () => {
  it('recovers slope/intercept for a perfectly linear series', () => {
    // y = 2x + 3 sampled at x = 0,1,2,3,4 (times in ms from 0)
    const times = [0, 1000, 2000, 3000, 4000];
    const values = [3, 5, 7, 9, 11];
    const out = computeLinearRegression(times, values);
    expect(out).toHaveLength(5);
    out.forEach((v, i) => {
      expect(v).not.toBeNull();
      expect(v!).toBeCloseTo(values[i], 6);
    });
  });

  it('ignores null values when fitting but predicts for all timestamps', () => {
    const times = [0, 1, 2, 3, 4];
    const values = [1, null, 3, null, 5];
    const out = computeLinearRegression(times, values);
    expect(out).toEqual([1, 2, 3, 4, 5]);
  });

  it('returns all nulls when fewer than 2 finite points are present', () => {
    expect(computeLinearRegression([0, 1, 2], [null, 5, null])).toEqual([null, null, null]);
  });
});

describe('applyTrendOverlay', () => {
  const theme = createTheme();

  const makeFrame = () =>
    toDataFrame({
      name: 'series',
      fields: [
        { name: 'time', type: FieldType.time, values: [0, 1000, 2000, 3000, 4000] },
        { name: 'a', type: FieldType.number, values: [1, 3, 5, 7, 9] },
        { name: 'b', type: FieldType.number, values: [2, 4, 6, 8, 10] },
      ],
    });

  it('is a no-op when mode is Off', () => {
    const frames = [makeFrame()];
    const out = applyTrendOverlay(frames, { mode: TrendOverlayMode.Off }, theme);
    expect(out).toBe(frames);
  });

  it('is a no-op when options are undefined', () => {
    const frames = [makeFrame()];
    expect(applyTrendOverlay(frames, undefined, theme)).toBe(frames);
  });

  it('appends one overlay field per numeric series when using moving average', () => {
    const frames = [makeFrame()];
    const [out] = applyTrendOverlay(
      frames,
      { mode: TrendOverlayMode.MovingAverage, windowSize: 3, lineWidth: 2 },
      theme
    );

    // time + 2 numerics + 2 overlays = 5 fields.
    expect(out.fields).toHaveLength(5);
    const overlayA = out.fields[3];
    const overlayB = out.fields[4];
    expect(overlayA.type).toBe(FieldType.number);
    expect(overlayB.type).toBe(FieldType.number);
    expect(overlayA.name).toMatch(/MA/);
    expect(overlayA.config.custom?.lineStyle?.fill).toBe('dash');
    expect(overlayA.values).toEqual(computeMovingAverage([1, 3, 5, 7, 9], 3));
    expect(overlayB.values).toEqual(computeMovingAverage([2, 4, 6, 8, 10], 3));
  });

  it('forces overlay drawStyle to line when parent series uses bars or points', () => {
    const frame = toDataFrame({
      name: 'series',
      fields: [
        { name: 'time', type: FieldType.time, values: [0, 1000, 2000] },
        {
          name: 'a',
          type: FieldType.number,
          values: [1, 2, 3],
          config: { custom: { drawStyle: GraphDrawStyle.Bars } },
        },
        {
          name: 'b',
          type: FieldType.number,
          values: [1, 2, 3],
          config: { custom: { drawStyle: GraphDrawStyle.Points } },
        },
      ],
    });
    const [out] = applyTrendOverlay([frame], { mode: TrendOverlayMode.MovingAverage, windowSize: 2 }, theme);
    expect(out.fields[3].config.custom?.drawStyle).toBe(GraphDrawStyle.Line);
    expect(out.fields[4].config.custom?.drawStyle).toBe(GraphDrawStyle.Line);
  });

  it('appends regression overlay fields matching computeLinearRegression output', () => {
    const frames = [makeFrame()];
    const [out] = applyTrendOverlay(frames, { mode: TrendOverlayMode.LinearRegression }, theme);

    expect(out.fields).toHaveLength(5);
    const overlayA = out.fields[3];
    expect(overlayA.values).toEqual(computeLinearRegression([0, 1000, 2000, 3000, 4000], [1, 3, 5, 7, 9]));
  });

  it('does not mutate source frames or fields', () => {
    const frames = [makeFrame()];
    const originalFieldCount = frames[0].fields.length;
    const originalValuesA = frames[0].fields[1].values.slice();

    applyTrendOverlay(frames, { mode: TrendOverlayMode.MovingAverage, windowSize: 3 }, theme);

    expect(frames[0].fields).toHaveLength(originalFieldCount);
    expect(frames[0].fields[1].values).toEqual(originalValuesA);
  });

  it('leaves frames without a time field untouched', () => {
    const frame = toDataFrame({
      fields: [
        { name: 'idx', type: FieldType.number, values: [0, 1, 2] },
        { name: 'a', type: FieldType.number, values: [1, 2, 3] },
      ],
    });
    const [out] = applyTrendOverlay([frame], { mode: TrendOverlayMode.MovingAverage }, theme);
    expect(out.fields).toHaveLength(2);
  });
});
