import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { queryEditorRowHeaderStyles } from './QueryEditorRowHeader.stylex';
import * as React from 'react';
import { type ReactNode, useState } from 'react';

import { type DataQuery, type DataSourceInstanceSettings, type GrafanaTheme2 } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { FieldValidationMessage, Icon, Input } from '@grafana/ui';
import { DataSourcePicker } from 'app/features/datasources/components/picker/DataSourcePicker';

export interface Props<TQuery extends DataQuery = DataQuery> {
  query: TQuery;
  queries: TQuery[];
  hidden?: boolean;
  dataSource: DataSourceInstanceSettings;
  renderExtras?: () => ReactNode;
  onChangeDataSource?: (settings: DataSourceInstanceSettings) => void;
  onChange: (query: TQuery) => void;
  collapsedText: string | null;
  alerting?: boolean;
  hideRefId?: boolean;
}

export const QueryEditorRowHeader = <TQuery extends DataQuery>(props: Props<TQuery>) => {
  const { query, queries, onChange, collapsedText, renderExtras, hidden, hideRefId = false } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const onEditQuery = (event: React.SyntheticEvent) => {
    setIsEditing(true);
  };

  const onEndEditName = (newName: string) => {
    setIsEditing(false);

    // Ignore change if invalid
    if (validationError) {
      setValidationError(null);
      return;
    }

    if (query.refId !== newName) {
      onChange({
        ...query,
        refId: newName,
      });
    }
  };

  const onInputChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const newName = event.currentTarget.value.trim();

    if (newName.length === 0) {
      setValidationError('An empty query name is not allowed');
      return;
    }

    for (const otherQuery of queries) {
      if (otherQuery !== query && newName === otherQuery.refId) {
        setValidationError('Query name already exists');
        return;
      }
    }

    if (validationError) {
      setValidationError(null);
    }
  };

  const onEditQueryBlur = (event: React.SyntheticEvent<HTMLInputElement>) => {
    onEndEditName(event.currentTarget.value.trim());
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onEndEditName(event.currentTarget.value);
    }
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <>
      <div {...stylex.props(queryEditorRowHeaderStyles.wrapper)}>
        {!hideRefId && !isEditing && (
          <button
            {...stylex.props(queryEditorRowHeaderStyles.queryNameWrapper)}
            data-testid={selectors.components.QueryEditorRow.title(query.refId)}
            title={t('query.query-editor-row-header.query-name-div-title-edit-query-name', 'Edit query name')}
            onClick={onEditQuery}
            type="button"
          >
            <span {...stylex.props(queryEditorRowHeaderStyles.queryName)}>{query.refId}</span>
            <Icon name="pen" className={queryEditorRowHeaderStyles.queryEditIcon} size="sm" />
          </button>
        )}

        {!hideRefId && isEditing && (
          <>
            <Input
              type="text"
              defaultValue={query.refId}
              onBlur={onEditQueryBlur}
              autoFocus
              onKeyDown={onKeyDown}
              onFocus={onFocus}
              invalid={validationError !== null}
              onChange={onInputChange}
              {...stylex.props(queryEditorRowHeaderStyles.queryNameInput)}
              data-testid="query-name-input"
            />
            {validationError && <FieldValidationMessage horizontal>{validationError}</FieldValidationMessage>}
          </>
        )}
        {renderDataSource(props, styles)}
        {renderExtras && <div {...stylex.props(queryEditorRowHeaderStyles.itemWrapper)}>{renderExtras()}</div>}
        {hidden && (
          <em {...stylex.props(queryEditorRowHeaderStyles.contextInfo)}>
            <Trans i18nKey="query.query-editor-row-header.hidden">Hidden</Trans>
          </em>
        )}
      </div>

      {collapsedText && <div {...stylex.props(queryEditorRowHeaderStyles.collapsedText)}>{collapsedText}</div>}
    </>
  );
};

const renderDataSource = <TQuery extends DataQuery>(
  props: Props<TQuery>,
  styles: ReturnType<typeof getStyles>
): ReactNode => {
  const { alerting, dataSource, onChangeDataSource } = props;

  if (!onChangeDataSource) {
    return <em {...stylex.props(queryEditorRowHeaderStyles.contextInfo)}>({dataSource.name})</em>;
  }

  return (
    <div {...stylex.props(queryEditorRowHeaderStyles.itemWrapper)}>
      <DataSourcePicker
        dashboard={true}
        variables={true}
        alerting={alerting}
        current={dataSource.name}
        onChange={onChangeDataSource}
      />
    </div>
  );
};

;
