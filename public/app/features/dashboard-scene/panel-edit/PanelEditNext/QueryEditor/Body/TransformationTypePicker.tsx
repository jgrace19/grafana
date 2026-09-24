import * as stylex from '@stylexjs/stylex';
import { type ChangeEvent, useMemo, useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { EmptyState, FilterPill, Grid, IconButton, Input, Stack, Switch } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import config from 'app/core/config';
import { SqlExpressionsBanner } from 'app/features/dashboard/components/TransformationsEditor/SqlExpressions/SqlExpressionsBanner';
import { TransformationCard } from 'app/features/dashboard/components/TransformationsEditor/TransformationCard';

import { trackTransformationFilterChanged, trackTransformationSearch } from '../../tracking';
import { useQueryEditorUIContext, useQueryRunnerContext } from '../QueryEditorContext';

import { useTransformationSearchAndFilter } from './useTransformationSearchAndFilter';

export function TransformationTypePicker() {
  const { finalizePendingTransformation } = useQueryEditorUIContext();
  const { data } = useQueryRunnerContext();

  const [showIllustrations, setShowIllustrations] = useState(true);

  const {
    search,
    setSearch,
    selectedFilter,
    setSelectedFilter,
    categories,
    filteredTransformations,
    onSearchKeyDown,
    allTransformationsCount,
  } = useTransformationSearchAndFilter(finalizePendingTransformation);

  const searchBoxSuffix = useMemo(() => {
    if (filteredTransformations.length === allTransformationsCount) {
      return null;
    }
    return (
      <Stack direction="row" alignItems="center" gap={1}>
        {filteredTransformations.length} / {allTransformationsCount}
        <IconButton
          name="times"
          onClick={() => setSearch('')}
          tooltip={t('dashboard.transformation-picker-ng.clear-search', 'Clear search')}
        />
      </Stack>
    );
  }, [filteredTransformations.length, allTransformationsCount, setSearch]);

  return (
    <Stack direction="column" gap={2}>
      {config?.featureToggles?.sqlExpressions && <SqlExpressionsBanner />}

      <div {...stylex.props(styles.searchWrapper)}>
        <Input
          autoFocus
          data-testid={selectors.components.Transforms.searchInput}
          xstyle={styles.search}
          value={search}
          placeholder={t(
            'dashboard.transformation-picker-ng.placeholder-search-for-transformation',
            'Search for transformation'
          )}
          onChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
            setSearch(value);
            trackTransformationSearch(value);
          }}
          onKeyDown={onSearchKeyDown}
          suffix={searchBoxSuffix}
        />
        <Stack direction="row" alignItems="center" gap={0.5}>
          <div {...stylex.props(styles.switchLabel)}>
            <Trans i18nKey="dashboard.transformation-picker-ng.show-images">Show images</Trans>
          </div>
          <Switch value={showIllustrations} onChange={() => setShowIllustrations((prev) => !prev)} />
        </Stack>
      </div>

      <Stack direction="row" wrap="wrap" rowGap={1} columnGap={0.5}>
        <FilterPill
          label={t('dashboard.transformation-picker-ng.view-all', 'View all')}
          selected={selectedFilter === null}
          onClick={() => {
            setSelectedFilter(null);
            trackTransformationFilterChanged(null);
          }}
        />
        {categories.map(({ slug, label }) => (
          <FilterPill
            key={slug}
            label={label}
            selected={selectedFilter === slug}
            onClick={() => {
              const next = selectedFilter === slug ? null : slug;
              setSelectedFilter(next);
              trackTransformationFilterChanged(next);
            }}
          />
        ))}
      </Stack>

      {filteredTransformations.length === 0 ? (
        <EmptyState
          variant="not-found"
          message={t('dashboard.transformation-picker-ng.no-transformations-found', 'No transformations found')}
        />
      ) : (
        <Grid columns={3} gap={1}>
          {filteredTransformations.map((item) => (
            <TransformationCard
              key={item.id}
              transform={item}
              data={data?.series ?? []}
              onClick={(id) => finalizePendingTransformation(id)}
              showIllustrations={showIllustrations}
              fullWidth
            />
          ))}
        </Grid>
      )}
    </Stack>
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
  },
  switchLabel: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
});
