import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';
import type { JSX } from 'react';

import { t } from '@grafana/i18n';
import { Icon, IconButton } from '@grafana/ui';
import { colors, components, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { LayerName } from './LayerName';
import { type LayerElement } from './types';

export const DATA_TEST_ID = 'layer-drag-drop-list';

export type LayerDragDropListProps<T extends LayerElement> = {
  layers: T[];
  getLayerInfo: (element: T) => string;
  onDragEnd: (result: DropResult) => void;
  onSelect: (element: T) => void;
  onDelete: (element: T) => void;
  onDuplicate?: (element: T) => void;
  showActions: (element: T) => boolean;
  selection?: string[]; // list of unique ids (names)
  excludeBaseLayer?: boolean;
  onNameChange: (element: T, newName: string) => void;
  verifyLayerNameUniqueness?: (nameToCheck: string) => boolean;
};

export const LayerDragDropList = <T extends LayerElement>({
  layers,
  getLayerInfo,
  onDragEnd,
  onSelect,
  onDelete,
  onDuplicate,
  showActions,
  selection,
  excludeBaseLayer,
  onNameChange,
  verifyLayerNameUniqueness,
}: LayerDragDropListProps<T>) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} data-testid={DATA_TEST_ID}>
            {(() => {
              // reverse order
              const rows: JSX.Element[] = [];
              const lastLayerIndex = excludeBaseLayer ? 1 : 0;
              const shouldRenderDragIconLengthThreshold = excludeBaseLayer ? 2 : 1;
              for (let i = layers.length - 1; i >= lastLayerIndex; i--) {
                const element = layers[i];
                const uid = element.getName();

                const isSelected = Boolean(selection?.includes(uid));
                rows.push(
                  <Draggable key={uid} draggableId={uid} index={rows.length}>
                    {(provided, snapshot) => (
                      <div
                        {...stylex.props(styles.row, isSelected && styles.sel)}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onSelect(element)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect(element);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <LayerName
                          name={uid}
                          onChange={(v) => onNameChange(element, v)}
                          verifyLayerNameUniqueness={verifyLayerNameUniqueness ?? undefined}
                        />
                        <div {...stylex.props(styles.textWrapper)}>&nbsp; {getLayerInfo(element)}</div>

                        {showActions(element) && (
                          <>
                            {onDuplicate ? (
                              <IconButton
                                name="copy"
                                tooltip={t('layers.layer-drag-drop-list.duplicate-tooltip', 'Duplicate')}
                                xstyle={styles.actionIcon}
                                onClick={() => onDuplicate(element)}
                              />
                            ) : null}

                            <IconButton
                              name="trash-alt"
                              tooltip={t('layers.layer-drag-drop-list.remove-tooltip', 'Remove')}
                              xstyle={styles.actionIcon}
                              onClick={() => onDelete(element)}
                            />
                          </>
                        )}
                        {layers.length > shouldRenderDragIconLengthThreshold && (
                          <Icon
                            aria-label={t(
                              'layers.layer-drag-drop-list.draggable-aria-label',
                              'Drag and drop to reorder'
                            )}
                            name="draggabledots"
                            size="lg"
                          />
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              }

              return rows;
            })()}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const styles = stylex.create({
  actionIcon: {
    color: { default: colors['--gf-colors-text-secondary'], ':hover': colors['--gf-colors-text-primary'] },
  },
  row: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    minHeight: spacing['--gf-spacing-x4'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '3px',
    cursor: 'pointer',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':hover': components['--gf-components-input-border-hover'],
    },
  },
  sel: {
    borderColor: colors['--gf-colors-primary-border'],
  },
  textWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: spacing['--gf-spacing-x1'],
  },
});
