import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelEditControlsStyles } from './PanelEditControls.stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import {InlineSwitch} from '@grafana/ui';

import { type PanelEditor } from './PanelEditor';

export interface Props {
  panelEditor: PanelEditor;
}

export function PanelEditControls({ panelEditor }: Props) {
  const { tableView, dataPane } = panelEditor.useState();


  if (!dataPane) {
    return null;
  }

  return (
    <div {...stylex.props(panelEditControlsStyles.container)}>
      <InlineSwitch
        label={t('dashboard-scene.panel-edit-controls.table-view-label-table-view', 'Table view')}
        showLabel={true}
        id="table-view"
        value={tableView ? true : false}
        onClick={panelEditor.onToggleTableView}
        aria-label={t('dashboard-scene.panel-edit-controls.table-view-aria-label-toggletableview', 'Toggle table view')}
        data-testid={selectors.components.PanelEditor.toggleTableView}
      />
    </div>
  );
}


