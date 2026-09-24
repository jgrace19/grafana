import * as stylex from '@stylexjs/stylex';
import React, { memo } from 'react';

import { type NavModelItem } from '@grafana/data';
import { Components } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { type ScopesContextValue } from '@grafana/runtime';
import { Icon, Stack, ToolbarButton } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { MEGA_MENU_TOGGLE_ID } from 'app/core/constants';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { useMediaQueryMinWidth } from 'app/core/hooks/useMediaQueryMinWidth';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { contextSrv } from 'app/core/services/context_srv';
import { ScopesSelector } from 'app/features/scopes/selector/ScopesSelector';
import { useSelector } from 'app/types/store';

import { HomeLink } from '../../Branding/Branding';
import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { buildBreadcrumbs } from '../../Breadcrumbs/utils';
import { ExtensionToolbarItem } from '../ExtensionSidebar/ExtensionToolbarItem';
import { NavToolbarSeparator } from '../NavToolbar/NavToolbarSeparator';
import { QuickAdd } from '../QuickAdd/QuickAdd';

import { HelpTopBarButton } from './HelpTopBarButton';
import { InviteUserButton } from './InviteUserButton';
import { ProfileButton } from './ProfileButton';
import { SignInLink } from './SignInLink';
import { SingleTopBarActions } from './SingleTopBarActions';
import { TopBarExtensionPoint } from './TopBarExtensionPoint';
import { TopSearchBarCommandPaletteTrigger } from './TopSearchBarCommandPaletteTrigger';
import { getChromeHeaderLevelHeight } from './useChromeHeaderHeight';

interface Props {
  sectionNav: NavModelItem;
  pageNav?: NavModelItem;
  onToggleMegaMenu(): void;
  onToggleKioskMode(): void;
  actions?: React.ReactNode;
  breadcrumbActions?: React.ReactNode;
  scopes?: ScopesContextValue | undefined;
  showToolbarLevel: boolean;
}

export const SingleTopBar = memo(function SingleTopBar({
  onToggleMegaMenu,
  onToggleKioskMode,
  pageNav,
  sectionNav,
  scopes,
  actions,
  breadcrumbActions,
  showToolbarLevel,
}: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const menuDockedAndOpen = !state.chromeless && state.megaMenuDocked && state.megaMenuOpen;
  const profileNode = useSelector((state) => state.navIndex['profile']);
  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];
  const breadcrumbs = buildBreadcrumbs(sectionNav, pageNav, homeNav);
  const isSmallScreen = !useMediaQueryMinWidth('sm');
  const isLargeScreen = useMediaQueryMinWidth('lg');
  const topLevelScopes = !showToolbarLevel && isLargeScreen && scopes?.state.enabled;

  return (
    <>
      <div
        {...stylex.props(
          styles.layout,
          styles.height(getChromeHeaderLevelHeight()),
          menuDockedAndOpen && styles.layoutMenuDocked
        )}
      >
        <Stack minWidth={0} gap={0.5} alignItems="center" flex={{ xs: 2, lg: 1 }}>
          {!menuDockedAndOpen && (
            <ToolbarButton
              narrow
              id={MEGA_MENU_TOGGLE_ID}
              onClick={onToggleMegaMenu}
              tooltip={t('navigation.megamenu.open', 'Main menu')}
              aria-expanded={state.megaMenuOpen}
            >
              <Stack gap={0} alignItems="center">
                <Icon name="bars" size="xl" />
              </Stack>
            </ToolbarButton>
          )}
          {!menuDockedAndOpen && <HomeLink homeNav={homeNav} />}
          {topLevelScopes ? <ScopesSelector /> : undefined}
          <Breadcrumbs breadcrumbs={breadcrumbs} className={stylex.props(styles.breadcrumbsWrapper).className} />
          {!showToolbarLevel && breadcrumbActions}
        </Stack>

        <Stack
          gap={0.5}
          alignItems="center"
          justifyContent={'flex-end'}
          flex={1}
          data-testid={!showToolbarLevel ? Components.NavToolbar.container : undefined}
        >
          <TopBarExtensionPoint />
          <TopSearchBarCommandPaletteTrigger />
          {!isSmallScreen && <QuickAdd />}
          <HelpTopBarButton isSmallScreen={isSmallScreen} />
          <NavToolbarSeparator />
          {!isSmallScreen && <ExtensionToolbarItem compact={isSmallScreen} />}
          {!showToolbarLevel && actions}
          {!contextSrv.user.isSignedIn && <SignInLink />}
          <InviteUserButton />
          {profileNode && <ProfileButton profileNode={profileNode} onToggleKioskMode={onToggleKioskMode} />}
        </Stack>
      </div>
      {showToolbarLevel && (
        <SingleTopBarActions scopes={scopes} actions={actions} breadcrumbActions={breadcrumbActions} />
      )}
    </>
  );
});

const styles = stylex.create({
  layout: {
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    justifyContent: 'space-between',
  },
  height: (height: number) => ({ height }),
  layoutMenuDocked: {
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 3.5)`,
  },
  breadcrumbsWrapper: {
    display: 'flex',
    overflow: 'hidden',
    minWidth: { default: null, [bp.smDown]: '40%' },
  },
});
