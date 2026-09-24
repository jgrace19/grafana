import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { IconButton, Stack } from '@grafana/ui';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
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
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];

  return (
    <div {...stylex.props(styles.header, styles.height(getChromeHeaderLevelHeight()))}>
      <Stack alignItems="center" minWidth={0} gap={1}>
        <HomeLink homeNav={homeNav} inMegaMenuOverlay={!state.megaMenuDocked} />
        <OrganizationSwitcher />
      </Stack>
      <div {...stylex.props(styles.flexGrow)} />
      {/* The wrapper hides the button without competing with IconButton's own `display`. */}
      <span {...stylex.props(styles.dockMenuButton)}>
        <IconButton
          id={DOCK_MENU_BUTTON_ID}
          tooltip={
            state.megaMenuDocked
              ? t('navigation.megamenu.undock', 'Undock menu')
              : t('navigation.megamenu.dock', 'Dock menu')
          }
          name="web-section-alt"
          onClick={handleDockedMenu}
          variant="secondary"
        />
      </span>
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

const styles = stylex.create({
  dockMenuButton: {
    display: { default: 'none', [bp.xlUp]: 'contents' },
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x1'],
    flexShrink: 0,
  },
  height: (height: number) => ({ height }),
  flexGrow: { flexGrow: 1 },
});
