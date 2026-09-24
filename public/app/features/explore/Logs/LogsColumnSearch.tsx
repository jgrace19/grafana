import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { t } from '@grafana/i18n';
import { Field, Input } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export function LogsColumnSearch(props: { onChange: (e: React.FormEvent<HTMLInputElement>) => void; value: string }) {
  return (
    <Field className={stylex.props(styles.searchWrap).className}>
      <Input
        value={props.value}
        type={'text'}
        placeholder={t('explore.logs-column-search.placeholder-search-fields-by-name', 'Search fields by name')}
        onChange={props.onChange}
      />
    </Field>
  );
}

const styles = stylex.create({
  searchWrap: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
    paddingRight: 0,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.4)`,
  },
});
