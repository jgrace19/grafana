import * as stylex from '@stylexjs/stylex';
import { isEqual } from 'lodash';
import { parse, stringify } from 'lossless-json';
import { type CSSProperties, memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  CoreApp,
  type Field,
  fuzzySearch,
  type IconName,
  type LinkModel,
  type LogLabelStatsModel,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { ClipboardButton, DataLinkButton, IconButton, type IconSize } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { logRowToSingleRowDataFrame } from '../../logsModel';
import { calculateLogsLabelStats, calculateStats } from '../../utils';
import { LogLabelStats } from '../LogLabelStats';
import { OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME } from '../fieldSelector/logFields';
import { type FieldDef } from '../logParser';

import { useLogDetailsContext } from './LogDetailsContext';
import { useLogListContext } from './LogListContext';
import { type LogListModel, getNormalizedFieldName } from './processing';
import './LogLineDetailsFields.css';

interface LogLineDetailsFieldsProps {
  disableActions?: boolean;
  fields: FieldDef[];
  log: LogListModel;
  logs: LogListModel[];
  search?: string;
}

export const LogLineDetailsFields = memo(({ disableActions, fields, log, logs, search }: LogLineDetailsFieldsProps) => {
  const { fontSize } = useLogListContext();
  const getLogs = useCallback(() => logs, [logs]);
  const filteredFields = useMemo(() => (search ? filterFields(fields, search) : fields), [fields, search]);

  if (!fields.length) {
    return null;
  } else if (filteredFields.length === 0) {
    return t('logs.log-line-details.search.no-results', 'No results to display.');
  }

  return (
    <div
      {...stylex.props(
        tableStyles.table,
        fontSize === 'small' ? tableStyles.gapSmall : tableStyles.gap,
        disableActions
          ? tableStyles.columnsNoActions
          : fontSize === 'small'
            ? tableStyles.columnsSmall
            : tableStyles.columns
      )}
    >
      {filteredFields.map((field, i) => (
        <LogLineDetailsField
          key={`${field.keys[0]}=${field.values[0]}-${i}`}
          disableActions={disableActions}
          getLogs={getLogs}
          fieldIndex={field.fieldIndex}
          keys={field.keys}
          links={field.links}
          log={log}
          values={field.values}
        />
      ))}
    </div>
  );
});
LogLineDetailsFields.displayName = 'LogLineDetailsFields';

interface LinkModelWithIcon extends LinkModel<Field> {
  icon?: IconName;
}

export interface LabelWithLinks {
  key: string;
  value: string;
  links?: LinkModelWithIcon[];
}

interface LogLineDetailsLabelFieldsProps {
  fields: LabelWithLinks[];
  log: LogListModel;
  logs: LogListModel[];
  search?: string;
}

export const LogLineDetailsLabelFields = ({ fields, log, logs, search }: LogLineDetailsLabelFieldsProps) => {
  const { fontSize } = useLogListContext();
  const getLogs = useCallback(() => logs, [logs]);
  const filteredFields = useMemo(() => (search ? filterLabels(fields, search) : fields), [fields, search]);

  if (!fields.length) {
    return null;
  } else if (filteredFields.length === 0) {
    return t('logs.log-line-details.search.no-results', 'No results to display.');
  }

  return (
    <div
      {...stylex.props(
        tableStyles.table,
        fontSize === 'small' ? tableStyles.gapSmall : tableStyles.gap,
        fontSize === 'small' ? tableStyles.columnsSmall : tableStyles.columns
      )}
    >
      {filteredFields.map((field, i) => (
        <LogLineDetailsField
          key={`${field.key}=${field.value}-${i}`}
          getLogs={getLogs}
          isLabel
          keys={[field.key]}
          links={field.links}
          log={log}
          values={[field.value]}
        />
      ))}
    </div>
  );
};

interface LogLineDetailsFieldProps {
  keys: string[];
  values: string[];
  disableActions?: boolean;
  fieldIndex?: number;
  getLogs(): LogListModel[];
  isLabel?: boolean;
  links?: LinkModelWithIcon[];
  log: LogListModel;
}

export const LogLineDetailsField = ({
  disableActions = false,
  fieldIndex,
  getLogs,
  isLabel,
  links,
  log,
  keys,
  values,
}: LogLineDetailsFieldProps) => {
  const [showFieldsStats, setShowFieldStats] = useState(false);
  const [fieldCount, setFieldCount] = useState(0);
  const [fieldStats, setFieldStats] = useState<LogLabelStatsModel[] | null>(null);
  const { fontSize } = useLogListContext();
  const {
    app,
    displayedFields,
    isLabelFilterActive,
    noInteractions,
    onClickFilterLabel,
    onClickFilterOutLabel,
    onClickShowField,
    onClickHideField,
    onPinLine,
    pinLineButtonTooltipTitle,
    prettifyJSON,
  } = useLogListContext();
  const { closeDetails } = useLogDetailsContext();

  const getStats = useCallback(() => {
    if (isLabel) {
      return calculateLogsLabelStats(getLogs(), keys[0]);
    }
    if (fieldIndex !== undefined) {
      return calculateStats(log.dataFrame.fields[fieldIndex].values);
    }
    return [];
  }, [fieldIndex, getLogs, isLabel, keys, log.dataFrame.fields]);

  const updateStats = useCallback(() => {
    const newStats = getStats();
    const newCount = newStats.reduce((sum, stat) => sum + stat.count, 0);
    if (!isEqual(fieldStats, newStats) || fieldCount !== newCount) {
      setFieldStats(newStats);
      setFieldCount(newCount);
    }
  }, [fieldCount, fieldStats, getStats]);

  useEffect(() => {
    if (showFieldsStats) {
      updateStats();
    }
  }, [showFieldsStats, updateStats]);

  const reportInteractionWrapper = useCallback(
    (interactionName: string, properties?: Record<string, unknown>) => {
      if (noInteractions) {
        return;
      }
      reportInteraction(interactionName, properties);
    },
    [noInteractions]
  );

  const showField = useCallback(() => {
    if (onClickShowField) {
      onClickShowField(keys[0]);
    }

    reportInteractionWrapper('logs_log_line_details_show_field_clicked', {
      datasourceType: log.datasourceType,
    });
  }, [onClickShowField, reportInteractionWrapper, log.datasourceType, keys]);

  const hideField = useCallback(() => {
    if (onClickHideField) {
      onClickHideField(keys[0]);
    }

    reportInteractionWrapper('logs_log_line_details_hide_field_clicked', {
      datasourceType: log.datasourceType,
    });
  }, [onClickHideField, reportInteractionWrapper, log.datasourceType, keys]);

  const filterLabel = useCallback(() => {
    if (onClickFilterLabel) {
      onClickFilterLabel(keys[0], values[0], logRowToSingleRowDataFrame(log) || undefined);
    }

    reportInteractionWrapper('logs_log_line_details_filter_clicked', {
      datasourceType: log.datasourceType,
      filterType: 'include',
      logRowUid: log.uid,
    });
  }, [onClickFilterLabel, reportInteractionWrapper, log, keys, values]);

  const filterOutLabel = useCallback(() => {
    if (onClickFilterOutLabel) {
      onClickFilterOutLabel(keys[0], values[0], logRowToSingleRowDataFrame(log) || undefined);
    }

    reportInteractionWrapper('logs_log_line_details_filter_clicked', {
      datasourceType: log.datasourceType,
      filterType: 'exclude',
      logRowUid: log.uid,
    });
  }, [onClickFilterOutLabel, reportInteractionWrapper, log, keys, values]);

  const labelFilterActive = useCallback(async () => {
    if (isLabelFilterActive) {
      return await isLabelFilterActive(keys[0], values[0], log.dataFrame?.refId);
    }
    return false;
  }, [isLabelFilterActive, keys, values, log.dataFrame?.refId]);

  const showStats = useCallback(() => {
    setShowFieldStats((showFieldStats: boolean) => !showFieldStats);

    reportInteractionWrapper('logs_log_line_details_stats_clicked', {
      dataSourceType: log.datasourceType,
      fieldType: isLabel ? 'label' : 'field',
      type: showFieldsStats ? 'close' : 'open',
      logRowUid: log.uid,
      app,
    });
  }, [app, isLabel, log.datasourceType, log.uid, reportInteractionWrapper, showFieldsStats]);

  const refIdTooltip = useMemo(
    () => (app === CoreApp.Explore && log.dataFrame?.refId ? ` in query ${log.dataFrame?.refId}` : ''),
    [app, log.dataFrame?.refId]
  );
  const singleKey = keys.length === 1;
  const singleValue = values.length === 1;

  const fieldSupportsFilters = keys[0] !== OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME;

  return (
    <>
      <div {...stylex.props(styles.row)}>
        {!disableActions && (
          <div {...stylex.props(styles.actions)}>
            <div {...stylex.props(styles.actionIcons)}>
              {onClickFilterLabel && fieldSupportsFilters && (
                <AsyncIconButton
                  name="search-plus"
                  size={fontSize === 'small' ? 'sm' : undefined}
                  onClick={filterLabel}
                  // We purposely want to pass a new function on every render to allow the active state to be updated when log details remains open between updates.
                  isActive={labelFilterActive}
                  tooltipSuffix={refIdTooltip}
                />
              )}
              {onClickFilterOutLabel && fieldSupportsFilters && (
                <IconButton
                  name="search-minus"
                  size={fontSize === 'small' ? 'sm' : undefined}
                  tooltip={
                    app === CoreApp.Explore && log.dataFrame?.refId
                      ? t('logs.log-line-details.fields.filter-out-query', 'Filter out value in query {{query}}', {
                          query: log.dataFrame?.refId,
                        })
                      : t('logs.log-line-details.fields.filter-out', 'Filter out value')
                  }
                  onClick={filterOutLabel}
                />
              )}
              {singleKey && displayedFields.includes(keys[0]) && (
                <IconButton
                  variant="primary"
                  size={fontSize === 'small' ? 'sm' : undefined}
                  tooltip={t('logs.log-line-details.fields.toggle-field-button.hide-this-field', 'Hide this field')}
                  name="eye"
                  onClick={hideField}
                />
              )}
              {singleKey && !displayedFields.includes(keys[0]) && (
                <IconButton
                  tooltip={t(
                    'logs.log-line-details.fields.toggle-field-button.field-instead-message',
                    'Show this field instead of the message'
                  )}
                  name="eye"
                  size={fontSize === 'small' ? 'sm' : undefined}
                  onClick={showField}
                />
              )}
              <IconButton
                variant={showFieldsStats ? 'primary' : 'secondary'}
                name="signal"
                size={fontSize === 'small' ? 'sm' : undefined}
                tooltip={t('logs.log-line-details.fields.adhoc-statistics', 'Ad-hoc statistics')}
                className={stylex.props(styles.statsIcon).className}
                style={statsIconStyle}
                disabled={!singleKey}
                onClick={showStats}
              />
            </div>
          </div>
        )}
        <div {...stylex.props(styles.label)}>
          {singleKey ? getNormalizedFieldName(keys[0]) : <MultipleValue values={keys} />}
        </div>
        <div {...mergeStylexProps(stylex.props(styles.value), { className: 'gf-log-line-details-value' })}>
          <div {...stylex.props(styles.valueContainer)}>
            {singleValue ? (
              <SingleValue value={values[0]} prettifyJSON={prettifyJSON} />
            ) : (
              <MultipleValue showCopy={true} values={values} />
            )}
          </div>
        </div>
      </div>
      {links?.map((link, i) => {
        if (link.onClick && onPinLine) {
          const originalOnClick = link.onClick;
          link.onClick = (e, origin) => {
            // Pin the line
            onPinLine(log);

            // Execute the link onClick function
            originalOnClick(e, origin);

            closeDetails();
          };
        }
        return (
          <div {...stylex.props(styles.row)} key={`${link.title}-${i}`}>
            <div {...stylex.props(disableActions ? styles.linkNoActions : styles.link)}>
              <DataLinkButton
                buttonProps={{
                  // Show tooltip message if max number of pinned lines has been reached
                  tooltip:
                    typeof pinLineButtonTooltipTitle === 'object' && link.onClick
                      ? pinLineButtonTooltipTitle
                      : undefined,
                  variant: 'secondary',
                  fill: 'outline',
                  ...(link.icon && { icon: link.icon }),
                }}
                link={link}
              />
            </div>
          </div>
        );
      })}
      {showFieldsStats && fieldStats && (
        <div {...stylex.props(styles.row)}>
          <div {...stylex.props(!disableActions && styles.statsColumn)}>
            <LogLabelStats
              xstyle={styles.stats}
              stats={fieldStats}
              label={keys[0]}
              value={values[0]}
              rowCount={fieldCount}
              isLabel={isLabel}
            />
          </div>
        </div>
      )}
    </>
  );
};

const ClipboardButtonWrapper = ({ value }: { value: string }) => {
  return (
    <div className="gf-log-line-details-copy">
      <ClipboardButton
        getText={() => value}
        aria-label={t('logs.log-line-details.fields.copy-value-to-clipboard', 'Copy value to clipboard')}
        fill="text"
        variant="secondary"
        icon="copy"
        size="md"
      />
    </div>
  );
};

export const MultipleValue = ({ showCopy, values = [] }: { showCopy?: boolean; values: string[] }) => {
  if (values.every((val) => val === '')) {
    return null;
  }
  return (
    <table>
      <tbody>
        {values.map((val, i) => {
          return (
            <tr key={`${val}-${i}`}>
              <td>{val}</td>
              <td>{showCopy && val !== '' && <ClipboardButtonWrapper value={val} />}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const SingleValue = ({ value: originalValue, prettifyJSON }: { value: string; prettifyJSON?: boolean }) => {
  const value = useMemo(() => {
    if (!prettifyJSON) {
      return originalValue;
    }
    try {
      const parsed = stringify(parse(originalValue), undefined, 2);
      if (parsed) {
        return parsed;
      }
    } catch (error) {}
    return originalValue;
  }, [originalValue, prettifyJSON]);

  return (
    <>
      {value}
      <ClipboardButtonWrapper value={value} />
    </>
  );
};

interface AsyncIconButtonProps extends Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  name: IconName;
  isActive(): Promise<boolean>;
  size?: IconSize;
  tooltipSuffix: string;
}

const AsyncIconButton = ({ isActive, tooltipSuffix, ...rest }: AsyncIconButtonProps) => {
  const [active, setActive] = useState(false);
  const tooltip = active ? 'Remove filter' : 'Filter for value';

  useEffect(() => {
    isActive().then(setActive);
  }, [isActive]);

  return <IconButton {...rest} variant={active ? 'primary' : undefined} tooltip={tooltip + tooltipSuffix} />;
};

export function filterFields(fields: FieldDef[], search: string) {
  const keys = fields.map((field) => field.keys.join(' '));
  const keysIdx = fuzzySearch(keys, search);
  const values = fields.map((field) => field.values.join(' '));
  const valuesIdx = fuzzySearch(values, search);

  const results = keysIdx.map((index) => fields[index]);
  valuesIdx.forEach((index) => {
    if (!results.includes(fields[index])) {
      results.push(fields[index]);
    }
  });

  return results;
}

function filterLabels(labels: LabelWithLinks[], search: string) {
  const keys = labels.map((field) => field.key);
  const keysIdx = fuzzySearch(keys, search);
  const values = labels.map((field) => field.value);
  const valuesIdx = fuzzySearch(values, search);

  const results = keysIdx.map((index) => labels[index]);
  valuesIdx.forEach((index) => {
    if (!results.includes(labels[index])) {
      results.push(labels[index]);
    }
  });

  return results;
}

// IconButton has no xstyle and sets its own right margin, which a class from another stylex.props() call can't
// reliably override.
const statsIconStyle: CSSProperties = { margin: 0 };

const tableStyles = stylex.create({
  table: {
    display: 'grid',
  },
  gap: {
    rowGap: spacing['--gf-spacing-x0-5'],
    columnGap: spacing['--gf-spacing-x1'],
  },
  gapSmall: {
    rowGap: spacing['--gf-spacing-x0-25'],
    columnGap: spacing['--gf-spacing-x0-5'],
  },
  columns: {
    gridTemplateColumns: `calc(${spacing['--gf-spacing-grid-size']} * 11.5) fit-content(30%) 1fr`,
  },
  columnsSmall: {
    gridTemplateColumns: `calc(${spacing['--gf-spacing-grid-size']} * 10) fit-content(30%) 1fr`,
  },
  columnsNoActions: {
    gridTemplateColumns: 'auto 1fr',
  },
});

const styles = stylex.create({
  row: {
    display: 'contents',
  },
  actions: {
    whiteSpace: 'nowrap',
  },
  actionIcons: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: 2,
  },
  statsIcon: {
    paddingRight: 4,
  },
  label: {
    paddingRight: spacing['--gf-spacing-x1'],
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  value: {
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
  },
  link: {
    gridColumnEnd: '4',
    gridColumnStart: '2',
  },
  linkNoActions: {
    gridColumn: 'span 2',
    paddingBottom: spacing['--gf-spacing-x0-5'],
  },
  stats: {
    paddingRight: spacing['--gf-spacing-x1'],
    wordBreak: 'break-all',
    width: '100%',
    maxWidth: '50vh',
  },
  statsColumn: {
    gridColumnEnd: '4',
    gridColumnStart: '2',
  },
  valueContainer: {
    display: 'flex',
    lineHeight: typography['--gf-typography-body-line-height'],
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '50vh',
    overflow: 'auto',
  },
});
