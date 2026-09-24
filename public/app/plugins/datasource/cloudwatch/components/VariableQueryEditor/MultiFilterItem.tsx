import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { AccessoryButton, InputGroup } from '@grafana/plugin-ui';
import { Alert, Input } from '@grafana/ui';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type CloudWatchDatasource } from '../../datasource';
import { useEnsureVariableHasSingleSelection } from '../../hooks';

import { type MultiFilterCondition } from './MultiFilter';

export interface Props {
  filter: MultiFilterCondition;
  onChange: (value: MultiFilterCondition) => void;
  onDelete: () => void;
  keyPlaceholder?: string;
  datasource: CloudWatchDatasource;
}

export const MultiFilterItem = ({ filter, onChange, onDelete, keyPlaceholder, datasource }: Props) => {
  const [localKey, setLocalKey] = useState(filter.key || '');
  const [localValue, setLocalValue] = useState(filter.value?.join(', ') || '');
  const error = useEnsureVariableHasSingleSelection(datasource, filter.key);

  return (
    <div data-testid="cloudwatch-multifilter-item">
      <InputGroup>
        <Input
          data-testid="cloudwatch-multifilter-item-key"
          aria-label="Filter key"
          value={localKey}
          placeholder={keyPlaceholder ?? 'key'}
          onChange={(e) => setLocalKey(e.currentTarget.value)}
          onBlur={() => {
            if (localKey && localKey !== filter.key) {
              onChange({ ...filter, key: localKey });
            }
          }}
        />

        <span {...stylex.props(styles.root)}>=</span>

        <Input
          data-testid="cloudwatch-multifilter-item-value"
          aria-label="Filter value"
          value={localValue}
          placeholder="value1, value2,..."
          onChange={(e) => setLocalValue(e.currentTarget.value)}
          onBlur={() => {
            const newValues = localValue.split(',').map((v) => v.trim());
            if (localValue && newValues !== filter.value) {
              onChange({ ...filter, value: newValues });
            }
            setLocalValue(newValues.join(', '));
          }}
        />

        <AccessoryButton aria-label="remove" icon="times" variant="secondary" onClick={onDelete} type="button" />
      </InputGroup>
      {error && <Alert title={error} severity="error" topSpacing={1} />}
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
});
