import * as stylex from '@stylexjs/stylex';
import { nestedQueryStyles } from './NestedQuery.stylex';

import { memo } from 'react';

import { EditorRows, FlexItem } from '@grafana/plugin-ui';
import { AutoSizeInput, IconButton, Select } from '@grafana/ui';

import { type LokiDatasource } from '../../datasource';
import { binaryScalarDefs } from '../binaryScalarOperations';
import { type LokiVisualQueryBinary } from '../types';

import { LokiQueryBuilder } from './LokiQueryBuilder';

export interface Props {
  nestedQuery: LokiVisualQueryBinary;
  datasource: LokiDatasource;
  index: number;
  showExplain: boolean;
  onChange: (index: number, update: LokiVisualQueryBinary) => void;
  onRemove: (index: number) => void;
  onRunQuery: () => void;
}

export const NestedQuery = memo<Props>(
  ({ nestedQuery, index, datasource, onChange, onRemove, onRunQuery, showExplain }) => {

    return (
      <div {...stylex.props(nestedQueryStyles.card)}>
        <div {...stylex.props(nestedQueryStyles.header)}>
          <div {...stylex.props(nestedQueryStyles.name)}>Operator</div>
          <Select
            aria-label="Select operator"
            width="auto"
            options={operators}
            value={toOption(nestedQuery.operator)}
            onChange={(value) => {
              onChange(index, {
                ...nestedQuery,
                operator: value.value!,
              });
            }}
          />
          <div {...stylex.props(nestedQueryStyles.name)}>Vector matches</div>
          <div {...stylex.props(nestedQueryStyles.vectorMatchWrapper)}>
            <Select<LokiVisualQueryBinary['vectorMatchesType']>
              width="auto"
              value={nestedQuery.vectorMatchesType || 'on'}
              allowCustomValue
              options={[
                { value: 'on', label: 'on' },
                { value: 'ignoring', label: 'ignoring' },
              ]}
              onChange={(val) => {
                onChange(index, {
                  ...nestedQuery,
                  vectorMatchesType: val.value,
                });
              }}
            />
            <AutoSizeInput
              {...stylex.props(nestedQueryStyles.vectorMatchInput)}
              minWidth={20}
              defaultValue={nestedQuery.vectorMatches}
              onCommitChange={(evt) => {
                onChange(index, {
                  ...nestedQuery,
                  vectorMatches: evt.currentTarget.value,
                  vectorMatchesType: nestedQuery.vectorMatchesType || 'on',
                });
              }}
            />
          </div>
          <FlexItem grow={1} />
          <IconButton name="times" size="sm" onClick={() => onRemove(index)} tooltip="Remove nested query" />
        </div>
        <div {...stylex.props(nestedQueryStyles.body)}>
          <EditorRows>
            <LokiQueryBuilder
              showExplain={showExplain}
              query={nestedQuery.query}
              datasource={datasource}
              onRunQuery={onRunQuery}
              onChange={(update) => {
                onChange(index, { ...nestedQuery, query: update });
              }}
            />
          </EditorRows>
        </div>
      </div>
    );
  }
);

const operators = binaryScalarDefs.map((def) => ({ label: def.sign, value: def.sign }));

NestedQuery.displayName = 'NestedQuery';

;
