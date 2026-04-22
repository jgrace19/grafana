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

    const trendOverlayCategory = [t('timeseries.trend-overlay.category', 'Trend overlay')];

    builder
      .addRadio({
        path: 'trendOverlay.mode',
        name: t('timeseries.trend-overlay.name-mode', 'Overlay type'),
        description: t(
          'timeseries.trend-overlay.description-mode',
          'Draw a trend overlay on top of every numeric series in the panel.'
        ),
        category: trendOverlayCategory,
        defaultValue: TrendOverlayMode.None,
        settings: {
          options: [
            { value: TrendOverlayMode.None, label: t('timeseries.trend-overlay.option-none', 'None') },
            {
              value: TrendOverlayMode.MovingAverage,
              label: t('timeseries.trend-overlay.option-moving-average', 'Moving average'),
            },
            {
              value: TrendOverlayMode.LinearRegression,
              label: t('timeseries.trend-overlay.option-linear-regression', 'Linear regression'),
            },
          ],
        },
      })
      .addNumberInput({
        path: 'trendOverlay.windowSize',
        name: t('timeseries.trend-overlay.name-window-size', 'Window size (points)'),
        description: t(
          'timeseries.trend-overlay.description-window-size',
          'Number of points in the trailing moving-average window. Zooming the time range changes what this represents.'
        ),
        category: trendOverlayCategory,
        defaultValue: 10,
        settings: { min: 2, integer: true },
        showIf: (o) => o.trendOverlay?.mode === TrendOverlayMode.MovingAverage,
      });

    addAnnotationOptions(builder);
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
