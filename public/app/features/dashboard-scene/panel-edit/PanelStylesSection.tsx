import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo, useState } from 'react';

import { FeatureState, type FieldConfigSource, type PanelPluginVisualizationSuggestion } from '@grafana/data';
import { t, Trans } from '@grafana/i18n';
import { sceneGraph, type VizPanel } from '@grafana/scenes';
import { FeatureBadge, Icon, Stack, Tooltip } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { OptionsPaneCategory } from 'app/features/dashboard/components/PanelEditor/OptionsPaneCategory';
import { VisualizationCardGrid } from 'app/features/panel/components/VizTypePicker/VisualizationCardGrid';
import { VizSuggestionsInteractions } from 'app/features/panel/components/VizTypePicker/interactions';
import { getPluginPresets } from 'app/features/panel/presets/getPresets';
import { MIN_MULTI_COLUMN_SIZE } from 'app/features/panel/suggestions/constants';
import { hasData } from 'app/features/panel/suggestions/utils';

export interface PanelStylesSectionProps {
  panel: VizPanel;
  onApplyPreset: (preset: PanelPluginVisualizationSuggestion, prevFieldConfig: FieldConfigSource) => void;
}

function presetModifiesThresholds(preset: PanelPluginVisualizationSuggestion): boolean {
  return Boolean(preset.fieldConfig?.defaults?.thresholds);
}

export function PanelStylesSection({ panel, onApplyPreset }: PanelStylesSectionProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);
  const { data } = sceneGraph.getData(panel).useState();

  const plugin = panel.getPlugin();
  const presets = useMemo(() => (plugin ? getPluginPresets(plugin, data?.series) : null), [plugin, data]);

  const handlePresetApply = useCallback(
    (preset: PanelPluginVisualizationSuggestion, index: number) => {
      VizSuggestionsInteractions.presetApplied({
        pluginId: preset.pluginId,
        presetName: preset.name,
        presetIndex: index + 1,
      });
      setSelectedPreset(preset.hash);
      if (preset.fieldConfig || preset.options) {
        onApplyPreset(preset, panel.state.fieldConfig);
      }
    },
    [onApplyPreset, panel]
  );

  const getThresholdBadge = (preset: PanelPluginVisualizationSuggestion) => {
    if (!presetModifiesThresholds(preset)) {
      return null;
    }
    return (
      <Tooltip
        content={t('dashboard-scene.panel-styles.threshold-badge-tooltip', 'This preset will modify thresholds')}
      >
        <div
          {...stylex.props(styles.thresholdBadge)}
          aria-label={t('dashboard-scene.panel-styles.threshold-badge-tooltip', 'This preset will modify thresholds')}
        >
          <Icon name="sliders-v-alt" size="xs" />
        </div>
      </Tooltip>
    );
  };

  if (!presets || presets.length === 0 || !data || !hasData(data)) {
    return null;
  }

  return (
    <OptionsPaneCategory
      id="panel-styles"
      title={t('dashboard-scene.panel-styles.title', 'Panel styles')}
      isOpenDefault={true}
      renderTitle={() => (
        <Stack direction="row" alignItems="center" gap={1}>
          <Trans i18nKey="dashboard-scene.panel-styles.title">Panel styles</Trans>
          <FeatureBadge featureState={FeatureState.new} />
        </Stack>
      )}
    >
      <VisualizationCardGrid
        items={presets}
        data={data}
        onItemClick={(preset, index) => handlePresetApply(preset, index)}
        getItemKey={(preset) => preset.hash}
        selectedKey={selectedPreset}
        minColumnWidth={120}
        maxCardWidth={MIN_MULTI_COLUMN_SIZE}
        getBadge={getThresholdBadge}
      />
    </OptionsPaneCategory>
  );
}

const styles = stylex.create({
  thresholdBadge: {
    position: 'absolute',
    top: spacing['--gf-spacing-x1'],
    right: spacing['--gf-spacing-x0-5'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacing['--gf-spacing-x2-5'],
    height: spacing['--gf-spacing-x2-5'],
    borderRadius: shape['--gf-shape-radius-circle'],
    backgroundColor: colors['--gf-colors-background-canvas'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-medium'],
    color: colors['--gf-colors-text-secondary'],
    cursor: 'default',
    zIndex: 1,
  },
});
