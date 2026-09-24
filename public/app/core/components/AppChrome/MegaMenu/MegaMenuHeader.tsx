import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton, Stack, useTheme2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { useSelector } from 'app/types/store';

import { HomeLink } from '../../Branding/Branding';
import { OrganizationSwitcher } from '../OrganizationSwitcher/OrganizationSwitcher';
import { getChromeHeaderLevelHeight } from '../TopBar/useChromeHeaderHeight';

export interface Props {
  handleDockedMenu: () => void;
  onClose: () => void;
}

export const DOCK_MENU_BUTTON_ID = 'dock-menu-button';
export const MEGA_MENU_HEADER_TOGGLE_ID = 'mega-menu-header-toggle';

export function MegaMenuHeader({ handleDockedMenu, onClose }: Props) {
  const theme = useTheme2();
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];
  const styles = getStyles(theme);

  return (
    <div {...stylex.props(megaMenuHeaderStyles.header)}>
      <Stack alignItems="center" minWidth={0} gap={1}>
        <HomeLink homeNav={homeNav} inMegaMenuOverlay={!state.megaMenuDocked} />
        <OrganizationSwitcher />
      </Stack>
      <div {...stylex.props(megaMenuHeaderStyles.flexGrow)} />
      <IconButton
        id={DOCK_MENU_BUTTON_ID}
        {...stylex.props(megaMenuHeaderStyles.dockMenuButton)}
        tooltip={
          state.megaMenuDocked
            ? t('navigation.megamenu.undock', 'Undock menu')
            : t('navigation.megamenu.dock', 'Dock menu')
        }
        name="web-section-alt"
        onClick={handleDockedMenu}
        variant="secondary"
      />
      <IconButton
        aria-label={t('navigation.megamenu.close', 'Close menu')}
        tooltip={t('navigation.megamenu.close', 'Close menu')}
        name="times"
        onClick={onClose}
        size="lg"
        variant="secondary"
      />
    </div>
  );
}

MegaMenuHeader.displayName = 'MegaMenuHeader';

