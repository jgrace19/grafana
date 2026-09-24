import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { playlistTableRowsStyles } from './PlaylistTableRows.stylex';
import { Draggable } from '@hello-pangea/dnd';
import pluralize from 'pluralize';
import { type ReactNode } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { Icon, IconButton, Spinner, type IconName } from '@grafana/ui';
import { TagBadge } from 'app/core/components/TagFilter/TagBadge';

import { type PlaylistItemUI } from './types';

interface Props {
  items: PlaylistItemUI[];
  onDelete: (idx: number) => void;
}

export const PlaylistTableRows = ({ items, onDelete }: Props) => {

  if (!items?.length) {
    return (
      <div>
        <em>
          <Trans i18nKey="playlist-edit.form.table-empty">Playlist is empty. Add dashboards below.</Trans>
        </em>
      </div>
    );
  }

  const renderItem = (item: PlaylistItemUI) => {
    let icon: IconName = item.type === 'dashboard_by_tag' ? 'apps' : 'tag-alt';
    const info: ReactNode[] = [];

    const first = item.dashboards?.[0];
    if (!item.dashboards) {
      info.push(<Spinner key="spinner" />);
    } else if (item.type === 'dashboard_by_tag') {
      info.push(<TagBadge key={item.value} label={item.value} removeIcon={false} count={0} />);
      if (!first) {
        icon = 'exclamation-triangle';
        info.push(
          <span key="no-dashboards">
            &nbsp;{' '}
            <span key="info">
              <Trans i18nKey="playlist.playlist-table-rows.no-dashboards-found">No dashboards found</Trans>
            </span>
          </span>
        );
      } else {
        info.push(<span key="info">&nbsp; {pluralize('dashboard', item.dashboards.length, true)}</span>);
      }
    } else if (first) {
      info.push(
        item.dashboards.length > 1 ? (
          <span key="multiple-dashboards">
            &nbsp;{' '}
            <span key="info">
              <Trans i18nKey="playlist.playlist-table-rows.multiple-dashboards-found" values={{ items: item.value }}>
                Multiple items found: {'{{items}}'}
              </Trans>
            </span>
          </span>
        ) : (
          <span key="info">{first.name ?? item.value}</span>
        )
      );
    } else {
      icon = 'exclamation-triangle';
      info.push(
        <span key="not-found">
          &nbsp;{' '}
          <span key="info">
            <Trans i18nKey="playlist.playlist-table-rows.not-found" values={{ items: item.value }}>
              Not found: {'{{items}}'}
            </Trans>
          </span>
        </span>
      );
    }
    return (
      <>
        <Icon name={icon} {...stylex.props(playlistTableRowsStyles.rightMargin)} key="icon" />
        {info}
      </>
    );
  };

  return (
    <>
      {items.map((item, index) => (
        <Draggable key={`${index}/${item.value}`} draggableId={`${index}`} index={index}>
          {(provided) => (
            <div {...stylex.props(playlistTableRowsStyles.row)} ref={provided.innerRef} {...provided.draggableProps} role="row">
              <div
                {...stylex.props(playlistTableRowsStyles.actions)}
                role="cell"
                aria-label={t(
                  'playlist.playlist-table-rows.aria-label-playlist-item',
                  'Playlist item, {{itemType}}, {{itemValue}}',
                  { itemType: item.type, itemValue: item.value }
                )}
              >
                {renderItem(item)}
              </div>
              <div {...stylex.props(playlistTableRowsStyles.actions)}>
                <IconButton
                  name="times"
                  size="md"
                  onClick={() => onDelete(index)}
                  data-testid={selectors.pages.PlaylistForm.itemDelete}
                  tooltip={t('playlist-edit.form.table-delete', 'Delete playlist item')}
                />
                <div {...provided.dragHandleProps}>
                  <Icon
                    title={t('playlist-edit.form.table-drag', 'Reorder playlist item')}
                    name="draggabledots"
                    size="md"
                  />
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );
};

