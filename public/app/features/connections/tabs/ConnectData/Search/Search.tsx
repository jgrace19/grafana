import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { searchStyles } from './Search.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { useChromeHeaderHeight } from '@grafana/runtime';
import { Icon, Input } from '@grafana/ui';


export interface Props {
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  value: string | undefined;
}

export const Search = ({ onChange, value }: Props) => {
  const chromeHeaderHeight = useChromeHeaderHeight();
  const styles = (getStyles, chromeHeaderHeight ?? 0);

  const placeholder = t('connections.search.placeholder', 'Search all');

  return (
    <div {...stylex.props(searchStyles.searchContainer)}>
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
