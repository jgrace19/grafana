import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { dashboardFiltersOverviewSearchStyles } from './DashboardFiltersOverviewSearch.stylex';

import { t } from '@grafana/i18n';
import {Icon, Input} from '@grafana/ui';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DashboardFiltersOverviewSearch({
  value,
  onChange,
  placeholder = t('dashboard.filters-overview.search.placeholder', 'Search...'),
}: Props) {


  return (
    <div {...stylex.props(dashboardFiltersOverviewSearchStyles.container)}>
      <Input
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onChange('');
          }
        }}
        placeholder={placeholder}
        aria-label={t('dashboard.filters-overview.search.aria-label', 'Search filters')}
        prefix={<Icon name="search" />}
        {...stylex.props(dashboardFiltersOverviewSearchStyles.input)}
      />
    </div>
  );
}

