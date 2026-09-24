import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { t } from '@grafana/i18n';
import {
  type SceneComponentProps,
  sceneGraph,
  SceneObjectBase,
  type SceneObjectState,
  sceneUtils,
} from '@grafana/scenes';
import { Drawer } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { getDashboardSceneFor } from '../../utils/utils';
import { type DashboardScene } from '../DashboardScene';

import { DashboardFiltersOverview } from './DashboardFiltersOverview';
import { DashboardFiltersOverviewSearch } from './DashboardFiltersOverviewSearch';

interface DashboardFiltersOverviewDrawerState extends SceneObjectState {}

export class DashboardFiltersOverviewDrawer extends SceneObjectBase<DashboardFiltersOverviewDrawerState> {
  static Component = DashboardFiltersOverviewDrawerRenderer;

  private _dashboard?: DashboardScene;

  constructor(state: DashboardFiltersOverviewDrawerState) {
    super(state);

    this.addActivationHandler(() => {
      this._dashboard = getDashboardSceneFor(this);
    });
  }

  public getDashboard() {
    return this._dashboard;
  }

  onClose = () => {
    this._dashboard?.closeModal();
  };
}

function DashboardFiltersOverviewDrawerRenderer({ model }: SceneComponentProps<DashboardFiltersOverviewDrawer>) {
  const [searchQuery, setSearchQuery] = useState('');
  const dashboard = model.getDashboard();

  if (!dashboard) {
    return null;
  }

  const { variables } = sceneGraph.getVariables(dashboard).useState();
  const adHocVar = variables.find((v) => sceneUtils.isAdHocVariable(v));
  const groupByVar = variables.find((v) => sceneUtils.isGroupByVariable(v));

  return (
    <Drawer
      title={
        <div {...stylex.props(styles.drawerHeader)}>
          <span {...stylex.props(styles.drawerTitle)}>{t('dashboard.filters-overview.title', 'Edit filters')}</span>
          <DashboardFiltersOverviewSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      }
      onClose={model.onClose}
      size="sm"
      scrollableContent={false}
    >
      <DashboardFiltersOverview
        adhocFilters={adHocVar}
        groupByVariable={groupByVar}
        onClose={model.onClose}
        searchQuery={searchQuery}
      />
    </Drawer>
  );
}

const styles = stylex.create({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    width: '100%',
    overflow: 'hidden',
    minWidth: 0,
    paddingRight: spacing['--gf-spacing-x2'],
  },
  drawerTitle: {
    flex: '1',
    minWidth: 0,
    overflow: 'hidden',
  },
});
