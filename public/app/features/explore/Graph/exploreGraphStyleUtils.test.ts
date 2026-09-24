import { ThresholdsMode } from '@grafana/data';
import { GraphDrawStyle, GraphThresholdsStyleMode, StackingMode } from '@grafana/schema';
import { type ExploreGraphStyle } from 'app/types/explore';

import { applyGraphStyle, applyThresholdsConfig, type FieldConfig } from './exploreGraphStyleUtils';

const emptyConfig = (): FieldConfig => ({ defaults: {}, overrides: [] });

describe('applyGraphStyle', () => {
  it.each<[ExploreGraphStyle, GraphDrawStyle, StackingMode, number]>([
    ['lines', GraphDrawStyle.Line, StackingMode.None, 0],
    ['bars', GraphDrawStyle.Bars, StackingMode.None, 100],
    ['points', GraphDrawStyle.Points, StackingMode.None, 0],
    ['stacked_lines', GraphDrawStyle.Line, StackingMode.Normal, 100],
    ['stacked_bars', GraphDrawStyle.Bars, StackingMode.Normal, 100],
  ])('maps %s to drawStyle %s, stacking %s, fillOpacity %s', (style, drawStyle, stackingMode, fillOpacity) => {
    const { custom } = applyGraphStyle(emptyConfig(), style).defaults;

    expect(custom?.drawStyle).toBe(drawStyle);
    expect(custom?.stacking).toEqual({ group: 'A', mode: stackingMode });
    expect(custom?.fillOpacity).toBe(fillOpacity);
  });

  it.each<ExploreGraphStyle>(['stacked_lines', 'stacked_bars'])('sets axisSoftMin to 0 for %s', (style) => {
    expect(applyGraphStyle(emptyConfig(), style).defaults.custom?.axisSoftMin).toBe(0);
  });

  it.each<ExploreGraphStyle>(['lines', 'bars', 'points'])('does not set axisSoftMin for %s', (style) => {
    expect(applyGraphStyle(emptyConfig(), style).defaults.custom?.axisSoftMin).toBeUndefined();
  });

  it('sets the maximum', () => {
    expect(applyGraphStyle(emptyConfig(), 'lines', 42).defaults.max).toBe(42);
  });

  it('clears a previously set maximum when none is given', () => {
    const config: FieldConfig = { defaults: { max: 10 }, overrides: [] };

    expect(applyGraphStyle(config, 'lines').defaults.max).toBeUndefined();
  });

  it('preserves an existing stacking group and unrelated custom options', () => {
    const config: FieldConfig = {
      defaults: { custom: { lineWidth: 3, stacking: { group: 'B', mode: StackingMode.Normal } } },
      overrides: [],
    };

    const { custom } = applyGraphStyle(config, 'lines').defaults;

    expect(custom?.lineWidth).toBe(3);
    expect(custom?.stacking).toEqual({ group: 'B', mode: StackingMode.None });
  });

  it('does not mutate the input config', () => {
    const config = emptyConfig();

    const result = applyGraphStyle(config, 'bars', 5);

    expect(result).not.toBe(config);
    expect(config).toEqual(emptyConfig());
  });

  it('throws on an unknown style', () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    expect(() => applyGraphStyle(emptyConfig(), 'area' as ExploreGraphStyle)).toThrow('Invalid graph-style: area');
  });
});

describe('applyThresholdsConfig', () => {
  const thresholds = {
    mode: ThresholdsMode.Absolute,
    steps: [{ value: -Infinity, color: 'green' }],
  };

  it('sets thresholds and thresholds style', () => {
    const { defaults } = applyThresholdsConfig(emptyConfig(), { mode: GraphThresholdsStyleMode.Line }, thresholds);

    expect(defaults.thresholds).toEqual(thresholds);
    expect(defaults.custom?.thresholdsStyle).toEqual({ mode: GraphThresholdsStyleMode.Line });
  });

  it('keeps existing custom options', () => {
    const config: FieldConfig = { defaults: { custom: { drawStyle: GraphDrawStyle.Bars } }, overrides: [] };

    const { custom } = applyThresholdsConfig(config, { mode: GraphThresholdsStyleMode.Area }).defaults;

    expect(custom?.drawStyle).toBe(GraphDrawStyle.Bars);
    expect(custom?.thresholdsStyle).toEqual({ mode: GraphThresholdsStyleMode.Area });
  });

  it('clears thresholds when called without them', () => {
    const config: FieldConfig = {
      defaults: { thresholds, custom: { thresholdsStyle: { mode: GraphThresholdsStyleMode.Line } } },
      overrides: [],
    };

    const { defaults } = applyThresholdsConfig(config);

    expect(defaults.thresholds).toBeUndefined();
    expect(defaults.custom?.thresholdsStyle).toBeUndefined();
  });

  it('does not mutate the input config', () => {
    const config = emptyConfig();

    applyThresholdsConfig(config, { mode: GraphThresholdsStyleMode.Line }, thresholds);

    expect(config).toEqual(emptyConfig());
  });
});
