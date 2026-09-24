import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { profileButtonStyles } from './ProfileButton.stylex';
import { cloneDeep } from 'lodash';
import { useToggle } from 'react-use';

import { t } from '@grafana/i18n';
import { config } from '@grafana/runtime';
import { Dropdown, Menu, MenuItem, ToolbarButton } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';

import { ThemeSelectorDrawer } from '../../ThemeSelector/ThemeSelectorDrawer';
import { enrichWithInteractionTracking } from '../MegaMenu/utils';
import { NewsContainer } from '../News/NewsDrawer';

import { TopNavBarMenu } from './TopNavBarMenu';

export interface Props {
  profileNode: NavModelItem;
  onToggleKioskMode: () => void;
}

export function ProfileButton({ profileNode, onToggleKioskMode }: Props) {
  const node = enrichWithInteractionTracking(cloneDeep(profileNode), false);
  const [showNewsDrawer, onToggleShowNewsDrawer] = useToggle(false);
  const [showThemeDrawer, onToggleThemeDrawer] = useToggle(false);

  if (!node) {
    return null;
  }

  const renderMenu = () => (
    <TopNavBarMenu node={profileNode}>
      <>
        {config.featureToggles.grafanaconThemes && (
          <MenuItem icon="palette" onClick={onToggleThemeDrawer} label={t('profile.change-theme', 'Change theme')} />
        )}
        <Menu.Item
          icon="monitor"
          onClick={onToggleKioskMode}
          label={t('profile.enable-kiosk-mode', 'Enable kiosk mode')}
        />
        {config.newsFeedEnabled && (
          <MenuItem
            icon="rss"
            onClick={onToggleShowNewsDrawer}
            label={t('navigation.rss-button', 'Latest from the blog')}
          />
        )}
        <Menu.Divider />
        {!config.auth.disableSignoutMenu && (
          <MenuItem
            url={`${config.appSubUrl}/logout`}
            label={t('nav.sign-out.title', 'Sign out')}
            icon="arrow-from-right"
            target={'_self'}
          />
        )}
      </>
    </TopNavBarMenu>
  );

  return (
    <>
      <Dropdown overlay={renderMenu} placement="bottom-end">
        <ToolbarButton
          {...stylex.props(profileButtonStyles.profileButton)}
          imgSrc={contextSrv.user.gravatarUrl}
          imgAlt="User avatar"
          aria-label={t('navigation.profile.aria-label', 'Profile')}
        />
      </Dropdown>
      {showNewsDrawer && <NewsContainer onClose={onToggleShowNewsDrawer} />}
      {showThemeDrawer && <ThemeSelectorDrawer onClose={onToggleThemeDrawer} />}
    </>
  );
}

