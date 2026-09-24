import clsx from 'clsx';

import { dataLinksListItemBaseStyleProps } from './DataLinksListItemBase.stylex'

import { Draggable } from '@hello-pangea/dnd';

import { type Action, type DataFrame, type DataLink, } from '@grafana/data';
import { t } from '@grafana/i18n';

import { Badge } from '../../Badge/Badge';
import { Icon } from '../../Icon/Icon';
import { IconButton } from '../../IconButton/IconButton';

export interface DataLinksListItemBaseProps<T extends DataLink | Action> {
  index: number;
  item: T;
  data: DataFrame[];
  onChange: (index: number, item: T) => void;
  onEdit: () => void;
  onRemove: () => void;
  isEditing?: boolean;
  itemKey: string;
}

/** @internal */
export function DataLinksListItemBase<T extends DataLink | Action>({
  item,
  onEdit,
  onRemove,
  index,
  itemKey,
}: DataLinksListItemBaseProps<T>) {
  const { title = '', oneClick = false } = item;

  const url = ('type' in item ? item[item.type]?.url : item.url) ?? '';
  const hasTitle = title.trim() !== '';
  const hasUrl = url.trim() !== '';

  return (
    <Draggable key={itemKey} draggableId={itemKey} index={index}>
      {(provided) => (
        <div
          className={clsx(dataLinksListItemBaseStyleProps('wrapper'), dataLinksListItemBaseStyleProps('dragRow'))}
          ref={provided.innerRef}
          {...provided.draggableProps}
          key={index}
        >
          <div {...dataLinksListItemBaseStyleProps('linkDetails')}>
            <div className={clsx(dataLinksListItemBaseStyleProps('url'), !hasTitle && dataLinksListItemBaseStyleProps('notConfigured'))}>
              {hasTitle ? title : t('grafana-ui.data-links-inline-editor.title-not-provided', 'Title not provided')}
            </div>
            <div className={clsx(dataLinksListItemBaseStyleProps('url'), !hasUrl && dataLinksListItemBaseStyleProps('notConfigured'))} title={url}>
              {hasUrl ? url : t('grafana-ui.data-links-inline-editor.url-not-provided', 'Data link url not provided')}
            </div>
          </div>
          <div {...dataLinksListItemBaseStyleProps('icons')}>
            {oneClick && (
              <Badge
                color="blue"
                text={t('grafana-ui.data-links-inline-editor.one-click', 'One click')}
                tooltip={t('grafana-ui.data-links-inline-editor.one-click-enabled', 'One click enabled')}
              />
            )}
            <IconButton
              name="pen"
              onClick={onEdit}
              {...dataLinksListItemBaseStyleProps('icon')}
              tooltip={t('grafana-ui.data-links-inline-editor.tooltip-edit', 'Edit')}
            />
            <IconButton
              name="trash-alt"
              onClick={onRemove}
              {...dataLinksListItemBaseStyleProps('icon')}
              tooltip={t('grafana-ui.data-links-inline-editor.tooltip-remove', 'Remove')}
            />
            <div {...dataLinksListItemBaseStyleProps('dragIcon')} {...provided.dragHandleProps}>
              <Icon
                name="draggabledots"
                size="lg"
                title={t('grafana-ui.data-links-inline-editor.drag-handle-label', 'Reorder data link {{title}}', {
                  title: hasTitle ? title : url,
                })}
              />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

;
