import * as stylex from '@stylexjs/stylex';
import { quickPositioningStyles } from './QuickPositioning.stylex';

import { t } from '@grafana/i18n';
import { IconButton } from '@grafana/ui';
import { type ElementState } from 'app/features/canvas/runtime/element';
import { QuickPlacement } from 'app/features/canvas/types';

import { HorizontalConstraint, VerticalConstraint, type Placement } from '../../panelcfg.gen';

import { type CanvasEditorOptions } from './elementEditor';

type Props = {
  onPositionChange: (value: number | undefined, placement: keyof Placement) => void;
  element: ElementState;
  settings: CanvasEditorOptions;
};

export const QuickPositioning = ({ onPositionChange, element, settings }: Props) => {

  const onQuickPositioningChange = (position: QuickPlacement) => {
    const defaultConstraint = { vertical: VerticalConstraint.Top, horizontal: HorizontalConstraint.Left };
    const originalConstraint = { ...element.options.constraint };

    element.options.constraint = defaultConstraint;
    element.setPlacementFromConstraint();

    switch (position) {
      case QuickPlacement.Top:
        onPositionChange(0, 'top');
        break;
      case QuickPlacement.Bottom:
        onPositionChange(getRightBottomPosition(element.options.placement?.height ?? 0, 'bottom'), 'top');
        break;
      case QuickPlacement.VerticalCenter:
        onPositionChange(getCenterPosition(element.options.placement?.height ?? 0, 'v'), 'top');
        break;
      case QuickPlacement.Left:
        onPositionChange(0, 'left');
        break;
      case QuickPlacement.Right:
        onPositionChange(getRightBottomPosition(element.options.placement?.width ?? 0, 'right'), 'left');
        break;
      case QuickPlacement.HorizontalCenter:
        onPositionChange(getCenterPosition(element.options.placement?.width ?? 0, 'h'), 'left');
        break;
    }

    element.options.constraint = originalConstraint;
    element.setPlacementFromConstraint();
  };

  // Basing this on scene will mean that center is based on root for the time being
  const getCenterPosition = (elementSize: number, align: 'h' | 'v') => {
    const sceneSize = align === 'h' ? settings.scene.width : settings.scene.height;

    return (sceneSize - elementSize) / 2;
  };

  const getRightBottomPosition = (elementSize: number, align: 'right' | 'bottom') => {
    const sceneSize = align === 'right' ? settings.scene.width : settings.scene.height;

    return sceneSize - elementSize;
  };

  return (
    <div {...stylex.props(quickPositioningStyles.buttonGroup)}>
      <IconButton
        name="horizontal-align-left"
        onClick={() => onQuickPositioningChange(QuickPlacement.Left)}
        {...stylex.props(quickPositioningStyles.button)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-left', 'Align left')}
      />
      <IconButton
        name="horizontal-align-center"
        onClick={() => onQuickPositioningChange(QuickPlacement.HorizontalCenter)}
        {...stylex.props(quickPositioningStyles.button)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-horizontal-centers', 'Align horizontal centers')}
      />
      <IconButton
        name="horizontal-align-right"
        onClick={() => onQuickPositioningChange(QuickPlacement.Right)}
        {...stylex.props(quickPositioningStyles.button)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-right', 'Align right')}
      />
      <IconButton
        name="vertical-align-top"
        onClick={() => onQuickPositioningChange(QuickPlacement.Top)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-top', 'Align top')}
      />
      <IconButton
        name="vertical-align-center"
        onClick={() => onQuickPositioningChange(QuickPlacement.VerticalCenter)}
        {...stylex.props(quickPositioningStyles.button)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-vertical-centers', 'Align vertical centers')}
      />
      <IconButton
        name="vertical-align-bottom"
        onClick={() => onQuickPositioningChange(QuickPlacement.Bottom)}
        {...stylex.props(quickPositioningStyles.button)}
        size="lg"
        tooltip={t('canvas.quick-positioning.tooltip-align-bottom', 'Align bottom')}
      />
    </div>
  );
};

