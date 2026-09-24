import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { variableControlsAddButtonStyles } from './VariableControlsAddButton.stylex';
import { useCallback } from 'react';

import { t } from '@grafana/i18n';
import {Button} from '@grafana/ui';

import { openAddVariablePane } from '../settings/variables/VariableTypeSelectionPane';
import { DashboardInteractions } from '../utils/interactions';

import { type DashboardScene } from './DashboardScene';

export function AddVariableButton({ dashboard }: { dashboard: DashboardScene }) {

  const { editview, editPanel, isEditing, viewPanel } = dashboard.useState();

  const handleClick = useCallback(() => {
    openAddVariablePane(dashboard);
    DashboardInteractions.addVariableButtonClicked({ source: 'variable_controls' });
  }, [dashboard]);

  // Hide the button if:
  // - the dashboard is not in edit mode
  // - the dashboard is in an edit view mode
  // - the dashboard is in a view panel mode
  // - the dashboard is in an edit panel mode
  if (!isEditing || !!editview || !!viewPanel || !!editPanel) {
    return null;
  }

  return (
    <div {...stylex.props(variableControlsAddButtonStyles.addButton)}>
      <div className="dashboard-canvas-add-button">
        <Button
          icon="plus"
          variant="secondary"
          fill="outline"
          size="md"
          onClick={handleClick}
          tooltip={t('dashboard-scene.variable-controls.add-variable', 'Add variable')}
          aria-label={t('dashboard-scene.variable-controls.add-variable', 'Add variable')}
        />
      </div>
    </div>
  );
}

