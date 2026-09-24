import * as stylex from '@stylexjs/stylex';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useToggle, useScroll } from 'react-use';

import { store } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { PanelContainer, ScrollContainer } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type ContentOutlineItemContextProps, useContentOutlineContext } from './ContentOutlineContext';
import { ContentOutlineItemButton } from './ContentOutlineItemButton';

function scrollableChildren(item: ContentOutlineItemContextProps) {
  return item.children?.filter((child) => child.type !== 'filter') || [];
}

type SectionsExpanded = Record<string, boolean>;

function shouldBeActive(
  item: ContentOutlineItemContextProps,
  activeSectionId: string,
  activeSectionChildId: string | undefined,
  sectionsExpanded: SectionsExpanded
) {
  const isAnActiveParent = activeSectionId === item.id;
  const isAnActiveChild = activeSectionChildId === item.id;
  const isCollapsed = !sectionsExpanded[item.id];
  const containsScrollableChildren = scrollableChildren(item).length > 0;
  const anyChildActive = isChildActive(item, activeSectionChildId) && !sectionsExpanded[item.id];

  if (containsScrollableChildren) {
    return isCollapsed && (isAnActiveParent || anyChildActive);
  } else {
    return isAnActiveParent || isAnActiveChild;
  }
}

export const CONTENT_OUTLINE_LOCAL_STORAGE_KEYS = {
  visible: 'grafana.explore.contentOutline.visible',
  expanded: 'grafana.explore.contentOutline.expanded',
};

export function ContentOutline({ scroller, panelId }: { scroller: HTMLElement | undefined; panelId: string }) {
  const [contentOutlineExpanded, toggleContentOutlineExpanded] = useToggle(
    store.getBool(CONTENT_OUTLINE_LOCAL_STORAGE_KEYS.expanded, true)
  );
  const scrollerRef = useRef(scroller || null);
  const { y: verticalScroll } = useScroll(scrollerRef);
  const { outlineItems } = useContentOutlineContext() ?? { outlineItems: [] };
  const [activeSectionId, setActiveSectionId] = useState(outlineItems[0]?.id);
  const [activeSectionChildId, setActiveSectionChildId] = useState(outlineItems[0]?.children?.[0]?.id);

  const outlineItemsShouldIndent = outlineItems.some(
    (item) => item.children && !(item.mergeSingleChild && item.children?.length === 1) && item.children.length > 0
  );

  const outlineItemsHaveDeleteButton = outlineItems.some((item) => item.children?.some((child) => child.onRemove));

  const [sectionsExpanded, setSectionsExpanded] = useState(() => {
    return outlineItems.reduce((acc: { [key: string]: boolean }, item) => {
      acc[item.id] = !!item.expanded;
      return acc;
    }, {});
  });

  const scrollIntoView = (ref: HTMLElement | null, customOffsetTop = 0) => {
    let scrollValue = 0;
    let el: HTMLElement | null | undefined = ref;

    if (!el) {
      return;
    }

    do {
      scrollValue += el?.offsetTop || 0;
      el = el?.offsetParent instanceof HTMLElement ? el.offsetParent : undefined;
    } while (el && el !== scroller);

    scroller?.scroll({
      top: scrollValue + customOffsetTop,
      behavior: 'smooth',
    });
  };

  const handleItemClicked = (item: ContentOutlineItemContextProps) => {
    if (item.level === 'child' && item.type === 'filter') {
      const activeParent = outlineItems.find((parent) => {
        return parent.children?.find((child) => child.id === item.id);
      });

      if (activeParent) {
        scrollIntoView(activeParent.ref, activeParent.customTopOffset);
      }
    } else {
      scrollIntoView(item.ref, item.customTopOffset);
      reportInteraction('explore_toolbar_contentoutline_clicked', {
        item: 'select_section',
        type: item.panelId,
      });
    }
  };

  const toggle = () => {
    store.set(CONTENT_OUTLINE_LOCAL_STORAGE_KEYS.expanded, !contentOutlineExpanded);
    toggleContentOutlineExpanded();
    reportInteraction('explore_toolbar_contentoutline_clicked', {
      item: 'outline',
      type: contentOutlineExpanded ? 'minimize' : 'expand',
    });
  };

  const toggleSection = (itemId: string) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    reportInteraction('explore_toolbar_contentoutline_clicked', {
      item: 'section',
      type: !sectionsExpanded[itemId] ? 'minimize' : 'expand',
    });
  };

  useEffect(() => {
    let activeItem;

    for (const item of outlineItems) {
      let top = item?.ref?.getBoundingClientRect().top;

      // Check item
      if (top && top >= 0) {
        activeItem = item;
      }

      // Check children
      const activeChild = scrollableChildren(item).find((child) => {
        const offsetTop = child.customTopOffset || 0;
        let childTop = child?.ref?.getBoundingClientRect().top;
        return childTop && childTop >= offsetTop;
      });

      if (activeChild && isCollapsible(item)) {
        setActiveSectionChildId(activeChild.id);
        setActiveSectionId(item.id);
        break;
      }

      if (activeItem) {
        setActiveSectionId(activeItem.id);
        setActiveSectionChildId(undefined);
        break;
      }
    }
  }, [outlineItems, verticalScroll]);

  return (
    <PanelContainer xstyle={[styles.wrapper, contentOutlineExpanded && styles.wrapperExpanded]} id={panelId}>
      <ScrollContainer>
        <div {...stylex.props(styles.content)}>
          <ContentOutlineItemButton
            icon={'arrow-from-right'}
            tooltip={
              contentOutlineExpanded
                ? t('explore.content-outline.tooltip-collapse-outline', 'Collapse outline')
                : t('explore.content-outline.tooltip-expand-outline', 'Expand outline')
            }
            tooltipPlacement={contentOutlineExpanded ? 'right' : 'bottom'}
            onClick={toggle}
            xstyle={[
              styles.toggleContentOutlineButton,
              contentOutlineExpanded && styles.toggleContentOutlineButtonExpanded,
              !contentOutlineExpanded && !outlineItemsShouldIndent && styles.justifyCenter,
            ]}
            aria-expanded={contentOutlineExpanded}
          />

          {outlineItems.map((item) => {
            return (
              <Fragment key={item.id}>
                <ContentOutlineItemButton
                  key={item.id}
                  title={contentOutlineExpanded ? item.title : undefined}
                  contentOutlineExpanded={contentOutlineExpanded}
                  xstyle={[
                    styles.buttonStyles,
                    !contentOutlineExpanded && !outlineItemsHaveDeleteButton && styles.justifyCenter,
                    isChildActive(item, activeSectionChildId) && !contentOutlineExpanded && styles.sectionHighlighter,
                  ]}
                  indentXstyle={[
                    !isCollapsible(item) && outlineItemsShouldIndent && styles.indentRoot,
                    isChildActive(item, activeSectionChildId) &&
                      !contentOutlineExpanded &&
                      sectionsExpanded[item.id] &&
                      styles.sectionHighlighter,
                  ]}
                  icon={item.icon}
                  onClick={() => handleItemClicked(item)}
                  tooltip={item.title}
                  collapsible={isCollapsible(item)}
                  collapsed={!sectionsExpanded[item.id]}
                  toggleCollapsed={() => toggleSection(item.id)}
                  isActive={shouldBeActive(item, activeSectionId, activeSectionChildId, sectionsExpanded)}
                  sectionId={item.id}
                  color={item.color}
                />
                <div id={item.id} data-testid={`section-wrapper-${item.id}`}>
                  {item.children &&
                    isCollapsible(item) &&
                    sectionsExpanded[item.id] &&
                    item.children.map((child, i) => (
                      <div key={child.id} {...stylex.props(styles.itemWrapper)}>
                        {contentOutlineExpanded && (
                          <div
                            {...stylex.props(
                              styles.itemConnector,
                              i === 0 && styles.firstItemConnector,
                              i === (item.children?.length || 0) - 1 && styles.lastItemConnector
                            )}
                          />
                        )}
                        <ContentOutlineItemButton
                          key={child.id}
                          title={contentOutlineExpanded ? child.title : undefined}
                          contentOutlineExpanded={contentOutlineExpanded}
                          icon={contentOutlineExpanded ? undefined : item.icon}
                          xstyle={[
                            styles.buttonStyles,
                            !contentOutlineExpanded && !outlineItemsHaveDeleteButton && styles.justifyCenter,
                            isChildActive(item, activeSectionChildId) &&
                              !contentOutlineExpanded &&
                              styles.sectionHighlighter,
                          ]}
                          indentXstyle={contentOutlineExpanded ? styles.indentChildExpanded : styles.indentChild}
                          onClick={(e) => {
                            handleItemClicked(child);
                            child.onClick?.(e);
                          }}
                          tooltip={child.title}
                          isActive={shouldBeActive(child, activeSectionId, activeSectionChildId, sectionsExpanded)}
                          extraHighlight={child.highlight}
                          color={child.color}
                          onRemove={child.onRemove ? () => child.onRemove?.(child.id) : undefined}
                        />
                      </div>
                    ))}
                </div>
              </Fragment>
            );
          })}
        </div>
      </ScrollContainer>
    </PanelContainer>
  );
}

const styles = stylex.create({
  wrapper: {
    backgroundColor: colors['--gf-colors-background-primary'],
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginRight: spacing['--gf-spacing-x1'],
    height: '100%',
  },
  wrapperExpanded: {
    width: '160px',
    minWidth: '160px',
  },
  content: {
    marginLeft: spacing['--gf-spacing-x0-5'],
    top: 0,
  },
  // Passed as the item button's xstyle, which replaces its `color`: repeat the button's resting colour.
  buttonStyles: {
    display: 'flex',
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
    textDecoration: { default: null, ':hover': 'underline' },
  },
  toggleContentOutlineButton: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
  toggleContentOutlineButtonExpanded: {
    transform: 'rotate(180deg)',
    marginRight: spacing['--gf-spacing-x0-5'],
  },
  indentRoot: {
    paddingLeft: spacing['--gf-spacing-x3'],
  },
  indentChild: {
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 2.75)`,
  },
  indentChildExpanded: {
    paddingLeft: spacing['--gf-spacing-x5'],
  },
  itemWrapper: {
    display: 'flex',
    height: spacing['--gf-spacing-x4'],
    alignItems: 'center',
  },
  itemConnector: {
    position: 'relative',
    height: '100%',
    width: spacing['--gf-spacing-x1-5'],
    '::before': {
      borderRightWidth: '1px',
      borderRightStyle: 'solid',
      borderRightColor: colors['--gf-colors-border-medium'],
      content: '""',
      height: '100%',
      left: `calc(${spacing['--gf-spacing-grid-size']} * 4.75)`,
      position: 'absolute',
      transform: 'translateX(50%)',
    },
  },
  firstItemConnector: {
    '::before': {
      top: spacing['--gf-spacing-x1'],
      height: `calc(100% - ${spacing['--gf-spacing-x1']})`,
    },
  },
  lastItemConnector: {
    '::before': {
      height: `calc(100% - ${spacing['--gf-spacing-x1']})`,
    },
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  sectionHighlighter: {
    backgroundColor: colors['--gf-colors-background-secondary'],
  },
});

function isCollapsible(item: ContentOutlineItemContextProps): boolean {
  return !!(item.children && item.children.length > 0 && (!item.mergeSingleChild || item.children.length !== 1));
}

function isChildActive(item: ContentOutlineItemContextProps, activeSectionChildId: string | undefined) {
  return item.children?.some((child) => child.id === activeSectionChildId);
}
