import * as stylex from '@stylexjs/stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { InlineSwitch } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.container)}>
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

const styles = stylex.create({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    marginBottom: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    gap: spacing['--gf-spacing-x1'],
  },
});
