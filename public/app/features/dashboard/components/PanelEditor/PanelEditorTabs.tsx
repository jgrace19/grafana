import * as stylex from '@stylexjs/stylex';
import { memo, useCallback, useEffect } from 'react';
import { Subscription } from 'rxjs';

import { config, reportInteraction } from '@grafana/runtime';
import { Tab, TabContent, TabsBar, toIconName, useForceUpdate } from '@grafana/ui';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { PanelAlertTab } from 'app/features/alerting/unified/PanelAlertTab';
import { PanelAlertTabContent } from 'app/features/alerting/unified/PanelAlertTabContent';
import { PanelQueriesChangedEvent, PanelTransformationsChangedEvent } from 'app/types/events';

import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';
import { TransformationsEditor } from '../TransformationsEditor/TransformationsEditor';

import { PanelEditorQueries } from './PanelEditorQueries';
import { type PanelEditorTab, PanelEditorTabId } from './types';

interface PanelEditorTabsProps {
  panel: PanelModel;
  dashboard: DashboardModel;
  tabs: PanelEditorTab[];
  onChangeTab: (tab: PanelEditorTab) => void;
}

export const PanelEditorTabs = memo(({ panel, dashboard, tabs, onChangeTab }: PanelEditorTabsProps) => {
  const forceUpdate = useForceUpdate();

  const instrumentedOnChangeTab = useCallback(
    (tab: PanelEditorTab) => {
      let eventName = 'transformations_redesign_panel_editor_tabs_changed';

      if (!tab.active) {
        reportInteraction(eventName, { tab_id: tab.id });
      }

      onChangeTab(tab);
    },
    [onChangeTab]
  );

  useEffect(() => {
    const eventSubs = new Subscription();
    eventSubs.add(panel.events.subscribe(PanelQueriesChangedEvent, forceUpdate));
    eventSubs.add(panel.events.subscribe(PanelTransformationsChangedEvent, forceUpdate));
    return () => eventSubs.unsubscribe();
  }, [panel, dashboard, forceUpdate]);

  const activeTab = tabs.find((item) => item.active)!;

  if (tabs.length === 0) {
    return null;
  }

  const alertingEnabled = config.unifiedAlertingEnabled;

  return (
    <div {...stylex.props(styles.wrapper)}>
      <TabsBar className={stylex.props(styles.tabBar).className} hideBorder>
        {tabs.map((tab) => {
          if (tab.id === PanelEditorTabId.Alert && alertingEnabled) {
            return (
              <PanelAlertTab
                key={tab.id}
                label={tab.text}
                active={tab.active}
                onChangeTab={() => onChangeTab(tab)}
                icon={toIconName(tab.icon)}
                panel={panel}
                dashboard={dashboard}
              />
            );
          }
          return (
            <Tab
              key={tab.id}
              label={tab.text}
              active={tab.active}
              onChangeTab={() => instrumentedOnChangeTab(tab)}
              icon={toIconName(tab.icon)}
              counter={getCounter(panel, tab)}
            />
          );
        })}
      </TabsBar>
      <TabContent className={stylex.props(styles.tabContent).className}>
        {activeTab.id === PanelEditorTabId.Query && <PanelEditorQueries panel={panel} queries={panel.targets} />}
        {activeTab.id === PanelEditorTabId.Alert && <PanelAlertTabContent panel={panel} dashboard={dashboard} />}
        {activeTab.id === PanelEditorTabId.Transform && <TransformationsEditor panel={panel} />}
      </TabContent>
    </div>
  );
});

PanelEditorTabs.displayName = 'PanelEditorTabs';

function getCounter(panel: PanelModel, tab: PanelEditorTab) {
  switch (tab.id) {
    case PanelEditorTabId.Query:
      return panel.targets.length;
    case PanelEditorTabId.Alert:
      return panel.alert ? 1 : 0;
    case PanelEditorTabId.Transform:
      const transformations = panel.getTransformations() ?? [];
      return transformations.length;
  }

  return null;
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  tabBar: {
    paddingLeft: spacing['--gf-spacing-x2'],
  },
  // TabContent's own Emotion background is the same colour, so its winning the cascade changes nothing.
  tabContent: {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    minHeight: 0,
    backgroundColor: colors['--gf-colors-background-primary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-panel-border-color'],
    borderLeftStyle: 'none',
    borderBottomStyle: 'none',
    borderTopRightRadius: `calc(${shape['--gf-shape-radius-default']} * 1.5)`,
  },
});
