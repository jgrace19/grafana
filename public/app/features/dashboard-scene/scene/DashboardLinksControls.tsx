import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardLinksControlsStyles } from './DashboardLinksControls.stylex';

import { sceneGraph } from '@grafana/scenes';
import { type DashboardLink } from '@grafana/schema';

import { DashboardLinkRenderer } from './DashboardLinkRenderer';
import { type DashboardScene } from './DashboardScene';

export interface Props {
  links: DashboardLink[];
  dashboard: DashboardScene;
}

export function DashboardLinksControls({ links, dashboard }: Props) {
  sceneGraph.getTimeRange(dashboard).useState();
  const { uid } = dashboard.useState();

  const linksToDisplay = excludeControlMenuLinks(links);

  if (!uid || linksToDisplay.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(dashboardLinksControlsStyles.linksContainer)}>
      {linksToDisplay.map((link: DashboardLink, index: number) => (
        <DashboardLinkRenderer
          link={link}
          dashboardUID={uid}
          key={`${link.title}-$${index}`}
          linkIndex={links.indexOf(link)}
          dashboard={dashboard}
        />
      ))}
    </div>
  );
}

function excludeControlMenuLinks(links: DashboardLink[]): DashboardLink[] {
  if (!links || links.length === 0) {
    return [];
  }

  return links.filter((link) => link.placement === undefined);
}


