import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardFiltersOverviewPaneStyles } from './DashboardFiltersOverviewPane.stylex';
import { useState } from 'react';

import { t } from '@grafana/i18n';
import { type AdHocFiltersVariable, type GroupByVariable } from '@grafana/scenes';
import {Box, IconButton, Text} from '@grafana/ui';

import { DashboardFiltersOverview } from './DashboardFiltersOverview';
import { DashboardFiltersOverviewSearch } from './DashboardFiltersOverviewSearch';

interface Props {
  adhocFilters?: AdHocFiltersVariable;
  groupByVariable?: GroupByVariable;
  onClose: () => void;
}

export function DashboardFiltersOverviewPane({ adhocFilters, groupByVariable, onClose }: Props) {

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box display="flex" direction="column" flex={1} height="100%" minHeight={0}>
      <div {...stylex.props(dashboardFiltersOverviewPaneStyles.header)}>
        <IconButton
          name="times"
          size="lg"
          onClick={onClose}
          aria-label={t('dashboard.filters-overview.close', 'Close')}
        />
        <div {...stylex.props(dashboardFiltersOverviewPaneStyles.title)}>
          <Text variant="h6">{t('dashboard.filters-overview.title', 'Edit filters')}</Text>
        </div>
        <DashboardFiltersOverviewSearch value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div {...mergeStylexClassName(stylex.props(dashboardFiltersOverviewPaneStyles.content), clsx(dashboardFiltersOverviewPaneStyles.body))}>
        <DashboardFiltersOverview
          adhocFilters={adhocFilters}
          groupByVariable={groupByVariable}
          onClose={onClose}
          searchQuery={searchQuery}
        />
      </div>
    </Box>
  );
}

