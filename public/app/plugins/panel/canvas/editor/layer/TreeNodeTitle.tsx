import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { LayerName } from 'app/core/components/Layers/LayerName';
import { type ElementState } from 'app/features/canvas/runtime/element';

import { LayerActionID } from '../../types';
import { type TreeViewEditorProps } from '../element/elementEditor';

import './TreeNodeTitle.css';
import { type TreeElement } from './tree';

interface Props {
  settings: TreeViewEditorProps;
  nodeData: TreeElement;
  setAllowSelection: (allow: boolean) => void;
}

export const TreeNodeTitle = ({ settings, nodeData, setAllowSelection }: Props) => {
  const element = nodeData.dataRef;
  const name = nodeData.dataRef.getName();

  const layer = settings.layer;

  const getScene = () => {
    if (!settings?.layer) {
      return;
    }

    return settings.layer.scene;
  };

  const onDelete = (element: ElementState) => {
    const elLayer = element.parent ?? layer;
    elLayer.doAction(LayerActionID.Delete, element);
    setAllowSelection(false);
  };

  const onDuplicate = (element: ElementState) => {
    const elLayer = element.parent ?? layer;
    elLayer.doAction(LayerActionID.Duplicate, element);
    setAllowSelection(false);
  };

  const onNameChange = (element: ElementState, name: string) => {
    element.onChange({ ...element.options, name });
  };

  const verifyLayerNameUniqueness = (nameToVerify: string) => {
    const scene = getScene();

    return Boolean(scene?.canRename(nameToVerify));
  };

  const getLayerInfo = (element: ElementState) => {
    return element.options.type;
  };

  return (
    <>
      <LayerName
        name={name}
        onChange={(v) => onNameChange(element, v)}
        verifyLayerNameUniqueness={verifyLayerNameUniqueness ?? undefined}
      />

      <div {...stylex.props(styles.textWrapper)}>&nbsp; {getLayerInfo(element)}</div>

      {!nodeData.children && (
        <div {...stylex.props(styles.actionButtonsWrapper)}>
          <IconButton
            name="copy"
            title={t('canvas.tree-node-title.title-duplicate', 'Duplicate')}
            className="gf-canvas-tree-action-icon"
            onClick={() => onDuplicate(element)}
            tooltip={t('canvas.tree-node-title.tooltip-duplicate', 'Duplicate')}
          />
          <IconButton
            name="trash-alt"
            title={t('canvas.tree-node-title.title-remove', 'Remove')}
            className="gf-canvas-tree-action-icon"
            onClick={() => onDelete(element)}
            tooltip={t('canvas.tree-node-title.tooltip-remove', 'Remove')}
          />
        </div>
      )}
    </>
  );
};

const styles = stylex.create({
  actionButtonsWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: spacing['--gf-spacing-x1'],
  },
});
