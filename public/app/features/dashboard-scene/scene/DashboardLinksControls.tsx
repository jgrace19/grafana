import * as stylex from '@stylexjs/stylex';

import { sceneGraph } from '@grafana/scenes';
import { type DashboardLink } from '@grafana/schema';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
    <div {...stylex.props(styles.linksContainer)}>
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

const styles = stylex.create({
  linksContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    flexWrap: 'wrap',
    // Match variable/annotation alignment in the controls row
    alignSelf: 'flex-start',
  },
});
