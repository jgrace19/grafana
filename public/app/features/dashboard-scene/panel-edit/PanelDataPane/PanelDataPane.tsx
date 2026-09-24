import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { panelDataPaneStyles } from './PanelDataPane.stylex';
import { useBooleanFlagValue } from '@openfeature/react-sdk';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import {
  type SceneComponentProps,
  SceneObjectBase,
  type SceneObjectRef,
  type SceneObjectState,
  SceneObjectUrlSyncConfig,
  type SceneObjectUrlValues,
  type VizPanel,
} from '@grafana/scenes';
import {Button, Container, ScrollContainer, TabContent, TabsBar} from '@grafana/ui';
import { getConfig } from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import { getRulesPermissions } from 'app/features/alerting/unified/utils/access-control';
import { GRAFANA_RULES_SOURCE_NAME } from 'app/features/alerting/unified/utils/datasource';

import { type PanelDataPaneTab, type PanelEditorInterface, TabId } from './types';

function isPanelEditor(obj: object): obj is PanelEditorInterface {
  return 'onToggleQueryEditorVersion' in obj && typeof obj.onToggleQueryEditorVersion === 'function';
}

const VALID_TAB_IDS: Set<string> = new Set(Object.values(TabId));

function isValidTabId(value: string): value is TabId {
  return VALID_TAB_IDS.has(value);
}

export interface PanelDataPaneState extends SceneObjectState {
  tabs: PanelDataPaneTab[];
  tab: TabId;
  panelRef: SceneObjectRef<VizPanel>;
}

export class PanelDataPane extends SceneObjectBase<PanelDataPaneState> {
  static Component = PanelDataPaneRendered;
  protected _urlSync = new SceneObjectUrlSyncConfig(this, { keys: ['tab'] });

  public onChangeTab = (tab: PanelDataPaneTab) => {
    this.setState({ tab: tab.tabId });
  };

  public onTryNewEditor = () => {
    if (this.parent && isPanelEditor(this.parent)) {
      this.parent.onToggleQueryEditorVersion();
    }
  };

  public getUrlState() {
    return { tab: this.state.tab };
  }

  public updateFromUrl(values: SceneObjectUrlValues) {
    if (!values.tab) {
      return;
    }
    if (typeof values.tab === 'string' && isValidTabId(values.tab)) {
      this.setState({ tab: values.tab });
    }
  }
}

function PanelDataPaneRendered({ model }: SceneComponentProps<PanelDataPane>) {
  const { tab, tabs } = model.useState();

  const showTryNewEditor = useBooleanFlagValue('queryEditorNext', false);

  if (!tabs || !tabs.length) {
    return;
  }

  const currentTab = tabs.find((t) => t.tabId === tab);

  return (
    <div {...stylex.props(panelDataPaneStyles.dataPane)} data-testid={selectors.components.PanelEditor.DataPane.content}>
      <TabsBar hideBorder {...stylex.props(panelDataPaneStyles.tabsBar)}>
        {tabs.map((t) => t.renderTab({ active: t.tabId === tab, onChangeTab: () => model.onChangeTab(t) }))}
        {showTryNewEditor && (
          <div {...stylex.props(panelDataPaneStyles.tryNewEditorWrapper)}>
            <Button
              size="sm"
              fill="text"
              icon="flask"
              variant="primary"
              onClick={model.onTryNewEditor}
              tooltip={t('panel-data-pane.try-new-editor.tooltip', 'Switch to the new query editor experience')}
            >
              {t('panel-data-pane.try-new-editor.label', 'Try the new editor')}
            </Button>
          </div>
        )}
      </TabsBar>
      <div {...stylex.props(panelDataPaneStyles.tabBorder)}>
        <ScrollContainer>
          <TabContent {...stylex.props(panelDataPaneStyles.tabContent)}>
            <Container>{currentTab && <currentTab.Component model={currentTab} />}</Container>
          </TabContent>
        </ScrollContainer>
      </div>
    </div>
  );
}

export function shouldShowAlertingTab(pluginId: string) {
  const { unifiedAlertingEnabled = false } = getConfig();
  const hasRuleReadPermissions = contextSrv.hasPermission(getRulesPermissions(GRAFANA_RULES_SOURCE_NAME).read);
  const isAlertingAvailable = unifiedAlertingEnabled && hasRuleReadPermissions;
  if (!isAlertingAvailable) {
    return false;
  }

  const isGraph = pluginId === 'graph';
  const isTimeseries = pluginId === 'timeseries';

  return isGraph || isTimeseries;
}


