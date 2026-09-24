import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type VizPanel, sceneGraph } from '@grafana/scenes';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type DashboardScene } from './DashboardScene';
import { SoloPanelContextProvider } from './SoloPanelContext';

export interface Props {
  dashboard: DashboardScene;
  panelSearch?: string;
  panelsPerRow?: number;
}

const panelsPerRowCSSVar = '--panels-per-row';

export function PanelSearchLayout({ dashboard, panelSearch = '', panelsPerRow }: Props) {
  const { body } = dashboard.state;
  const soloPanelContext = useMemo(() => new SoloPanelContextValueWithSearchStringFilter(panelSearch), [panelSearch]);

  return (
    <div
      {...stylex.props(styles.grid, panelsPerRow !== undefined && styles.perRow)}
      style={{ [panelsPerRowCSSVar]: panelsPerRow } as Record<string, number>}
    >
      <SoloPanelContextProvider value={soloPanelContext} singleMatch={false} dashboard={dashboard}>
        <body.Component model={body} />
      </SoloPanelContextProvider>
    </div>
  );
}

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: spacing['--gf-spacing-x1'],
    gridAutoRows: '320px',
  },
  perRow: {
    gridTemplateColumns: `repeat(var(${panelsPerRowCSSVar}, 3), 1fr)`,
  },
});

export class SoloPanelContextValueWithSearchStringFilter {
  public matchFound = false;

  public constructor(private searchQuery: string) {}

  public matches(panel: VizPanel): boolean {
    const interpolatedSearchString = sceneGraph.interpolate(panel, this.searchQuery).toLowerCase();
    const interpolatedTitle = panel.interpolate(panel.state.title, undefined, 'text').toLowerCase();

    const match = interpolatedTitle.includes(interpolatedSearchString);
    if (match) {
      this.matchFound = true;
    }

    return match;
  }
}
