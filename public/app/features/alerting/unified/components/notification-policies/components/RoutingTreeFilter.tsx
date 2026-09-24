import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { routingTreeFilterStyles } from './RoutingTreeFilter.stylex';
import { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Button, Field, Icon, Input, Stack } from '@grafana/ui';

import { useURLSearchParams } from '../../../hooks/useURLSearchParams';

const RoutingTreeFilter = () => {

  const [searchParams, setSearchParams] = useURLSearchParams();

  const defaultValue = searchParams.get('search') ?? '';
  const [searchValue, setSearchValue] = useState(defaultValue);

  const [_, cancel] = useDebounce(
    () => {
      setSearchParams({ search: searchValue }, true);
    },
    300,
    [setSearchParams, searchValue]
  );

  const clear = useCallback(() => {
    cancel();
    setSearchValue('');
    setSearchParams({ search: '' }, true);
  }, [cancel, setSearchParams]);

  const hasInput = Boolean(defaultValue);

  return (
    <Stack direction="row" alignItems="end" gap={0.5}>
      <Field
        noMargin
        {...stylex.props(routingTreeFilterStyles.noBottom)}
        label={t(
          'alerting.routing-tree-filter.label-search-by-name-or-receiver',
          'Search by policy name or contact point'
        )}
      >
        <Input
          aria-label={t('alerting.routing-tree-filter.aria-label-search-routing-trees', 'search routing trees')}
          placeholder={t('alerting.routing-tree-filter.placeholder-search', 'Search')}
          width={46}
          prefix={<Icon name="search" />}
          onChange={(event) => {
            setSearchValue(event.currentTarget.value);
          }}
          value={searchValue}
        />
      </Field>
      <Button
        variant="secondary"
        icon="times"
        onClick={() => clear()}
        disabled={!hasInput}
        aria-label={t('alerting.routing-tree-filter.aria-label-clear', 'clear')}
      >
        <Trans i18nKey="alerting.routing-tree-filter.clear">Clear</Trans>
      </Button>
    </Stack>
  );
};


export { RoutingTreeFilter };
