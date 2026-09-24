import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { contentOutlineStyles } from './ContentOutline.stylex';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useToggle, useScroll } from 'react-use';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { PanelContainer, ScrollContainer  } from '@grafana/ui';

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
    <PanelContainer {...stylex.props(contentOutlineStyles.wrapper)} id={panelId}>
      <ScrollContainer>
        <div {...stylex.props(contentOutlineStyles.content)}>
          <ContentOutlineItemButton
            icon={'arrow-from-right'}
            tooltip={
              contentOutlineExpanded
                ? t('explore.content-outline.tooltip-collapse-outline', 'Collapse outline')
                : t('explore.content-outline.tooltip-expand-outline', 'Expand outline')
            }
            tooltipPlacement={contentOutlineExpanded ? 'right' : 'bottom'}
            onClick={toggle}
            {...mergeStylexClassName(stylex.props(contentOutlineStyles.toggleContentOutlineButton, , {
              [mergeStylexClassName(stylex.props(contentOutlineStyles.justifyCenter), undefined).className]: !contentOutlineExpanded && !outlineItemsShouldIndent,
            }), undefined)}
            aria-expanded={contentOutlineExpanded}
          />

          {outlineItems.map((item) => {
            return (
              <Fragment key={item.id}>
                <ContentOutlineItemButton
                  key={item.id}
                  title={contentOutlineExpanded ? item.title : undefined}
                  contentOutlineExpanded={contentOutlineExpanded}
                  className={clsx(mergeStylexClassName(stylex.props(contentOutlineStyles.buttonStyles), undefined).className, {
                    [mergeStylexClassName(stylex.props(contentOutlineStyles.justifyCenter), undefined).className]: !contentOutlineExpanded && !outlineItemsHaveDeleteButton,
                    [mergeStylexClassName(stylex.props(contentOutlineStyles.sectionHighlighter), undefined).className]: isChildActive(item, activeSectionChildId) && !contentOutlineExpanded,
                  })}
                  indentStyle={clsx({
                    [mergeStylexClassName(stylex.props(contentOutlineStyles.indentRoot), undefined).className]: !isCollapsible(item) && outlineItemsShouldIndent,
                    [mergeStylexClassName(stylex.props(contentOutlineStyles.sectionHighlighter), undefined).className]:
                      isChildActive(item, activeSectionChildId) && !contentOutlineExpanded && sectionsExpanded[item.id],
                  })}
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
                      <div key={child.id} {...stylex.props(contentOutlineStyles.itemWrapper)}>
                        {contentOutlineExpanded && (
                          <div
                            className={clsx(mergeStylexClassName(stylex.props(contentOutlineStyles.itemConnector), undefined).className, {
                              [mergeStylexClassName(stylex.props(contentOutlineStyles.firstItemConnector), undefined).className]: i === 0,
                              [mergeStylexClassName(stylex.props(contentOutlineStyles.lastItemConnector), undefined).className]: i === (item.children?.length || 0) - 1,
                            })}
                          />
                        )}
                        <ContentOutlineItemButton
                          key={child.id}
                          title={contentOutlineExpanded ? child.title : undefined}
                          contentOutlineExpanded={contentOutlineExpanded}
                          icon={contentOutlineExpanded ? undefined : item.icon}
                          className={clsx(mergeStylexClassName(stylex.props(contentOutlineStyles.buttonStyles), undefined).className, {
                            [mergeStylexClassName(stylex.props(contentOutlineStyles.justifyCenter), undefined).className]: !contentOutlineExpanded && !outlineItemsHaveDeleteButton,
                            [mergeStylexClassName(stylex.props(contentOutlineStyles.sectionHighlighter), undefined).className]:
                              isChildActive(item, activeSectionChildId) && !contentOutlineExpanded,
                          })}
                          indentStyle={mergeStylexClassName(stylex.props(contentOutlineStyles.indentChild), undefined).className}
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

;

function isCollapsible(item: ContentOutlineItemContextProps): boolean {
  return !!(item.children && item.children.length > 0 && (!item.mergeSingleChild || item.children.length !== 1));
}

function isChildActive(item: ContentOutlineItemContextProps, activeSectionChildId: string | undefined) {
  return item.children?.some((child) => child.id === activeSectionChildId);
}
