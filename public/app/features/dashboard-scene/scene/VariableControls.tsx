import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableControlsStyles } from './VariableControls.stylex';
import { useCallback, useEffect, useMemo } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { config, reportInteraction } from '@grafana/runtime';
import {
  ControlsLabel,
  type ControlsLayout,
  sceneGraph,
  sceneUtils,
  type SceneVariable,
  type SceneVariables,
  SceneVariableSet,
  type SceneVariableState,
  SceneVariableValueChangedEvent,
  useSceneObjectState,
} from '@grafana/scenes';
import {useElementSelection} from '@grafana/ui';

import { dashboardEditActions } from '../edit-pane/shared';
import { filterSectionRepeatLocalVariables } from '../variables/utils';

import { ControlActionsPopover, ControlEditActions } from './ControlActionsPopover';
import { DashboardScene } from './DashboardScene';
import { AddVariableButton } from './VariableControlsAddButton';
import { VariableDescriptionTooltip } from './VariableDescriptionTooltip';

export function VariableControls({ dashboard }: { dashboard: DashboardScene }) {
  const { variables } = sceneGraph.getVariables(dashboard)!.useState();
  const { isEditing } = dashboard.useState();
  const isEditingNewLayouts = isEditing && config.featureToggles.dashboardNewLayouts;

  // Subscribe to variable value changes to track interactions
  useEffect(() => {
    const subscription = dashboard.subscribeToEvent(SceneVariableValueChangedEvent, () => {
      reportInteraction('grafana_dashboards_variable_changed');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dashboard]);

  const visibleVariables = variables.filter(
    (v: SceneVariable) =>
      v.state.hide !== VariableHide.inControlsMenu &&
      (v.state.hide !== VariableHide.hideVariable || v.UNSAFE_renderAsHidden)
  );

  return (
    <>
      {visibleVariables.length > 0 &&
        visibleVariables.map((variable) => (
          <VariableValueSelectWrapper
            key={variable.state.key}
            variable={variable}
            isEditingNewLayouts={isEditingNewLayouts}
          />
        ))}
      {config.featureToggles.dashboardNewLayouts ? <AddVariableButton dashboard={dashboard} /> : null}
    </>
  );
}

interface VariableSelectProps {
  variable: SceneVariable;
  inMenu?: boolean;
  isEditingNewLayouts?: boolean;
}

export function VariableValueSelectWrapper({ variable, inMenu, isEditingNewLayouts }: VariableSelectProps) {

  const state = useSceneObjectState<SceneVariableState>(variable, { shouldActivateOrKeepAlive: true });
  const { isSelected, isSelectable } = useElementSelection(variable.state.key);
  const isHidden = state.hide === VariableHide.hideVariable;

  const onClickEditVariable = useCallback(() => {
    const dashboard = sceneGraph.getAncestor(variable, DashboardScene);
    dashboard.state.editPane.selectObject(variable);
  }, [variable]);

  const onClickDeleteVariable = useCallback(() => {
    const set = variable.parent;
    if (set instanceof SceneVariableSet) {
      dashboardEditActions.removeVariable({ source: set, removedObject: variable });
    }
  }, [variable]);

  const editActions = useMemo(
    () => <ControlEditActions onClickEdit={onClickEditVariable} onClickDelete={onClickDeleteVariable} />,
    [onClickDeleteVariable, onClickEditVariable]
  );

  // UNSAFE_renderAsHidden variables (like ScopesVariable) should always render invisibly
  if (isHidden && variable.UNSAFE_renderAsHidden) {
    return <variable.Component model={variable} />;
  }

  if (isHidden && !isEditingNewLayouts) {
    return null;
  }

  // For switch variables in menu, we want to show the switch on the left and the label on the right
  if (inMenu && sceneUtils.isSwitchVariable(variable)) {
    return (
      <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
        <div
          className={cx(
            variableControlsStyles.switchMenuContainer,
            isSelected && 'dashboard-selected-element',
            isSelectable && !isSelected && 'dashboard-selectable-element'
          )}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <div {...stylex.props(variableControlsStyles.switchControl)}>
            <variable.Component model={variable} />
          </div>
          <VariableLabel
            variable={variable}
            layout={'vertical'}
            {...stylex.props(variableControlsStyles.switchLabel, isSelectable && variableControlsStyles.labelSelectable)}
          />
        </div>
      </ControlActionsPopover>
    );
  }

  if (inMenu) {
    return (
      <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
        <div
          className={cx(
            variableControlsStyles.verticalContainer,
            isSelected && 'dashboard-selected-element',
            isSelectable && !isSelected && 'dashboard-selectable-element'
          )}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <VariableLabel
            variable={variable}
            layout={'vertical'}
            className={cx(isSelectable && variableControlsStyles.labelSelectable)}
          />
          <variable.Component model={variable} />
        </div>
      </ControlActionsPopover>
    );
  }

  return (
    <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
      <div
        className={cx(
          variableControlsStyles.container,
          isSelected && 'dashboard-selected-element',
          isSelectable && !isSelected && 'dashboard-selectable-element'
        )}
        data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
      >
        <VariableLabel variable={variable} {...stylex.props(variableControlsStyles.label, isSelectable && variableControlsStyles.labelSelectable)} />
        <variable.Component model={variable} />
      </div>
    </ControlActionsPopover>
  );
}

function VariableLabel({
  variable,
  className,
  layout,
}: {
  variable: SceneVariable;
  className?: string;
  layout?: ControlsLayout;
}) {
  const { state } = variable;
  const elementId = `var-${state.key}`;

  if (variable.state.hide === VariableHide.hideLabel) {
    return null;
  }

  const labelOrName = state.label || state.name;
  const controlsLayout = layout ?? 'horizontal';
  const descriptionSuffix =
    state.description != null && state.description !== '' ? (
      <VariableDescriptionTooltip
        description={state.description}
        placement={controlsLayout === 'vertical' ? 'top' : 'bottom'}
      />
    ) : undefined;

  return (
    <ControlsLabel
      htmlFor={elementId}
      isLoading={state.loading}
      onCancel={() => variable.onCancel?.()}
      label={labelOrName}
      error={state.error}
      layout={controlsLayout}
      description={undefined}
      suffix={descriptionSuffix}
      className={className}
    />
  );
}

export function SectionVariableControls({ variableSet }: { variableSet: SceneVariables }) {
  const { variables } = variableSet.useState();


  const visibleVariables = filterSectionRepeatLocalVariables(variables, variableSet).filter(
    (v) => v.state.hide !== VariableHide.hideVariable
  );

  if (visibleVariables.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(variableControlsStyles.sectionVariables)}>
      {visibleVariables.map((variable) => (
        <VariableValueSelectWrapper key={variable.state.key} variable={variable} />
      ))}
    </div>
  );
}

