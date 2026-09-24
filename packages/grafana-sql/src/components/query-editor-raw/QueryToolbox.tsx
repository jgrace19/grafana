import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { Stack, Icon, IconButton, Tooltip } from '@grafana/ui';
import { mergeStylexClassName } from '@grafana/ui/unstable';

import { sqlEditorStyles } from '../sqlComponents.stylex';

import { QueryValidator, type QueryValidatorProps } from './QueryValidator';

interface QueryToolboxProps extends Omit<QueryValidatorProps, 'onValidate'> {
  showTools?: boolean;
  isExpanded?: boolean;
  onFormatCode?: () => void;
  onExpand?: (expand: boolean) => void;
  onValidate?: (isValid: boolean) => void;
}

export function QueryToolbox({ showTools, onFormatCode, onExpand, isExpanded, ...validatorProps }: QueryToolboxProps) {
  const [validationResult, setValidationResult] = useState<boolean>();

  let style = {};

  if (!showTools && validationResult === undefined) {
    style = { height: 0, padding: 0, visibility: 'hidden' as const };
  }

  return (
    <div {...stylex.props(sqlEditorStyles.queryToolboxContainer)} style={style}>
      <div>
        {validatorProps.onValidate && (
          <QueryValidator
            {...validatorProps}
            onValidate={(result: boolean) => {
              setValidationResult(result);
              validatorProps.onValidate!(result);
            }}
          />
        )}
      </div>
      {showTools && (
        <div>
          <Stack gap={1}>
            {onFormatCode && (
              <IconButton
                onClick={() => {
                  reportInteraction('grafana_sql_query_formatted', {
                    datasource: validatorProps.query.datasource?.type,
                  });
                  onFormatCode();
                }}
                name="brackets-curly"
                size="xs"
                tooltip={t('grafana-sql.components.query-toolbox.tooltip-format-query', 'Format query')}
              />
            )}
            {onExpand && (
              <IconButton
                onClick={() => {
                  reportInteraction('grafana_sql_editor_expand', {
                    datasource: validatorProps.query.datasource?.type,
                    expanded: !isExpanded,
                  });

                  onExpand(!isExpanded);
                }}
                name={isExpanded ? 'angle-up' : 'angle-down'}
                size="xs"
                tooltip={
                  isExpanded
                    ? t('grafana-sql.components.query-toolbox.tooltip-collapse', 'Collapse editor')
                    : t('grafana-sql.components.query-toolbox.tooltip-expand', 'Expand editor')
                }
              />
            )}
            <Tooltip
              content={t(
                'grafana-sql.components.query-toolbox.content-hit-ctrlcmdreturn-to-run-query',
                'Hit CTRL/CMD+Return to run query'
              )}
            >
              <Icon className={mergeStylexClassName(stylex.props(sqlEditorStyles.queryToolboxHint)).className} name="keyboard" />
            </Tooltip>
          </Stack>
        </div>
      )}
    </div>
  );
}
