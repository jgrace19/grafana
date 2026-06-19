import { type FieldConfigSource } from '@grafana/data';
import { GraphDrawStyle, type GraphFieldConfig, ScaleDistribution, StackingMode } from '@grafana/schema';

import { applyGraphStyle, applyGraphYAxisScale } from './exploreGraphStyleUtils';
import { toGraphYAxisScale } from './utils';

const makeFieldConfig = (): FieldConfigSource<GraphFieldConfig> => ({
  defaults: {
    custom: {},
  },
  overrides: [],
});

describe('Explore graph style utils', () => {
  describe('toGraphYAxisScale', () => {
    it('returns known y-axis scales', () => {
      expect(toGraphYAxisScale('linear')).toBe('linear');
      expect(toGraphYAxisScale('log')).toBe('log');
      expect(toGraphYAxisScale('symlog')).toBe('symlog');
    });

    it('falls back to linear for unknown values', () => {
      expect(toGraphYAxisScale('log2')).toBe('linear');
      expect(toGraphYAxisScale(null)).toBe('linear');
      expect(toGraphYAxisScale({ type: 'log' })).toBe('linear');
    });
  });

  describe('applyGraphYAxisScale', () => {
    it('applies a linear y-axis scale', () => {
      const config = applyGraphYAxisScale(makeFieldConfig(), 'linear');

      expect(config.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Linear });
    });

    it('applies a base 10 logarithmic y-axis scale', () => {
      const config = applyGraphYAxisScale(makeFieldConfig(), 'log');

      expect(config.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Log, log: 10 });
    });

    it('applies a base 10 symlog y-axis scale for zero and negative values', () => {
      const config = applyGraphYAxisScale(makeFieldConfig(), 'symlog');

      expect(config.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Symlog,
        log: 10,
        linearThreshold: 1,
      });
    });

    it('does not mutate the input field config', () => {
      const fieldConfig = makeFieldConfig();

      applyGraphYAxisScale(fieldConfig, 'log');

      expect(fieldConfig.defaults.custom?.scaleDistribution).toBeUndefined();
    });

    it('keeps graph style independent from y-axis scale', () => {
      const config = applyGraphYAxisScale(applyGraphStyle(makeFieldConfig(), 'bars'), 'log');

      expect(config.defaults.custom?.drawStyle).toBe(GraphDrawStyle.Bars);
      expect(config.defaults.custom?.stacking?.mode).toBe(StackingMode.None);
      expect(config.defaults.custom?.scaleDistribution).toEqual({ type: ScaleDistribution.Log, log: 10 });
    });
  });
});
