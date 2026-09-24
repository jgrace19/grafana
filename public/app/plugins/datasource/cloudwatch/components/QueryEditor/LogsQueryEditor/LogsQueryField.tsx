import * as stylex from '@stylexjs/stylex';
import { logsQueryFieldStyles } from './LogsQueryField.stylex';

import { type ReactNode, useCallback } from 'react';


import {
  type CloudWatchLogsQuery,
  type LogGroupClass,
  LogsQueryLanguage,
  type LogsQueryScope,
} from '../../../dataquery.gen';
import { type CloudWatchDatasource } from '../../../datasource';
import { type CloudWatchJsonData, type CloudWatchQuery } from '../../../types';
import { LogGroupsFieldWrapper } from '../../shared/LogGroups/LogGroupsField';

import { LogsQLCodeEditor } from './code-editors/LogsQLCodeEditor';
import { PPLQueryEditor } from './code-editors/PPLQueryEditor';
import { SQLQueryEditor } from './code-editors/SQLCodeEditor';

export interface CloudWatchLogsQueryFieldProps
  extends QueryEditorProps<CloudWatchDatasource, CloudWatchQuery, CloudWatchJsonData> {
  ExtraFieldElement?: ReactNode;
  query: CloudWatchLogsQuery;
}
export const CloudWatchLogsQueryField = (props: CloudWatchLogsQueryFieldProps) => {
  const { query, datasource, onChange, ExtraFieldElement } = props;

  const onChangeLogs = useCallback(
    async (query: CloudWatchLogsQuery) => {
      onChange(query);
    },
    [onChange]
  );

  return (
    <>
      <LogGroupsFieldWrapper
        region={query.region}
        datasource={datasource}
        legacyLogGroupNames={query.logGroupNames}
        logGroups={query.logGroups}
        onChange={(logGroups) => {
          onChangeLogs({ ...query, logGroups, logGroupNames: undefined });
        }}
        queryLanguage={query.queryLanguage}
        logsQueryScope={query.logsQueryScope}
        onLogsQueryScopeChange={(scope: LogsQueryScope) => {
          onChangeLogs({ ...query, logsQueryScope: scope });
        }}
        logGroupPrefixes={query.logGroupPrefixes}
        onLogGroupPrefixesChange={(prefixes: string[]) => {
          onChangeLogs({ ...query, logGroupPrefixes: prefixes });
        }}
        logGroupClass={query.logGroupClass}
        onLogGroupClassChange={(logGroupClass: LogGroupClass) => {
          onChangeLogs({ ...query, logGroupClass });
        }}
        selectedAccountIds={query.selectedAccountIds}
        onSelectedAccountIdsChange={(accountIds: string[]) => {
          onChangeLogs({ ...query, selectedAccountIds: accountIds });
        }}
        //legacy props
        legacyOnChange={(logGroupNames) => {
          onChangeLogs({ ...query, logGroupNames });
        }}
      />
      <div>
        {getCodeEditor(query, datasource, onChange)}
        <div {...stylex.props(logsQueryFieldStyles.editor)}>{ExtraFieldElement}</div>
      </div>
    </>
  );
};


const getCodeEditor = (
  query: CloudWatchLogsQuery,
  datasource: CloudWatchDatasource,
  onChange: (value: CloudWatchLogsQuery) => void
) => {
  switch (query.queryLanguage) {
    case LogsQueryLanguage.PPL:
      return <PPLQueryEditor query={query} datasource={datasource} onChange={onChange} />;
    case LogsQueryLanguage.SQL:
      return <SQLQueryEditor query={query} datasource={datasource} onChange={onChange} />;
    default:
      return <LogsQLCodeEditor query={query} datasource={datasource} onChange={onChange} />;
  }
};
