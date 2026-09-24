import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { useCallback, useEffect, useMemo } from 'react';

import { VariableHide } from '@grafana/data';
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
import { useElementSelection } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { dashboardEditActions } from '../edit-pane/shared';
import { filterSectionRepeatLocalVariables } from '../variables/utils';

import { ControlActionsPopover, ControlEditActions } from './ControlActionsPopover';
import { DashboardScene } from './DashboardScene';
import { AddVariableButton } from './VariableControlsAddButton';
import { VariableDescriptionTooltip } from './VariableDescriptionTooltip';

import './VariableControls.css';

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
          {...mergeStylexProps(stylex.props(styles.switchMenuContainer), {
            className: selectionClassName(isSelected, isSelectable),
          })}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <div className="gf-variable-switch-control">
            <variable.Component model={variable} />
          </div>
          <VariableLabel
            variable={variable}
            layout={'vertical'}
            className={clsx(stylex.props(isSelectable && styles.labelSelectable).className, 'gf-variable-switch-label')}
          />
        </div>
      </ControlActionsPopover>
    );
  }

  if (inMenu) {
    return (
      <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
        <div
          {...mergeStylexProps(stylex.props(styles.verticalContainer), {
            className: selectionClassName(isSelected, isSelectable),
          })}
          data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
        >
          <VariableLabel
            variable={variable}
            layout={'vertical'}
            className={stylex.props(isSelectable && styles.labelSelectable).className}
          />
          <variable.Component model={variable} />
        </div>
      </ControlActionsPopover>
    );
  }

  return (
    <ControlActionsPopover isEditable={Boolean(isSelectable)} content={editActions}>
      <div
        {...mergeStylexProps(stylex.props(styles.container), {
          className: clsx('gf-variable-controls-item', selectionClassName(isSelected, isSelectable)),
        })}
        data-testid={selectors.pages.Dashboard.SubMenu.submenuItem}
      >
        <VariableLabel
          variable={variable}
          className={stylex.props(isSelectable && styles.labelSelectable, styles.label).className}
        />
        <variable.Component model={variable} />
      </div>
    </ControlActionsPopover>
  );
}

function selectionClassName(isSelected?: boolean, isSelectable?: boolean) {
  return clsx(
    isSelected && 'dashboard-selected-element',
    isSelectable && !isSelected && 'dashboard-selectable-element'
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
    <div {...stylex.props(styles.sectionVariables)}>
      {visibleVariables.map((variable) => (
        <VariableValueSelectWrapper key={variable.state.key} variable={variable} />
      ))}
    </div>
  );
}

// The switch control's scenes-rendered child and the ControlsLabel margins are styled in VariableControls.css.
const styles = stylex.create({
  sectionVariables: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    marginBottom: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  verticalContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing['--gf-spacing-x1'],
  },
  switchMenuContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
  },
  labelSelectable: {
    cursor: 'pointer',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
  },
});
