import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useMemo } from 'react';

import { t, Trans } from '@grafana/i18n';
import type { DashboardLink } from '@grafana/schema';
import { Box, Button, Icon, Stack, Text, Tooltip } from '@grafana/ui';
import { easings, motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { dashboardEditActions } from '../../edit-pane/shared';
import { type DashboardScene } from '../../scene/DashboardScene';
import { DashboardInteractions } from '../../utils/interactions';

import { openAddLinkPane, openLinkEditPane } from './LinkAddEditableElement';
import { linkContentMarker } from './markers.stylex';

function partitionLinks(links: DashboardLink[]) {
  const standardLinks: Array<{ link: DashboardLink; originalIndex: number }> = [];
  const controlsMenuLinks: Array<{ link: DashboardLink; originalIndex: number }> = [];

  links.forEach((link, index) => {
    if (link.placement === 'inControlsMenu') {
      controlsMenuLinks.push({ link, originalIndex: index });
    } else {
      standardLinks.push({ link, originalIndex: index });
    }
  });

  return { standardLinks, controlsMenuLinks };
}

export function LinkList({ dashboard }: { dashboard: DashboardScene }) {
  const { links } = dashboard.useState();

  const onSelectLink = useCallback(
    (linkIndex: number) => {
      openLinkEditPane(dashboard, linkIndex);
    },
    [dashboard]
  );

  const onAddLink = useCallback(() => {
    openAddLinkPane(dashboard);
    DashboardInteractions.addLinkButtonClicked({ source: 'edit_pane' });
  }, [dashboard]);

  const { standardLinks, controlsMenuLinks } = useMemo(() => partitionLinks(links ?? []), [links]);

  const createDragEndHandler = useCallback(
    (
      sourceList: Array<{ link: DashboardLink; originalIndex: number }>,
      otherList: Array<{ link: DashboardLink; originalIndex: number }>
    ) => {
      return (result: DropResult) => {
        const currentLinks = dashboard.state.links ?? [];

        dashboardEditActions.edit({
          source: dashboard,
          description: t(
            'dashboard-scene.link-list.create-drag-end-handler.description.reorder-links-list',
            'Reorder links list'
          ),
          perform: () => {
            if (!result.destination || result.destination.index === result.source.index) {
              return;
            }

            const updatedList = [...sourceList];
            const [movedLink] = updatedList.splice(result.source.index, 1);
            updatedList.splice(result.destination.index, 0, movedLink);

            const isSourceStandard = sourceList === standardLinks;
            const merged = isSourceStandard ? [...updatedList, ...otherList] : [...otherList, ...updatedList];

            dashboard.setState({ links: merged.map((item) => item.link) });
          },
          undo: () => {
            dashboard.setState({ links: currentLinks });
          },
        });
      };
    },
    [dashboard, standardLinks]
  );

  const onStandardDragEnd = useMemo(
    () => createDragEndHandler(standardLinks, controlsMenuLinks),
    [controlsMenuLinks, createDragEndHandler, standardLinks]
  );

  const onControlsDragEnd = useMemo(
    () => createDragEndHandler(controlsMenuLinks, standardLinks),
    [controlsMenuLinks, createDragEndHandler, standardLinks]
  );

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    event.stopPropagation();
  }, []);

  const renderList = (list: Array<{ link: DashboardLink; originalIndex: number }>, droppableId: string) => (
    <Droppable droppableId={droppableId} direction="vertical">
      {(provided) => (
        <Stack ref={provided.innerRef} {...provided.droppableProps} direction="column" gap={0}>
          {list.map((item, index) => (
            <Draggable key={`link-${item.originalIndex}`} draggableId={`link-${item.originalIndex}`} index={index}>
              {(draggableProvided) => (
                <div
                  {...stylex.props(styles.linkItem)}
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                >
                  <div {...draggableProvided.dragHandleProps} onPointerDown={onPointerDown}>
                    <Tooltip content={t('dashboard.edit-pane.links.reorder', 'Drag to reorder')} placement="top">
                      <Icon name="draggabledots" size="md" xstyle={styles.dragHandle} />
                    </Tooltip>
                  </div>
                  <div
                    {...stylex.props(styles.linkContent, linkContentMarker)}
                    aria-label={t('dashboard-scene.link-list.render-list.aria-label-link', 'Link')}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectLink(item.originalIndex)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectLink(item.originalIndex);
                      }
                    }}
                  >
                    <Text truncate>{item.link.title || t('dashboard.edit-pane.links.untitled', 'Untitled link')}</Text>
                    {item.link.placement === 'inControlsMenu' && (
                      <Icon name="sliders-v-alt" size="sm" xstyle={styles.hiddenIcon} />
                    )}
                    <Stack direction="row" gap={1} alignItems="center">
                      <Button
                        variant="primary"
                        size="sm"
                        fill="outline"
                        className={stylex.props(styles.selectButton).className}
                      >
                        <Trans i18nKey="dashboard.edit-pane.links.select-link">Select</Trans>
                      </Button>
                    </Stack>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Stack>
      )}
    </Droppable>
  );

  return (
    <Stack direction="column" gap={0}>
      <DragDropContext onDragEnd={onStandardDragEnd}>
        {renderList(standardLinks, 'links-outline-standard')}
      </DragDropContext>
      {controlsMenuLinks.length > 0 && (
        <DragDropContext onDragEnd={onControlsDragEnd}>
          {renderList(controlsMenuLinks, 'links-outline-controls')}
        </DragDropContext>
      )}
      <Box paddingBottom={1} paddingTop={1} display={'flex'}>
        <Button fullWidth icon="plus" size="sm" variant="secondary" onClick={onAddLink}>
          <Trans i18nKey="dashboard.edit-pane.links.add-link">Add link</Trans>
        </Button>
      </Box>
    </Stack>
  );
}

const styles = stylex.create({
  linkItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    padding: spacing['--gf-spacing-x0-5'],
  },
  linkContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing['--gf-spacing-x0-5'],
    width: '100%',
    cursor: 'pointer',
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'color' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '250ms' },
    transitionTimingFunction: { default: null, [motion.noPreferenceOrReduce]: easings.easeInOut },
    transitionDelay: { default: null, [motion.noPreferenceOrReduce]: '0ms' },
    color: { default: null, ':hover': colors['--gf-colors-text-link'] },
  },
  // Button doesn't set visibility itself, so a StyleX class can't conflict with it.
  selectButton: {
    visibility: { default: 'hidden', [stylex.when.ancestor(':hover', linkContentMarker)]: 'visible' },
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    cursor: { default: 'grab', ':active': 'grabbing' },
    color: colors['--gf-colors-text-secondary'],
  },
  hiddenIcon: {
    color: colors['--gf-colors-text-secondary'],
    marginLeft: spacing['--gf-spacing-x1'],
  },
});
