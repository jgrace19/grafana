import * as stylex from '@stylexjs/stylex';
import Skeleton from 'react-loading-skeleton';

import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Avatar, Icon, IconButton, Link, Spinner, Text } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
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
        <span {...stylex.props(styles.folderButtonSpacer)} />
        {item.uiKind === 'empty-folder' ? (
          <em {...stylex.props(styles.emptyText)}>
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
          xstyle={styles.chevron}
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
        <span {...stylex.props(styles.folderButtonSpacer)} />
      )}

      <div {...stylex.props(styles.iconNameContainer)}>
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
              {...stylex.props(styles.link)}
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </Text>

        <FolderRepo folder={item} />

        {ownerReference && (
          <div {...stylex.props(styles.ownerReference)}>
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

const styles = stylex.create({
  // 16 is getSvgSize(CHEVRON_SIZE).
  chevron: {
    marginRight: spacing['--gf-spacing-x1'],
    width: 16,
  },
  emptyText: {
    // needed for text to truncate correctly
    overflow: 'hidden',
  },
  // Should be the same size as the <IconButton /> so Dashboard name is aligned to Folder name siblings
  folderButtonSpacer: {
    paddingLeft: `calc(16px + ${spacing['--gf-spacing-x1']})`,
  },
  iconNameContainer: {
    alignItems: 'center',
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    overflow: 'hidden',
  },
  link: {
    textDecoration: { default: null, ':hover': 'underline' },
  },
  ownerReference: {
    display: 'flex',
    marginLeft: spacing['--gf-spacing-x1'],
    alignItems: 'center',
    gap: spacing['--gf-spacing-x0-5'],
    minWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    flexGrow: '0',
    flexShrink: '1',
    flexBasis: 'auto',
  },
});
