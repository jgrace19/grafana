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
import {
  defaultTimeSeriesOverlayOptions,
  type FieldConfig,
  type Options,
  TimeSeriesOverlayType,
} from './panelcfg.gen';
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

    const overlayCategory = [t('timeseries.overlay.category', 'Overlay')];
    builder
      .addBooleanSwitch({
        path: 'overlay.enabled',
        name: t('timeseries.overlay.name-enabled', 'Show overlay'),
        description: t(
          'timeseries.overlay.description-enabled',
          'Render a moving average or linear regression trendline on top of each numeric series'
        ),
        category: overlayCategory,
        defaultValue: defaultTimeSeriesOverlayOptions.enabled,
      })
      .addRadio({
        path: 'overlay.type',
        name: t('timeseries.overlay.name-type', 'Overlay type'),
        category: overlayCategory,
        defaultValue: defaultTimeSeriesOverlayOptions.type,
        settings: {
          options: [
            {
              value: TimeSeriesOverlayType.MovingAverage,
              label: t('timeseries.overlay.type-options.label-moving-average', 'Moving average'),
            },
            {
              value: TimeSeriesOverlayType.LinearRegression,
              label: t('timeseries.overlay.type-options.label-linear-regression', 'Linear regression'),
            },
          ],
        },
        showIf: (c) => Boolean(c.overlay?.enabled),
      })
      .addNumberInput({
        path: 'overlay.movingAverageWindow',
        name: t('timeseries.overlay.name-window', 'Window size (points)'),
        description: t(
          'timeseries.overlay.description-window',
          'Number of points to average over. Larger values produce a smoother overlay.'
        ),
        category: overlayCategory,
        defaultValue: defaultTimeSeriesOverlayOptions.movingAverageWindow,
        settings: {
          min: 2,
          step: 1,
          integer: true,
        },
        showIf: (c) => Boolean(c.overlay?.enabled) && c.overlay?.type === TimeSeriesOverlayType.MovingAverage,
      });

    addAnnotationOptions(builder);
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
