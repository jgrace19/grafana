import * as stylex from '@stylexjs/stylex';
import { memo, useEffect } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

import { t } from '@grafana/i18n';
import { FilterInput } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { Page } from 'app/core/components/Page/Page';
import { ActionRow } from 'app/features/search/page/components/ActionRow';
import { getGrafanaSearcher } from 'app/features/search/service/searcher';
import { useDispatch } from 'app/types/store';

import { useRecentlyDeletedStateManager } from './api/useRecentlyDeletedStateManager';
import { RecentlyDeletedActions } from './components/RecentlyDeletedActions';
import { RecentlyDeletedEmptyState } from './components/RecentlyDeletedEmptyState';
import { SearchView } from './components/SearchView';
import { getFolderPermissions } from './permissions';
import { useHasSelection } from './state/hooks';
import { setAllSelection } from './state/slice';

const RecentlyDeletedPage = memo(() => {
  const dispatch = useDispatch();

  const [searchState, stateManager] = useRecentlyDeletedStateManager();
  const hasSelection = useHasSelection();

  const { canEditFolders, canEditDashboards, canDeleteFolders, canDeleteDashboards } = getFolderPermissions();
  const permissions = { canEditFolders, canEditDashboards, canDeleteFolders, canDeleteDashboards };

  useEffect(() => {
    stateManager.initStateFromUrl(undefined);

    // Clear selected state when folderUID changes
    dispatch(
      setAllSelection({
        isSelected: false,
        folderUID: undefined,
      })
    );
  }, [dispatch, stateManager]);

  return (
    <Page navId="dashboards/recently-deleted">
      <Page.Contents className={stylex.props(styles.pageContents).className}>
        <div>
          <FilterInput
            placeholder={t('recentlyDeleted.filter.placeholder', 'Search for dashboards')}
            value={searchState.query}
            escapeRegex={false}
            onChange={stateManager.onQueryChange}
          />
        </div>

        {hasSelection ? (
          <RecentlyDeletedActions />
        ) : (
          <ActionRow
            state={searchState}
            getTagOptions={stateManager.getTagOptions}
            getSortOptions={stateManager.getSortOptions}
            sortPlaceholder={getGrafanaSearcher().sortPlaceholder}
            onLayoutChange={stateManager.onLayoutChange}
            onSortChange={stateManager.onSortChange}
            onTagFilterChange={stateManager.onTagFilterChange}
            onDatasourceChange={stateManager.onDatasourceChange}
            onPanelTypeChange={stateManager.onPanelTypeChange}
            onSetIncludePanels={stateManager.onSetIncludePanels}
          />
        )}

        <div {...stylex.props(styles.subView)}>
          <AutoSizer>
            {({ width, height }) => (
              <SearchView
                permissions={permissions}
                width={width}
                height={height}
                searchStateManager={stateManager}
                searchState={searchState}
                emptyState={<RecentlyDeletedEmptyState searchState={searchState} />}
              />
            )}
          </AutoSizer>
        </div>
      </Page.Contents>
    </Page>
  );
});

const styles = stylex.create({
  pageContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing['--gf-spacing-x1'],
    height: '100%',
  },

  // AutoSizer needs an element to measure the full height available
  subView: {
    height: '100%',
    minHeight: '300px',
  },
});

RecentlyDeletedPage.displayName = 'RecentlyDeletedPage';
export default RecentlyDeletedPage;
