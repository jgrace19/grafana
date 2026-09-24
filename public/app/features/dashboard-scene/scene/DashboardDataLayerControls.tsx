import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo } from 'react';

import { type SceneDataLayerProvider, sceneGraph } from '@grafana/scenes';
import { useElementSelection } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { annotationEditActions } from '../settings/annotations/actions';

import { ControlActionsPopover, ControlEditActions } from './ControlActionsPopover';
import { DashboardAnnotationsDataLayer } from './DashboardAnnotationsDataLayer';
import { DashboardDataLayerSet, isDashboardDataLayerSet, isDashboardDataLayerSetState } from './DashboardDataLayerSet';
import { DashboardScene } from './DashboardScene';
import { DataLayerControl } from './DataLayerControl';

type DashboardDataLayerControlsProps = {
  dashboard: DashboardScene;
  inMenu?: boolean;
};

export function DashboardDataLayerControls({ dashboard, inMenu }: DashboardDataLayerControlsProps) {
  // We render controls here (instead of the data layer set's default renderer) to
  // respect per-layer `placement` and edit-mode visibility rules.
  const dataLayerSet = sceneGraph.getData(dashboard);
  const state = dataLayerSet.useState();

  const visibleLayers = useMemo(() => {
    if (!isDashboardDataLayerSetState(state) || !isDashboardDataLayerSet(dataLayerSet)) {
      return [];
    }
    return state.annotationLayers.filter((layer) => !layer.state.isHidden && layer.state.placement === undefined);
  }, [state, dataLayerSet]);

  return useMemo(
    () =>
      visibleLayers.map((layer) => (
        <DataLayerControlEditWrapper key={layer.state.key!} layer={layer} inMenu={inMenu} />
      )),
    [inMenu, visibleLayers]
  );
}

export function DataLayerControlEditWrapper({ layer, inMenu }: { layer: SceneDataLayerProvider; inMenu?: boolean }) {
  const { isSelectable } = useElementSelection(layer.state.key);

  const onClickEditLayer = useCallback(() => {
    const dashboard = sceneGraph.getAncestor(layer, DashboardScene);
    dashboard.state.editPane.selectObject(layer);
  }, [layer]);

  const onClickDeleteLayer = useCallback(() => {
    const dataLayerSet = layer.parent;

    if (dataLayerSet instanceof DashboardDataLayerSet && layer instanceof DashboardAnnotationsDataLayer) {
      annotationEditActions.removeAnnotation({
        source: dataLayerSet,
        removedObject: layer,
      });
    }
  }, [layer]);

  const editActions = useMemo(
    () => <ControlEditActions onClickEdit={onClickEditLayer} onClickDelete={onClickDeleteLayer} />,
    [onClickEditLayer, onClickDeleteLayer]
  );

  return (
    <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
      <div {...stylex.props(styles.container)}>
        <DataLayerControl layer={layer} inMenu={inMenu} />
      </div>
    </ControlActionsPopover>
  );
}

const styles = stylex.create({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    marginBottom: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
  },
});
