import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { type DataLink, type LinkModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Dropdown, Icon, Menu, ToolbarButton, PanelChrome } from '@grafana/ui';
import { colors } from '@grafana/ui/stylex/tokens.stylex';

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
          xstyle={styles.menuTrigger}
        />
      </Dropdown>
    );
  }
}

// ToolbarButton's own :hover, :active and :disabled backgrounds and its :disabled cursor still win.
const styles = stylex.create({
  menuTrigger: {
    height: '100%',
    backgroundColor: {
      default: 'inherit',
      ':disabled': colors['--gf-colors-action-disabled-background'],
      ':hover': {
        default: colors['--gf-colors-action-hover'],
        ':disabled': colors['--gf-colors-action-disabled-background'],
      },
      ':active': colors['--gf-colors-secondary-main'],
    },
    backgroundImage: 'inherit',
    borderStyle: 'none',
    cursor: { default: 'context-menu', ':disabled': 'not-allowed' },
  },
});
