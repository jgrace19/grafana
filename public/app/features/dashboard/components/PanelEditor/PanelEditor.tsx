import { css } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Subscription } from 'rxjs';

import {
  type FieldConfigSource,
  type GrafanaTheme2,
  type NavModel,
  type NavModelItem,
  PageLayoutType,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { locationService } from '@grafana/runtime';
import {
  Button,
  InlineSwitch,
  ModalsController,
  RadioButtonGroup,
  stylesFactory,
  ToolbarButton,
  ToolbarButtonRow,
  useStyles2,
  Stack,
} from '@grafana/ui';
import { appEvents } from 'app/core/app_events';
import { AppChromeUpdate } from 'app/core/components/AppChrome/AppChromeUpdate';
import { Page } from 'app/core/components/Page/Page';
import { SplitPaneWrapper } from 'app/core/components/SplitPaneWrapper/SplitPaneWrapper';
import { notifyApp } from 'app/core/reducers/appNotification';
import { SubMenuItems } from 'app/features/dashboard/components/SubMenu/SubMenuItems';
import { SaveLibraryPanelModal } from 'app/features/library-panels/components/SaveLibraryPanelModal/SaveLibraryPanelModal';
import { type PanelModelWithLibraryPanel } from 'app/features/library-panels/types';
import { getPanelStateForModel } from 'app/features/panel/state/selectors';
import { updateTimeZoneForSession } from 'app/features/profile/state/reducers';
import { PanelOptionsChangedEvent, ShowModalReactEvent } from 'app/types/events';
import { type StoreState, useDispatch } from 'app/types/store';

import { UnlinkModal } from '../../../dashboard-scene/scene/UnlinkModal';
import { isPanelModelLibraryPanel } from '../../../library-panels/guard';
import { getVariablesByKey } from '../../../variables/state/selectors';
import { DashboardPanel } from '../../dashgrid/DashboardPanel';
import { type DashboardModel } from '../../state/DashboardModel';
import { type PanelModel } from '../../state/PanelModel';
import { DashNavTimeControls } from '../DashNav/DashNavTimeControls';
import { SaveDashboardDrawer } from '../SaveDashboard/SaveDashboardDrawer';

import { OptionsPane } from './OptionsPane';
import { PanelEditorTableView } from './PanelEditorTableView';
import { PanelEditorTabs } from './PanelEditorTabs';
import { VisualizationButton } from './VisualizationButton';
import { discardPanelChanges, initPanelEditor, updatePanelEditorUIState } from './state/actions';
import { type PanelEditorUIState, toggleTableView } from './state/reducers';
import { getPanelEditorTabs } from './state/selectors';
import { type DisplayMode, displayModes, type PanelEditorTab } from './types';
import { calculatePanelSize } from './utils';

interface OwnProps {
  dashboard: DashboardModel;
  sourcePanel: PanelModel;
  sectionNav: NavModel;
  pageNav: NavModelItem;
  className?: string;
  tab?: string;
}

export function PanelEditor({ dashboard, sourcePanel, sectionNav, pageNav, className, tab }: OwnProps) {
  const dispatch = useDispatch();
  const [showSaveLibraryPanelModal, setShowSaveLibraryPanelModal] = useState(false);
  const eventSubsRef = useRef<Subscription | undefined>(undefined);
  const [, forceUpdate] = useState(0);

  const panel = useSelector((state: StoreState) => state.panelEditor.getPanel());
  const panelState = useSelector((state: StoreState) => panel ? getPanelStateForModel(state, panel) : undefined);
  const plugin = panelState?.plugin;
  const instanceState = panelState?.instanceState;
  const initDone = useSelector((state: StoreState) => state.panelEditor.initDone);
  const uiState = useSelector((state: StoreState) => state.panelEditor.ui);
  const tableViewEnabled = useSelector((state: StoreState) => state.panelEditor.tableViewEnabled);
  const variables = useSelector((state: StoreState) => getVariablesByKey(dashboard.uid, state));

  useEffect(() => {
    dispatch(initPanelEditor(sourcePanel, dashboard));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initDone && panel && !eventSubsRef.current) {
      eventSubsRef.current = new Subscription();
      eventSubsRef.current.add(
        panel.events.subscribe(PanelOptionsChangedEvent, () => {
          forceUpdate((c) => c + 1);
        })
      );
    }
    return () => {
      eventSubsRef.current?.unsubscribe();
    };
  }, [initDone, panel]);

  const onBack = () => {
    locationService.partial({
      editPanel: null,
      tab: null,
      showCategory: null,
    });
  };

  const onDiscard = () => {
    dispatch(discardPanelChanges());
    onBack();
  };

  const onSaveDashboard = () => {
    appEvents.publish(
      new ShowModalReactEvent({
        component: SaveDashboardDrawer,
        props: { dashboard },
      })
    );
  };

  const onSaveLibraryPanel = async () => {
    if (!isPanelModelLibraryPanel(panel!)) {
      return;
    }
    setShowSaveLibraryPanelModal(true);
  };

  const onChangeTab = (panelTab: PanelEditorTab) => {
    locationService.partial({
      tab: panelTab.id,
    });
  };

  const onFieldConfigChange = (config: FieldConfigSource) => {
    panel!.updateFieldConfig({
      ...config,
    });
  };

  const onPanelOptionsChanged = (options: PanelModel['options']) => {
    panel!.updateOptions(options);
  };

  const onPanelConfigChanged = (configKey: keyof PanelModel, value: unknown) => {
    panel!.setProperty(configKey, value);
    panel!.render();
    forceUpdate((c) => c + 1);
  };

  const onDisplayModeChange = (mode?: DisplayMode) => {
    if (tableViewEnabled) {
      dispatch(toggleTableView());
    }
    dispatch(updatePanelEditorUIState({ mode }));
  };

  const onToggleTableView = () => {
    dispatch(toggleTableView());
  };

  const styles = useStyles2((theme) => getStyles(theme, uiState));

  const renderTemplateVariables = () => {
    if (!variables.length) {
      return null;
    }

    return (
      <div className={styles.variablesWrapper}>
        <SubMenuItems variables={variables} />
      </div>
    );
  };

  const renderPanelToolbar = () => {
    return (
      <div className={styles.panelToolbar}>
        <Stack justifyContent={variables.length > 0 ? 'space-between' : 'flex-end'} alignItems="flex-start">
          {renderTemplateVariables()}
          <Stack gap={1}>
            <InlineSwitch
              label={t('dashboard.panel-editor-unconnected.table-view-label-table-view', 'Table view')}
              showLabel={true}
              id="table-view"
              value={tableViewEnabled}
              onClick={onToggleTableView}
              data-testid={selectors.components.PanelEditor.toggleTableView}
            />
            <RadioButtonGroup value={uiState.mode} options={displayModes} onChange={onDisplayModeChange} />
            <DashNavTimeControls
              dashboard={dashboard}
              onChangeTimeZone={(tz) => dispatch(updateTimeZoneForSession(tz))}
              isOnCanvas={true}
            />
            {!uiState.isPanelOptionsVisible && <VisualizationButton panel={panel!} />}
          </Stack>
        </Stack>
      </div>
    );
  };

  const renderPanel = (isOnlyPanel: boolean) => {
    if (!panel) {
      return null;
    }

    return (
      <div className={styles.mainPaneWrapper} key="panel">
        {renderPanelToolbar()}
        <div className={styles.panelWrapper}>
          <AutoSizer>
            {({ width, height }) => {
              if (width < 3 || height < 3) {
                return null;
              }

              if (isOnlyPanel) {
                const theme = { spacing: { gridSize: 8 } };
                height -= theme.spacing.gridSize * 2;
              }

              if (tableViewEnabled) {
                return <PanelEditorTableView width={width} height={height} panel={panel} dashboard={dashboard} />;
              }

              const panelSize = calculatePanelSize(uiState.mode, width, height, panel);

              return (
                <div className={styles.centeringContainer} style={{ width, height }}>
                  <div style={panelSize} data-panelid={panel.id}>
                    <DashboardPanel
                      key={panel.key}
                      stateKey={panel.key}
                      dashboard={dashboard}
                      panel={panel}
                      isEditing={true}
                      isViewing={false}
                      lazy={false}
                      width={panelSize.width}
                      height={panelSize.height}
                    />
                  </div>
                </div>
              );
            }}
          </AutoSizer>
        </div>
      </div>
    );
  };

  const renderPanelAndEditor = () => {
    if (!panel || !plugin) {
      return null;
    }

    const tabs = getPanelEditorTabs(tab, plugin);
    const isOnlyPanel = tabs.length === 0;
    const panelPane = renderPanel(isOnlyPanel);

    if (tabs.length === 0) {
      return <div className={styles.onlyPanel}>{panelPane}</div>;
    }

    return (
      <SplitPaneWrapper
        splitOrientation="horizontal"
        maxSize={-200}
        paneSize={uiState.topPaneSize}
        primary="first"
        secondaryPaneStyle={{ minHeight: 0 }}
        onDragFinished={(size) => {
          if (size) {
            dispatch(updatePanelEditorUIState({ topPaneSize: size / window.innerHeight }));
          }
        }}
      >
        {panelPane}
        <div
          className={styles.tabsWrapper}
          data-testid={selectors.components.PanelEditor.DataPane.content}
          key="panel-editor-tabs"
        >
          <PanelEditorTabs
            key={panel.key}
            panel={panel}
            dashboard={dashboard}
            tabs={tabs}
            onChangeTab={onChangeTab}
          />
        </div>
      </SplitPaneWrapper>
    );
  };

  const renderOptionsPane = () => {
    if (!plugin || !panel) {
      return <div />;
    }

    return (
      <OptionsPane
        plugin={plugin}
        dashboard={dashboard}
        panel={panel}
        instanceState={instanceState}
        onFieldConfigsChange={onFieldConfigChange}
        onPanelOptionsChanged={onPanelOptionsChanged}
        onPanelConfigChange={onPanelConfigChanged}
      />
    );
  };

  const renderEditorActions = () => {
    const size = 'sm';
    let editorActions = [
      <Button
        onClick={onDiscard}
        title={t('dashboard.panel-editor-unconnected.editor-actions.title-undo-all-changes', 'Undo all changes')}
        key="discard"
        size={size}
        variant="destructive"
        fill="outline"
      >
        <Trans i18nKey="dashboard.panel-editor-unconnected.editor-actions.discard">Discard</Trans>
      </Button>,
      dashboard.meta.canSave &&
        (panel?.libraryPanel ? (
          <Button
            onClick={onSaveLibraryPanel}
            variant="primary"
            size={size}
            title={t(
              'dashboard.panel-editor-unconnected.editor-actions.title-apply-changes-and-save-library-panel',
              'Apply changes and save library panel'
            )}
            key="save-panel"
          >
            <Trans i18nKey="dashboard.panel-editor-unconnected.editor-actions.save-library-panel">
              Save library panel
            </Trans>
          </Button>
        ) : (
          <Button
            onClick={onSaveDashboard}
            title={t(
              'dashboard.panel-editor-unconnected.editor-actions.title-apply-changes-and-save-dashboard',
              'Apply changes and save dashboard'
            )}
            key="save"
            size={size}
            variant="secondary"
          >
            <Trans i18nKey="dashboard.panel-editor-unconnected.editor-actions.save">Save</Trans>
          </Button>
        )),
      <Button
        onClick={onBack}
        variant="primary"
        title={t(
          'dashboard.panel-editor-unconnected.editor-actions.title-apply-changes-dashboard',
          'Apply changes and go back to dashboard'
        )}
        data-testid={selectors.components.PanelEditor.applyButton}
        key="apply"
        size={size}
      >
        <Trans i18nKey="dashboard.panel-editor-unconnected.editor-actions.apply">Apply</Trans>
      </Button>,
    ];

    if (panel?.libraryPanel) {
      editorActions.splice(
        1,
        0,
        <ModalsController key="unlink-controller">
          {({ showModal, hideModal }) => {
            return (
              <ToolbarButton
                onClick={() => {
                  showModal(UnlinkModal, {
                    onConfirm: () => {
                      panel.unlinkLibraryPanel();
                      forceUpdate((c) => c + 1);
                    },
                    onDismiss: hideModal,
                    isOpen: true,
                  });
                }}
                title={t(
                  'dashboard.panel-editor-unconnected.title-unlink',
                  'Disconnects this panel from the library panel so that you can edit it regularly.'
                )}
                key="unlink"
              >
                <Trans i18nKey="dashboard.panel-editor-unconnected.unlink">Unlink</Trans>
              </ToolbarButton>
            );
          }}
        </ModalsController>
      );

      editorActions.pop();
    }

    return editorActions;
  };

  if (!initDone) {
    return null;
  }

  return (
    <Page
      navModel={sectionNav}
      pageNav={pageNav}
      data-testid={selectors.components.PanelEditor.General.content}
      layout={PageLayoutType.Custom}
      className={className}
    >
      <AppChromeUpdate
        actions={<ToolbarButtonRow alignment="right">{renderEditorActions()}</ToolbarButtonRow>}
      />
      <div className={styles.wrapper}>
        <div className={styles.verticalSplitPanesWrapper}>
          {!uiState.isPanelOptionsVisible ? (
            renderPanelAndEditor()
          ) : (
            <SplitPaneWrapper
              splitOrientation="vertical"
              maxSize={-300}
              paneSize={uiState.rightPaneSize}
              primary="second"
              onDragFinished={(size) => {
                if (size) {
                  dispatch(updatePanelEditorUIState({ rightPaneSize: size / window.innerWidth }));
                }
              }}
            >
              {renderPanelAndEditor()}
              {renderOptionsPane()}
            </SplitPaneWrapper>
          )}
        </div>
        {showSaveLibraryPanelModal && panel && (
          <SaveLibraryPanelModal
            panel={panel as PanelModelWithLibraryPanel}
            folderUid={dashboard.meta.folderUid ?? ''}
            onConfirm={() => setShowSaveLibraryPanelModal(false)}
            onDiscard={onDiscard}
            onDismiss={() => setShowSaveLibraryPanelModal(false)}
          />
        )}
      </div>
    </Page>
  );
}

export const PanelEditorUnconnected = PanelEditor;

/*
 * Styles
 */
export const getStyles = stylesFactory((theme: GrafanaTheme2, uiState: PanelEditorUIState) => {
  const paneSpacing = theme.spacing(2);

  return {
    wrapper: css({
      width: '100%',
      flexGrow: 1,
      minHeight: 0,
      display: 'flex',
      paddingTop: theme.spacing(2),
    }),
    verticalSplitPanesWrapper: css({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      position: 'relative',
    }),
    mainPaneWrapper: css({
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      paddingRight: `${uiState.isPanelOptionsVisible ? 0 : paneSpacing}`,
    }),
    variablesWrapper: css({
      label: 'variablesWrapper',
      display: 'flex',
      flexGrow: 1,
      flexWrap: 'wrap',
      gap: theme.spacing(1, 2),
    }),
    panelWrapper: css({
      flex: '1 1 0',
      minHeight: 0,
      width: '100%',
      paddingLeft: paneSpacing,
    }),
    tabsWrapper: css({
      height: '100%',
      width: '100%',
    }),
    panelToolbar: css({
      display: 'flex',
      padding: `0 0 ${paneSpacing} ${paneSpacing}`,
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }),
    angularWarning: css({
      display: 'flex',
      height: theme.spacing(4),
      alignItems: 'center',
    }),
    toolbarLeft: css({
      paddingLeft: theme.spacing(1),
    }),
    centeringContainer: css({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      flexDirection: 'column',
    }),
    onlyPanel: css({
      height: '100%',
      position: 'absolute',
      overflow: 'hidden',
      width: '100%',
    }),
  };
});
