import { produce } from 'immer';

import { type FieldConfigSource, type ThresholdsConfig } from '@grafana/data';
import {
  GraphDrawStyle,
  type GraphFieldConfig,
  type GraphThresholdsStyleConfig,
  ScaleDistribution,
  StackingMode,
} from '@grafana/schema';
import { type ExploreGraphScale, type ExploreGraphStyle, isStackedGraphStyle } from 'app/types/explore';

export type FieldConfig = FieldConfigSource<GraphFieldConfig>;

// Returns the effective scale to apply given the user-selected scale and graph
// style. Stacked styles are forced to linear because additive stacking on a
// multiplicative axis renders nonsense (the UI also disables Log in that
// case, but this is a defense-in-depth fallback for any other code path that
// constructs a stacked style without going through the toggle).
export function effectiveScale(scale: ExploreGraphScale, style: ExploreGraphStyle): ExploreGraphScale {
  return isStackedGraphStyle(style) ? 'linear' : scale;
}

export function applyScaleDistribution(config: FieldConfig, scale: ExploreGraphScale): FieldConfig {
  return produce(config, (draft) => {
    if (draft.defaults.custom === undefined) {
      draft.defaults.custom = {};
    }

    draft.defaults.custom.scaleDistribution =
      scale === 'log' ? { type: ScaleDistribution.Log, log: 10 } : { type: ScaleDistribution.Linear };
  });
}

export function applyGraphStyle(config: FieldConfig, style: ExploreGraphStyle, maximum?: number): FieldConfig {
  return produce(config, (draft) => {
    if (draft.defaults.custom === undefined) {
      draft.defaults.custom = {};
    }

    draft.defaults.max = maximum;

    const { custom } = draft.defaults;

    if (custom.stacking === undefined) {
      custom.stacking = { group: 'A' };
    }

    switch (style) {
      case 'lines':
        custom.drawStyle = GraphDrawStyle.Line;
        custom.stacking.mode = StackingMode.None;
        custom.fillOpacity = 0;
        break;
      case 'bars':
        custom.drawStyle = GraphDrawStyle.Bars;
        custom.stacking.mode = StackingMode.None;
        custom.fillOpacity = 100;
        break;
      case 'points':
        custom.drawStyle = GraphDrawStyle.Points;
        custom.stacking.mode = StackingMode.None;
        custom.fillOpacity = 0;
        break;
      case 'stacked_lines':
        custom.drawStyle = GraphDrawStyle.Line;
        custom.stacking.mode = StackingMode.Normal;
        custom.fillOpacity = 100;
        custom.axisSoftMin = 0;
        break;
      case 'stacked_bars':
        custom.drawStyle = GraphDrawStyle.Bars;
        custom.stacking.mode = StackingMode.Normal;
        custom.fillOpacity = 100;
        custom.axisSoftMin = 0;
        break;
      default: {
        // should never happen
        // NOTE: casting to `never` will cause typescript
        // to verify that the switch statement checks every possible
        // enum-value
        const invalidValue: never = style;
        throw new Error(`Invalid graph-style: ${invalidValue}`);
      }
    }
  });
}

export function applyThresholdsConfig(
  config: FieldConfig,
  thresholdsStyle?: GraphThresholdsStyleConfig,
  thresholdsConfig?: ThresholdsConfig
): FieldConfig {
  return produce(config, (draft) => {
    draft.defaults.thresholds = thresholdsConfig;
    draft.defaults.custom = draft.defaults.custom ?? {};
    draft.defaults.custom.thresholdsStyle = thresholdsStyle;
  });
}
