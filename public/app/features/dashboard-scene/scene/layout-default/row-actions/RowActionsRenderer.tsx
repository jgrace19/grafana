import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { t } from '@grafana/i18n';
import { type SceneComponentProps, VizPanel } from '@grafana/scenes';
import { Icon } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors } from '@grafana/ui/stylex/tokens.stylex';
import { SHARED_DASHBOARD_QUERY } from 'app/plugins/datasource/dashboard/constants';
import { MIXED_DATASOURCE_NAME } from 'app/plugins/datasource/mixed/MixedDataSource';

import { getQueryRunnerFor, useDashboardState } from '../../../utils/utils';
import { DashboardGridItem } from '../DashboardGridItem';
import { RowRepeaterBehavior } from '../RowRepeaterBehavior';

import { type RowActions } from './RowActions';
import { RowOptionsButton } from './RowOptionsButton';

import './RowActionsRenderer.css';

export function RowActionsRenderer({ model }: SceneComponentProps<RowActions>) {
  const row = model.getParent();
  const { title, children } = row.useState();
  const { meta, isEditing } = useDashboardState(model);

  const isUsingDashboardDS = useMemo(
    () =>
      children.some((gridItem) => {
        if (!(gridItem instanceof DashboardGridItem)) {
          return false;
        }

        if (gridItem.state.body instanceof VizPanel) {
          const runner = getQueryRunnerFor(gridItem.state.body);
          return (
            runner?.state.datasource?.uid === SHARED_DASHBOARD_QUERY ||
            (runner?.state.datasource?.uid === MIXED_DATASOURCE_NAME &&
              runner?.state.queries.some((query) => query.datasource?.uid === SHARED_DASHBOARD_QUERY))
          );
        }

        return false;
      }),
    [children]
  );

  const behaviour = row.state.$behaviors?.find((b) => b instanceof RowRepeaterBehavior);

  return (
    <>
      {meta.canEdit && isEditing && (
        <>
          <div {...mergeStylexProps(stylex.props(styles.rowActions), { className: 'gf-row-actions' })}>
            <RowOptionsButton
              title={title}
              repeat={behaviour instanceof RowRepeaterBehavior ? behaviour.state.variableName : undefined}
              parent={row}
              onUpdate={(title, repeat) => model.onUpdate(title, repeat)}
              isUsingDashboardDS={isUsingDashboardDS}
            />
            <button
              type="button"
              onClick={() => model.onDelete()}
              aria-label={t('dashboard.default-layout.row-actions.delete', 'Delete row')}
            >
              <Icon name="trash-alt" />
            </button>
          </div>
        </>
      )}
    </>
  );
}

// The action buttons, including the one RowOptionsButton renders, are styled by RowActionsRenderer.css.
const styles = stylex.create({
  rowActions: {
    color: colors['--gf-colors-text-secondary'],
    lineHeight: '27px',
  },
});
