import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { libraryPanelsSearchStyles } from './LibraryPanelsSearch.stylex';
import { memo, useCallback, useState, type JSX } from 'react';
import { useDebounce } from 'react-use';

import { t } from '@grafana/i18n';
import { Stack, FilterInput } from '@grafana/ui';

import { FolderFilter } from '../../../../core/components/FolderFilter/FolderFilter';
import { PanelTypeFilter } from '../../../../core/components/PanelTypeFilter/PanelTypeFilter';
import { SortPicker } from '../../../../core/components/Select/SortPicker';
import { DEFAULT_PER_PAGE_PAGINATION } from '../../../../core/constants';
import { type LibraryElementDTO } from '../../types';
import { LibraryPanelsView } from '../LibraryPanelsView/LibraryPanelsView';

export enum LibraryPanelsSearchVariant {
  Tight = 'tight',
  Spacious = 'spacious',
}

export interface LibraryPanelsSearchProps {
  onClick: (panel: LibraryElementDTO) => void;
  variant?: LibraryPanelsSearchVariant;
  showSort?: boolean;
  showPanelFilter?: boolean;
  showFolderFilter?: boolean;
  showSecondaryActions?: boolean;
  currentPanelId?: string;
  currentFolderUID?: string;
  perPage?: number;
}

export const LibraryPanelsSearch = ({
  onClick,
  variant = LibraryPanelsSearchVariant.Spacious,
  currentPanelId,
  currentFolderUID,
  perPage = DEFAULT_PER_PAGE_PAGINATION,
  showPanelFilter = false,
  showFolderFilter = false,
  showSort = false,
  showSecondaryActions = false,
}: LibraryPanelsSearchProps): JSX.Element => {
  const styles = (getStyles, variant);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useDebounce(() => setDebouncedSearchQuery(searchQuery), 200, [searchQuery]);

  const [sortDirection, setSortDirection] = useState<SelectableValue<string>>({});
  const [folderFilter, setFolderFilter] = useState<string[]>(currentFolderUID ? [currentFolderUID] : []);
  const [panelFilter, setPanelFilter] = useState<string[]>([]);

  const sortOrFiltersVisible = showSort || showPanelFilter || showFolderFilter;
  const verticalGroupSpacing = variant === LibraryPanelsSearchVariant.Tight ? 3 : 0.5;

  return (
    <div {...stylex.props(libraryPanelsSearchStyles.container)}>
      <Stack direction="column" gap={verticalGroupSpacing}>
        <div
          {...mergeStylexClassName(stylex.props(libraryPanelsSearchStyles.gridContainer, { ...(variant === LibraryPanelsSearchVariant.Tight,
           ? stylex.props(libraryPanelsSearchStyles.tightLayout) : {}) }), undefined)}
        >
          <div {...stylex.props(libraryPanelsSearchStyles.filterInputWrapper)}>
            <FilterInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t(
                'library-panels.library-panels-search.placeholder-search-by-name-or-description',
                'Search by name, description or folder name'
              )}
              width={0}
              escapeRegex={false}
            />
          </div>
          {sortOrFiltersVisible && (
            <SearchControls
              showSort={showSort}
              showPanelFilter={showPanelFilter}
              showFolderFilter={showFolderFilter}
              onSortChange={setSortDirection}
              onFolderFilterChange={setFolderFilter}
              onPanelFilterChange={setPanelFilter}
              sortDirection={sortDirection.value}
              variant={variant}
            />
          )}
        </div>

        <div {...stylex.props(libraryPanelsSearchStyles.libraryPanelsView)}>
          <LibraryPanelsView
            onClickCard={onClick}
            searchString={debouncedSearchQuery}
            sortDirection={sortDirection.value}
            panelFilter={panelFilter}
            folderFilter={folderFilter}
            currentPanelId={currentPanelId}
            showSecondaryActions={showSecondaryActions}
            perPage={perPage}
          />
        </div>
      </Stack>
    </div>
  );
};


interface SearchControlsProps {
  showSort: boolean;
  showPanelFilter: boolean;
  showFolderFilter: boolean;
  sortDirection?: string;
  onSortChange: (sortValue: SelectableValue) => void;
  onFolderFilterChange: (folder: string[]) => void;
  onPanelFilterChange: (plugins: string[]) => void;
  variant?: LibraryPanelsSearchVariant;
}

const SearchControls = memo(
  ({
    variant = LibraryPanelsSearchVariant.Spacious,
    showSort,
    showPanelFilter,
    showFolderFilter,
    sortDirection,
    onSortChange,
    onFolderFilterChange,
    onPanelFilterChange,
  }: SearchControlsProps) => {
    const styles = (getRowStyles);
    const panelFilterChanged = useCallback(
      (plugins: PanelPluginMeta[]) => onPanelFilterChange(plugins.map((p) => p.id)),
      [onPanelFilterChange]
    );
    const folderFilterChanged = useCallback(
      (folders: string[]) => onFolderFilterChange(folders),
      [onFolderFilterChange]
    );

    return (
      <div
        {...mergeStylexClassName(stylex.props(libraryPanelsSearchStyles.container, {
          [libraryPanelsSearchStyles.containerTight]: variant === LibraryPanelsSearchVariant.Tight,
        }), undefined)}
      >
        {showSort && <SortPicker value={sortDirection} onChange={onSortChange} filter={['alpha-asc', 'alpha-desc']} />}
        {(showFolderFilter || showPanelFilter) && (
          <div
            className={cx(libraryPanelsSearchStyles.filterContainer, {
              [libraryPanelsSearchStyles.filterContainerTight]: variant === LibraryPanelsSearchVariant.Tight,
            })}
          >
            {showFolderFilter && <FolderFilter onChange={folderFilterChanged} />}
            {showPanelFilter && <PanelTypeFilter onChange={panelFilterChanged} />}
          </div>
        )}
      </div>
    );
  }
);
SearchControls.displayName = 'SearchControls';

function getRowStyles(theme: GrafanaTheme2) {
  return {
    container: css({
      display: 'flex',
      gap: theme.spacing(1),
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }),
    containerTight: css({
      flexGrow: 'initial',
      flexDirection: 'column',
      justifyContent: 'normal',
    }),
    filterContainer: css({
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1),
    }),
    filterContainerTight: css({
      flexDirection: 'column',
      marginLeft: 'initial',
    }),
  };
}
