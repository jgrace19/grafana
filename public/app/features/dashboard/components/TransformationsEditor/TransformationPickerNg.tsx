import * as stylex from '@stylexjs/stylex';
import { type FormEventHandler, type KeyboardEventHandler, type ReactNode, useCallback } from 'react';

import { type DataFrame, type TransformerRegistryItem, type SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Drawer, FilterPill, Grid, Input, Stack, Switch } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import config from 'app/core/config';
import { getCategoriesLabels } from 'app/features/transformers/utils';

import { SqlExpressionsBanner } from './SqlExpressions/SqlExpressionsBanner';
import { TransformationCard } from './TransformationCard';
import { type FilterCategory } from './TransformationsEditor';
const VIEW_ALL_VALUE = 'viewAll';

interface TransformationPickerNgProps {
  onTransformationAdd: (selectedItem: SelectableValue<string>) => void;
  onSearchChange: FormEventHandler<HTMLInputElement>;
  onSearchKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onClose?: () => void;
  noTransforms: boolean;
  xforms: TransformerRegistryItem[];
  search: string;
  suffix: ReactNode;
  data: DataFrame[];
  showIllustrations?: boolean;
  onShowIllustrationsChange?: (showIllustrations: boolean) => void;
  onSelectedFilterChange?: (category: FilterCategory) => void;
  selectedFilter?: FilterCategory;
}

export function TransformationPickerNg(props: TransformationPickerNgProps) {
  const {
    suffix,
    xforms,
    search,
    onSearchChange,
    onSearchKeyDown,
    showIllustrations,
    onTransformationAdd,
    selectedFilter,
    data,
    onClose,
    onShowIllustrationsChange,
    onSelectedFilterChange,
  } = props;

  const filterCategoriesLabels: Array<[FilterCategory, string]> = [
    [VIEW_ALL_VALUE, t('dashboard.transformation-picker-ng.view-all', 'View all')],
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ...(Object.entries(getCategoriesLabels()) as Array<[FilterCategory, string]>),
  ];

  // Use a callback ref to call "click" on the search input
  // This will focus it when it's opened
  const searchInputRef = useCallback((input: HTMLInputElement) => {
    input?.click();
  }, []);

  return (
    <Drawer
      size="md"
      onClose={() => {
        onClose && onClose();
      }}
      title={t('dashboard.transformation-picker-ng.title-add-another-transformation', 'Add another transformation')}
    >
      <Stack direction="column" gap={2}>
        {config?.featureToggles?.sqlExpressions && <SqlExpressionsBanner />}
        <div {...stylex.props(styles.searchWrapper)}>
          <Input
            data-testid={selectors.components.Transforms.searchInput}
            xstyle={styles.search}
            value={search ?? ''}
            placeholder={t(
              'dashboard.transformation-picker-ng.placeholder-search-for-transformation',
              'Search for transformation'
            )}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            suffix={suffix}
            ref={searchInputRef}
            autoFocus={true}
          />
          <Stack direction="row" alignItems="center" gap={0.5}>
            <span {...stylex.props(styles.switchLabel)}>
              <Trans i18nKey="dashboard.transformation-picker-ng.show-images">Show images</Trans>
            </span>
            <Switch
              value={showIllustrations}
              onChange={() => onShowIllustrationsChange && onShowIllustrationsChange(!showIllustrations)}
            />
          </Stack>
        </div>

        <Stack direction="row" wrap="wrap" rowGap={1} columnGap={0.5}>
          {filterCategoriesLabels.map(([slug, label]) => {
            return (
              <FilterPill
                key={slug}
                onClick={() => onSelectedFilterChange && onSelectedFilterChange(slug)}
                label={label}
                selected={selectedFilter === slug}
              />
            );
          })}
        </Stack>

        <TransformationsGrid
          showIllustrations={showIllustrations}
          transformations={xforms}
          data={data}
          onClick={(id) => {
            reportInteraction('grafana_panel_transformations_clicked', {
              context: 'transformations_drawer',
              type: id,
              action: 'add',
            });
            onTransformationAdd({ value: id });
          }}
        />
      </Stack>
    </Drawer>
  );
}

const styles = stylex.create({
  search: {
    flexGrow: 1,
    width: 'initial',
  },
  searchWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: spacing['--gf-spacing-x2'],
    rowGap: spacing['--gf-spacing-x1'],
    width: '100%',
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  switchLabel: {
    whiteSpace: 'nowrap',
  },
});

interface TransformationsGridProps {
  transformations: TransformerRegistryItem[];
  showIllustrations?: boolean;
  onClick: (id: string) => void;
  data: DataFrame[];
}

function TransformationsGrid({ showIllustrations, transformations, onClick, data }: TransformationsGridProps) {
  return (
    <Grid columns={3} gap={1}>
      {transformations.map((transform) => (
        <TransformationCard
          data={data}
          fullWidth
          key={transform.id}
          onClick={onClick}
          showIllustrations={showIllustrations}
          transform={transform}
        />
      ))}
    </Grid>
  );
}
