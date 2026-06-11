import { PanelPlugin } from '@grafana/data';
import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { commonOptionsBuilder } from '@grafana/ui';
import { optsWithHideZeros } from '@grafana/ui/internal';
import { addAnnotationOptions } from 'app/features/panel/options/builder/annotations';

import { TimeSeriesPanel } from './TimeSeriesPanel';
import { TimezonesEditor } from './TimezonesEditor';
import { defaultGraphConfig, getGraphFieldConfig } from './config';
import { graphPanelChangedHandler } from './migrations';
import { type FieldConfig, type Options, TrendOverlayType } from './panelcfg.gen';
import { timeseriesPresetsSupplier } from './presets';
import { timeseriesSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<Options, FieldConfig>(TimeSeriesPanel)
  .setPanelChangeHandler(graphPanelChangedHandler)
  .useFieldConfig(getGraphFieldConfig(defaultGraphConfig))
  .setPanelOptions((builder) => {
    commonOptionsBuilder.addTooltipOptions(builder, false, true, optsWithHideZeros);
    commonOptionsBuilder.addLegendOptions(builder, true, true);

    const legendCategory = [t('timeseries.legend.category', 'Legend')];

    if (config.featureToggles.vizLegendFacetedFilter) {
      builder.addBooleanSwitch({
        path: 'legend.enableFacetedFilter',
        name: t('timeseries.legend.name-faceted-filter', 'Faceted filter'),
        category: legendCategory,
        description: t('timeseries.legend.description-faceted-filter', 'Show series visibility filter based on labels'),
        defaultValue: true,
        showIf: (c) => c.legend.showLegend,
      });
    }

    builder.addCustomEditor({
      id: 'timezone',
      name: t('timeseries.name-time-zone', 'Time zone'),
      path: 'timezone',
      category: [t('timeseries.category-axis', 'Axis')],
      editor: TimezonesEditor,
      defaultValue: undefined,
    });

    const overlayCategory = [t('timeseries.trend-overlay.category', 'Trend overlay')];

    builder
      .addBooleanSwitch({
        path: 'trendOverlay.enabled',
        name: t('timeseries.trend-overlay.name-enabled', 'Enable'),
        category: overlayCategory,
        description: t(
          'timeseries.trend-overlay.description-enabled',
          'Render an additional series for each visible numeric series with the chosen trend calculation'
        ),
        defaultValue: false,
      })
      .addRadio({
        path: 'trendOverlay.type',
        name: t('timeseries.trend-overlay.name-type', 'Type'),
        category: overlayCategory,
        defaultValue: TrendOverlayType.MovingAverage,
        settings: {
          options: [
            {
              value: TrendOverlayType.MovingAverage,
              label: t('timeseries.trend-overlay.type-moving-average', 'Moving average'),
            },
            {
              value: TrendOverlayType.LinearRegression,
              label: t('timeseries.trend-overlay.type-linear-regression', 'Linear regression'),
            },
          ],
        },
        showIf: (c) => Boolean(c.trendOverlay?.enabled),
      })
      .addNumberInput({
        path: 'trendOverlay.windowSize',
        name: t('timeseries.trend-overlay.name-window-size', 'Window size'),
        category: overlayCategory,
        description: t(
          'timeseries.trend-overlay.description-window-size',
          'Number of samples included in each trailing moving-average window'
        ),
        defaultValue: 10,
        settings: { min: 2, integer: true },
        showIf: (c) => Boolean(c.trendOverlay?.enabled) && c.trendOverlay?.type === TrendOverlayType.MovingAverage,
      })
      .addNumberInput({
        path: 'trendOverlay.predictionCount',
        name: t('timeseries.trend-overlay.name-prediction-count', 'Prediction points'),
        category: overlayCategory,
        description: t(
          'timeseries.trend-overlay.description-prediction-count',
          'Number of evenly spaced points used to draw the regression trendline'
        ),
        defaultValue: 100,
        settings: { min: 2, integer: true },
        showIf: (c) => Boolean(c.trendOverlay?.enabled) && c.trendOverlay?.type === TrendOverlayType.LinearRegression,
      });

    addAnnotationOptions(builder);
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
