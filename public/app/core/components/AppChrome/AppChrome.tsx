import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';
import classNames from 'classnames';
import { Resizable } from 're-resizable';
import { type PropsWithChildren, useEffect, useMemo } from 'react';

import { store } from '@grafana/data';
import { Trans } from '@grafana/i18n';
import { locationSearchToObject, locationService, useScopes } from '@grafana/runtime';
import { ErrorBoundaryAlert, floatingUtils, getDragStyles, LinkButton, useTheme2 } from '@grafana/ui';
import { bp, zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { SplashScreenModal } from 'app/core/components/SplashScreenModal/SplashScreenModal';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { CommandPalette } from 'app/features/commandPalette/CommandPalette';
import { ScopesDashboards } from 'app/features/scopes/dashboards/ScopesDashboards';

import { AppChromeMenu } from './AppChromeMenu';
import { type AppChromeService, DOCKED_LOCAL_STORAGE_KEY } from './AppChromeService';
import {
  ExtensionSidebar,
  MAX_EXTENSION_SIDEBAR_WIDTH,
  MIN_EXTENSION_SIDEBAR_WIDTH,
} from './ExtensionSidebar/ExtensionSidebar';
import { useExtensionSidebarContext } from './ExtensionSidebar/ExtensionSidebarProvider';
import { MegaMenu } from './MegaMenu/MegaMenu';
import { megaMenu } from './MegaMenu/megaMenu.stylex';
import { useMegaMenuFocusHelper } from './MegaMenu/utils';
import { ReturnToPrevious } from './ReturnToPrevious/ReturnToPrevious';
import { SingleTopBar } from './TopBar/SingleTopBar';
import { getChromeHeaderLevelHeight, useChromeHeaderLevels } from './TopBar/useChromeHeaderHeight';

export interface Props extends PropsWithChildren<{}> {}

export function AppChrome({ children }: Props) {
  const { chrome } = useGrafana();
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
  const theme = useTheme2();
  // getDragStyles is a @grafana/ui Emotion helper; the resize handle it styles belongs to that package.
  const dragStyles = useMemo(() => getDragStyles(theme), [theme]);

  useResponsiveDockedMegaMenu(chrome);
  useMegaMenuFocusHelper(state.megaMenuOpen, state.megaMenuDocked);

  const handleMegaMenu = () => {
    chrome.setMegaMenuOpen(!state.megaMenuOpen);
  };

  const sidebarProps = stylex.props(styles.sidebarContainer, styles.sidebarTop(headerHeight));

  const { pathname, search } = locationService.getLocation();
  const url = pathname + search;
  const shouldShowReturnToPrevious = state.returnToPrevious && url !== state.returnToPrevious.href;

  // Clear returnToPrevious when the page is manually navigated to
  useEffect(() => {
    if (state.returnToPrevious && url === state.returnToPrevious.href) {
      chrome.clearReturnToPrevious('auto_dismissed');
    }
    // We only want to pay attention when the location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chrome, url]);

  // Sync updates from kiosk mode query string back into app chrome
  useEffect(() => {
    const queryParams = locationSearchToObject(search);
    chrome.setKioskModeFromUrl(queryParams.kiosk);
  }, [chrome, search]);

  // Chromeless routes are without topNav, mega menu, search & command palette
  // We check chromeless twice here instead of having a separate path so {children}
  // doesn't get re-mounted when chromeless goes from true to false.
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
            className={stylex.props(styles.skipLink).className}
            href="#pageContent"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pageContent')?.focus();
            }}
          >
            <Trans i18nKey="app-chrome.skip-content-button">Skip to main content</Trans>
          </LinkButton>
          {menuDockedAndOpen && (
            <MegaMenu
              className={stylex.props(styles.dockedMegaMenu).className}
              onClose={() => chrome.setMegaMenuOpen(false)}
            />
          )}
          <header {...stylex.props(styles.topNav, menuDockedAndOpen && styles.topNavMenuDocked)}>
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
          styles.content,
          styles.contentPaddingTop(headerLevels * headerHeight),
          state.chromeless && styles.contentChromeless,
          isExtensionSidebarOpen && !state.chromeless && styles.contentWithSidebar
        )}
      >
        <div {...stylex.props(styles.panes, isExtensionSidebarOpen && styles.panesWithSidebar)}>
          {!state.chromeless && (
            <div
              {...stylex.props(
                styles.scopesDashboardsContainer,
                styles.scopesDashboardsContainerHeight(`calc(100% - ${headerHeight}px)`),
                menuDockedAndOpen && styles.scopesDashboardsContainerDocked
              )}
            >
              <ErrorBoundaryAlert boundaryName="scopes-dashboards">
                <ScopesDashboards />
              </ErrorBoundaryAlert>
            </div>
          )}
          <main
            {...stylex.props(
              styles.pageContainer,
              (menuDockedAndOpen || isScopesDashboardsOpen) && styles.pageContainerMenuDocked,
              menuDockedAndOpen && isScopesDashboardsOpen && styles.pageContainerMenuDockedScopes,
              !state.chromeless && isExtensionSidebarOpen && styles.pageContainerWithSidebar,
              !state.chromeless &&
                isExtensionSidebarOpen &&
                styles.contentWidth(`calc(100% - ${extensionSidebarWidth}px)`)
            )}
            id="pageContent"
            tabIndex={-1}
          >
            {children}
          </main>
          {!state.chromeless && isExtensionSidebarOpen && (
            <Resizable
              className={sidebarProps.className}
              // Resizable's own inline `position: relative` is only replaced by an inline value.
              style={{ ...sidebarProps.style, position: 'fixed' }}
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

/**
 * When having docked mega menu we automatically undock it on smaller screens
 */
function useResponsiveDockedMegaMenu(chrome: AppChromeService) {
  const dockedMenuLocalStorageState = store.getBool(DOCKED_LOCAL_STORAGE_KEY, true);
  const isLargeScreen = useMediaQueryMinWidth('xl');

  useEffect(() => {
    // if undocked we do not need to do anything
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

const styles = stylex.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: 'auto',
  },
  contentPaddingTop: (paddingTop: number) => ({ paddingTop }),
  contentWithSidebar: {
    height: '100vh',
    overflow: 'hidden',
  },
  contentChromeless: {
    paddingTop: 0,
  },
  dockedMegaMenu: {
    backgroundColor: colors['--gf-colors-background-primary'],
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
    display: { default: 'none', [bp.xlUp]: 'flex' },
    flexDirection: { default: null, [bp.xlUp]: 'column' },
    height: '100%',
    position: 'fixed',
    top: 0,
    width: megaMenu.width,
    zIndex: 2,
  },
  scopesDashboardsContainer: {
    position: 'fixed',
    zIndex: 1,
  },
  scopesDashboardsContainerHeight: (height: string) => ({ height }),
  scopesDashboardsContainerDocked: {
    left: megaMenu.width,
  },
  topNav: {
    display: 'flex',
    position: 'fixed',
    zIndex: zIndex.navbarFixed,
    left: 0,
    right: 0,
    backgroundColor: colors['--gf-colors-background-primary'],
    flexDirection: 'column',
  },
  topNavMenuDocked: {
    left: megaMenu.width,
  },
  panes: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  panesWithSidebar: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  pageContainerMenuDocked: {
    paddingLeft: megaMenu.width,
  },
  pageContainerMenuDockedScopes: {
    paddingLeft: `calc(${megaMenu.width} * 2)`,
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  pageContainerWithSidebar: {
    overflow: 'auto',
    height: '100%',
    minHeight: 0,
  },
  contentWidth: (maxWidth: string) => ({ maxWidth }),
  skipLink: {
    position: 'fixed',
    top: { default: -1000, ':focus': spacing['--gf-spacing-x1'] },
    left: { default: null, ':focus': spacing['--gf-spacing-x1'] },
    zIndex: { default: null, ':focus': zIndex.portal },
  },
  sidebarContainer: {
    bottom: 0,
    zIndex: `calc(${zIndex.navbarFixed} + 1)`,
    right: 0,
  },
  sidebarTop: (top: number) => ({ top }),
});
