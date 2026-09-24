import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { t } from '@grafana/i18n';
import { FilterInput } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { ContextualNavigationPaneToggle } from './ContextualNavigationPaneToggle';

export interface ScopesDashboardsTreeSearchProps {
  disabled: boolean;
  query: string;
  onChange: (value: string) => void;
}

export function ScopesDashboardsTreeSearch({ disabled, query, onChange }: ScopesDashboardsTreeSearchProps) {
  const [inputState, setInputState] = useState<{ value: string; dirty: boolean }>({ value: query, dirty: false });

  const [getDebounceState] = useDebounce(
    () => {
      if (inputState.dirty) {
        onChange(inputState.value);
      }
    },
    500,
    [inputState.dirty, inputState.value]
  );

  useEffect(() => {
    if ((getDebounceState() || !inputState.dirty) && inputState.value !== query) {
      setInputState({ value: query, dirty: false });
    }
  }, [getDebounceState, inputState, query]);

  return (
    <div {...stylex.props(styles.container)}>
      <FilterInput
        disabled={disabled}
        placeholder={t('scopes.dashboards.search', 'Search')}
        value={inputState.value}
        data-testid="scopes-dashboards-search"
        onChange={(value) => setInputState({ value, dirty: true })}
      />
      <ContextualNavigationPaneToggle />
    </div>
  );
}

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: spacing['--gf-spacing-x1'],
    flexGrow: '0',
    flexShrink: '1',
    flexBasis: 'auto',
  },
});
