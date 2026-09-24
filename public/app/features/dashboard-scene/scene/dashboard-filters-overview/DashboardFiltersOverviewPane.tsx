import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { t } from '@grafana/i18n';
import { type AdHocFiltersVariable, type GroupByVariable } from '@grafana/scenes';
import { Box, IconButton, Text } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

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
      <div {...stylex.props(styles.header)}>
        <IconButton
          name="times"
          size="lg"
          onClick={onClose}
          aria-label={t('dashboard.filters-overview.close', 'Close')}
        />
        <div {...stylex.props(styles.title)}>
          <Text variant="h6">{t('dashboard.filters-overview.title', 'Edit filters')}</Text>
        </div>
        <DashboardFiltersOverviewSearch value={searchQuery} onChange={setSearchQuery} />
      </div>
      <div {...stylex.props(styles.content, styles.body)}>
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

const styles = stylex.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing['--gf-spacing-x1'],
    padding: spacing['--gf-spacing-x1'],
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-weak'],
    overflow: 'hidden',
    minWidth: 0,
  },
  title: {
    flex: '1',
    minWidth: 0,
    overflow: 'hidden',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing['--gf-spacing-x1'],
    height: '100%',
    boxSizing: 'border-box',
  },
  body: {
    flex: '1',
    minHeight: 0,
    height: '100%',
  },
});
