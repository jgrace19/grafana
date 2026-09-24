import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardControlsMenuStyles } from './DashboardControlsMenu.stylex';

import { config } from '@grafana/runtime';
import { type SceneDataLayerProvider, type SceneVariable } from '@grafana/scenes';
import { type DashboardLink } from '@grafana/schema';
import {Menu, ScrollContainer} from '@grafana/ui';

import { sortDefaultLinksFirst, sortDefaultVarsFirst } from '../../utils/dashboardControls';
import { DataLayerControlEditWrapper } from '../DashboardDataLayerControls';
import { DashboardLinkRenderer } from '../DashboardLinkRenderer';
import { type DashboardScene } from '../DashboardScene';
import { VariableValueSelectWrapper } from '../VariableControls';

interface DashboardControlsMenuProps {
  variables: SceneVariable[];
  links: DashboardLink[];
  annotations: SceneDataLayerProvider[];
  dashboardUID?: string;
  isEditing?: boolean;
  dashboard: DashboardScene;
}

export function DashboardControlsMenu({
  variables,
  links,
  annotations,
  dashboardUID,
  isEditing,
  dashboard,
}: DashboardControlsMenuProps) {
  const isEditingNewLayouts = isEditing && config.featureToggles.dashboardNewLayouts;
  const fullLinks = dashboard.state.links ?? [];


  return (
    <ScrollContainer
      minWidth={32}
      borderColor={'weak'}
      borderStyle={'solid'}
      boxShadow={'z3'}
      borderRadius={'default'}
      backgroundColor={'primary'}
      maxHeight={'calc(100vh - 80px)'}
      overflowX={'hidden'}
      onClick={(e) => {
        // Normally, clicking the overlay closes the dropdown.
        // We stop event propagation here to keep it open while users interact with variable controls.
        e.stopPropagation();
      }}
    >
      <div {...stylex.props(dashboardControlsMenuStyles.items)}>
        {/* Variables */}
        {sortDefaultVarsFirst(variables).map((variable) => (
          <div key={variable.state.key}>
            <VariableValueSelectWrapper variable={variable} inMenu isEditingNewLayouts={isEditingNewLayouts} />
          </div>
        ))}

        {/* Annotation layers */}
        {annotations.length > 0 &&
          annotations.map((layer) => (
            <div key={layer.state.key}>
              <DataLayerControlEditWrapper layer={layer} inMenu />
            </div>
          ))}

        {/* Links */}
        {links.length > 0 && dashboardUID && (
          <>
            {(variables.length > 0 || annotations.length > 0) && <MenuDivider />}
            {sortDefaultLinksFirst(links).map((link, index) => (
              <div key={`${link.title}-${index}`}>
                <DashboardLinkRenderer
                  link={link}
                  dashboardUID={dashboardUID}
                  inMenu
                  linkIndex={fullLinks.indexOf(link)}
                  dashboard={dashboard}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </ScrollContainer>
  );
}

function MenuDivider() {


  return (
    <div {...stylex.props(dashboardControlsMenuStyles.divider)}>
      <Menu.Divider />
    </div>
  );
}

