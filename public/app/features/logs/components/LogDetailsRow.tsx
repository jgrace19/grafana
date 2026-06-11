import { css, cx } from '@emotion/css';
import { isEqual } from 'lodash';
import memoizeOne from 'memoize-one';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';

import {
  CoreApp,
  type DataFrame,
  type Field,
  type GrafanaTheme2,
  type IconName,
  type LinkModel,
  type LogLabelStatsModel,
  type LogRowModel,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import {
  ClipboardButton,
  DataLinkButton,
  IconButton,
  type PopoverContent,
  Tooltip,
  useTheme2,
} from '@grafana/ui';

import { logRowToSingleRowDataFrame } from '../logsModel';
import { getLabelTypeFromRow } from '../utils';

import { LogLabelStats } from './LogLabelStats';
import { getLogRowStyles } from './getLogRowStyles';

interface LinkModelWithIcon extends LinkModel<Field> {
  icon?: IconName;
}

export interface Props {
  parsedValues: string[];
  parsedKeys: string[];
  disableActions: boolean;
  wrapLogMessage?: boolean;
  isLabel?: boolean;
  onClickFilterLabel?: (key: string, value: string, frame?: DataFrame) => void;
  onClickFilterOutLabel?: (key: string, value: string, frame?: DataFrame) => void;
  links?: LinkModelWithIcon[];
  getStats: () => LogLabelStatsModel[] | null;
  displayedFields?: string[];
  onClickShowField?: (key: string) => void;
  onClickHideField?: (key: string) => void;
  row: LogRowModel;
  app?: CoreApp;
  isFilterLabelActive?: (key: string, value: string, refId?: string) => Promise<boolean>;
  onPinLine?: (row: LogRowModel, allowUnPin?: boolean) => void;
  pinLineButtonTooltipTitle?: PopoverContent;
}

const getStyles = memoizeOne((theme: GrafanaTheme2) => {
  return {
    labelType: css({
      border: `solid 1px ${theme.colors.text.secondary}`,
      color: theme.colors.text.secondary,
      borderRadius: theme.shape.radius.circle,
      fontSize: theme.spacing(1),
      lineHeight: theme.spacing(1.25),
      height: theme.spacing(1.5),
      width: theme.spacing(1.5),
      display: 'flex',
      justifyContent: 'center',
      verticalAlign: 'middle',
      marginLeft: theme.spacing(1),
    }),
    wordBreakAll: css({
      label: 'wordBreakAll',
      wordBreak: 'break-all',
    }),
    copyButton: css({
      '& > button': {
        gap: 0,
        color: theme.colors.text.secondary,
        padding: 0,
        justifyContent: 'center',
        borderRadius: theme.shape.radius.circle,
        height: theme.spacing(theme.components.height.sm),
        width: theme.spacing(theme.components.height.sm),
        svg: {
          margin: 0,
        },

        'span > div': {
          top: '-5px',
          '& button': {
            color: theme.colors.success.main,
          },
        },
      },
    }),
    adjoiningLinkButton: css({
      marginLeft: theme.spacing(1),
    }),
    wrapLine: css({
      label: 'wrapLine',
      whiteSpace: 'pre-wrap',
    }),
    logDetailsStats: css({
      padding: `0 ${theme.spacing(1)}`,
    }),
    logDetailsValue: css({
      display: 'flex',
      alignItems: 'center',
      lineHeight: '22px',

      '.log-details-value-copy': {
        visibility: 'hidden',
      },
      '&:hover': {
        '.log-details-value-copy': {
          visibility: 'visible',
        },
      },
    }),
    buttonRow: css({
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
    }),
  };
});

export function UnThemedLogDetailsRow({
  parsedValues,
  parsedKeys,
  isLabel,
  links,
  displayedFields,
  wrapLogMessage,
  onClickFilterLabel,
  onClickFilterOutLabel,
  disableActions,
  row,
  app,
  onPinLine,
  pinLineButtonTooltipTitle,
  isFilterLabelActive: isFilterLabelActiveProp,
  getStats,
  onClickShowField: onClickShowDetectedField,
  onClickHideField: onClickHideDetectedField,
}: Props) {
  const theme = useTheme2();
  const [showFieldsStats, setShowFieldsStats] = useState(false);
  const [fieldCount, setFieldCount] = useState(0);
  const [fieldStats, setFieldStats] = useState<LogLabelStatsModel[] | null>(null);

  const styles = getStyles(theme);
  const rowStyles = getLogRowStyles(theme);

  const updateStats = () => {
    const newFieldStats = getStats();
    const newFieldCount = newFieldStats ? newFieldStats.reduce((sum, stat) => sum + stat.count, 0) : 0;
    if (!isEqual(fieldStats, newFieldStats) || fieldCount !== newFieldCount) {
      setFieldStats(newFieldStats);
      setFieldCount(newFieldCount);
    }
  };

  // Update stats whenever showFieldsStats changes to true or on relevant updates
  const showFieldsStatsRef = useRef(showFieldsStats);
  showFieldsStatsRef.current = showFieldsStats;

  useEffect(() => {
    if (showFieldsStats) {
      updateStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const showField = () => {
    if (onClickShowDetectedField) {
      onClickShowDetectedField(parsedKeys[0]);
    }

    reportInteraction('grafana_explore_logs_log_details_replace_line_clicked', {
      datasourceType: row.datasourceType,
      logRowUid: row.uid,
      type: 'enable',
    });
  };

  const hideField = () => {
    if (onClickHideDetectedField) {
      onClickHideDetectedField(parsedKeys[0]);
    }

    reportInteraction('grafana_explore_logs_log_details_replace_line_clicked', {
      datasourceType: row.datasourceType,
      logRowUid: row.uid,
      type: 'disable',
    });
  };

  const isFilterLabelActive = async () => {
    if (isFilterLabelActiveProp) {
      return await isFilterLabelActiveProp(parsedKeys[0], parsedValues[0], row.dataFrame?.refId);
    }
    return false;
  };

  const filterLabel = () => {
    if (onClickFilterLabel) {
      onClickFilterLabel(parsedKeys[0], parsedValues[0], logRowToSingleRowDataFrame(row) || undefined);
    }

    reportInteraction('grafana_explore_logs_log_details_filter_clicked', {
      datasourceType: row.datasourceType,
      filterType: 'include',
      logRowUid: row.uid,
    });
  };

  const filterOutLabel = () => {
    if (onClickFilterOutLabel) {
      onClickFilterOutLabel(parsedKeys[0], parsedValues[0], logRowToSingleRowDataFrame(row) || undefined);
    }

    reportInteraction('grafana_explore_logs_log_details_filter_clicked', {
      datasourceType: row.datasourceType,
      filterType: 'exclude',
      logRowUid: row.uid,
    });
  };

  const showStats = () => {
    if (!showFieldsStats) {
      updateStats();
    }
    setShowFieldsStats(!showFieldsStats);

    reportInteraction('grafana_explore_logs_log_details_stats_clicked', {
      dataSourceType: row.datasourceType,
      fieldType: isLabel ? 'label' : 'detectedField',
      type: showFieldsStats ? 'close' : 'open',
      logRowUid: row.uid,
      app,
    });
  };

  const generateClipboardButton = (val: string) => {
    return (
      <div className={`log-details-value-copy ${styles.copyButton}`}>
        <ClipboardButton
          getText={() => val}
          aria-label={t('logs.un-themed-log-details-row.title-copy-value-to-clipboard', 'Copy value to clipboard')}
          fill="text"
          variant="secondary"
          icon="copy"
          size="md"
        />
      </div>
    );
  };

  const generateMultiVal = (value: string[], showCopy?: boolean) => {
    return (
      <table>
        <tbody>
          {value?.map((val, i) => {
            return (
              <tr key={`${val}-${i}`}>
                <td>
                  {val}
                  {showCopy && val !== '' && generateClipboardButton(val)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const singleKey = parsedKeys == null ? false : parsedKeys.length === 1;
  const singleVal = parsedValues == null ? false : parsedValues.length === 1;
  const hasFilteringFunctionality = !disableActions && onClickFilterLabel && onClickFilterOutLabel;
  const refIdTooltip = app === CoreApp.Explore && row.dataFrame?.refId ? ` in query ${row.dataFrame?.refId}` : '';
  const labelType = singleKey ? getLabelTypeFromRow(parsedKeys[0], row) : null;

  const isMultiParsedValueWithNoContent =
    !singleVal && parsedValues != null && !parsedValues.every((val) => val === '');

  const toggleFieldButton =
    displayedFields && parsedKeys != null && displayedFields.includes(parsedKeys[0]) ? (
      <IconButton
        variant="primary"
        tooltip={t('logs.un-themed-log-details-row.toggle-field-button.tooltip-hide-this-field', 'Hide this field')}
        name="eye"
        onClick={hideField}
      />
    ) : (
      <IconButton
        tooltip={t(
          'logs.un-themed-log-details-row.toggle-field-button.tooltip-field-instead-message',
          'Show this field instead of the message'
        )}
        name="eye"
        onClick={showField}
      />
    );

  return (
    <>
      <tr className={rowStyles.logDetailsValue}>
        <td className={rowStyles.logsDetailsIcon}>
          <div className={styles.buttonRow}>
            {hasFilteringFunctionality && (
              <>
                <AsyncIconButton
                  name="search-plus"
                  onClick={filterLabel}
                  // We purposely want to pass a new function on every render to allow the active state to be updated when log details remains open between updates.
                  isActive={() => isFilterLabelActive()}
                  tooltipSuffix={refIdTooltip}
                />
                <IconButton
                  name="search-minus"
                  tooltip={
                    app === CoreApp.Explore && row.dataFrame?.refId
                      ? t('logs.un-themed-log-details-row.filter-out-query', 'Filter out value in query {{query}}', {
                          query: row.dataFrame?.refId,
                        })
                      : t('logs.un-themed-log-details-row.filter-out', 'Filter out value')
                  }
                  onClick={filterOutLabel}
                />
              </>
            )}
            {!disableActions && displayedFields && toggleFieldButton}
            {!disableActions && (
              <IconButton
                variant={showFieldsStats ? 'primary' : 'secondary'}
                name="signal"
                tooltip={t('logs.un-themed-log-details-row.tooltip-adhoc-statistics', 'Ad-hoc statistics')}
                className="stats-button"
                disabled={!singleKey}
                onClick={showStats}
              />
            )}
          </div>
        </td>

        <td>{labelType && <LabelTypeBadge type={labelType} styles={styles} />}</td>
        {/* Key - value columns */}
        <td className={rowStyles.logDetailsLabel}>{singleKey ? parsedKeys[0] : generateMultiVal(parsedKeys)}</td>
        <td className={cx(styles.wordBreakAll, wrapLogMessage && styles.wrapLine)}>
          <div className={styles.logDetailsValue}>
            {singleVal ? parsedValues[0] : generateMultiVal(parsedValues, true)}
            {singleVal && generateClipboardButton(parsedValues[0])}
            <div className={cx((singleVal || isMultiParsedValueWithNoContent) && styles.adjoiningLinkButton)}>
              {links?.map((link, i) => {
                if (link.onClick && onPinLine) {
                  const originalOnClick = link.onClick;
                  link.onClick = (e, origin) => {
                    onPinLine(row, false);
                    originalOnClick(e, origin);
                  };
                }
                return (
                  <span key={`${link.title}-${i}`}>
                    <DataLinkButton
                      buttonProps={{
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
                  </span>
                );
              })}
            </div>
          </div>
        </td>
      </tr>
      {showFieldsStats && singleKey && singleVal && (
        <tr>
          <td colSpan={2}>
            <IconButton
              variant={showFieldsStats ? 'primary' : 'secondary'}
              name="signal"
              tooltip={t('logs.un-themed-log-details-row.tooltip-hide-adhoc-statistics', 'Hide ad-hoc statistics')}
              onClick={showStats}
            />
          </td>
          <td colSpan={2}>
            <div className={styles.logDetailsStats}>
              <LogLabelStats
                stats={fieldStats!}
                label={parsedKeys[0]}
                value={parsedValues[0]}
                rowCount={fieldCount}
                isLabel={isLabel}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function LabelTypeBadge({ type, styles }: { type: string; styles: ReturnType<typeof getStyles> }) {
  return (
    <Tooltip content={type}>
      <div className={styles.labelType}>
        <span>{type.substring(0, 1)}</span>
      </div>
    </Tooltip>
  );
}

interface AsyncIconButtonProps extends Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  name: IconName;
  isActive(): Promise<boolean>;
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

export const LogDetailsRow = UnThemedLogDetailsRow;
