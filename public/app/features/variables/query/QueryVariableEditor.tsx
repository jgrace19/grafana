import { type FormEvent, useEffect } from 'react';

import {
  type DataSourceInstanceSettings,
  getDataSourceRef,
  type QueryVariableModel,
  type SelectableValue,
  type VariableRefresh,
  type VariableSort,
} from '@grafana/data';
import { QueryVariableEditorForm } from 'app/features/dashboard-scene/settings/variables/components/QueryVariableForm';
import { type StoreState, useDispatch, useSelector } from 'app/types/store';

import { getTimeSrv } from '../../dashboard/services/TimeSrv';
import { initialVariableEditorState } from '../editor/reducer';
import { getQueryVariableEditorState } from '../editor/selectors';
import { type VariableEditorProps } from '../editor/types';
import { getVariablesState } from '../state/selectors';
import { toKeyedVariableIdentifier } from '../utils';

import { changeQueryVariableDataSource, changeQueryVariableQuery, initQueryVariableEditor } from './actions';

export interface OwnProps extends VariableEditorProps<QueryVariableModel> {}

export type Props = OwnProps;

export function QueryVariableEditorUnConnected({ variable, onPropChange }: OwnProps) {
  const dispatch = useDispatch();

  const extended = useSelector((state: StoreState) => {
    const { rootStateKey } = variable;
    if (!rootStateKey) {
      console.error('QueryVariableEditor: variable has no rootStateKey');
      return getQueryVariableEditorState(initialVariableEditorState);
    }

    const { editor } = getVariablesState(rootStateKey, state);
    return getQueryVariableEditorState(editor);
  });

  useEffect(() => {
    dispatch(initQueryVariableEditor(toKeyedVariableIdentifier(variable)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevDatasourceRef = { current: variable.datasource };
  useEffect(() => {
    if (prevDatasourceRef.current !== variable.datasource) {
      dispatch(changeQueryVariableDataSource(toKeyedVariableIdentifier(variable), variable.datasource));
    }
    prevDatasourceRef.current = variable.datasource;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variable.datasource]);

  const onDataSourceChange = (dsSettings: DataSourceInstanceSettings) => {
    onPropChange({
      propName: 'datasource',
      propValue: dsSettings.isDefault ? null : getDataSourceRef(dsSettings),
    });
  };

  const onLegacyQueryChange = async (query: unknown, definition: string) => {
    if (variable.query !== query) {
      dispatch(changeQueryVariableQuery(toKeyedVariableIdentifier(variable), query, definition));
    }
  };

  const onQueryChange = async (query: unknown) => {
    if (variable.query !== query) {
      let definition = '';

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const queryRecord = query as Record<string, unknown>;
      if (query && typeof query === 'object' && 'query' in query && typeof queryRecord.query === 'string') {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        definition = queryRecord.query as string;
      }

      dispatch(changeQueryVariableQuery(toKeyedVariableIdentifier(variable), query, definition));
    }
  };

  const onRegExBlur = async (event: FormEvent<HTMLTextAreaElement>) => {
    const regex = event.currentTarget.value;
    if (variable.regex !== regex) {
      onPropChange({ propName: 'regex', propValue: regex, updateOptions: true });
    }
  };

  const onRefreshChange = (option: VariableRefresh) => {
    onPropChange({ propName: 'refresh', propValue: option });
  };

  const onSortChange = async (option: SelectableValue<VariableSort>) => {
    onPropChange({ propName: 'sort', propValue: option.value, updateOptions: true });
  };

  const onMultiChange = (event: FormEvent<HTMLInputElement>) => {
    onPropChange({ propName: 'multi', propValue: event.currentTarget.checked });
  };

  const onIncludeAllChange = (event: FormEvent<HTMLInputElement>) => {
    onPropChange({ propName: 'includeAll', propValue: event.currentTarget.checked });
  };

  const onAllValueChange = (event: FormEvent<HTMLInputElement>) => {
    onPropChange({ propName: 'allValue', propValue: event.currentTarget.value });
  };

  if (!extended || !extended.dataSource) {
    return null;
  }

  const timeRange = getTimeSrv().timeRange();

  return (
    <QueryVariableEditorForm
      datasource={variable.datasource ?? undefined}
      onDataSourceChange={onDataSourceChange}
      query={variable.query}
      onQueryChange={onQueryChange}
      onLegacyQueryChange={onLegacyQueryChange}
      timeRange={timeRange}
      regex={variable.regex}
      onRegExChange={onRegExBlur}
      sort={variable.sort}
      onSortChange={onSortChange}
      refresh={variable.refresh}
      onRefreshChange={onRefreshChange}
      isMulti={variable.multi}
      includeAll={variable.includeAll}
      allValue={variable.allValue ?? ''}
      onMultiChange={onMultiChange}
      onIncludeAllChange={onIncludeAllChange}
      onAllValueChange={onAllValueChange}
      options={variable.options.map((o) => ({
        label: String(o.text),
        value: String(o.value),
        properties: o.properties,
      }))}
    />
  );
}

export const QueryVariableEditor = QueryVariableEditorUnConnected;
