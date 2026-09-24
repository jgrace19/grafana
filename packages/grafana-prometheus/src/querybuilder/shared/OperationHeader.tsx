// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/OperationHeader.tsx
import { type DraggableProvided } from '@hello-pangea/dnd';
import { memo, useState } from 'react';
import * as stylex from '@stylexjs/stylex';

import { type SelectableValue } from '@grafana/data';
import { t } from '@grafana/i18n';
import { FlexItem } from '@grafana/plugin-ui';
import { Button, Select } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { OperationInfoButton } from './OperationInfoButton';
import { operationHeaderStyles } from './OperationHeader.stylex';
import { type QueryBuilderOperation, type QueryBuilderOperationDef, type VisualQueryModeller } from './types';

interface Props {
  operation: QueryBuilderOperation;
  def: QueryBuilderOperationDef;
  index: number;
  queryModeller: VisualQueryModeller;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  onChange: (index: number, update: QueryBuilderOperation) => void;
  onRemove: (index: number) => void;
}

interface State {
  isOpen?: boolean;
  alternatives?: Array<SelectableValue<QueryBuilderOperationDef>>;
}

export const OperationHeader = memo<Props>(
  ({ operation, def, index, onChange, onRemove, queryModeller, dragHandleProps }) => {
    const [state, setState] = useState<State>({});

    const onToggleSwitcher = () => {
      if (state.isOpen) {
        setState({ ...state, isOpen: false });
      } else {
        const alternatives = queryModeller
          .getAlternativeOperations(def.alternativesKey!)
          .map((alt) => ({ label: alt.name, value: alt }));
        setState({ isOpen: true, alternatives });
      }
    };

    return (
      <div {...stylex.props(operationHeaderStyles.header)}>
        {!state.isOpen && (
          <>
            <div {...dragHandleProps}>{def.name ?? def.id}</div>
            <FlexItem grow={1} />
            <div
              {...mergeStylexClassName(
                stylex.props(operationHeaderStyles.operationHeaderButtons),
                'operation-header-show-on-hover'
              )}
            >
              <Button
                icon="angle-down"
                size="sm"
                onClick={onToggleSwitcher}
                fill="text"
                variant="secondary"
                aria-label={t(
                  'grafana-prometheus.querybuilder.operation-header.title-click-to-view-alternative-operations',
                  'Click to view alternative operations'
                )}
              />
              <OperationInfoButton def={def} operation={operation} />
              <Button
                icon="times"
                size="sm"
                onClick={() => onRemove(index)}
                fill="text"
                variant="secondary"
                aria-label={t(
                  'grafana-prometheus.querybuilder.operation-header.title-remove-operation',
                  'Remove operation'
                )}
              />
            </div>
          </>
        )}
        {state.isOpen && (
          <div {...stylex.props(operationHeaderStyles.selectWrapper)}>
            <Select
              autoFocus
              openMenuOnFocus
              placeholder={t(
                'grafana-prometheus.querybuilder.operation-header.placeholder-replace-with',
                'Replace with'
              )}
              options={state.alternatives}
              isOpen={true}
              onCloseMenu={onToggleSwitcher}
              onChange={(value) => {
                if (value.value) {
                  // Operation should exist if it is selectable
                  const newDef = queryModeller.getOperationDef(value.value.id)!;

                  // copy default params, and override with all current params
                  const newParams = [...newDef.defaultParams];
                  for (let i = 0; i < Math.min(operation.params.length, newParams.length); i++) {
                    if (newDef.params[i].type === def.params[i].type) {
                      newParams[i] = operation.params[i];
                    }
                  }

                  const changedOp = { ...operation, params: newParams, id: value.value.id };
                  onChange(index, def.changeTypeHandler ? def.changeTypeHandler(changedOp, newDef) : changedOp);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

OperationHeader.displayName = 'OperationHeader';
