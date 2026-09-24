// eslint-disable-next-line no-restricted-imports -- stylex: pending ToolbarButton migration (see menuTrigger)
import { css } from '@emotion/css';
import type { JSX } from 'react';

import { type DataLink, type LinkModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Dropdown, Icon, Menu, ToolbarButton, PanelChrome } from '@grafana/ui';
import { shape } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  panelLinks: DataLink[];
  onShowPanelLinks: () => LinkModel[];
}

export function PanelLinks({ panelLinks, onShowPanelLinks }: Props) {
  const getLinksContent = (): JSX.Element => {
    const interpolatedLinks = onShowPanelLinks();
    return (
      <Menu>
        {interpolatedLinks?.map((link, idx) => {
          return <Menu.Item key={idx} label={link.title} url={link.href} target={link.target} onClick={link.onClick} />;
        })}
      </Menu>
    );
  };

  if (panelLinks.length === 1) {
    const linkModel = onShowPanelLinks()[0];
    return (
      <PanelChrome.TitleItem
        href={linkModel.href}
        onClick={linkModel.onClick}
        target={linkModel.target}
        title={linkModel.title}
      >
        <Icon name="external-link-alt" size="md" />
      </PanelChrome.TitleItem>
    );
  } else {
    return (
      <Dropdown overlay={getLinksContent}>
        <ToolbarButton
          icon="external-link-alt"
          iconSize="md"
          aria-label={t('dashboard.panel-links.aria-label-panel-links', 'Panel links')}
          className={menuTrigger}
        />
      </Dropdown>
    );
  }
}

// stylex: pending ToolbarButton migration. ToolbarButton's own Emotion height, background and border would beat
// a StyleX override.
const menuTrigger = css({
  height: '100%',
  background: 'inherit',
  border: 'none',
  borderRadius: shape['--gf-shape-radius-default'],
  cursor: 'context-menu',
});
