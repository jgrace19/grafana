import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { useBooleanFlagValue } from '@openfeature/react-sdk';
import classNames from 'classnames';
import { Resizable } from 're-resizable';
import { type PropsWithChildren, useEffect } from 'react';

import { store } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { locationSearchToObject, locationService, useScopes } from '@grafana/runtime';
import { ErrorBoundaryAlert, floatingUtils, getDragStyles, LinkButton, useTheme2 } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { SplashScreenModal } from 'app/core/components/SplashScreenModal/SplashScreenModal';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { CommandPalette } from 'app/features/commandPalette/CommandPalette';
import { ScopesDashboards } from 'app/features/scopes/dashboards/ScopesDashboards';

import { AppChromeMenu } from './AppChromeMenu';
import { type AppChromeService, DOCKED_LOCAL_STORAGE_KEY } from './AppChromeService';
import { appChromeStyles } from './AppChrome.stylex';
import {
  ExtensionSidebar,
  MAX_EXTENSION_SIDEBAR_WIDTH,
  MIN_EXTENSION_SIDEBAR_WIDTH,
} from './ExtensionSidebar/ExtensionSidebar';
import { useExtensionSidebarContext } from './ExtensionSidebar/ExtensionSidebarProvider';
import { MegaMenu } from './MegaMenu/MegaMenu';
import { useMegaMenuFocusHelper } from './MegaMenu/utils';
import { ReturnToPrevious } from './ReturnToPrevious/ReturnToPrevious';
import { SingleTopBar } from './TopBar/SingleTopBar';
import { getChromeHeaderLevelHeight, useChromeHeaderLevels } from './TopBar/useChromeHeaderHeight';

export interface Props extends PropsWithChildren<{}> {}

export function AppChrome({ children }: Props) {
  const { chrome } = useGrafana();
  const theme = useTheme2();
  const {
    isOpen: isExtensionSidebarOpen,
    extensionSidebarWidth,
    setExtensionSidebarWidth,
  } = useExtensionSidebarContext();
  const state = chrome.useState();
  const scopes = useScopes();
  const isSplashScreenEnabled = useBooleanFlagValue('splashScreen', false);

  const menuDockedAndOpen = !state.chromeless && state.megaMenuDocked && state.megaMenuOpen;
  const isScopesDashboardsOpen = Boolean(
    scopes?.state.enabled && scopes?.state.drawerOpened && !scopes?.state.readOnly
  );

  const headerLevels = useChromeHeaderLevels();
  const headerHeight = getChromeHeaderLevelHeight();
  const dragStyles = getDragStyles(theme);

  useResponsiveDockedMegaMenu(chrome);
  useMegaMenuFocusHelper(state.megaMenuOpen, state.megaMenuDocked);

  const handleMegaMenu = () => {
    chrome.setMegaMenuOpen(!state.megaMenuOpen);
  };

  const { pathname, search } = locationService.getLocation();
  const url = pathname + search;
  const shouldShowReturnToPrevious = state.returnToPrevious && url !== state.returnToPrevious.href;

  useEffect(() => {
    if (state.returnToPrevious && url === state.returnToPrevious.href) {
      chrome.clearReturnToPrevious('auto_dismissed');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome, url]);

  useEffect(() => {
    const queryParams = locationSearchToObject(search);
    chrome.setKioskModeFromUrl(queryParams.kiosk);
  }, [chrome, search]);

  return (
    <div
      id={floatingUtils.BOUNDARY_ELEMENT_ID}
      className={classNames('main-view', {
        'main-view--chrome-hidden': state.chromeless,
      })}
    >
      {!state.chromeless && (
        <>
          <LinkButton
            {...stylex.props(appChromeStyles.skipLink)}
            href="#pageContent"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pageContent')?.focus();
            }}
          >
            <Trans i18nKey="app-chrome.skip-content-button">Skip to main content</Trans>
          </LinkButton>
          {menuDockedAndOpen && (
            <MegaMenu {...stylex.props(appChromeStyles.dockedMegaMenu)} onClose={() => chrome.setMegaMenuOpen(false)} />
          )}
          <header
            {...mergeStylexClassName(
              stylex.props(appChromeStyles.topNav, menuDockedAndOpen && appChromeStyles.topNavMenuDocked),
              undefined
            )}
          >
            <SingleTopBar
              sectionNav={state.sectionNav.node}
              pageNav={state.pageNav}
              onToggleMegaMenu={handleMegaMenu}
              onToggleKioskMode={chrome.onToggleKioskMode}
              actions={state.actions}
              breadcrumbActions={state.breadcrumbActions}
              scopes={scopes}
              showToolbarLevel={headerLevels === 2}
            />
          </header>
        </>
      )}
      <div
        {...stylex.props(
          appChromeStyles.content,
          state.chromeless && appChromeStyles.contentChromeless,
          isExtensionSidebarOpen && !state.chromeless && appChromeStyles.contentWithSidebar
        )}
        style={state.chromeless ? undefined : { paddingTop: headerLevels * headerHeight }}
      >
        <div
          {...stylex.props(appChromeStyles.panes, isExtensionSidebarOpen && appChromeStyles.panesWithSidebar)}
        >
          {!state.chromeless && (
            <div
              {...stylex.props(
                appChromeStyles.scopesDashboardsContainer,
                menuDockedAndOpen && appChromeStyles.scopesDashboardsContainerDocked
              )}
              style={{ height: `calc(100% - ${headerHeight}px)` }}
            >
              <ErrorBoundaryAlert boundaryName="scopes-dashboards">
                <ScopesDashboards />
              </ErrorBoundaryAlert>
            </div>
          )}
          <main
            {...mergeStylexClassName(
              stylex.props(
                appChromeStyles.pageContainer,
                (menuDockedAndOpen || isScopesDashboardsOpen) && appChromeStyles.pageContainerMenuDocked,
                menuDockedAndOpen &&
                  isScopesDashboardsOpen &&
                  appChromeStyles.pageContainerMenuDockedScopes,
                !state.chromeless && isExtensionSidebarOpen && appChromeStyles.pageContainerWithSidebar
              ),
              undefined
            )}
            id="pageContent"
            tabIndex={-1}
            style={
              !state.chromeless && isExtensionSidebarOpen
                ? { maxWidth: `calc(100% - ${extensionSidebarWidth}px)` }
                : undefined
            }
          >
            {children}
          </main>
          {!state.chromeless && isExtensionSidebarOpen && (
            <Resizable
              {...stylex.props(appChromeStyles.sidebarContainer)}
              style={{ top: headerHeight, position: 'fixed' }}
              defaultSize={{ width: extensionSidebarWidth }}
              enable={{ left: true }}
              onResize={(_evt, _direction, ref) => setExtensionSidebarWidth(ref.getBoundingClientRect().width)}
              handleClasses={{ left: dragStyles.dragHandleBaseVertical }}
              minWidth={MIN_EXTENSION_SIDEBAR_WIDTH}
              maxWidth={MAX_EXTENSION_SIDEBAR_WIDTH}
            >
              <ExtensionSidebar />
            </Resizable>
          )}
        </div>
      </div>
      {!state.chromeless && !state.megaMenuDocked && <AppChromeMenu />}
      {!state.chromeless && <CommandPalette />}
      {!state.chromeless && isSplashScreenEnabled && <SplashScreenModal />}
      {shouldShowReturnToPrevious && state.returnToPrevious && (
        <ReturnToPrevious href={state.returnToPrevious.href} title={state.returnToPrevious.title} />
      )}
    </div>
  );
}

function useResponsiveDockedMegaMenu(chrome: AppChromeService) {
  const dockedMenuLocalStorageState = store.getBool(DOCKED_LOCAL_STORAGE_KEY, true);
  const isLargeScreen = useMediaQueryMinWidth('xl');

  useEffect(() => {
    if (!dockedMenuLocalStorageState) {
      return;
    }

    const state = chrome.state.getValue();
    if (isLargeScreen && !state.megaMenuDocked) {
      chrome.setMegaMenuDocked(true, false);
      chrome.setMegaMenuOpen(true);
    } else if (!isLargeScreen && state.megaMenuDocked) {
      chrome.setMegaMenuDocked(false, false);
      chrome.setMegaMenuOpen(false);
    }
  }, [isLargeScreen, chrome, dockedMenuLocalStorageState]);
}
