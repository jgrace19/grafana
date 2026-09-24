// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/components/NestedQuery.tsx
import { memo } from 'react';
import * as stylex from '@stylexjs/stylex';

import { toOption } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { EditorRows, FlexItem } from '@grafana/plugin-ui';
import { AutoSizeInput, IconButton, Select } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { type PrometheusDatasource } from '../../datasource';
import { binaryScalarDefs } from '../binaryScalarOperations';
import { type PromVisualQueryBinary } from '../types';

import { nestedQueryStyles } from './NestedQuery.stylex';
import { QueryBuilderContent } from './QueryBuilderContent';

interface NestedQueryProps {
  nestedQuery: PromVisualQueryBinary;
  datasource: PrometheusDatasource;
  index: number;
  onChange: (index: number, update: PromVisualQueryBinary) => void;
  onRemove: (index: number) => void;
  onRunQuery: () => void;
  showExplain: boolean;
}

export const NestedQuery = memo<NestedQueryProps>((props) => {
  const { nestedQuery, index, datasource, onChange, onRemove, onRunQuery, showExplain } = props;

  return (
    <div {...stylex.props(nestedQueryStyles.card)}>
      <div {...stylex.props(nestedQueryStyles.header)}>
        <div {...stylex.props(nestedQueryStyles.name)}>
          <Trans i18nKey="grafana-prometheus.querybuilder.nested-query.operator">Operator</Trans>
        </div>
        <Select
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
        <div {...stylex.props(nestedQueryStyles.name)}>
          <Trans i18nKey="grafana-prometheus.querybuilder.nested-query.vector-matches">Vector matches</Trans>
        </div>
        <div {...stylex.props(nestedQueryStyles.vectorMatchWrapper)}>
          <Select<PromVisualQueryBinary['vectorMatchesType']>
            width="auto"
            value={nestedQuery.vectorMatchesType || 'on'}
            allowCustomValue
            options={[
              { value: 'on', label: t('grafana-prometheus.querybuilder.nested-query.label.on', 'On') },
              {
                value: 'ignoring',
                label: t('grafana-prometheus.querybuilder.nested-query.label.ignoring', 'Ignoring'),
              },
            ]}
            onChange={(val) => {
              onChange(index, {
                ...nestedQuery,
                vectorMatchesType: val.value,
              });
            }}
          />
          <AutoSizeInput
            {...mergeStylexClassName(stylex.props(nestedQueryStyles.vectorMatchInput))}
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
        <IconButton
          name="times"
          size="sm"
          onClick={() => onRemove(index)}
          tooltip={t('grafana-prometheus.querybuilder.nested-query.tooltip-remove-match', 'Remove match')}
        />
      </div>
      <div {...stylex.props(nestedQueryStyles.body)}>
        <EditorRows>
          <QueryBuilderContent
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
});

const operators = binaryScalarDefs.map((def) => ({ label: def.sign, value: def.sign }));

NestedQuery.displayName = 'NestedQuery';
