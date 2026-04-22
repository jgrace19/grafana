import { createDataFrame, createTheme, FieldType } from '@grafana/data';

import { TrendOverlayMode } from './panelcfg.gen';
import { applyTrendOverlay } from './trendOverlay';

const theme = createTheme();

function makeFrame(
  name: string,
  times: number[],
  values: Array<number | null>,
  refId = 'A',
  meta?: Record<string, unknown>
) {
  return createDataFrame({
    refId,
    name,
    meta,
    fields: [
      { name: 'time', type: FieldType.time, values: times },
      { name, type: FieldType.number, values },
    ],
  });
}

describe('applyTrendOverlay', () => {
  it('returns same reference when mode is none', () => {
    const frames = [makeFrame('a', [1, 2, 3], [1, 2, 3])];
    const out = applyTrendOverlay(frames, frames, { mode: TrendOverlayMode.None }, theme);
    expect(out).toBe(frames);
  });

  it('returns same reference when options is undefined', () => {
    const frames = [makeFrame('a', [1, 2, 3], [1, 2, 3])];
    const out = applyTrendOverlay(frames, frames, undefined, theme);
    expect(out).toBe(frames);
  });

  it('returns same reference when frames is empty', () => {
    const out = applyTrendOverlay([], [], { mode: TrendOverlayMode.MovingAverage, windowSize: 3 }, theme);
    expect(out).toEqual([]);
  });

  it('produces trailing MA window 3 on [1..5] -> [null, null, 2, 3, 4]', () => {
    const src = [makeFrame('a', [1, 2, 3, 4, 5], [1, 2, 3, 4, 5])];
    const out = applyTrendOverlay(src, src, { mode: TrendOverlayMode.MovingAverage, windowSize: 3 }, theme);

    expect(out).toHaveLength(2);
    const overlay = out[1];
    const maField = overlay.fields.find((f) => f.type === FieldType.number)!;
    expect(maField.values).toEqual([null, null, 2, 3, 4]);
  });

  it('skips real nulls in the sum/count and does not fabricate from a single sample', () => {
    // window=4, min-obs=ceil(4/2)=2. values[1..3] are null.
    const values: Array<number | null> = [1, null, null, null, 2, 3];
    const src = [makeFrame('a', [1, 2, 3, 4, 5, 6], values)];

    const out = applyTrendOverlay(src, src, { mode: TrendOverlayMode.MovingAverage, windowSize: 4 }, theme);
    const maField = out[1].fields.find((f) => f.type === FieldType.number)!;

    expect(maField.values[0]).toBeNull();
    expect(maField.values[1]).toBeNull();
    expect(maField.values[2]).toBeNull();
    expect(maField.values[3]).toBeNull();
    // i=4: after sliding, window={null,null,null,2}, count=1 < minObs -> null
    expect(maField.values[4]).toBeNull();
    // i=5: window={null,null,2,3}, count=2, MA = 2.5
    expect(maField.values[5]).toBeCloseTo(2.5, 12);
  });

  it('reproduces y = 2t + 3 under linear regression within 1e-9', () => {
    const times = [0, 1, 2, 3, 4];
    const values = times.map((t) => 2 * t + 3);
    const src = [makeFrame('a', times, values)];

    const out = applyTrendOverlay(src, src, { mode: TrendOverlayMode.LinearRegression }, theme);
    const trendField = out[1].fields.find((f) => f.type === FieldType.number)!;

    trendField.values.forEach((v: number | null, i: number) => {
      expect(v).not.toBeNull();
      expect(v!).toBeCloseTo(2 * times[i] + 3, 9);
    });
  });

  it('emits all-null overlay when fewer than 2 finite points are available', () => {
    const src = [makeFrame('a', [1, 2, 3], [null, null, 5])];
    const out = applyTrendOverlay(src, src, { mode: TrendOverlayMode.LinearRegression }, theme);
    const trendField = out[1].fields.find((f) => f.type === FieldType.number)!;
    expect(trendField.values).toEqual([null, null, null]);
  });

  it('preserves input frames and adds one overlay frame per source frame', () => {
    const frames = [
      makeFrame('a', [1, 2, 3], [1, 2, 3], 'A'),
      makeFrame('b', [1, 2, 3], [4, 5, 6], 'B'),
    ];
    const out = applyTrendOverlay(
      frames,
      frames,
      { mode: TrendOverlayMode.MovingAverage, windowSize: 2 },
      theme
    );
    expect(out).toHaveLength(4);
    expect(out[0]).toBe(frames[0]);
    expect(out[1]).toBe(frames[1]);
    expect(out[2].refId).toBe('A-trend');
    expect(out[3].refId).toBe('B-trend');
  });

  it('sets hideFrom.legend=true and stacking.mode=none on overlay fields', () => {
    const src = [makeFrame('a', [1, 2, 3], [1, 2, 3])];
    const out = applyTrendOverlay(src, src, { mode: TrendOverlayMode.MovingAverage, windowSize: 2 }, theme);
    const overlayNumField = out[1].fields.find((f) => f.type === FieldType.number)!;
    expect(overlayNumField.config.custom?.hideFrom?.legend).toBe(true);
    expect(overlayNumField.config.custom?.stacking?.mode).toBe('none');
  });

  it('skips a field that was boolean-coerced in the pre-prep source', () => {
    const sourceFrame = createDataFrame({
      refId: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1, 2, 3] },
        { name: 'flag', type: FieldType.boolean, values: [true, false, true] },
      ],
    });
    const preppedFrame = createDataFrame({
      refId: 'A',
      fields: [
        { name: 'time', type: FieldType.time, values: [1, 2, 3] },
        { name: 'flag', type: FieldType.number, values: [1, 0, 1] },
      ],
    });

    const prepped = [preppedFrame];
    const out = applyTrendOverlay(
      prepped,
      [sourceFrame],
      { mode: TrendOverlayMode.MovingAverage, windowSize: 2 },
      theme
    );
    expect(out).toBe(prepped);
  });

  it('propagates meta.timeCompare from source to overlay frame', () => {
    const frame = makeFrame('a', [1, 2, 3], [1, 2, 3], 'A', {
      timeCompare: { diffMs: 123, isTimeShiftQuery: false },
    });
    const out = applyTrendOverlay(
      [frame],
      [frame],
      { mode: TrendOverlayMode.MovingAverage, windowSize: 2 },
      theme
    );
    expect(out[1].meta?.timeCompare).toEqual({ diffMs: 123, isTimeShiftQuery: false });
  });
});
