import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { useAsync } from 'react-use';

import { type DataSourceApi, type SelectableValue } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { config, getDataSourceSrv } from '@grafana/runtime';
import { Button, FilterInput, MultiSelect, RangeSlider, Select } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { mapNumbertoTimeInSlider, mapQueriesToHeadings } from 'app/core/utils/richHistory';
import { SortOrder, type RichHistorySearchFilters, type RichHistorySettings } from 'app/core/utils/richHistoryTypes';
import { type RichHistoryQuery } from 'app/types/explore';

import { getSortOrderOptions } from './RichHistory';
import RichHistoryCard from './RichHistoryCard';

export interface RichHistoryQueriesTabProps {
  queries: RichHistoryQuery[];
  totalQueries: number;
  loading: boolean;
  updateFilters: (filtersToUpdate?: Partial<RichHistorySearchFilters>) => void;
  clearRichHistoryResults: () => void;
  loadMoreRichHistory: () => void;
  richHistorySettings: RichHistorySettings;
  richHistorySearchFilters?: RichHistorySearchFilters;
  activeDatasources: string[];
  listOfDatasources: Array<{ name: string; uid: string }>;
  height: number;
}

const styles = stylex.create({
  container: {
    display: 'flex',
  },
  labelSlider: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    marginTop: { default: null, ':last-of-type': spacing['--gf-spacing-x3'] },
    fontWeight: { default: null, ':first-of-type': typography['--gf-typography-font-weight-medium'] },
    marginBottom: { default: null, ':first-of-type': spacing['--gf-spacing-x2'] },
  },
  containerContent: {
    /* 134px is based on the width of the Query history tabs bar, so the content is aligned to right side of the tab */
    width: 'calc(100% - 134px)',
  },
  containerSlider: {
    width: '129px',
    marginRight: spacing['--gf-spacing-x1'],
  },
  fixedSlider: {
    position: 'fixed',
  },
  slider: {
    bottom: '10px',
    width: '129px',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
    paddingRight: 0,
  },
  sliderHeight: (height: number) => ({
    height: `${height - 180}px`,
  }),
  selectors: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  filterInput: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
  multiselect: {
    width: '100%',
    marginBottom: spacing['--gf-spacing-x1'],
  },
  sort: {
    width: '170px',
  },
  heading: {
    fontSize: typography['--gf-typography-h4-font-size'],
    marginTop: spacing['--gf-spacing-x2'],
    marginRight: spacing['--gf-spacing-x0-25'],
    marginBottom: spacing['--gf-spacing-x1'],
    marginLeft: spacing['--gf-spacing-x0-25'],
  },
  footer: {
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: typography['--gf-typography-font-weight-light'],
    fontSize: typography['--gf-typography-body-small-font-size'],
  },
  queries: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-regular'],
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
});

export function RichHistoryQueriesTab(props: RichHistoryQueriesTabProps) {
  const {
    queries,
    totalQueries,
    loading,
    richHistorySearchFilters,
    updateFilters,
    clearRichHistoryResults,
    loadMoreRichHistory,
    richHistorySettings,
    height,
    listOfDatasources,
    activeDatasources,
  } = props;

  // on mount, set filter to either active datasource or all datasources
  useEffect(() => {
    const datasourceFilters =
      !richHistorySettings.activeDatasourcesOnly && richHistorySettings.lastUsedDatasourceFilters
        ? richHistorySettings.lastUsedDatasourceFilters
        : activeDatasources;
    const filters: RichHistorySearchFilters = {
      search: '',
      sortOrder: SortOrder.Descending,
      datasourceFilters,
      from: 0,
      to: richHistorySettings.retentionPeriod,
      starred: false,
    };
    updateFilters(filters);

    return () => {
      clearRichHistoryResults();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { value: datasourceFilterApis, loading: loadingDs } = useAsync(async () => {
    const datasourcesToGet = listOfDatasources.map((ds) => ds.uid);
    const dsGetProm = datasourcesToGet.map(async (dsf) => {
      try {
        // this get works off datasource names
        return getDataSourceSrv().get(dsf);
      } catch (e) {
        return Promise.resolve();
      }
    });

    if (dsGetProm !== undefined) {
      const enhancedDatasourceData = (await Promise.all(dsGetProm)).filter((dsi): dsi is DataSourceApi => !!dsi);
      return enhancedDatasourceData;
    } else {
      return [];
    }
  }, [richHistorySearchFilters?.datasourceFilters]);

  if (!richHistorySearchFilters) {
    return (
      <span>
        <Trans i18nKey="explore.rich-history-queries-tab.loading">Loading...</Trans>
      </span>
    );
  }

  /* mappedQueriesToHeadings is an object where query headings (stringified dates/data sources)
   * are keys and arrays with queries that belong to that headings are values.
   */
  const mappedQueriesToHeadings = mapQueriesToHeadings(queries, richHistorySearchFilters.sortOrder);
  const sortOrderOptions = getSortOrderOptions();
  const partialResults = queries.length && queries.length !== totalQueries;
  const timeFilter = [
    richHistorySearchFilters.from || 0,
    richHistorySearchFilters.to || richHistorySettings.retentionPeriod,
  ];

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.containerSlider)}>
        <div {...stylex.props(styles.fixedSlider)}>
          <div {...stylex.props(styles.labelSlider)}>
            <Trans i18nKey="explore.rich-history-queries-tab.filter-history">Filter history</Trans>
          </div>
          <div {...stylex.props(styles.labelSlider)}>{mapNumbertoTimeInSlider(timeFilter[0])}</div>
          <div {...stylex.props(styles.slider, styles.sliderHeight(height))}>
            <RangeSlider
              tooltipAlwaysVisible={false}
              min={0}
              max={richHistorySettings.retentionPeriod}
              value={timeFilter}
              orientation="vertical"
              formatTooltipResult={mapNumbertoTimeInSlider}
              reverse={true}
              onAfterChange={(value) => {
                updateFilters({ from: value![0], to: value![1] });
              }}
            />
          </div>
          <div {...stylex.props(styles.labelSlider)}>{mapNumbertoTimeInSlider(timeFilter[1])}</div>
        </div>
      </div>

      <div {...stylex.props(styles.containerContent)} data-testid="query-history-queries-tab">
        <div {...stylex.props(styles.selectors)}>
          {!richHistorySettings.activeDatasourcesOnly && (
            <MultiSelect
              className={stylex.props(styles.multiselect).className}
              options={listOfDatasources.map((ds) => {
                return { value: ds.name, label: ds.name };
              })}
              value={richHistorySearchFilters.datasourceFilters}
              placeholder={t(
                'explore.rich-history-queries-tab.filter-placeholder',
                'Filter queries for data sources(s)'
              )}
              aria-label={t('explore.rich-history-queries-tab.filter-aria-label', 'Filter queries for data sources(s)')}
              onChange={(options: SelectableValue[]) => {
                updateFilters({ datasourceFilters: options.map((option) => option.value) });
              }}
            />
          )}
          <div {...stylex.props(styles.filterInput)}>
            <FilterInput
              escapeRegex={false}
              placeholder={t('explore.rich-history-queries-tab.search-placeholder', 'Search queries')}
              value={richHistorySearchFilters.search}
              onChange={(search: string) => updateFilters({ search })}
            />
          </div>
          <div
            aria-label={t('explore.rich-history-queries-tab.sort-aria-label', 'Sort queries')}
            {...stylex.props(styles.sort)}
          >
            <Select
              value={sortOrderOptions.filter((order) => order.value === richHistorySearchFilters.sortOrder)}
              options={sortOrderOptions}
              placeholder={t('explore.rich-history-queries-tab.sort-placeholder', 'Sort queries by')}
              onChange={(e: SelectableValue<SortOrder>) => updateFilters({ sortOrder: e.value })}
            />
          </div>
        </div>

        {(loading || loadingDs) && (
          <span>
            <Trans i18nKey="explore.rich-history-queries-tab.loading-results">Loading results...</Trans>
          </span>
        )}

        {!(loading || loadingDs) &&
          Object.keys(mappedQueriesToHeadings).map((heading) => {
            return (
              <div key={heading}>
                <div {...stylex.props(styles.heading)}>
                  {heading}{' '}
                  <span {...stylex.props(styles.queries)}>
                    {partialResults ? (
                      <Trans
                        i18nKey="explore.rich-history-queries-tab.displaying-partial-queries"
                        defaults="Displaying {{ count }} queries"
                        values={{ count: mappedQueriesToHeadings[heading].length }}
                      />
                    ) : (
                      <Trans
                        i18nKey="explore.rich-history-queries-tab.displaying-queries"
                        defaults="{{ count }} queries"
                        values={{ count: mappedQueriesToHeadings[heading].length }}
                      />
                    )}
                  </span>
                </div>
                {mappedQueriesToHeadings[heading].map((q) => {
                  return <RichHistoryCard datasourceInstances={datasourceFilterApis} queryHistoryItem={q} key={q.id} />;
                })}
              </div>
            );
          })}
        {partialResults ? (
          <div>
            <Trans
              i18nKey="explore.rich-history-queries-tab.showing-queries"
              defaults="Showing {{ shown }} of {{ total }} <0>Load more</0>"
              values={{ shown: queries.length, total: totalQueries }}
              components={[
                <Button onClick={loadMoreRichHistory} key="loadMoreButton">
                  Load more
                </Button>,
              ]}
            />
          </div>
        ) : null}
        <div {...stylex.props(styles.footer)}>
          {!config.queryHistoryEnabled
            ? t(
                'explore.rich-history-queries-tab.history-local',
                'The history is local to your browser and is not shared with others.'
              )
            : ''}
        </div>
      </div>
    </div>
  );
}
