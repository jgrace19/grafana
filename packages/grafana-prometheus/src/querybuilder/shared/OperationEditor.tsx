// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/querybuilder/shared/OperationEditor.tsx
import { Draggable } from '@hello-pangea/dnd';
import { useEffect, useId, useState } from 'react';
import * as React from 'react';
import * as stylex from '@stylexjs/stylex';

import { type DataSourceApi, type TimeRange } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Button, Icon, Stack, Tooltip } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { operationEditorStyles } from './OperationEditor.stylex';

import { OperationHeader } from './OperationHeader';
import { getOperationParamEditor } from './OperationParamEditorRegistry';
import { getOperationParamId } from './param_utils';
import {
  type QueryBuilderOperation,
  type QueryBuilderOperationDef,
  type QueryBuilderOperationParamDef,
  type QueryBuilderOperationParamValue,
  type VisualQueryModeller,
} from './types';

interface Props {
  operation: QueryBuilderOperation;
  index: number;
  query: any;
  datasource: DataSourceApi;
  queryModeller: VisualQueryModeller;
  onChange: (index: number, update: QueryBuilderOperation) => void;
  onRemove: (index: number) => void;
  onRunQuery: () => void;
  flash?: boolean;
  highlight?: boolean;
  timeRange: TimeRange;
}

export function OperationEditor({
  operation,
  index,
  onRemove,
  onChange,
  onRunQuery,
  queryModeller,
  query,
  datasource,
  flash,
  highlight,
  timeRange,
}: Props) {
  const def = queryModeller.getOperationDef(operation.id);
  const shouldFlash = useFlash(flash);
  const id = useId();

  if (!def) {
    return (
      <span>
        <Trans i18nKey="grafana-prometheus.querybuilder.operation-editor.not-found" values={{ id: operation.id }}>
          Operation {'{{id}}'} not found
        </Trans>
      </span>
    );
  }

  const onParamValueChanged = (paramIdx: number, value: QueryBuilderOperationParamValue) => {
    const update: QueryBuilderOperation = { ...operation, params: [...operation.params] };
    update.params[paramIdx] = value;
    callParamChangedThenOnChange(def, update, index, paramIdx, onChange);
  };

  const onAddRestParam = () => {
    const update: QueryBuilderOperation = { ...operation, params: [...operation.params, ''] };
    callParamChangedThenOnChange(def, update, index, operation.params.length, onChange);
  };

  const onRemoveRestParam = (paramIdx: number) => {
    const update: QueryBuilderOperation = {
      ...operation,
      params: [...operation.params.slice(0, paramIdx), ...operation.params.slice(paramIdx + 1)],
    };
    callParamChangedThenOnChange(def, update, index, paramIdx, onChange);
  };

  const operationElements: React.ReactNode[] = [];

  for (let paramIndex = 0; paramIndex < operation.params.length; paramIndex++) {
    const paramDef = def.params[Math.min(def.params.length - 1, paramIndex)];
    const Editor = getOperationParamEditor(paramDef);

    operationElements.push(
      <div {...stylex.props(operationEditorStyles.paramRow)} key={`${paramIndex}-1`}>
        {!paramDef.hideName && (
          <div {...stylex.props(operationEditorStyles.paramName)}>
            <label htmlFor={getOperationParamId(id, paramIndex)}>{paramDef.name}</label>
            {paramDef.description && (
              <Tooltip placement="top" content={paramDef.description} theme="info">
                <Icon
                  name="info-circle"
                  size="sm"
                  className={stylex.props(operationEditorStyles.infoIcon).className}
                />
              </Tooltip>
            )}
          </div>
        )}
        <div {...stylex.props(operationEditorStyles.paramValue)}>
          <Stack gap={0.5} direction="row" alignItems="center">
            <Editor
              paramDef={paramDef}
              value={operation.params[paramIndex]}
              index={paramIndex}
              operationId={operation.id}
              query={query}
              datasource={datasource}
              timeRange={timeRange}
              onChange={onParamValueChanged}
              onRunQuery={onRunQuery}
              queryModeller={queryModeller}
            />
            {paramDef.restParam && (operation.params.length > def.params.length || paramDef.optional) && (
              <Button
                data-testid={`operations.${index}.remove-rest-param`}
                size="sm"
                fill="text"
                icon="times"
                variant="secondary"
                aria-label={t('grafana-prometheus.querybuilder.operation-editor.title-remove', 'Remove {{name}}', {
                  name: paramDef.name,
                })}
                onClick={() => onRemoveRestParam(paramIndex)}
              />
            )}
          </Stack>
        </div>
      </div>
    );
  }

  // Handle adding button for rest params
  let restParam: React.ReactNode | undefined;
  if (def.params.length > 0) {
    const lastParamDef = def.params[def.params.length - 1];
    if (lastParamDef.restParam) {
      restParam = renderAddRestParamButton(lastParamDef, onAddRestParam, index, operation.params.length);
    }
  }

  return (
    <Draggable draggableId={`operation-${index}`} index={index}>
      {(provided) => (
        <div
          {...mergeStylexClassName(
            stylex.props(
              operationEditorStyles.card,
              (shouldFlash || highlight) && operationEditorStyles.cardHighlight
            )
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-testid={`operations.${index}.wrapper`}
        >
          <OperationHeader
            operation={operation}
            dragHandleProps={provided.dragHandleProps}
            def={def}
            index={index}
            onChange={onChange}
            onRemove={onRemove}
            queryModeller={queryModeller}
          />
          <div {...stylex.props(operationEditorStyles.body)}>{operationElements}</div>
          {restParam}
          {index < query.operations.length - 1 && (
            <div {...stylex.props(operationEditorStyles.arrow)}>
              <div {...stylex.props(operationEditorStyles.arrowLine)} />
              <div {...stylex.props(operationEditorStyles.arrowArrow)} />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

/**
 * When flash is switched on makes sure it is switched of right away, so we just flash the highlight and then fade
 * out.
 * @param flash
 */
function useFlash(flash?: boolean) {
  const [keepFlash, setKeepFlash] = useState(true);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (flash) {
      t = setTimeout(() => {
        setKeepFlash(false);
      }, 1000);
    } else {
      setKeepFlash(true);
    }

    return () => clearTimeout(t);
  }, [flash]);

  return keepFlash && flash;
}

function renderAddRestParamButton(
  paramDef: QueryBuilderOperationParamDef,
  onAddRestParam: () => void,
  operationIndex: number,
  paramIndex: number
) {
  return (
    <div {...stylex.props(operationEditorStyles.restParam)} key={`${paramIndex}-2`}>
      <Button
        size="sm"
        icon="plus"
        title={`Add ${paramDef.name}`.trimEnd()}
        variant="secondary"
        onClick={onAddRestParam}
        data-testid={`operations.${operationIndex}.add-rest-param`}
      >
        {paramDef.name}
      </Button>
    </div>
  );
}

function callParamChangedThenOnChange(
  def: QueryBuilderOperationDef,
  operation: QueryBuilderOperation,
  operationIndex: number,
  paramIndex: number,
  onChange: (index: number, update: QueryBuilderOperation) => void
) {
  if (def.paramChangedHandler) {
    onChange(operationIndex, def.paramChangedHandler(paramIndex, operation, def));
  } else {
    onChange(operationIndex, operation);
  }
}

