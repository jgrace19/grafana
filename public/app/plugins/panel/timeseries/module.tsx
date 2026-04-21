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
import { type FieldConfig, type Options, TrendOverlayMode } from './panelcfg.gen';
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
    addAnnotationOptions(builder);

    const trendOverlayCategory = [t('timeseries.trend-overlay.category', 'Trend overlay')];
    builder
      .addBooleanSwitch({
        path: 'trendOverlay.enabled',
        name: t('timeseries.trend-overlay.name-enabled', 'Show trend overlay'),
        description: t(
          'timeseries.trend-overlay.description-enabled',
          'Overlay a moving average or linear regression trendline on each numeric series'
        ),
        category: trendOverlayCategory,
        defaultValue: false,
      })
      .addRadio({
        path: 'trendOverlay.mode',
        name: t('timeseries.trend-overlay.name-mode', 'Mode'),
        category: trendOverlayCategory,
        defaultValue: TrendOverlayMode.MovingAverage,
        settings: {
          options: [
            {
              label: t('timeseries.trend-overlay.mode-moving-average', 'Moving average'),
              value: TrendOverlayMode.MovingAverage,
            },
            {
              label: t('timeseries.trend-overlay.mode-linear-regression', 'Linear regression'),
              value: TrendOverlayMode.LinearRegression,
            },
          ],
        },
        showIf: (c) => c.trendOverlay?.enabled === true,
      })
      .addSliderInput({
        path: 'trendOverlay.windowSize',
        name: t('timeseries.trend-overlay.name-window-size', 'Window size'),
        description: t(
          'timeseries.trend-overlay.description-window-size',
          'Number of trailing samples averaged for each point'
        ),
        category: trendOverlayCategory,
        defaultValue: 10,
        settings: {
          min: 2,
          max: 200,
          step: 1,
          ariaLabelForHandle: t('timeseries.trend-overlay.aria-label-window-size', 'Window size'),
        },
        showIf: (c) => c.trendOverlay?.enabled === true && c.trendOverlay?.mode === TrendOverlayMode.MovingAverage,
      })
      .addSliderInput({
        path: 'trendOverlay.lineWidth',
        name: t('timeseries.trend-overlay.name-line-width', 'Line width'),
        category: trendOverlayCategory,
        defaultValue: 2,
        settings: {
          min: 1,
          max: 10,
          step: 1,
          ariaLabelForHandle: t('timeseries.trend-overlay.aria-label-line-width', 'Line width'),
        },
        showIf: (c) => c.trendOverlay?.enabled === true,
      })
      .addSliderInput({
        path: 'trendOverlay.opacity',
        name: t('timeseries.trend-overlay.name-opacity', 'Opacity'),
        category: trendOverlayCategory,
        defaultValue: 0.7,
        settings: {
          min: 0.1,
          max: 1,
          step: 0.05,
          ariaLabelForHandle: t('timeseries.trend-overlay.aria-label-opacity', 'Opacity'),
        },
        showIf: (c) => c.trendOverlay?.enabled === true,
      });
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
