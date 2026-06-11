import { type FieldConfigSource } from '@grafana/data';
import { type GraphFieldConfig, ScaleDistribution } from '@grafana/schema';

import { applyGraphScale, applyGraphStyle, applyThresholdsConfig } from './exploreGraphStyleUtils';

describe('exploreGraphStyleUtils', () => {
  const baseFieldConfig: FieldConfigSource<GraphFieldConfig> = {
    defaults: {
      custom: {},
    },
    overrides: [],
  };

  describe('applyGraphScale', () => {
    it('should apply linear scale distribution', () => {
      const result = applyGraphScale(baseFieldConfig, 'linear');
      expect(result.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Linear,
      });
    });

    it('should apply log scale distribution with log base 10', () => {
      const result = applyGraphScale(baseFieldConfig, 'log');
      expect(result.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Log,
        log: 10,
      });
    });

    it('should not mutate the original config', () => {
      const original: FieldConfigSource<GraphFieldConfig> = {
        defaults: {
          custom: {
            scaleDistribution: { type: ScaleDistribution.Linear },
          },
        },
        overrides: [],
      };
      const result = applyGraphScale(original, 'log');
      expect(original.defaults.custom?.scaleDistribution?.type).toBe(ScaleDistribution.Linear);
      expect(result.defaults.custom?.scaleDistribution?.type).toBe(ScaleDistribution.Log);
    });

    it('should handle config without custom field', () => {
      const configWithoutCustom: FieldConfigSource<GraphFieldConfig> = {
        defaults: {},
        overrides: [],
      };
      const result = applyGraphScale(configWithoutCustom, 'log');
      expect(result.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Log,
        log: 10,
      });
    });
  });

  describe('applyGraphStyle', () => {
    it('should not affect scale distribution when applying graph style', () => {
      const configWithScale: FieldConfigSource<GraphFieldConfig> = {
        defaults: {
          custom: {
            scaleDistribution: { type: ScaleDistribution.Log, log: 10 },
          },
        },
        overrides: [],
      };
      const result = applyGraphStyle(configWithScale, 'lines');
      expect(result.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Log,
        log: 10,
      });
    });
  });

  describe('applyThresholdsConfig', () => {
    it('should not affect scale distribution when applying thresholds', () => {
      const configWithScale: FieldConfigSource<GraphFieldConfig> = {
        defaults: {
          custom: {
            scaleDistribution: { type: ScaleDistribution.Log, log: 10 },
          },
        },
        overrides: [],
      };
      const result = applyThresholdsConfig(configWithScale, undefined, undefined);
      expect(result.defaults.custom?.scaleDistribution).toEqual({
        type: ScaleDistribution.Log,
        log: 10,
      });
    });
  });

  describe('scale and style independence', () => {
    it('should allow applying scale after style without losing scale', () => {
      let config = baseFieldConfig;
      config = applyGraphStyle(config, 'bars');
      config = applyGraphScale(config, 'log');
      expect(config.defaults.custom?.scaleDistribution?.type).toBe(ScaleDistribution.Log);
    });

    it('should allow applying style after scale without losing scale', () => {
      let config = baseFieldConfig;
      config = applyGraphScale(config, 'log');
      config = applyGraphStyle(config, 'bars');
      expect(config.defaults.custom?.scaleDistribution?.type).toBe(ScaleDistribution.Log);
    });
  });
});
