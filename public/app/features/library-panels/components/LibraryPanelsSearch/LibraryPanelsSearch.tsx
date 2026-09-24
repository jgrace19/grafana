import * as stylex from '@stylexjs/stylex';
import { memo, useCallback, useState, type JSX } from 'react';
import { useDebounce } from 'react-use';

import { type PanelPluginMeta, type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Stack, FilterInput } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

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
  const isTight = variant === LibraryPanelsSearchVariant.Tight;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  useDebounce(() => setDebouncedSearchQuery(searchQuery), 200, [searchQuery]);

  const [sortDirection, setSortDirection] = useState<SelectableValue<string>>({});
  const [folderFilter, setFolderFilter] = useState<string[]>(currentFolderUID ? [currentFolderUID] : []);
  const [panelFilter, setPanelFilter] = useState<string[]>([]);

  const sortOrFiltersVisible = showSort || showPanelFilter || showFolderFilter;
  const verticalGroupSpacing = variant === LibraryPanelsSearchVariant.Tight ? 3 : 0.5;

  return (
    <div {...stylex.props(styles.container)}>
      <Stack direction="column" gap={verticalGroupSpacing}>
        <div {...stylex.props(styles.gridContainer, isTight && styles.tightLayout)}>
          <div {...stylex.props(isTight ? styles.filterInputWrapperTight : styles.filterInputWrapper)}>
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

        <div {...stylex.props(styles.libraryPanelsView)}>
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

const styles = stylex.create({
  filterInputWrapper: {
    flexGrow: 'initial',
  },
  filterInputWrapperTight: {
    flexGrow: 1,
  },
  container: {
    width: '100%',
    overflowY: 'auto',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1'],
  },
  libraryPanelsView: {
    width: '100%',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    columnGap: spacing['--gf-spacing-x1'],
    rowGap: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  tightLayout: {
    flexDirection: 'row',
    rowGap: spacing['--gf-spacing-x1'],
  },
});

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
        {...stylex.props(rowStyles.container, variant === LibraryPanelsSearchVariant.Tight && rowStyles.containerTight)}
      >
        {showSort && <SortPicker value={sortDirection} onChange={onSortChange} filter={['alpha-asc', 'alpha-desc']} />}
        {(showFolderFilter || showPanelFilter) && (
          <div
            {...stylex.props(
              rowStyles.filterContainer,
              variant === LibraryPanelsSearchVariant.Tight && rowStyles.filterContainerTight
            )}
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

const rowStyles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  containerTight: {
    flexGrow: 'initial',
    flexDirection: 'column',
    justifyContent: 'normal',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: spacing['--gf-spacing-x1'],
  },
  filterContainerTight: {
    flexDirection: 'column',
    marginLeft: 'initial',
  },
});
