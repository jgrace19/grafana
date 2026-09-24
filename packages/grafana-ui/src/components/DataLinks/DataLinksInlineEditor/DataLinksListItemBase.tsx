import { Draggable } from '@hello-pangea/dnd';
import * as stylex from '@stylexjs/stylex';

import { type Action, type DataFrame, type DataLink } from '@grafana/data';
import { t } from '@grafana/i18n';

import { colors, shape, spacing, typography } from '../../../themes/stylex/tokens.stylex';
import { Badge } from '../../Badge/Badge';
import { Icon } from '../../Icon/Icon';
import { IconButton } from '../../IconButton/IconButton';

import './DataLinksListItemBase.css';

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
          {...stylex.props(styles.wrapper, styles.dragRow)}
          ref={provided.innerRef}
          {...provided.draggableProps}
          key={index}
        >
          <div {...stylex.props(styles.linkDetails)}>
            <div {...stylex.props(styles.url, !hasTitle && styles.notConfigured)}>
              {hasTitle ? title : t('grafana-ui.data-links-inline-editor.title-not-provided', 'Title not provided')}
            </div>
            <div {...stylex.props(styles.url, !hasUrl && styles.notConfigured)} title={url}>
              {hasUrl ? url : t('grafana-ui.data-links-inline-editor.url-not-provided', 'Data link url not provided')}
            </div>
          </div>
          <div {...stylex.props(styles.icons)}>
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
              className="gf-data-links-list-item-icon"
              tooltip={t('grafana-ui.data-links-inline-editor.tooltip-edit', 'Edit')}
            />
            <IconButton
              name="trash-alt"
              onClick={onRemove}
              className="gf-data-links-list-item-icon"
              tooltip={t('grafana-ui.data-links-inline-editor.tooltip-remove', 'Remove')}
            />
            <div {...stylex.props(styles.dragIcon)} {...provided.dragHandleProps}>
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

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '5px',
    paddingRight: 0,
    paddingBottom: '5px',
    paddingLeft: '10px',
    borderRadius: shape['--gf-shape-radius-default'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    gap: 8,
  },
  linkDetails: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    maxWidth: `calc(100% - 100px)`,
  },
  notConfigured: {
    fontStyle: 'italic',
  },
  url: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-size-sm'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dragRow: {
    position: 'relative',
    margin: '8px',
  },
  icons: {
    display: 'flex',
    padding: 6,
    alignItems: 'center',
    gap: 8,
  },
  dragIcon: {
    cursor: 'grab',
    color: colors['--gf-colors-text-secondary'],
    marginTop: 0,
    marginRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
    marginBottom: 0,
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.5)`,
  },
});
