import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { useChromeHeaderHeight } from '@grafana/runtime';
import { Icon, Input } from '@grafana/ui';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  value: string | undefined;
}

export const Search = ({ onChange, value }: Props) => {
  const chromeHeaderHeight = useChromeHeaderHeight();

  const placeholder = t('connections.search.placeholder', 'Search all');

  return (
    <div {...stylex.props(styles.searchContainer, styles.top(chromeHeaderHeight ?? 0))}>
      <Input
        value={value}
        onChange={onChange}
        prefix={<Icon name="search" />}
        placeholder={placeholder}
        aria-label={t('connections.search.aria-label-search-all', 'Search all')}
      />
    </div>
  );
};

const styles = stylex.create({
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'sticky',
    backgroundColor: colors['--gf-colors-background-primary'],
    zIndex: 2,
    paddingTop: spacing['--gf-spacing-x2'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x2'],
    paddingLeft: 0,
  },
  top: (top: number) => ({
    top,
  }),
});
