import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import { useAsyncFn } from 'react-use';

import { type SelectableValue, toOption } from '@grafana/data';
import { AccessoryButton, InputGroup } from '@grafana/plugin-ui';
import { Alert, Select } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type Dimensions, type MetricStat } from '../../../dataquery.gen';
import { type CloudWatchDatasource } from '../../../datasource';
import { useDimensionKeys, useEnsureVariableHasSingleSelection } from '../../../hooks';
import { appendTemplateVariables } from '../../../utils/utils';

import { type DimensionFilterCondition } from './Dimensions';

export interface Props {
  metricStat: MetricStat;
  datasource: CloudWatchDatasource;
  filter: DimensionFilterCondition;
  disableExpressions: boolean;
  onChange: (value: DimensionFilterCondition) => void;
  onDelete: () => void;
}

const wildcardOption = { value: '*', label: '*' };

const excludeCurrentKey = (dimensions: Dimensions, currentKey: string | undefined) =>
  Object.entries(dimensions ?? {}).reduce<Dimensions>((acc, [key, value]) => {
    if (key !== currentKey) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});

export const FilterItem = ({ filter, metricStat, datasource, disableExpressions, onChange, onDelete }: Props) => {
  const { region, namespace, metricName, dimensions, accountId } = metricStat;
  const error = useEnsureVariableHasSingleSelection(datasource, filter.key);
  const dimensionsExcludingCurrentKey = useMemo(
    () => excludeCurrentKey(dimensions ?? {}, filter.key),
    [dimensions, filter]
  );
  const dimensionKeys = useDimensionKeys(datasource, {
    ...metricStat,
    dimensionFilters: dimensionsExcludingCurrentKey,
  });

  const loadDimensionValues = async () => {
    if (!filter.key) {
      return [];
    }

    return datasource.resources
      .getDimensionValues({
        dimensionKey: filter.key,
        dimensionFilters: dimensionsExcludingCurrentKey,
        region,
        namespace,
        metricName,
        accountId,
      })
      .then((result: Array<SelectableValue<string>>) => {
        if (result.length && !disableExpressions && !result.some((o) => o.value === wildcardOption.value)) {
          result.unshift(wildcardOption);
        }
        return appendTemplateVariables(datasource, result);
      });
  };

  const [state, loadOptions] = useAsyncFn(loadDimensionValues, [
    filter.key,
    dimensions,
    region,
    namespace,
    metricName,
    accountId,
  ]);

  return (
    <div {...stylex.props(styles.container)} data-testid="cloudwatch-dimensions-filter-item">
      <InputGroup>
        <Select
          aria-label="Dimensions filter key"
          inputId="cloudwatch-dimensions-filter-item-key"
          width="auto"
          value={filter.key ? toOption(filter.key) : null}
          allowCustomValue
          options={dimensionKeys}
          onChange={(change) => {
            if (change.label) {
              onChange({ key: change.label, value: undefined });
            }
          }}
        />

        <span {...stylex.props(styles.root)}>=</span>

        <Select
          aria-label="Dimensions filter value"
          inputId="cloudwatch-dimensions-filter-item-value"
          onOpenMenu={loadOptions}
          width="auto"
          value={filter.value ? toOption(filter.value) : null}
          allowCustomValue
          isLoading={state.loading}
          options={state.value}
          onChange={(change) => {
            if (change.value) {
              onChange({ ...filter, value: change.value });
            }
          }}
        />
        <AccessoryButton aria-label="remove" icon="times" variant="secondary" onClick={onDelete} type="button" />
      </InputGroup>
      {error && (
        <Alert className={stylex.props(styles.alert).className} title={error} severity="error" topSpacing={1} />
      )}
    </div>
  );
};

const styles = stylex.create({
  root: {
    paddingTop: spacing['--gf-spacing-x0'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0'],
    paddingLeft: spacing['--gf-spacing-x1'],
    alignSelf: 'center',
  },

  container: {
    display: 'inline-block',
  },

  alert: {
    minWidth: '100%',
    width: 'min-content',
  },
});
