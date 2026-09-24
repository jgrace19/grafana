import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { Trans } from '@grafana/i18n';
import { Button } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { type AlertState, type AlertmanagerGroup } from 'app/plugins/datasource/alertmanager/types';

import { getFiltersFromUrlParams } from '../../utils/misc';

import { AlertStateFilter } from './AlertStateFilter';
import { GroupBy } from './GroupBy';
import { MatcherFilter } from './MatcherFilter';
import { ReceiverFilter } from './ReceiverFilter';

interface Props {
  groups: AlertmanagerGroup[];
}

export const AlertGroupFilter = ({ groups }: Props) => {
  const [filterKey, setFilterKey] = useState<number>(Math.floor(Math.random() * 100));
  const [queryParams, setQueryParams] = useQueryParams();
  const { groupBy = [], queryString, alertState, receivers = [] } = getFiltersFromUrlParams(queryParams);
  const matcherFilterKey = `matcher-${filterKey}`;

  const clearFilters = () => {
    setQueryParams({
      groupBy: null,
      queryString: null,
      alertState: null,
      contactPoint: null,
      receivers: null,
    });
    setTimeout(() => setFilterKey(filterKey + 1), 100);
  };

  const showClearButton = !!(groupBy.length > 0 || queryString || alertState || receivers.length > 0);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.filterSectionScroll)}>
        <div {...stylex.props(styles.filterSection)}>
          <MatcherFilter
            key={matcherFilterKey}
            defaultQueryString={queryString}
            onFilterChange={(value) => setQueryParams({ queryString: value ? value : null })}
          />
          <GroupBy
            groups={groups}
            groupBy={groupBy}
            onGroupingChange={(keys) => setQueryParams({ groupBy: keys.length ? keys.join(',') : null })}
          />
          <ReceiverFilter
            groups={groups}
            receivers={receivers}
            onReceiversChange={(receivers) =>
              setQueryParams({ receivers: receivers.length ? receivers.join(',') : null })
            }
          />
          <AlertStateFilter
            stateFilter={alertState as AlertState}
            onStateFilterChange={(value) => setQueryParams({ alertState: value ? value : null })}
          />
        </div>
      </div>
      {showClearButton && (
        <div {...stylex.props(styles.clearButtonRow)}>
          <Button size="sm" variant="primary" fill="text" onClick={clearFilters}>
            <Trans i18nKey="alerting.alert-group-filter.clear-filters">Clear filters</Trans>
          </Button>
        </div>
      )}
    </div>
  );
};

const styles = stylex.create({
  wrapper: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    marginBottom: spacing['--gf-spacing-x3'],
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    gap: spacing['--gf-spacing-x1'],
    width: 'max-content',
    minWidth: '100%',
  },
  filterSectionScroll: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    marginBottom: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
  },
  clearButtonRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
