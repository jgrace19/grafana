import { ScaleDistribution } from '@grafana/schema';

import { applyScaleDistribution, effectiveScale, type FieldConfig } from './exploreGraphStyleUtils';

const emptyConfig = (): FieldConfig => ({ defaults: {}, overrides: [] });

describe('applyScaleDistribution', () => {
  it('sets a Linear scale distribution by default', () => {
    const out = applyScaleDistribution(emptyConfig(), 'linear');
    expect(out.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Linear });
  });

  it('sets a base-10 Log scale distribution when scale is "log"', () => {
    const out = applyScaleDistribution(emptyConfig(), 'log');
    expect(out.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Log, log: 10 });
  });

  it('preserves other custom field config and does not mutate input', () => {
    const input: FieldConfig = {
      defaults: { custom: { drawStyle: 'line', fillOpacity: 30 } },
      overrides: [],
    } as unknown as FieldConfig;

    const out = applyScaleDistribution(input, 'log');

    expect(out).not.toBe(input);
    expect(out.defaults.custom?.drawStyle).toBe('line');
    expect(out.defaults.custom?.fillOpacity).toBe(30);
    // immer should leave the original input untouched
    expect(input.defaults.custom?.scaleDistribution).toBeUndefined();
  });

  it('toggling scale back to linear overwrites a previous log config', () => {
    const withLog = applyScaleDistribution(emptyConfig(), 'log');
    const withLinear = applyScaleDistribution(withLog, 'linear');
    expect(withLinear.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Linear });
  });
});

describe('effectiveScale', () => {
  it('passes through the requested scale for non-stacked styles', () => {
    expect(effectiveScale('log', 'lines')).toBe('log');
    expect(effectiveScale('log', 'bars')).toBe('log');
    expect(effectiveScale('log', 'points')).toBe('log');
    expect(effectiveScale('linear', 'lines')).toBe('linear');
  });

  it('forces linear when style is stacked, regardless of selection', () => {
    expect(effectiveScale('log', 'stacked_lines')).toBe('linear');
    expect(effectiveScale('log', 'stacked_bars')).toBe('linear');
    expect(effectiveScale('linear', 'stacked_lines')).toBe('linear');
  });
});
