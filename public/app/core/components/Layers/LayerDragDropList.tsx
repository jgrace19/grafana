import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { layerDragDropListStyles } from './LayerDragDropList.stylex';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import type { JSX } from 'react';

import { t } from '@grafana/i18n';
import { Icon, IconButton } from '@grafana/ui';

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

  const getRowStyle = (isSelected: boolean) => {
    return isSelected ? `${style.row} ${style.sel}` : style.row;
  };

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
                        className={getRowStyle(isSelected)}
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
                        <div className={style.textWrapper}>&nbsp; {getLayerInfo(element)}</div>

                        {showActions(element) && (
                          <>
                            {onDuplicate ? (
                              <IconButton
                                name="copy"
                                tooltip={t('layers.layer-drag-drop-list.duplicate-tooltip', 'Duplicate')}
                                className={style.actionIcon}
                                onClick={() => onDuplicate(element)}
                              />
                            ) : null}

                            <IconButton
                              name="trash-alt"
                              tooltip={t('layers.layer-drag-drop-list.remove-tooltip', 'Remove')}
                              className={cx(style.actionIcon, style.dragIcon)}
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
                            className={style.dragIcon}
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

