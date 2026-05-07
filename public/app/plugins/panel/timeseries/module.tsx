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

    const trendOverlayCategory = [t('timeseries.trend-overlay.category', 'Trend overlay')];
    builder
      .addBooleanSwitch({
        path: 'trendOverlay.enabled',
        name: t('timeseries.trend-overlay.name-enabled', 'Show trend overlay'),
        description: t(
          'timeseries.trend-overlay.description-enabled',
          'Adds a derived trendline series for each numeric series in the panel'
        ),
        category: trendOverlayCategory,
        defaultValue: false,
      })
      .addRadio({
        path: 'trendOverlay.type',
        name: t('timeseries.trend-overlay.name-type', 'Overlay type'),
        category: trendOverlayCategory,
        defaultValue: TrendOverlayType.MovingAverage,
        settings: {
          options: [
            {
              label: t('timeseries.trend-overlay.type-options.label-moving-average', 'Moving average'),
              value: TrendOverlayType.MovingAverage,
            },
            {
              label: t('timeseries.trend-overlay.type-options.label-linear-regression', 'Linear regression'),
              value: TrendOverlayType.LinearRegression,
            },
          ],
        },
        showIf: (c) => Boolean(c.trendOverlay?.enabled),
      })
      .addNumberInput({
        path: 'trendOverlay.windowSize',
        name: t('timeseries.trend-overlay.name-window-size', 'Window size (points)'),
        description: t(
          'timeseries.trend-overlay.description-window-size',
          'Number of trailing data points (including the current point) to include in the moving average'
        ),
        category: trendOverlayCategory,
        defaultValue: 10,
        settings: {
          min: 2,
          step: 1,
          integer: true,
        },
        showIf: (c) =>
          Boolean(c.trendOverlay?.enabled) && c.trendOverlay?.type === TrendOverlayType.MovingAverage,
      });

    addAnnotationOptions(builder);
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
