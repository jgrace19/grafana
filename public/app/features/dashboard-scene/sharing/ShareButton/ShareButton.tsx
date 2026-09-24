import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { shareButtonStyles } from './ShareButton.stylex';
import { useCallback, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { type VizPanel } from '@grafana/scenes';
import {Button, ButtonGroup, Dropdown} from '@grafana/ui';

import { type DashboardScene } from '../../scene/DashboardScene';
import { DashboardInteractions } from '../../utils/interactions';

import ShareMenu from './ShareMenu';
import { buildShareUrl } from './utils';

const newShareButtonSelector = e2eSelectors.pages.Dashboard.DashNav.newShareButton;

export default function ShareButton({ dashboard, panel }: { dashboard: DashboardScene; panel?: VizPanel }) {

  const [isOpen, setIsOpen] = useState(false);

  const [{ loading }, buildUrl] = useAsyncFn(async () => {
    DashboardInteractions.toolbarShareClick();
    await buildShareUrl(dashboard, panel);
  }, [dashboard, panel]);

  const onMenuClick = useCallback((isOpen: boolean) => {
    if (isOpen) {
      DashboardInteractions.toolbarShareDropdownClick();
    }

    setIsOpen(isOpen);
  }, []);

  const MenuActions = () => <ShareMenu dashboard={dashboard} />;

  return (
    <ButtonGroup data-testid={newShareButtonSelector.container} {...stylex.props(shareButtonStyles.container)}>
      <Button
        data-testid={newShareButtonSelector.shareLink}
        size="sm"
        tooltip={t('share-dashboard.share-button-tooltip', 'Copy link')}
        onClick={buildUrl}
        icon={loading ? 'spinner' : undefined}
        disabled={loading}
      >
        <Trans i18nKey="share-dashboard.share-button">Share</Trans>
      </Button>
      <Dropdown overlay={MenuActions} placement="bottom-end" onVisibleChange={onMenuClick}>
        <Button
          aria-label={t('dashboard-scene.share-button.aria-label-sharedropdownmenu', 'Toggle share menu')}
          data-testid={newShareButtonSelector.arrowMenu}
          size="sm"
          icon={isOpen ? 'angle-up' : 'angle-down'}
        />
      </Dropdown>
    </ButtonGroup>
  );
}


