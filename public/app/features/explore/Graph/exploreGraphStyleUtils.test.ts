import { type FieldConfigSource } from '@grafana/data';
import { GraphDrawStyle, ScaleDistribution, StackingMode, type GraphFieldConfig } from '@grafana/schema';

import { applyGraphStyle } from './exploreGraphStyleUtils';

describe('applyGraphStyle', () => {
  const baseConfig: FieldConfigSource<GraphFieldConfig> = {
    defaults: {
      custom: {},
    },
    overrides: [],
  };

  it('applies linear scale distribution for linear graph scale', () => {
    const result = applyGraphStyle(baseConfig, 'lines', 'linear');

    expect(result.defaults.custom?.scaleDistribution).toEqual({
      type: ScaleDistribution.Linear,
    });
  });

  it('applies log scale distribution for log graph scale', () => {
    const result = applyGraphStyle(baseConfig, 'lines', 'log');

    expect(result.defaults.custom?.scaleDistribution).toEqual({
      type: ScaleDistribution.Log,
      log: 10,
    });
  });

  it('keeps existing graph style behavior while applying scale', () => {
    const result = applyGraphStyle(baseConfig, 'stacked_bars', 'log', 123);

    expect(result.defaults.max).toBe(123);
    expect(result.defaults.custom?.drawStyle).toBe(GraphDrawStyle.Bars);
    expect(result.defaults.custom?.fillOpacity).toBe(100);
    expect(result.defaults.custom?.stacking?.mode).toBe(StackingMode.Normal);
    expect(result.defaults.custom?.scaleDistribution).toEqual({
      type: ScaleDistribution.Log,
      log: 10,
    });
  });
});
