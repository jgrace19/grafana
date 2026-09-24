import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { megaMenuItemTextStyles } from './MegaMenuItemText.stylex';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon, IconButton, Link, useTheme2 } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';

export interface Props {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  target?: HTMLAnchorElement['target'];
  url: string;
  onPin: (id?: string) => void;
  isPinned?: boolean;
  itemName: string;
}

export function MegaMenuItemText({ children, isActive, onClick, target, url, onPin, isPinned, itemName }: Props) {
  const theme = useTheme2();

  const styles = getStyles(theme, isActive);
  const LinkComponent = !target && url.startsWith('/') ? Link : 'a';

  const linkContent = (
    <div {...stylex.props(megaMenuItemTextStyles.linkContent)}>
      {children}

      {
        // As nav links are supposed to link to internal urls this option should be used with caution
        target === '_blank' && <Icon data-testid="external-link-icon" name="external-link-alt" />
      }
    </div>
  );

  return (
    <div {...mergeStylexClassName(stylex.props(megaMenuItemTextStyles.wrapper, isActive && megaMenuItemTextStyles.wrapperActive), undefined)}>
      <LinkComponent
        data-testid={selectors.components.NavMenu.item}
        {...stylex.props(megaMenuItemTextStyles.container)}
        href={url}
        target={target}
        onClick={onClick}
        {...(isActive && { 'aria-current': 'page' })}
      >
        {linkContent}
      </LinkComponent>
      {contextSrv.isSignedIn && url && url !== '/bookmarks' && (
        <IconButton
          name="bookmark"
          className={'pin-icon'}
          iconType={isPinned ? 'solid' : 'default'}
          onClick={() => onPin(url)}
          aria-pressed={isPinned}
          tooltip={t('navigation.item.bookmark.tooltip', 'Bookmark {{itemName}}', { itemName })}
        />
      )}
    </div>
  );
}

MegaMenuItemText.displayName = 'MegaMenuItemText';

