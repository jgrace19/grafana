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
import { type FieldConfig, type Options, defaultGhostOverlayOptions } from './panelcfg.gen';
import { timeseriesPresetsSupplier } from './presets';
import { timeseriesSuggestionsSupplier } from './suggestions';

const GHOST_OVERLAY_OFFSET_OPTIONS = [
  { label: '1 day', value: '1d' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
];

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

    const ghostOverlayCategory = [t('timeseries.ghost-overlay.category', 'Ghost overlay')];

    builder.addBooleanSwitch({
      path: 'ghostOverlay.enabled',
      name: t('timeseries.ghost-overlay.name-enabled', 'Enabled'),
      category: ghostOverlayCategory,
      description: t(
        'timeseries.ghost-overlay.description-enabled',
        'Show a translucent overlay of historical data for comparison'
      ),
      defaultValue: defaultGhostOverlayOptions.enabled,
    });

    builder.addSelect({
      path: 'ghostOverlay.offset',
      name: t('timeseries.ghost-overlay.name-offset', 'Time offset'),
      category: ghostOverlayCategory,
      description: t(
        'timeseries.ghost-overlay.description-offset',
        'How far back to look for comparison data'
      ),
      settings: {
        options: GHOST_OVERLAY_OFFSET_OPTIONS,
        allowCustomValue: true,
      },
      defaultValue: defaultGhostOverlayOptions.offset,
      showIf: (c) => c.ghostOverlay?.enabled === true,
    });

    builder.addSliderInput({
      path: 'ghostOverlay.opacity',
      name: t('timeseries.ghost-overlay.name-opacity', 'Opacity'),
      category: ghostOverlayCategory,
      description: t(
        'timeseries.ghost-overlay.description-opacity',
        'Opacity of the ghost overlay (10-80%)'
      ),
      defaultValue: defaultGhostOverlayOptions.opacity,
      settings: {
        min: 10,
        max: 80,
        step: 5,
      },
      showIf: (c) => c.ghostOverlay?.enabled === true,
    });
  })
  .setSuggestionsSupplier(timeseriesSuggestionsSupplier)
  .setPresetsSupplier(timeseriesPresetsSupplier)
  .setDataSupport({ annotations: true, alertStates: true });
