import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { useLocalStorage } from 'react-use';

import { FeatureState, type NavModelItem, toIconName } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Text, IconButton, Icon, Stack, FeatureBadge } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useGrafana } from 'app/core/context/GrafanaContext';

import { Indent } from '../../Indent/Indent';

import { MegaMenuItemText } from './MegaMenuItemText';
import { hasChildMatch } from './utils';

interface Props {
  link: NavModelItem;
  activeItem?: NavModelItem;
  onClick?: () => void;
  level?: number;
  onPin: (item: NavModelItem) => void;
  isPinned: (id?: string) => boolean;
}

const MAX_DEPTH = 2;

export function MegaMenuItem({ link, activeItem, level = 0, onClick, onPin, isPinned }: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const menuIsDocked = state.megaMenuDocked;
  const location = useLocation();
  const hasActiveChild = hasChildMatch(link, activeItem);
  const isActive = link === activeItem || (level === MAX_DEPTH && hasActiveChild);
  const [sectionExpanded, setSectionExpanded] = useLocalStorage(
    `grafana.navigation.expanded[${link.text}]`,
    Boolean(hasActiveChild)
  );
  const showExpandButton = level < MAX_DEPTH && Boolean(linkHasChildren(link) || link.emptyMessage);
  const item = useRef<HTMLLIElement>(null);

  // expand parent sections if child is active
  useEffect(() => {
    if (hasActiveChild) {
      setSectionExpanded(true);
    }
  }, [hasActiveChild, location, menuIsDocked, setSectionExpanded]);

  // scroll active element into center if it's offscreen
  useEffect(() => {
    if (isActive && item.current && isElementOffscreen(item.current)) {
      item.current.scrollIntoView({
        block: 'center',
      });
    }
  }, [isActive]);

  if (!link.url) {
    return null;
  }

  let iconElement: React.JSX.Element | null = null;

  if (link.icon) {
    iconElement = <Icon xstyle={styles.icon} name={toIconName(link.icon) ?? 'link'} size="lg" />;
  } else if (link.img) {
    iconElement = (
      <Stack width={3} justifyContent="center">
        <img {...stylex.props(styles.img)} src={link.img} alt="" />
      </Stack>
    );
  }

  function getIconName(isExpanded: boolean) {
    return isExpanded ? 'angle-up' : 'angle-down';
  }

  return (
    <li ref={item} {...stylex.props(styles.listItem)}>
      <div {...stylex.props(styles.menuItem)}>
        {level !== 0 && <Indent level={level === MAX_DEPTH ? level - 1 : level} spacing={3} />}
        {level === MAX_DEPTH && <div {...stylex.props(styles.itemConnector)} />}
        <div {...stylex.props(styles.collapsibleSectionWrapper)}>
          <MegaMenuItemText
            isActive={isActive}
            onClick={() => {
              link.onClick?.();
              onClick?.();
            }}
            target={link.target}
            url={link.url}
            onPin={() => onPin(link)}
            isPinned={isPinned(link.url)}
            itemName={link.text}
          >
            <div
              {...stylex.props(
                styles.labelWrapper,
                hasActiveChild && styles.hasActiveChild,
                Boolean(level === 0 && iconElement) && styles.labelWrapperWithIcon
              )}
            >
              {level === 0 && iconElement}
              <Text truncate element="p">
                {link.text}
              </Text>
              {link.isNew && <FeatureBadge featureState={FeatureState.new} />}
            </div>
          </MegaMenuItemText>
        </div>
        <div {...stylex.props(styles.collapseButtonWrapper)}>
          {showExpandButton && (
            <IconButton
              aria-label={
                sectionExpanded
                  ? t('navigation.megamenu-item.collapse-aria-label', 'Collapse section: {{sectionName}}', {
                      sectionName: link.text,
                    })
                  : t('navigation.megamenu-item.expand-aria-label', 'Expand section: {{sectionName}}', {
                      sectionName: link.text,
                    })
              }
              aria-expanded={Boolean(sectionExpanded)}
              // IconButton has no `xstyle`; its own `marginRight` beats a StyleX class passed as `className`.
              style={{ margin: 0 }}
              onClick={() => setSectionExpanded(!sectionExpanded)}
              name={getIconName(Boolean(sectionExpanded))}
              size="md"
              variant="secondary"
            />
          )}
        </div>
      </div>
      {showExpandButton && sectionExpanded && (
        <ul {...stylex.props(styles.children)}>
          {linkHasChildren(link) ? (
            link.children
              .filter((childLink) => !childLink.isCreateAction)
              .map((childLink) => (
                <MegaMenuItem
                  key={`${link.text}-${childLink.text}`}
                  link={childLink}
                  activeItem={activeItem}
                  onClick={onClick}
                  level={level + 1}
                  onPin={onPin}
                  isPinned={isPinned}
                />
              ))
          ) : (
            <div {...stylex.props(styles.emptyMessage)} aria-live="polite">
              {link.emptyMessage}
            </div>
          )}
        </ul>
      )}
    </li>
  );
}

const styles = stylex.create({
  icon: {
    width: spacing['--gf-spacing-x3'],
  },

  img: {
    height: spacing['--gf-spacing-x2'],
    width: spacing['--gf-spacing-x2'],
  },

  listItem: {
    flex: '1',
    maxWidth: '100%',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1-5'],
    height: spacing['--gf-spacing-x4'],
    position: 'relative',
  },

  collapseButtonWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: spacing['--gf-spacing-x3'],
    flexShrink: 0,
  },

  itemConnector: {
    position: 'relative',
    height: '100%',
    width: spacing['--gf-spacing-x1-5'],

    '::before': {
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: colors['--gf-colors-border-medium'],
      content: '""',
      height: '100%',
      right: 0,
      position: 'absolute',
      transform: 'translateX(50%)',
    },
  },

  collapsibleSectionWrapper: {
    alignItems: 'center',
    display: 'flex',
    flex: '1',
    height: '100%',
    minWidth: 0,
  },

  labelWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
    minWidth: 0,
  },

  hasActiveChild: {
    color: colors['--gf-colors-text-primary'],
  },

  labelWrapperWithIcon: {
    minWidth: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },

  children: {
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'column',
  },

  emptyMessage: {
    color: colors['--gf-colors-text-secondary'],
    fontStyle: 'italic',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 7)`,
  },
});

function linkHasChildren(link: NavModelItem): link is NavModelItem & { children: NavModelItem[] } {
  return Boolean(link.children && link.children.length > 0);
}

function isElementOffscreen(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom < 0 || rect.top >= window.innerHeight;
}
