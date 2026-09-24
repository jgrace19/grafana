import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { nameCellStyles } from './NameCell.stylex';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Avatar, Icon, IconButton, Link, Spinner, Text } from '@grafana/ui';
import { getSvgSize } from '@grafana/ui/internal';
import { getIconForItem } from 'app/features/search/service/utils';

import { Indent } from '../../../core/components/Indent/Indent';
import { FolderRepo } from '../../../core/components/NestedFolderPicker/FolderRepo';
import { useChildrenByParentUIDState } from '../state/hooks';
import { type DashboardsTreeCellProps } from '../types';
import { makeRowID } from '../utils/dashboards';

const CHEVRON_SIZE = 'md';
const ICON_SIZE = 'sm';

type NameCellProps = DashboardsTreeCellProps & {
  onFolderClick: (uid: string, newOpenState: boolean) => void;
};

export function NameCell({ row: { original: data }, onFolderClick, treeID }: NameCellProps) {
  const { item, level, isOpen } = data;
  const childrenByParentUID = useChildrenByParentUIDState();

  const isLoading = isOpen && !childrenByParentUID[item.uid];
  const iconName = getIconForItem(data.item, isOpen);
  const ownerReference = item.kind !== 'ui' ? item.ownerReference : undefined;

  if (item.kind === 'ui') {
    return (
      <>
        <Indent
          level={level}
          spacing={{
            xs: 1,
            md: 3,
          }}
        />
        <span {...stylex.props(nameCellStyles.folderButtonSpacer)} />
        {item.uiKind === 'empty-folder' ? (
          <em {...stylex.props(nameCellStyles.emptyText)}>
            <Text variant="body" color="secondary" truncate>
              <Trans i18nKey="browse-dashboards.name-cell.no-items">No items</Trans>
            </Text>
          </em>
        ) : (
          <Skeleton width={200} />
        )}
      </>
    );
  }

  return (
    <>
      <Indent
        level={level}
        spacing={{
          xs: 1,
          md: 3,
        }}
      />

      {item.kind === 'folder' ? (
        <IconButton
          size={CHEVRON_SIZE}
          {...stylex.props(nameCellStyles.chevron)}
          onClick={() => {
            onFolderClick(item.uid, !isOpen);
          }}
          name={isOpen ? 'angle-down' : 'angle-right'}
          aria-label={
            isOpen
              ? t('browse-dashboards.dashboards-tree.collapse-folder-button', 'Collapse folder {{title}}', {
                  title: item.title,
                })
              : t('browse-dashboards.dashboards-tree.expand-folder-button', 'Expand folder {{title}}', {
                  title: item.title,
                })
          }
        />
      ) : (
        <span {...stylex.props(nameCellStyles.folderButtonSpacer)} />
      )}

      <div {...stylex.props(nameCellStyles.iconNameContainer)}>
        {isLoading ? <Spinner size={ICON_SIZE} /> : <Icon size={ICON_SIZE} name={iconName} />}

        <Text variant="body" truncate id={treeID && makeRowID(treeID, item)}>
          {item.url ? (
            <Link
              onClick={() => {
                reportInteraction('grafana_browse_dashboards_page_click_list_item', {
                  itemKind: item.kind,
                  parent: item.parentUID ? 'folder' : 'root',
                  source: 'browseDashboardsPage_BrowseView',
                  uid: item.uid,
                });
              }}
              href={item.url}
              {...stylex.props(nameCellStyles.link)}
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </Text>

        <FolderRepo folder={item} />

        {ownerReference && (
          <div {...stylex.props(nameCellStyles.ownerReference)}>
            {ownerReference.avatarUrl && <Avatar src={ownerReference.avatarUrl} alt={ownerReference.title} />}
            <Text truncate color="secondary" variant="bodySmall">
              {ownerReference.title}
            </Text>
          </div>
        )}
      </div>
    </>
  );
}

;
