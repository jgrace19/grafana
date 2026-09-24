import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardControlsMenuButtonStyles } from './DashboardControlsMenuButton.stylex';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import {Dropdown, ToolbarButton} from '@grafana/ui';

import { type DashboardScene } from '../DashboardScene';

import { DashboardControlsMenu } from './DashboardControlsMenu';
import { useDashboardControls } from './utils';

export const DASHBOARD_CONTROLS_MENU_ARIA_LABEL = 'Dashboard controls menu';
export const DASHBOARD_CONTROLS_MENU_TITLE = 'Dashboard controls';

export function DashboardControlsButton({ dashboard }: { dashboard: DashboardScene }) {

  const { uid, isEditing } = dashboard.useState();
  const { variables, links, annotations } = useDashboardControls(dashboard);
  const dashboardControlsCount = variables.length + links.length + annotations.length;
  const hasDashboardControls = dashboardControlsCount > 0;

  if (!hasDashboardControls) {
    return null;
  }

  return (
    <Dropdown
      placement="bottom-start"
      overlay={
        <DashboardControlsMenu
          variables={variables}
          links={links}
          annotations={annotations}
          dashboardUID={uid}
          isEditing={isEditing}
          dashboard={dashboard}
        />
      }
    >
      <ToolbarButton
        aria-label={t('dashboard.controls.menu.aria-label', DASHBOARD_CONTROLS_MENU_ARIA_LABEL)}
        title={t('dashboard.controls.menu.title', DASHBOARD_CONTROLS_MENU_TITLE)}
        data-testid={selectors.pages.Dashboard.ControlsButton}
        icon="sliders-v-alt"
        iconSize="md"
        variant="canvas"
        {...stylex.props(dashboardControlsMenuButtonStyles.dropdownButton)}
      >
        + {dashboardControlsCount}
      </ToolbarButton>
    </Dropdown>
  );
}

