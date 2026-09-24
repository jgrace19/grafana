import * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { useMedia } from 'react-use';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';

import { useTheme2 } from '../../themes/ThemeContext';
import { durations, easings, motion, zIndex } from '../../themes/stylex/constants.stylex';
import { colors, shadows, shape, spacing } from '../../themes/stylex/tokens.stylex';
import { IconButton } from '../IconButton/IconButton';
import { getPortalContainer } from '../Portal/Portal';

import './Sidebar.css';

import { SidebarButton } from './SidebarButton';
import { SidebarPaneHeader } from './SidebarPaneHeader';
import { SidebarResizer } from './SidebarResizer';
import {
  SIDE_BAR_WIDTH_ICON_ONLY,
  SIDE_BAR_WIDTH_WITH_TEXT,
  SidebarContext,
  type SidebarContextValue,
  useSidebarContext,
} from './useSidebar';
import { useCustomClickAway } from './useSidebarClickAway';

export interface Props {
  children?: ReactNode;
  contextValue: SidebarContextValue;
}

export function SidebarComp({ children, contextValue }: Props) {
  const theme = useTheme2();
  const { isDocked, position, tabsMode, hasOpenPane, edgeMargin, bottomMargin, onToggleIsHidden } = contextValue;

  const style = { [position]: theme.spacing(edgeMargin), bottom: theme.spacing(bottomMargin) };

  const ref = useCustomClickAway((evt) => {
    const portalContainer = getPortalContainer();
    // ignore clicks inside portal container
    if (evt.target instanceof Node && portalContainer && portalContainer.contains(evt.target)) {
      return;
    }
    if (!isDocked && hasOpenPane) {
      contextValue.onClosePane?.();
    }
  });

  if (contextValue.isHidden) {
    return (
      <SidebarContext.Provider value={contextValue}>
        <IconButton
          className={clsx(
            'gf-sidebar-show-button',
            position === 'left' ? 'gf-sidebar-show-button--left' : 'gf-sidebar-show-button--right'
          )}
          variant="secondary"
          name={'arrow-to-right'}
          tooltip={t('grafana-ui.sidebar.show', 'Show')}
          tooltipPlacement={position === 'left' ? 'right' : 'left'}
          onClick={onToggleIsHidden}
          data-testid={selectors.components.Sidebar.showHideToggle}
        />
      </SidebarContext.Provider>
    );
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...stylex.props(
          styles.container,
          hasOpenPane && !isDocked && styles.undockedPaneOpen,
          position === 'left' && styles.containerLeft,
          tabsMode && styles.containerTabsMode,
          !!contextValue.isHidden && styles.containerHidden
        )}
        style={style}
        id="sidebar-container"
        data-testid={selectors.components.Sidebar.container}
        aria-hidden={contextValue.isHidden}
      >
        {!tabsMode && <SidebarResizer />}
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SiderbarToolbarProps {
  children?: ReactNode;
}

export function SiderbarToolbar({ children }: SiderbarToolbarProps) {
  const sidebarContext = useSidebarContext();
  const theme = useTheme2();
  const isMobile = useMedia(`(max-width: ${theme.breakpoints.values.sm}px)`);

  if (!sidebarContext) {
    throw new Error('Sidebar.Toolbar must be used within a Sidebar component');
  }

  return (
    <div
      {...stylex.props(
        styles.toolbar,
        styles.width(
          `calc(var(--gf-spacing-grid-size) * ${sidebarContext.compact ? SIDE_BAR_WIDTH_ICON_ONLY : SIDE_BAR_WIDTH_WITH_TEXT})`
        )
      )}
    >
      {children}
      <div {...stylex.props(styles.flexGrow)} />
      {!isMobile && (
        <SidebarButton
          icon={'web-section-alt'}
          onClick={sidebarContext.onToggleDock}
          title={
            sidebarContext.isDocked ? t('grafana-ui.sidebar.undock', 'Undock') : t('grafana-ui.sidebar.dock', 'Dock')
          }
          data-testid={selectors.components.Sidebar.dockToggle}
        />
      )}
    </div>
  );
}

export function SidebarDivider() {
  return <div {...stylex.props(styles.divider)} />;
}

export interface SidebarOpenPaneProps {
  children?: ReactNode;
}

export function SidebarOpenPane({ children }: SidebarOpenPaneProps) {
  const sidebarContext = useSidebarContext();

  if (!sidebarContext) {
    throw new Error('Sidebar.OpenPane must be used within a Sidebar component');
  }

  return (
    <div
      {...stylex.props(
        styles.openPane,
        sidebarContext.position === 'right' ? styles.openPaneRight : styles.openPaneLeft
      )}
      style={{ width: sidebarContext.paneWidth }}
    >
      {children}
    </div>
  );
}

export const Sidebar = Object.assign(SidebarComp, {
  Toolbar: SiderbarToolbar,
  Button: SidebarButton,
  OpenPane: SidebarOpenPane,
  Divider: SidebarDivider,
  PaneHeader: SidebarPaneHeader,
});

export { useSidebar, useSidebarContext, type SidebarContextValue, type SidebarPosition } from './useSidebar';

const grid = spacing['--gf-spacing-grid-size'];

const styles = stylex.create({
  container: {
    display: 'flex',
    position: 'absolute',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    backgroundColor: colors['--gf-colors-background-primary'],
    borderRadius: shape['--gf-shape-radius-default'],
    zIndex: zIndex.navbarFixed,
    bottom: 0,
    top: 0,
    right: 0,
    width: 'calc-size(auto, size)',
    transitionProperty: { default: null, [motion.noPreference]: 'width' },
    transitionDuration: { default: null, [motion.noPreference]: durations.standard },
    transitionTimingFunction: { default: null, [motion.noPreference]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreference]: '0ms' },
  },
  containerHidden: {
    width: 0,
    borderWidth: 0,
    borderStyle: 'none',
    borderColor: 'currentcolor',
    overflow: 'hidden',
  },
  containerTabsMode: {
    position: 'relative',
  },
  containerLeft: {
    right: 'unset',
    flexDirection: 'row-reverse',
    left: 0,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  undockedPaneOpen: {
    boxShadow: shadows['--gf-shadows-z3'],
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: grid,
    flexGrow: 0,
    gap: `calc(${grid} * 2)`,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  width: (width: string) => ({ width }),
  divider: {
    height: '1px',
    backgroundColor: colors['--gf-colors-border-weak'],
    width: '70%',
  },
  flexGrow: {
    flexGrow: 1,
  },
  openPane: {
    width: '280px',
    flexGrow: 1,
    paddingBottom: `calc(${grid} * 2)`,
    overflowY: 'auto',
  },
  openPaneRight: {
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderRightColor: colors['--gf-colors-border-weak'],
  },
  openPaneLeft: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors['--gf-colors-border-weak'],
  },
});
