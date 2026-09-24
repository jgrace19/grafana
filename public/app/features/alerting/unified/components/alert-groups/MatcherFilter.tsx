import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { useDebounce } from 'react-use';

import { Trans, t } from '@grafana/i18n';
import { Field, Icon, Input, Label, Stack, Tooltip } from '@grafana/ui';

import { LogMessages, logInfo } from '../../Analytics';
import { parsePromQLStyleMatcherLoose } from '../../utils/matchers';

interface Props {
  defaultQueryString?: string;
  onFilterChange: (filterString: string) => void;
}

export const MatcherFilter = ({ onFilterChange, defaultQueryString }: Props) => {
  const [filterQuery, setFilterQuery] = useState<string>(defaultQueryString ?? '');

  useDebounce(
    () => {
      logInfo(LogMessages.filterByLabel);
      onFilterChange(filterQuery);
    },
    600,
    [filterQuery]
  );

  const searchIcon = <Icon name={'search'} />;
  let inputValid = Boolean(defaultQueryString && defaultQueryString.length >= 3);
  try {
    if (!defaultQueryString) {
      inputValid = true;
    } else {
      parsePromQLStyleMatcherLoose(defaultQueryString);
    }
  } catch (err) {
    inputValid = false;
  }

  return (
    <Field
      noMargin
      className={stylex.props(styles.fixMargin).className}
      invalid={!inputValid}
      error={!inputValid ? 'Query must use valid matcher syntax. See the examples in the help tooltip.' : null}
      label={
        <Label>
          <Stack gap={0.5} alignItems="center">
            <span>
              <Trans i18nKey="alerting.matcher-filter.search-by-label">Search by label</Trans>
            </span>
            <Tooltip
              content={
                <div>
                  <Trans i18nKey="alerting.matcher-filter.filter-alerts-using-label-querying-without-spaces">
                    Filter alerts using label querying without spaces, ex:
                  </Trans>
                  <pre>{`{severity="critical", instance=~"cluster-us-.+"}`}</pre>
                  <Trans i18nKey="alerting.matcher-filter.invalid-use-of-spaces">Invalid use of spaces:</Trans>
                  <pre>{`{severity= "critical"}`}</pre>
                  <pre>{`{severity ="critical"}`}</pre>
                  <Trans i18nKey="alerting.matcher-filter.valid-use-of-spaces">Valid use of spaces:</Trans>
                  <pre>{`{severity=" critical"}`}</pre>
                  <Trans i18nKey="alerting.matcher-filter.filter-alerts-using-label-querying-without-braces">
                    Filter alerts using label querying without braces, ex:
                  </Trans>
                  <pre>{`severity="critical", instance=~"cluster-us-.+"`}</pre>
                </div>
              }
            >
              <Icon name="info-circle" size="sm" />
            </Tooltip>
          </Stack>
        </Label>
      }
    >
      <Input
        placeholder={t('alerting.matcher-filter.search-query-input-placeholder-search', 'Search')}
        value={filterQuery}
        onChange={(e) => setFilterQuery(e.currentTarget.value)}
        data-testid="search-query-input"
        prefix={searchIcon}
        className={stylex.props(styles.inputWidth).className}
      />
    </Field>
  );
};

const styles = stylex.create({
  fixMargin: {
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0',
  },
  inputWidth: {
    width: '100%',
    minWidth: '220px',
  },
});
