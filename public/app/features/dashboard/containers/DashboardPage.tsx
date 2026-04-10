import { css, cx } from '@emotion/css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  type NavModel,
  type NavModelItem,
  type TimeRange,
  PageLayoutType,
  locationUtil,
  type GrafanaTheme2,
} from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { locationService } from '@grafana/runtime';
import { useStyles2 } from '@grafana/ui';
import { type ScrollRefElement } from 'app/core/components/NativeScrollbar';
import { Page } from 'app/core/components/Page/Page';
import { GrafanaContext } from 'app/core/context/GrafanaContext';
import { createErrorNotification } from 'app/core/copy/appNotification';
import { getKioskMode } from 'app/core/navigation/kiosk';
import { type GrafanaRouteComponentProps } from 'app/core/navigation/types';
import { notifyApp } from 'app/core/reducers/appNotification';
import { ID_PREFIX } from 'app/core/reducers/navBarTree';
import { getNavModel } from 'app/core/selectors/navModel';
import { type PanelModel } from 'app/features/dashboard/state/PanelModel';
import { dashboardWatcher } from 'app/features/live/dashboard/dashboardWatcher';
import { KioskMode } from 'app/types/dashboard';
import { PanelEditEnteredEvent, PanelEditExitedEvent } from 'app/types/events';
import { type StoreState } from 'app/types/store';

import { cancelVariables, templateVarsChangedInUrl } from '../../variables/state/actions';
import { findTemplateVarChanges } from '../../variables/utils';
import DashNav from '../components/DashNav/DashNav';
import { DashboardLoading } from '../components/DashboardLoading/DashboardLoading';
import { DashboardPrompt } from '../components/DashboardPrompt/DashboardPrompt';
import { DashboardSettings } from '../components/DashboardSettings/DashboardSettings';
import { PanelInspector } from '../components/Inspector/PanelInspector';
import { PanelEditor } from '../components/PanelEditor/PanelEditor';
import { ShareModal } from '../components/ShareModal/ShareModal';
import { SubMenu } from '../components/SubMenu/SubMenu';
import { DashboardGrid } from '../dashgrid/DashboardGrid';
import { liveTimer } from '../dashgrid/liveTimer';
import { getTimeSrv } from '../services/TimeSrv';
import { cleanUpDashboardAndVariables } from '../state/actions';
import { initDashboard } from '../state/initDashboard';

import { DashboardPageError } from './DashboardPageError';
import { type DashboardPageRouteParams, type DashboardPageRouteSearchParams } from './types';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const mapStateToProps = (state: StoreState) => ({
  initPhase: state.dashboard.initPhase,
  initError: state.dashboard.initError,
  dashboard: state.dashboard.getModel(),
  navIndex: state.navIndex,
});

export type DashboardPageParams = { slug: string; uid: string; type: string; accessToken: string };
export type Props = Omit<GrafanaRouteComponentProps<DashboardPageRouteParams, DashboardPageRouteSearchParams>, 'match'> &
  { params: Partial<DashboardPageParams> };

const getStyles = (theme: GrafanaTheme2) => ({
  fullScreenPanel: css({
    '.react-grid-layout': {
      height: 'auto !important',
      // eslint-disable-next-line @grafana/no-unreduced-motion
      transitionProperty: 'none',
    },
    '.react-grid-item': {
      display: 'none !important',
      // eslint-disable-next-line @grafana/no-unreduced-motion
      transitionProperty: 'none !important',

      '&--fullscreen': {
        display: 'block !important',
        // can't avoid type assertion here due to !important
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        position: 'unset !important' as 'unset',
        transform: 'translate(0px, 0px) !important',
      },
    },

    // Disable grid interaction indicators in fullscreen panels
    '.panel-header:hover': {
      backgroundColor: 'inherit',
    },

    '.panel-title-container': {
      cursor: 'pointer',
    },

    '.react-resizable-handle': {
      display: 'none',
    },
  }),
});

export function UnthemedDashboardPage({ location, queryParams, route, params }: Props) {
  const dispatch = useDispatch();
  const grafanaContext = useContext(GrafanaContext);
  const styles = useStyles2(getStyles);

  const initPhase = useSelector((state: StoreState) => state.dashboard.initPhase);
  const initError = useSelector((state: StoreState) => state.dashboard.initError);
  const dashboard = useSelector((state: StoreState) => state.dashboard.getModel());
  const navIndex = useSelector((state: StoreState) => state.navIndex);

  const [editPanel, setEditPanel] = useState<PanelModel | null>(null);
  const [viewPanel, setViewPanel] = useState<PanelModel | null>(null);
  const [editView, setEditView] = useState<string | null>(null);
  const [showLoadingState] = useState(false);
  const [panelNotFound, setPanelNotFound] = useState(false);
  const [editPanelAccessDenied, setEditPanelAccessDenied] = useState(false);
  const [scrollElement, setScrollElement] = useState<ScrollRefElement | undefined>(undefined);
  const [pageNav, setPageNav] = useState<NavModelItem | undefined>(undefined);
  const [sectionNav, setSectionNav] = useState<NavModel | undefined>(undefined);
  const [updateScrollTop, setUpdateScrollTop] = useState<number | undefined>(undefined);
  const rememberScrollTopRef = useRef<number | undefined>(undefined);

  const forceRouteReloadCounterRef = useRef(0);

  const initDashboardFn = () => {
    if (dashboard) {
      dispatch(cleanUpDashboardAndVariables());
    }

    dispatch(
      initDashboard({
        urlSlug: params.slug,
        urlUid: params.uid,
        urlType: params.type,
        urlFolderUid: queryParams.folderUid,
        panelType: queryParams.panelType,
        routeName: route.routeName,
        fixUrl: true,
        accessToken: params.accessToken,
        keybindingSrv: grafanaContext?.keybindings,
      })
    );

    setTimeout(updateLiveTimer, 250);
  };

  // On mount
  useEffect(() => {
    initDashboardFn();
    forceRouteReloadCounterRef.current = (location.state as any)?.routeReloadCounter || 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(cleanUpDashboardAndVariables());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLiveTimer = () => {
    let tr: TimeRange | undefined = undefined;
    if (dashboard?.liveNow) {
      tr = getTimeSrv().timeRange();
    }
    liveTimer.setLiveTimeRange(tr);
  };

  // Handle route param changes (uid change or forced reload)
  const prevParamsUidRef = useRef(params.uid);
  useEffect(() => {
    const routeReloadCounter = (location.state as any)?.routeReloadCounter;

    if (!dashboard) {
      return;
    }

    if (
      prevParamsUidRef.current !== params.uid ||
      (routeReloadCounter !== undefined && forceRouteReloadCounterRef.current !== routeReloadCounter)
    ) {
      initDashboardFn();
      forceRouteReloadCounterRef.current = routeReloadCounter;
      prevParamsUidRef.current = params.uid;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.uid, location.state]);

  // Handle location search changes
  const prevSearchRef = useRef(location.search);
  useEffect(() => {
    if (!dashboard || prevSearchRef.current === location.search) {
      prevSearchRef.current = location.search;
      return;
    }
    prevSearchRef.current = location.search;

    const prevUrlParams = {} as typeof queryParams;
    if (queryParams?.from !== undefined || queryParams?.to !== undefined) {
      getTimeSrv().updateTimeRangeFromUrl();
      updateLiveTimer();
    }

    if (queryParams?.refresh) {
      getTimeSrv().setAutoRefresh(queryParams.refresh);
    }

    const templateVarChanges = findTemplateVarChanges(queryParams, prevUrlParams);
    if (templateVarChanges) {
      dispatch(templateVarsChangedInUrl(dashboard.uid, templateVarChanges));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Handle edit panel entered/exited
  const prevEditPanelRef = useRef<PanelModel | null>(null);
  useEffect(() => {
    if (editPanel && !prevEditPanelRef.current) {
      dashboardWatcher.setEditingState(true);
      dashboard?.events.publish(new PanelEditEnteredEvent(editPanel.id));
    }
    if (!editPanel && prevEditPanelRef.current) {
      dashboardWatcher.setEditingState(false);
      dashboard?.events.publish(new PanelEditExitedEvent(prevEditPanelRef.current.id));
    }
    prevEditPanelRef.current = editPanel;
  }, [editPanel, dashboard]);

  // Handle notifications for panel errors
  useEffect(() => {
    if (editPanelAccessDenied) {
      dispatch(notifyApp(createErrorNotification('Permission to edit panel denied')));
      locationService.partial({ editPanel: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPanelAccessDenied]);

  useEffect(() => {
    if (panelNotFound) {
      dispatch(notifyApp(createErrorNotification(`Panel not found`)));
      locationService.partial({ editPanel: null, viewPanel: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelNotFound]);

  // Handle scroll top update
  useEffect(() => {
    if (updateScrollTop !== undefined) {
      scrollElement?.scrollTo(0, updateScrollTop);
    }
  }, [updateScrollTop, scrollElement]);

  // Sync derived state from props (getDerivedStateFromProps equivalent)
  const urlEditPanelId = queryParams.editPanel;
  const urlViewPanelId = queryParams.viewPanel;
  const urlEditView = queryParams.editview;

  const prevUrlEditViewRef = useRef(urlEditView);
  const prevUrlEditPanelIdRef = useRef(urlEditPanelId);
  const prevUrlViewPanelIdRef = useRef(urlViewPanelId);

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    // Entering settings view
    if (!prevUrlEditViewRef.current && urlEditView) {
      setEditView(urlEditView);
      rememberScrollTopRef.current = scrollElement?.scrollTop;
      setUpdateScrollTop(0);
    }
    // Leaving settings view
    else if (prevUrlEditViewRef.current && !urlEditView) {
      setUpdateScrollTop(rememberScrollTopRef.current);
      setEditView(null);
    }

    prevUrlEditViewRef.current = urlEditView;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlEditView, dashboard]);

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    // Entering edit mode
    if (!prevUrlEditPanelIdRef.current && urlEditPanelId) {
      const panel = dashboard.getPanelByUrlId(urlEditPanelId);
      if (panel) {
        if (dashboard.canEditPanel(panel)) {
          setEditPanel(panel);
          rememberScrollTopRef.current = scrollElement?.scrollTop;
        } else {
          setEditPanelAccessDenied(true);
        }
      } else {
        setPanelNotFound(true);
      }
    }
    // Leaving edit mode
    else if (prevUrlEditPanelIdRef.current && !urlEditPanelId) {
      setEditPanel(null);
      setUpdateScrollTop(rememberScrollTopRef.current);
    }

    // Clear error states on valid url
    if (panelNotFound || (editPanelAccessDenied && !urlEditPanelId)) {
      setPanelNotFound(false);
      setEditPanelAccessDenied(false);
    }

    prevUrlEditPanelIdRef.current = urlEditPanelId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlEditPanelId, dashboard]);

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    // Entering view mode
    if (!prevUrlViewPanelIdRef.current && urlViewPanelId) {
      const panel = dashboard.getPanelByUrlId(urlViewPanelId);
      if (panel) {
        dashboard.initViewPanel(panel);
        setViewPanel(panel);
        rememberScrollTopRef.current = scrollElement?.scrollTop;
        setUpdateScrollTop(0);
      } else {
        setPanelNotFound(true);
      }
    }
    // Leaving view mode
    else if (prevUrlViewPanelIdRef.current && !urlViewPanelId) {
      if (viewPanel) {
        dashboard.exitViewPanel(viewPanel);
      }
      setViewPanel(null);
      setUpdateScrollTop(rememberScrollTopRef.current);
    }

    prevUrlViewPanelIdRef.current = urlViewPanelId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlViewPanelId, dashboard]);

  // Update pageNav and sectionNav from dashboard state
  useEffect(() => {
    if (!dashboard) {
      return;
    }

    let newPageNav = pageNav;
    let newSectionNav = sectionNav;

    if (!newPageNav || dashboard.title !== newPageNav.text || dashboard.meta.folderUrl !== newPageNav.parentItem?.url) {
      newPageNav = {
        text: dashboard.title,
        url: locationUtil.getUrlForPartial(location, {
          editview: null,
          editPanel: null,
          viewPanel: null,
        }),
      };
    }

    newSectionNav = getNavModel(navIndex, ID_PREFIX + dashboard.uid, getNavModel(navIndex, 'dashboards/browse'));

    const { folderUid } = dashboard.meta;
    if (folderUid && newPageNav && newSectionNav.main.id !== 'starred') {
      const folderNavModel = getNavModel(navIndex, `folder-dashboards-${folderUid}`).main;
      if (folderNavModel.id !== 'not-found') {
        newPageNav = {
          ...newPageNav,
          parentItem: folderNavModel,
        };
      }
    }

    if (editPanel || viewPanel) {
      newPageNav = {
        ...newPageNav,
        text: `${editPanel ? 'Edit' : 'View'} panel`,
        parentItem: newPageNav,
        url: undefined,
      };
    }

    setPageNav(newPageNav);
    setSectionNav(newSectionNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard, navIndex, editPanel, viewPanel]);

  const setScrollRef = (scrollEl: ScrollRefElement): void => {
    setScrollElement(scrollEl);
  };

  const getInspectPanel = () => {
    const inspectPanelId = queryParams.inspect;

    if (!dashboard || !inspectPanelId) {
      return null;
    }

    const inspectPanel = dashboard.getPanelById(parseInt(inspectPanelId, 10));

    if (!inspectPanel) {
      return null;
    }

    return inspectPanel;
  };

  const onCloseShareModal = () => {
    locationService.partial({ shareView: null });
  };

  if (!dashboard || !pageNav || !sectionNav) {
    return <DashboardLoading initPhase={initPhase} />;
  }

  const inspectPanel = getInspectPanel();
  const kioskMode = getKioskMode(queryParams);
  const showSubMenu = !editPanel && !kioskMode && !queryParams.editview && dashboard.isSubMenuVisible();
  const showToolbar = kioskMode !== KioskMode.Full && !queryParams.editview && !initError;

  const pageClassName = cx({
    [styles.fullScreenPanel]: Boolean(viewPanel),
    'page-hidden': Boolean(queryParams.editview || editPanel),
  });

  return (
    <>
      <Page
        navModel={sectionNav}
        pageNav={pageNav}
        layout={PageLayoutType.Canvas}
        className={pageClassName}
        onSetScrollRef={setScrollRef}
      >
        {showToolbar && (
          <header data-testid={selectors.pages.Dashboard.DashNav.navV2}>
            <DashNav
              dashboard={dashboard}
              title={dashboard.title}
              folderTitle={dashboard.meta.folderTitle}
              isFullscreen={!!viewPanel}
              kioskMode={kioskMode}
              hideTimePicker={dashboard.timepicker.hidden}
            />
          </header>
        )}
        <DashboardPrompt dashboard={dashboard} />
        {initError && <DashboardPageError error={initError.error} type={params.type} />}
        {showSubMenu && (
          <section data-testid={selectors.pages.Dashboard.SubMenu.submenu}>
            <SubMenu dashboard={dashboard} annotations={dashboard.annotations.list} links={dashboard.links} />
          </section>
        )}
        {!initError && (
          <DashboardGrid
            dashboard={dashboard}
            isEditable={!!dashboard.meta.canEdit}
            viewPanel={viewPanel}
            editPanel={editPanel}
          />
        )}

        {inspectPanel && <PanelInspector dashboard={dashboard} panel={inspectPanel} />}
        {queryParams.shareView && (
          <ShareModal dashboard={dashboard} onDismiss={onCloseShareModal} activeTab={queryParams.shareView} />
        )}
      </Page>
      {editPanel && (
        <PanelEditor
          dashboard={dashboard}
          sourcePanel={editPanel}
          tab={queryParams.tab}
          sectionNav={sectionNav}
          pageNav={pageNav}
        />
      )}
      {queryParams.editview && (
        <DashboardSettings
          dashboard={dashboard}
          editview={queryParams.editview}
          pageNav={pageNav}
          sectionNav={sectionNav}
        />
      )}
    </>
  );
}

export const DashboardPage = UnthemedDashboardPage;
DashboardPage.displayName = 'DashboardPage';
export default DashboardPage;
