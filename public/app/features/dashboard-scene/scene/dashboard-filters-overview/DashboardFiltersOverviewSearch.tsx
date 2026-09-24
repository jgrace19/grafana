import * as stylex from '@stylexjs/stylex';

import { t } from '@grafana/i18n';
import { Icon, Input } from '@grafana/ui';

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
    <div {...stylex.props(styles.container)}>
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
        className={stylex.props(styles.input).className}
      />
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
    overflow: 'hidden',
  },
  // Input's wrapper already defaults to 100%, so this doesn't have to beat Input's own styles.
  input: {
    width: '100%',
  },
});
