import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { megaMenuItemStyles } from './MegaMenuItem.stylex';
import { useEffect, useRef } from 'react';
import * as React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { useLocalStorage } from 'react-use';

import { FeatureState, type GrafanaTheme2, type NavModelItem, toIconName } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Text, IconButton, Icon, Stack, FeatureBadge } from '@grafana/ui';
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
    iconElement = <Icon {...stylex.props(megaMenuItemStyles.icon)} name={toIconName(link.icon) ?? 'link'} size="lg" />;
  } else if (link.img) {
    iconElement = (
      <Stack width={3} justifyContent="center">
        <img {...stylex.props(megaMenuItemStyles.img)} src={link.img} alt="" />
      </Stack>
    );
  }

  function getIconName(isExpanded: boolean) {
    return isExpanded ? 'angle-up' : 'angle-down';
  }

  return (
    <li ref={item} {...stylex.props(megaMenuItemStyles.listItem)}>
      <div {...stylex.props(megaMenuItemStyles.menuItem)}>
        {level !== 0 && <Indent level={level === MAX_DEPTH ? level - 1 : level} spacing={3} />}
        {level === MAX_DEPTH && <div {...stylex.props(megaMenuItemStyles.itemConnector)} />}
        <div {...stylex.props(megaMenuItemStyles.collapsibleSectionWrapper)}>
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
              className={cx(megaMenuItemStyles.labelWrapper, {
                [megaMenuItemStyles.hasActiveChild]: hasActiveChild,
                [megaMenuItemStyles.labelWrapperWithIcon]: Boolean(level === 0 && iconElement),
              })}
            >
              {level === 0 && iconElement}
              <Text truncate element="p">
                {link.text}
              </Text>
              {link.isNew && <FeatureBadge featureState={FeatureState.new} />}
            </div>
          </MegaMenuItemText>
        </div>
        <div {...stylex.props(megaMenuItemStyles.collapseButtonWrapper)}>
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
              {...stylex.props(megaMenuItemStyles.collapseButton)}
              onClick={() => setSectionExpanded(!sectionExpanded)}
              name={getIconName(Boolean(sectionExpanded))}
              size="md"
              variant="secondary"
            />
          )}
        </div>
      </div>
      {showExpandButton && sectionExpanded && (
        <ul {...stylex.props(megaMenuItemStyles.children)}>
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
            <div {...stylex.props(megaMenuItemStyles.emptyMessage)} aria-live="polite">
              {link.emptyMessage}
            </div>
          )}
        </ul>
      )}
    </li>
  );
}


function linkHasChildren(link: NavModelItem): link is NavModelItem & { children: NavModelItem[] } {
  return Boolean(link.children && link.children.length > 0);
}

function isElementOffscreen(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom < 0 || rect.top >= window.innerHeight;
}
