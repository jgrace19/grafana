import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dataLayerControlStyles } from './DataLayerControl.stylex';

import { t } from '@grafana/i18n';
import { ControlsLabel, dataLayers, type SceneDataLayerProvider } from '@grafana/scenes';
import {useElementSelection} from '@grafana/ui';

export type Props = {
  layer: SceneDataLayerProvider;
  inMenu?: boolean;
};

// Renders the controls for a single data layer
export function DataLayerControl({ layer, inMenu }: Props) {
  const elementId = `data-layer-${layer.state.key}`;
  const { data } = layer.useState();
  const { isSelected, isSelectable } = useElementSelection(layer.state.key);
  const showLoading = Boolean(data && data.state === LoadingState.Loading);


  const label: string =
    layer instanceof dataLayers.AnnotationsDataLayer && Boolean(layer.state.query.builtIn)
      ? t('dashboard-scene.annotation-settings-list.built-in', '{{annoName}} (Built-in)', {
          annoName: layer.state.name,
          interpolation: { escapeValue: false },
        })
      : layer.state.name;

  if (inMenu) {
    return (
      <div
        className={cx(
          dataLayerControlStyles.menuContainer,
          isSelected && 'dashboard-selected-element',
          isSelectable && !isSelected && 'dashboard-selectable-element'
        )}
      >
        <div {...stylex.props(dataLayerControlStyles.controlWrapper)}>
          <layer.Component model={layer} />
        </div>
        <ControlsLabel
          htmlFor={isSelectable ? undefined : elementId}
          isLoading={showLoading}
          onCancel={() => layer.cancelQuery?.()}
          label={label}
          description={layer.state.description}
          error={layer.state.data?.errors?.[0].message}
          layout={'vertical'}
          {...stylex.props(dataLayerControlStyles.menuLabel, isSelectable && dataLayerControlStyles.labelSelectable)}
        />
      </div>
    );
  }

  return (
    <div
      className={cx(
        dataLayerControlStyles.container,
        isSelected && 'dashboard-selected-element',
        isSelectable && !isSelected && 'dashboard-selectable-element'
      )}
    >
      <ControlsLabel
        htmlFor={isSelectable ? undefined : elementId}
        isLoading={showLoading}
        onCancel={() => layer.cancelQuery?.()}
        label={label}
        description={layer.state.description}
        error={layer.state.data?.errors?.[0].message}
        className={cx(isSelectable && dataLayerControlStyles.labelSelectable)}
      />
      <layer.Component model={layer} />
    </div>
  );
}

