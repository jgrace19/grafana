import * as stylex from '@stylexjs/stylex';
import { panelSearchLayoutStyles } from './PanelSearchLayout.stylex';
import { useMemo } from 'react';

import { type VizPanel, sceneGraph } from '@grafana/scenes';

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
      {...stylex.props(
        panelSearchLayoutStyles.grid,
        panelsPerRow !== undefined && panelSearchLayoutStyles.perRow
      )}
      style={{ [panelsPerRowCSSVar]: panelsPerRow } as Record<string, number>}
    >
      <SoloPanelContextProvider value={soloPanelContext} singleMatch={false} dashboard={dashboard}>
        <body.Component model={body} />
      </SoloPanelContextProvider>
    </div>
  );
}

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
