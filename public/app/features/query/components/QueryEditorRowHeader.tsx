import * as stylex from '@stylexjs/stylex';
import * as React from 'react';
import { type ReactNode, useState } from 'react';

import { type DataQuery, type DataSourceInstanceSettings } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Trans, t } from '@grafana/i18n';
import { FieldValidationMessage, Icon, Input } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { DataSourcePicker } from 'app/features/datasources/components/picker/DataSourcePicker';

import { queryNameMarker } from './markers.stylex';

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
      <div {...stylex.props(styles.wrapper)}>
        {!hideRefId && !isEditing && (
          <button
            {...stylex.props(styles.queryNameWrapper, queryNameMarker)}
            data-testid={selectors.components.QueryEditorRow.title(query.refId)}
            title={t('query.query-editor-row-header.query-name-div-title-edit-query-name', 'Edit query name')}
            onClick={onEditQuery}
            type="button"
          >
            <span {...stylex.props(styles.queryName)}>{query.refId}</span>
            <Icon name="pen" xstyle={styles.queryEditIcon} size="sm" />
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
              className={stylex.props(styles.queryNameInput).className}
              data-testid="query-name-input"
            />
            {validationError && <FieldValidationMessage horizontal>{validationError}</FieldValidationMessage>}
          </>
        )}
        {renderDataSource(props)}
        {renderExtras && <div {...stylex.props(styles.itemWrapper)}>{renderExtras()}</div>}
        {hidden && (
          <em {...stylex.props(styles.contextInfo)}>
            <Trans i18nKey="query.query-editor-row-header.hidden">Hidden</Trans>
          </em>
        )}
      </div>

      {collapsedText && <div {...stylex.props(styles.collapsedText)}>{collapsedText}</div>}
    </>
  );
};

const renderDataSource = <TQuery extends DataQuery>(props: Props<TQuery>): ReactNode => {
  const { alerting, dataSource, onChangeDataSource } = props;

  if (!onChangeDataSource) {
    return <em {...stylex.props(styles.contextInfo)}>({dataSource.name})</em>;
  }

  return (
    <div {...stylex.props(styles.itemWrapper)}>
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

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
  },
  queryNameWrapper: {
    display: 'flex',
    cursor: 'pointer',
    borderWidth: { default: '1px', ':focus': '2px' },
    borderStyle: { default: 'solid', ':hover': 'dashed', ':focus': 'solid' },
    borderColor: {
      default: 'transparent',
      ':hover': colors['--gf-colors-border-strong'],
      ':focus': colors['--gf-colors-primary-border'],
    },
    borderRadius: shape['--gf-shape-radius-default'],
    alignItems: 'center',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    backgroundColor: { default: 'transparent', ':hover': colors['--gf-colors-action-hover'] },
    overflow: 'hidden',
  },
  queryName: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    color: colors['--gf-colors-primary-text'],
    cursor: 'pointer',
    overflow: 'hidden',
    marginLeft: spacing['--gf-spacing-x0-5'],
  },
  queryEditIcon: {
    marginLeft: spacing['--gf-spacing-x2'],
    visibility: {
      default: 'hidden',
      [stylex.when.ancestor(':hover', queryNameMarker)]: 'visible',
      [stylex.when.ancestor(':focus', queryNameMarker)]: 'visible',
    },
  },
  queryNameInput: {
    maxWidth: '300px',
    marginTop: '-4px',
    marginRight: 0,
    marginBottom: '-4px',
    marginLeft: 0,
  },
  collapsedText: {
    fontWeight: typography['--gf-typography-font-weight-regular'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    paddingLeft: spacing['--gf-spacing-x1'],
    alignItems: 'center',
    overflow: 'hidden',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  contextInfo: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontStyle: 'italic',
    color: colors['--gf-colors-text-secondary'],
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  itemWrapper: {
    display: 'flex',
    marginLeft: '4px',
  },
});
