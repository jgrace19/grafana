import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { t } from '@grafana/i18n';
import { Icon, IconButton, Link } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { contextSrv } from 'app/core/services/context_srv';

import { menuItemMarker } from './markers.stylex';

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
  const LinkComponent = !target && url.startsWith('/') ? Link : 'a';

  const linkContent = (
    <div {...stylex.props(styles.linkContent)}>
      {children}

      {
        // As nav links are supposed to link to internal urls this option should be used with caution
        target === '_blank' && <Icon data-testid="external-link-icon" name="external-link-alt" />
      }
    </div>
  );

  return (
    <div {...stylex.props(styles.wrapper, menuItemMarker, isActive && styles.wrapperActive)}>
      <LinkComponent
        data-testid={selectors.components.NavMenu.item}
        {...stylex.props(styles.container, isActive && styles.containerActive)}
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
          className={`pin-icon ${stylex.props(styles.pinIcon).className}`}
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

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  pinIcon: {
    visibility: {
      default: 'hidden',
      [stylex.when.ancestor(':hover', menuItemMarker)]: 'visible',
      [stylex.when.ancestor(':focus-within', menuItemMarker)]: 'visible',
    },
  },
  wrapperActive: {
    backgroundColor: colors['--gf-colors-action-selected'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    position: 'relative',
    color: colors['--gf-colors-text-primary'],
    '::before': {
      backgroundImage: colors['--gf-colors-gradients-brand-vertical'],
      borderRadius: shape['--gf-shape-radius-default'],
      content: '" "',
      display: 'block',
      height: '100%',
      position: 'absolute',
      transform: 'translateX(-50%)',
      left: 0,
      width: spacing['--gf-spacing-x0-25'],
    },
  },
  container: {
    alignItems: 'center',
    color: colors['--gf-colors-text-secondary'],
    height: '100%',
    position: 'relative',
    width: {
      default: '100%',
      [stylex.when.ancestor(':hover', menuItemMarker)]: 'calc(100% - 20px)',
      [stylex.when.ancestor(':focus-within', menuItemMarker)]: 'calc(100% - 20px)',
    },
    boxShadow: { default: null, ':focus-visible': 'none' },
    outlineWidth: { default: null, ':focus-visible': '2px' },
    outlineStyle: { default: null, ':focus-visible': 'solid' },
    outlineColor: { default: null, ':focus-visible': colors['--gf-colors-primary-main'] },
    outlineOffset: { default: null, ':focus-visible': '-2px' },
  },
  containerActive: {
    color: colors['--gf-colors-text-primary'],
  },
  linkContent: {
    alignItems: 'center',
    display: 'flex',
    gap: '0.5rem',
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
});
