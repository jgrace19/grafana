import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardEditPaneSplitterStyles } from './DashboardEditPaneSplitter.stylex';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { config, useChromeHeaderHeight } from '@grafana/runtime';
import { type VizPanel, useSceneObjectState } from '@grafana/scenes';
import {ElementSelectionContext, useSidebar, useTheme2, Sidebar} from '@grafana/ui';
import NativeScrollbar, { DivScrollElement } from 'app/core/components/NativeScrollbar';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';
import { playlistSrv } from 'app/features/playlist/PlaylistSrv';
import { KioskMode } from 'app/types/dashboard';

import { type PopoverTarget, AssistantPopoverContext } from '../assistant/AssistantPopoverContext';
import {
  useDashboardAssistantViewMode,
  usePopoverDismissOnClickOutside,
} from '../assistant/DashboardAssistantViewMode';
import { ViewModePanelPromptCard } from '../assistant/ViewModePanelPromptCard';
import { type DashboardScene } from '../scene/DashboardScene';
import { NavToolbarActions } from '../scene/NavToolbarActions';
import { PublicDashboardBadge } from '../scene/new-toolbar/actions/PublicDashboardBadge';
import { StarButton } from '../scene/new-toolbar/actions/StarButton';
import { dynamicDashNavActions } from '../utils/registerDynamicDashNavAction';

import { type DashboardSidebarPaneName } from './DashboardEditPane';
import { DashboardEditPaneRenderer } from './DashboardEditPaneRenderer';

interface Props {
  dashboard: DashboardScene;
  isEditing?: boolean;
  body?: React.ReactNode;
  controls?: React.ReactNode;
}

export function DashboardEditPaneSplitter(props: Props) {
  if (config.featureToggles.dashboardNewLayouts) {
    return <DashboardEditPaneSplitterNewLayouts {...props} />;
  } else {
    return <DashboardEditPaneSplitterLegacy {...props} />;
  }
}

function DashboardEditPaneSplitterLegacy({ dashboard, body, controls }: Props) {
  const headerHeight = useChromeHeaderHeight();


  return (
    <NativeScrollbar onSetScrollRef={dashboard.onSetScrollRef}>
      <div {...stylex.props(dashboardEditPaneSplitterStyles.canvasWrappperOld)}>
        <NavToolbarActions dashboard={dashboard} />
        <div {...stylex.props(dashboardEditPaneSplitterStyles.controlsWrapperSticky)}>{controls}</div>
        <div {...stylex.props(dashboardEditPaneSplitterStyles.body)}>{body}</div>
      </div>
    </NativeScrollbar>
  );
}

function DashboardEditPaneSplitterNewLayouts({ dashboard, isEditing, body, controls }: Props) {
  const headerHeight = useChromeHeaderHeight();
  const { editPane } = dashboard.state;

  const { chrome } = useGrafana();
  const { kioskMode } = chrome.useState();
  const { isPlaying } = playlistSrv.useState();

  /**
   * Adds star button and left side actions to app chrome breadcrumb area
   */
  useUpdateAppChromeActions(dashboard);

  const { selectionContext, openPane } = useSceneObjectState(editPane, { shouldActivateOrKeepAlive: true });

  const { isEnabled: isAssistantEnabled } = useDashboardAssistantViewMode({
    dashboard,
    isEditing,
  });

  // --- Assistant popover state (decoupled from selection system) ---
  // Stores an array of PopoverTargets to support multi-panel context.
  // Once the popover is open, clicking another sparkle adds that panel;
  // clicking the same sparkle again removes it (toggle).
  const [popoverTargets, setPopoverTargets] = useState<PopoverTarget[]>([]);

  // Close popover when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setPopoverTargets([]);
    }
  }, [isEditing]);

  const clearPopover = useCallback(() => setPopoverTargets([]), []);
  usePopoverDismissOnClickOutside(popoverTargets.length > 0, clearPopover);

  const popoverContextValue = useMemo(
    () => ({
      openPopover: (panel: VizPanel, anchorEl: HTMLElement, multi: boolean) => {
        setPopoverTargets((prev) => {
          const exists = prev.findIndex((t) => t.panel === panel);

          if (multi) {
            // Shift+click: toggle panel in/out of the selection
            if (exists >= 0) {
              return prev.filter((_, i) => i !== exists);
            }
            return [...prev, { panel, anchorEl }];
          }

          // Plain click: replace selection, or toggle off if already the only one
          if (exists >= 0 && prev.length === 1) {
            return [];
          }
          return [{ panel, anchorEl }];
        });
      },
    }),
    []
  );

  const CODE_PANE_MIN_WIDTH = 700;
  const originalPaneWidthRef = useRef<number | null>(null);
  const previousPaneRef = useRef<DashboardSidebarPaneName | undefined>(undefined);

  // Selection is only needed in edit mode — the assistant popover is triggered
  // exclusively via the sparkle button, not through the selection system.
  useEffect(() => {
    if (isEditing) {
      editPane.enableSelection();
    } else {
      editPane.disableSelection();
    }
  }, [isEditing, editPane]);

  const theme = useTheme2();
  const isMobile = useMedia(`(max-width: ${theme.breakpoints.values.sm}px)`);
  const sidebarContext = useSidebar({
    hasOpenPane: Boolean(openPane),
    contentMargin: 1,
    position: 'right',
    persistanceKey: isEditing ? 'dashboard' : 'dashboard-view',
    defaultToDocked: isEditing ? true : false,
    onClosePane: () => editPane.closePane(),
    defaultIsHidden: isEditing ? false : isMobile,
  });

  useEffect(() => {
    const wasCodePane = previousPaneRef.current === 'code';
    const isCodePane = openPane === 'code';
    previousPaneRef.current = openPane;

    if (isCodePane && !wasCodePane) {
      // Opening code pane - store original width and expand if needed
      if (sidebarContext.paneWidth < CODE_PANE_MIN_WIDTH) {
        originalPaneWidthRef.current = sidebarContext.paneWidth;
        const diff = CODE_PANE_MIN_WIDTH - sidebarContext.paneWidth;
        sidebarContext.onResize(diff);
      }
    } else if (wasCodePane && !isCodePane && originalPaneWidthRef.current !== null) {
      // Leaving code pane - restore original width
      const diff = originalPaneWidthRef.current - sidebarContext.paneWidth;
      sidebarContext.onResize(diff);
      originalPaneWidthRef.current = null;
    }
  }, [openPane, sidebarContext]);

  /**
   * Sync docked state to editPane state
   */
  useEffect(() => {
    editPane.setState({ isDocked: sidebarContext.isDocked });
  }, [sidebarContext.isDocked, editPane]);

  const onClearSelection: React.PointerEventHandler<HTMLDivElement> = (evt) => {
    if (evt.shiftKey) {
      return;
    }

    editPane.clearSelection();
  };

  const onBodyRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      dashboard.onSetScrollRef(new DivScrollElement(ref));
    }
  };

  function renderBody() {
    const renderWithoutSidebar = isPlaying || kioskMode === KioskMode.Full;

    // In kiosk mode the full document body scrolls so we don't need to wrap in our own scrollbar
    if (renderWithoutSidebar) {
      return (
        <div
          {...mergeStylexClassName(stylex.props(dashboardEditPaneSplitterStyles.bodyWrapper), clsx(dashboardEditPaneSplitterStyles.bodyWrapperKiosk))}
          data-testid={selectors.components.DashboardEditPaneSplitter.primaryBody}
        >
          <NativeScrollbar onSetScrollRef={dashboard.onSetScrollRef}>{body}</NativeScrollbar>
        </div>
      );
    }

    return (
      <div
        {...stylex.props(dashboardEditPaneSplitterStyles.bodyWrapper)}
        data-testid={selectors.components.DashboardEditPaneSplitter.primaryBody}
        {...sidebarContext.outerWrapperProps}
      >
        <div
          {...stylex.props(dashboardEditPaneSplitterStyles.scrollContainer)}
          ref={onBodyRef}
          onPointerDown={onClearSelection}
          data-testid={selectors.components.DashboardEditPaneSplitter.bodyContainer}
        >
          {body}
        </div>

        <Sidebar contextValue={sidebarContext}>
          <DashboardEditPaneRenderer editPane={editPane} dashboard={dashboard} />
        </Sidebar>
      </div>
    );
  }

  const showPopover = !isEditing && isAssistantEnabled && popoverTargets.length > 0;

  return (
    <AssistantPopoverContext.Provider value={popoverContextValue}>
      <div {...stylex.props(dashboardEditPaneSplitterStyles.container)}>
        <ElementSelectionContext.Provider value={selectionContext}>
          <div {...stylex.props(dashboardEditPaneSplitterStyles.controlsWrapperSticky)} onPointerDown={onClearSelection}>
            {controls}
          </div>
          {renderBody()}
          {showPopover && <ViewModePanelPromptCard targets={popoverTargets} onClose={clearPopover} />}
        </ElementSelectionContext.Provider>
      </div>
    </AssistantPopoverContext.Provider>
  );
}

function useUpdateAppChromeActions(dashboard: DashboardScene) {
  const { chrome } = useGrafana();

  useLayoutEffect(() => {
    const hasUid = Boolean(dashboard.state.uid);
    const canStar = Boolean(dashboard.state.meta.canStar);

    const breadcrumbActions = (
      <>
        {hasUid && canStar && <StarButton dashboard={dashboard} />}
        {hasUid && canStar && <PublicDashboardBadge dashboard={dashboard} />}
        {renderDynamicNavActions()}
      </>
    );

    chrome.update({ breadcrumbActions });

    return () => {
      chrome.update({ breadcrumbActions: undefined });
    };
  }, [chrome, dashboard]);
}

function renderDynamicNavActions() {
  const dashboard = getDashboardSrv().getCurrent()!;
  const showProps = { dashboard };

  return dynamicDashNavActions.left.map((action, index) => {
    if (action.show(showProps)) {
      const ActionComponent = action.component;
      return <ActionComponent key={index} dashboard={dashboard} />;
    }
    return null;
  });
}


