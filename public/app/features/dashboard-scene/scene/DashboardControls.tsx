import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { VariableHide } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import {
  type SceneObjectState,
  SceneObjectBase,
  type SceneComponentProps,
  SceneTimePicker,
  SceneRefreshPicker,
  SceneDebugger,
  VariableDependencyConfig,
  sceneGraph,
  SceneObjectUrlSyncConfig,
  type SceneObjectUrlValues,
  type CancelActivationHandler,
} from '@grafana/scenes';
import { Box, Button, ButtonGroup } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { contextSrv } from 'app/core/services/context_srv';
import { playlistSrv } from 'app/features/playlist/PlaylistSrv';
import { ContextualNavigationPaneToggle } from 'app/features/scopes/dashboards/ContextualNavigationPaneToggle';
import { KioskMode } from 'app/types/dashboard';

import { PanelEditControls } from '../panel-edit/PanelEditControls';
import { getDashboardSceneFor } from '../utils/utils';

import { DashboardDataLayerControls } from './DashboardDataLayerControls';
import { DashboardLinksControls } from './DashboardLinksControls';
import { type DashboardScene } from './DashboardScene';
import { VariableControls } from './VariableControls';
import { DashboardControlsButton } from './dashboard-controls-menu/DashboardControlsMenuButton';
import { hasDashboardControls, useHasDashboardControls } from './dashboard-controls-menu/utils';
import { DashboardFiltersOverviewPaneToggle } from './dashboard-filters-overview/DashboardFiltersOverviewPaneToggle';
import { EditDashboardSwitch } from './new-toolbar/actions/EditDashboardSwitch';
import { MakeDashboardEditableButton } from './new-toolbar/actions/MakeDashboardEditableButton';
import { SaveDashboard } from './new-toolbar/actions/SaveDashboard';
import { ShareDashboardButton } from './new-toolbar/actions/ShareDashboardButton';

import './layouts-shared/canvasControls.global.css';

export interface DashboardControlsState extends SceneObjectState {
  timePicker: SceneTimePicker;
  refreshPicker: SceneRefreshPicker;
  hideTimeControls?: boolean;
  hideVariableControls?: boolean;
  hideLinksControls?: boolean;
  // Hides the dashboard-controls dropdown menu
  hideDashboardControls?: boolean;
  hidePlaylistNav?: boolean;
}

export class DashboardControls extends SceneObjectBase<DashboardControlsState> {
  static Component = DashboardControlsRenderer;

  protected _variableDependency = new VariableDependencyConfig(this, {
    onAnyVariableChanged: this._onAnyVariableChanged.bind(this),
  });

  protected _urlSync = new SceneObjectUrlSyncConfig(this, {
    keys: [
      '_dash.hideTimePicker',
      '_dash.hideVariables',
      '_dash.hideLinks',
      '_dash.hideDashboardControls',
      '_dash.hidePlaylistNav',
    ],
  });

  /**
   * We want the hideXX url keys to only sync one way (url => state) on init
   * We don't want these flags to be added to URL.
   */
  getUrlState() {
    return {};
  }

  updateFromUrl(values: SceneObjectUrlValues) {
    const { hideTimeControls, hideVariableControls, hideLinksControls, hideDashboardControls, hidePlaylistNav } =
      this.state;
    const isEnabledViaUrl = (key: string) => values[key] === 'true' || values[key] === '';

    if (!hideTimeControls && isEnabledViaUrl('_dash.hideTimePicker')) {
      this.setState({ hideTimeControls: true });
    }

    if (!hideVariableControls && isEnabledViaUrl('_dash.hideVariables')) {
      this.setState({ hideVariableControls: true });
    }

    if (!hideLinksControls && isEnabledViaUrl('_dash.hideLinks')) {
      this.setState({ hideLinksControls: true });
    }

    if (!hideDashboardControls && isEnabledViaUrl('_dash.hideDashboardControls')) {
      this.setState({ hideDashboardControls: true });
    }

    if (!hidePlaylistNav && isEnabledViaUrl('_dash.hidePlaylistNav')) {
      this.setState({ hidePlaylistNav: true });
    }
  }

  public constructor(state: Partial<DashboardControlsState>) {
    super({
      timePicker: state.timePicker ?? new SceneTimePicker({}),
      refreshPicker: state.refreshPicker ?? new SceneRefreshPicker({}),
      ...state,
    });

    this.addActivationHandler(() => {
      let refreshPickerDeactivation: CancelActivationHandler | undefined;

      if (this.state.hideTimeControls) {
        refreshPickerDeactivation = this.state.refreshPicker.activate();
      }

      // Subscribe to time range changes to track interactions
      const timeRange = sceneGraph.getTimeRange(this);
      const timeRangeSubscription = timeRange.subscribeToState((newState, prevState) => {
        if (newState.value !== prevState.value) {
          reportInteraction('grafana_dashboards_time_picker_changed');
        }
      });

      return () => {
        if (refreshPickerDeactivation) {
          refreshPickerDeactivation();
        }
        timeRangeSubscription.unsubscribe();
      };
    });
  }

  /**
   * Links can include all variables so we need to re-render when any change
   */
  private _onAnyVariableChanged(): void {
    const dashboard = getDashboardSceneFor(this);
    if (dashboard.state.links?.length > 0) {
      this.forceRender();
    }
  }

  public hasControls(): boolean {
    const dashboard = getDashboardSceneFor(this);
    const hasVariables = sceneGraph
      .getVariables(this)
      ?.state.variables.some((v) => v.state.hide !== VariableHide.hideVariable);
    const hasAnnotations = sceneGraph.getDataLayers(this).some((d) => d.state.isEnabled && !d.state.isHidden);
    const hasLinks = getDashboardSceneFor(this).state.links?.length > 0;
    const hideLinks = this.state.hideLinksControls || !hasLinks;
    const hideVariables = this.state.hideVariableControls || (!hasAnnotations && !hasVariables);
    const hideTimePicker = this.state.hideTimeControls;
    const hideDashboardControls = this.state.hideDashboardControls || !hasDashboardControls(dashboard);

    return !(hideVariables && hideLinks && hideTimePicker && hideDashboardControls);
  }
}

function DashboardControlsRenderer({ model }: SceneComponentProps<DashboardControls>) {
  const {
    refreshPicker,
    timePicker,
    hideTimeControls,
    hideVariableControls,
    hideLinksControls,
    hideDashboardControls,
    hidePlaylistNav,
  } = model.useState();

  const dashboard = getDashboardSceneFor(model);
  const { links, editPanel } = dashboard.useState();
  const isQueryEditorNext = Boolean(editPanel?.state.useQueryExperienceNext);
  const showDebugger = window.location.search.includes('scene-debugger');
  const hasDashboardControls = useHasDashboardControls(dashboard);

  if (!model.hasControls()) {
    // If dynamic dashboards is enabled, we need to show the edit/share/playlist buttons
    // However we shouldn't do it if we're in edit panel view
    // `DashboardControlActions` already check for edit panel view but we need to prevent showing the container as well
    if (config.featureToggles.dashboardNewLayouts && !editPanel) {
      return (
        <>
          <div
            data-testid={selectors.pages.Dashboard.Controls}
            {...mergeStylexProps(stylex.props(styles.controls), { className: 'gf-dashboard-controls' })}
          >
            <div {...stylex.props(styles.rightControls)}>
              <div {...stylex.props(styles.fixedControls)}>
                <DashboardControlActions dashboard={dashboard} hidePlaylistNav={hidePlaylistNav} />
              </div>
            </div>
          </div>
          <RenderHiddenVariables dashboard={dashboard} />
        </>
      );
    }

    // To still have spacing when no controls are rendered
    return (
      <Box padding={1}>
        <RenderHiddenVariables dashboard={dashboard} />
      </Box>
    );
  }

  return (
    <div
      data-testid={selectors.pages.Dashboard.Controls}
      {...mergeStylexProps(
        stylex.props(
          styles.controls,
          editPanel && styles.controlsPanelEdit,
          editPanel && isQueryEditorNext && styles.controlsPanelEditQueryNext
        ),
        { className: 'gf-dashboard-controls' }
      )}
    >
      <div {...stylex.props(styles.rightControls, editPanel && styles.rightControlsWrap)}>
        {!hideTimeControls && (
          <div {...stylex.props(styles.fixedControls)}>
            <timePicker.Component model={timePicker} />
            <refreshPicker.Component model={refreshPicker} />
          </div>
        )}
        {config.featureToggles.dashboardNewLayouts && (
          <div {...stylex.props(styles.fixedControls)}>
            <DashboardControlActions dashboard={dashboard} hidePlaylistNav={hidePlaylistNav} />
          </div>
        )}
        {(config.featureToggles.dashboardFiltersOverview || config.featureToggles.dashboardUnifiedDrilldownControls) &&
          !config.featureToggles.dashboardNewLayouts && (
            <div {...stylex.props(styles.fixedControls)}>
              <DashboardFiltersOverviewPaneToggle dashboard={dashboard} />
            </div>
          )}
      </div>
      {config.featureToggles.scopeFilters && !editPanel && (
        <ContextualNavigationPaneToggle
          className={stylex.props(styles.contextualNavToggle).className}
          hideWhenOpen={true}
        />
      )}
      {!hideVariableControls && (
        <>
          <VariableControls dashboard={dashboard} />
          <DashboardDataLayerControls dashboard={dashboard} />
        </>
      )}
      {!hideLinksControls && !editPanel && <DashboardLinksControls links={links} dashboard={dashboard} />}
      {!hideDashboardControls && hasDashboardControls && <DashboardControlsButton dashboard={dashboard} />}
      <DefaultControlsLoadingSkeleton
        dashboard={dashboard}
        hideVariableControls={hideVariableControls}
        hideLinksControls={hideLinksControls}
      />
      {editPanel && <PanelEditControls panelEditor={editPanel} />}
      {showDebugger && <SceneDebugger scene={model} key={'scene-debugger'} />}
    </div>
  );
}

function DashboardControlActions({
  dashboard,
  hidePlaylistNav,
}: {
  dashboard: DashboardScene;
  hidePlaylistNav?: boolean;
}) {
  const { isEditing, editPanel, uid, meta, editable } = dashboard.useState();
  const { isPlaying } = playlistSrv.useState();
  const { chrome } = useGrafana();
  const { kioskMode } = chrome.useState();

  if (editPanel) {
    return null;
  }

  if (kioskMode === KioskMode.Full) {
    return null;
  }

  const canEditDashboard = dashboard.canEditDashboard();
  const canSave = Boolean(meta.canSave);
  const canSaveAs = contextSrv.hasEditPermissionInFolders;
  const hasUid = Boolean(uid);
  const isSnapshot = Boolean(meta.isSnapshot);
  const isEmbedded = meta.isEmbedded;
  const isEditable = Boolean(editable);
  const showShareButton = hasUid && !isSnapshot && !isEmbedded && !isPlaying;

  return (
    <>
      {showShareButton && <ShareDashboardButton dashboard={dashboard} />}
      {isEditing && (canSave || canSaveAs) && <SaveDashboard dashboard={dashboard} />}
      {!isPlaying && canEditDashboard && isEditable && <EditDashboardSwitch dashboard={dashboard} />}
      {!isPlaying && canEditDashboard && !isEditable && !isEditing && (
        <MakeDashboardEditableButton dashboard={dashboard} />
      )}
      {isPlaying && (
        <ButtonGroup>
          {!hidePlaylistNav && (
            <Button
              variant="secondary"
              data-testid={selectors.pages.Dashboard.DashNav.playlistControls.prev}
              tooltip={t('dashboard.toolbar.new.playlist-previous', 'Go to previous dashboard')}
              icon="backward"
              onClick={() => playlistSrv.prev()}
            />
          )}
          <Button
            variant="secondary"
            onClick={() => playlistSrv.stop()}
            data-testid={selectors.pages.Dashboard.DashNav.playlistControls.stop}
          >
            <Trans i18nKey="dashboard.toolbar.new.playlist-stop">Stop playlist</Trans>
          </Button>
          {!hidePlaylistNav && (
            <Button
              variant="secondary"
              data-testid={selectors.pages.Dashboard.DashNav.playlistControls.next}
              tooltip={t('dashboard.toolbar.new.playlist-next', 'Go to next dashboard')}
              icon="forward"
              onClick={() => playlistSrv.next()}
            />
          )}
        </ButtonGroup>
      )}
    </>
  );
}

function RenderHiddenVariables({ dashboard }: { dashboard: DashboardScene }) {
  const { variables } = sceneGraph.getVariables(dashboard).useState();
  const renderAsHiddenVariables = variables.filter((v) => v.UNSAFE_renderAsHidden);
  if (renderAsHiddenVariables && renderAsHiddenVariables.length > 0) {
    return (
      <>
        {renderAsHiddenVariables.map((v) => (
          <v.Component model={v} key={v.state.key} />
        ))}
      </>
    );
  }
  return null;
}

function DefaultControlsLoadingSkeleton({
  dashboard,
  hideVariableControls,
  hideLinksControls,
}: {
  dashboard: DashboardScene;
  hideVariableControls?: boolean;
  hideLinksControls?: boolean;
}) {
  const { defaultVariablesLoading, defaultLinksLoading } = dashboard.useState();

  const showVariablesSkeleton = defaultVariablesLoading && !hideVariableControls;
  const showLinksSkeleton = defaultLinksLoading && !hideLinksControls;

  if (!showVariablesSkeleton && !showLinksSkeleton) {
    return null;
  }

  return <Skeleton width={60} height={32} containerClassName={stylex.props(styles.skeletonContainer).className} />;
}

// The `.dashboard-canvas-controls` hover rule lives in layouts-shared/canvasControls.global.css.
const styles = stylex.create({
  skeletonContainer: {
    display: 'inline-flex',
    lineHeight: 1,
    verticalAlign: 'middle',
    marginBottom: spacing['--gf-spacing-x1'],
    marginRight: spacing['--gf-spacing-x1'],
  },
  controls: {
    gap: spacing['--gf-spacing-x1'],
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x2'],
    flexDirection: { default: 'row', [bp.smDown]: 'column-reverse' },
    flexWrap: 'nowrap',
    position: 'relative',
    width: '100%',
    marginLeft: 'auto',
    display: 'inline-block',
    alignItems: { default: null, [bp.smDown]: 'stretch' },
  },
  controlsPanelEdit: {
    flexWrap: 'wrap-reverse',
    paddingRight: 0,
  },
  controlsPanelEditQueryNext: {
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
  },
  rightControls: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    float: 'right',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    maxWidth: '100%',
    minWidth: 0,
  },
  fixedControls: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    order: 2,
    marginLeft: 'auto',
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  rightControlsWrap: {
    flexWrap: 'wrap',
    marginLeft: 'auto',
  },
  contextualNavToggle: {
    display: 'inline-flex',
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x1'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: 0,
  },
});
