import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';

import { LoadingState } from '@grafana/data';
import { t } from '@grafana/i18n';
import { ControlsLabel, dataLayers, type SceneDataLayerProvider } from '@grafana/scenes';
import { useElementSelection } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import './DataLayerControl.css';

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
        {...mergeStylexProps(stylex.props(styles.menuContainer), {
          className: clsx(
            isSelected && 'dashboard-selected-element',
            isSelectable && !isSelected && 'dashboard-selectable-element'
          ),
        })}
      >
        <div {...mergeStylexProps(stylex.props(styles.controlWrapper), { className: 'gf-data-layer-control-wrapper' })}>
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
          className={clsx('gf-data-layer-menu-label', stylex.props(isSelectable && styles.labelSelectable).className)}
        />
      </div>
    );
  }

  return (
    <div
      {...mergeStylexProps(stylex.props(styles.container), {
        className: clsx(
          isSelected && 'dashboard-selected-element',
          isSelectable && !isSelected && 'dashboard-selectable-element'
        ),
      })}
    >
      <ControlsLabel
        htmlFor={isSelectable ? undefined : elementId}
        isLoading={showLoading}
        onCancel={() => layer.cancelQuery?.()}
        label={label}
        description={layer.state.description}
        error={layer.state.data?.errors?.[0].message}
        className={stylex.props(isSelectable && styles.labelSelectable).className}
      />
      <layer.Component model={layer} />
    </div>
  );
}

// The data layer's scenes-rendered child and the ControlsLabel margins are styled in DataLayerControl.css.
const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  menuContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
  },
  controlWrapper: {
    height: spacing['--gf-spacing-x2'],
  },
  labelSelectable: {
    cursor: 'pointer',
  },
});
