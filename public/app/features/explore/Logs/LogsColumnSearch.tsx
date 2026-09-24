import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logsColumnSearchStyles } from './LogsColumnSearch.stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Field, Input, useTheme2 } from '@grafana/ui';


export function LogsColumnSearch(props: { onChange: (e: React.FormEvent<HTMLInputElement>) => void; value: string }) {
  const theme = useTheme2();
  return (
    <Field {...stylex.props(logsColumnSearchStyles.searchWrap)}>
      <Input
        value={props.value}
        type={'text'}
        placeholder={t('explore.logs-column-search.placeholder-search-fields-by-name', 'Search fields by name')}
        onChange={props.onChange}
      />
    </Field>
  );
}
