import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import {
  type DataSourceJsonData,
  type DataSourcePluginOptionsEditorProps,
  updateDatasourcePluginJsonDataOption,
} from '@grafana/data';
import { InlineField, InlineFieldRow, InlineSwitch } from '@grafana/ui';

import { traceIdTimeParamsStyles } from './TraceIdTimeParams.stylex';

export interface TraceIdTimeParamsOptions {
  enabled?: boolean;
}

export interface TraceIdTimeParamsData extends DataSourceJsonData {
  traceIdTimeParams?: TraceIdTimeParamsOptions;
}

interface Props extends DataSourcePluginOptionsEditorProps<TraceIdTimeParamsData> {}

export function TraceIdTimeParams({ options, onOptionsChange }: Props) {
  return (
    <div {...stylex.props(traceIdTimeParamsStyles.container)}>
      <h3 className="page-heading">Query Trace by ID with Time Params</h3>
      <InlineFieldRow {...stylex.props(traceIdTimeParamsStyles.row)}>
        <InlineField
          tooltip="pass time parameters when querying trace by ID"
          label="Enable Time Parameters"
          labelWidth={26}
        >
          <InlineSwitch
            id="enableTraceIdTimeParams"
            value={options.jsonData.traceIdTimeParams?.enabled}
            onChange={(event: React.SyntheticEvent<HTMLInputElement>) =>
              updateDatasourcePluginJsonDataOption({ onOptionsChange, options }, 'traceIdTimeParams', {
                ...options.jsonData.traceIdTimeParams,
                enabled: event.currentTarget.checked,
              })
            }
          />
        </InlineField>
      </InlineFieldRow>
    </div>
  );
}
