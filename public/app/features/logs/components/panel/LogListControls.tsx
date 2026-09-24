import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';
import { capitalize } from 'lodash';
import { type MouseEvent, useCallback, useMemo } from 'react';

import {
  CoreApp,
  type EventBus,
  LogLevel,
  LogsDedupDescription,
  LogsDedupStrategy,
  LogsSortOrder,
  store,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { config, reportInteraction } from '@grafana/runtime';
import { Dropdown, Menu } from '@grafana/ui';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

import { type LogsVisualisationType } from '../../../explore/Logs/constants';
import { DownloadFormat } from '../../utils';

import { useLogListContext } from './LogListContext';
import { LogListControlsOption, LogListControlsSelectOption } from './LogListControlsOption';
import { useLogListSearchContext } from './LogListSearchContext';
import { LOG_LIST_CONTROLS_WIDTH, ScrollToLogsEvent } from './virtualization';

type Props = {
  eventBus: EventBus;
  visualisationType?: LogsVisualisationType;
  logLevels?: LogLevel[];
};

const DEDUP_OPTIONS = [
  LogsDedupStrategy.none,
  LogsDedupStrategy.exact,
  LogsDedupStrategy.numbers,
  LogsDedupStrategy.signature,
];

const FILTER_LEVELS: LogLevel[] = [
  LogLevel.info,
  LogLevel.debug,
  LogLevel.trace,
  LogLevel.warning,
  LogLevel.error,
  LogLevel.critical,
  LogLevel.unknown,
];

export const LogListControls = ({ eventBus, logLevels = FILTER_LEVELS, visualisationType = 'logs' }: Props) => {
  const newLogsPanelEnabled = useBooleanFlagValue('newLogsPanel', true);
  const {
    app,
    controlsExpanded,
    dedupStrategy,
    downloadLogs,
    filterLevels,
    fontSize,
    forceEscape,
    hasUnescapedContent,
    logOptionsStorageKey,
    prettifyJSON,
    setControlsExpanded,
    setDedupStrategy,
    setFilterLevels,
    setFontSize,
    setForceEscape,
    setPrettifyJSON,
    setShowTime,
    setShowUniqueLabels,
    setSortOrder,
    setSyntaxHighlighting,
    setUnwrappedColumns,
    setWrapLogMessage,
    showTime,
    showUniqueLabels,
    sortOrder,
    syntaxHighlighting,
    unwrappedColumns,
    wrapLogMessage,
  } = useLogListContext();
  const { hideSearch, searchVisible, showSearch } = useLogListSearchContext();

  const onScrollToTopClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_scroll_top_clicked');
    eventBus.publish(
      new ScrollToLogsEvent({
        scrollTo: 'top',
      })
    );
  }, [eventBus]);

  const onScrollToBottomClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_scroll_bottom_clicked');
    eventBus.publish(
      new ScrollToLogsEvent({
        scrollTo: 'bottom',
      })
    );
  }, [eventBus]);

  const onExpandControlsClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_expand_controls_clicked');
    setControlsExpanded(!controlsExpanded);
    store.set(`${logOptionsStorageKey}.controlsExpanded`, !controlsExpanded);
  }, [controlsExpanded, logOptionsStorageKey, setControlsExpanded]);

  const onForceEscapeClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_force_escape_clicked');
    setForceEscape(!forceEscape);
  }, [forceEscape, setForceEscape]);

  const onFilterLevelClick = useCallback(
    (level?: LogLevel) => {
      reportInteraction('logs_log_list_controls_level_clicked', {
        level,
      });
      if (level === undefined) {
        setFilterLevels([]);
      } else if (!filterLevels.includes(level)) {
        setFilterLevels([...filterLevels, level]);
      } else {
        setFilterLevels(filterLevels.filter((filterLevel) => filterLevel !== level));
      }
    },
    [filterLevels, setFilterLevels]
  );

  const onFontSizeClick = useCallback(() => {
    const newSize = fontSize === 'default' ? 'small' : 'default';
    reportInteraction('logs_log_list_controls_font_size_clicked', {
      size: newSize,
    });
    setFontSize(newSize);
  }, [fontSize, setFontSize]);

  const onShowTimestampsClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_show_time_clicked', {
      show_time: !showTime,
    });
    setShowTime(!showTime);
  }, [setShowTime, showTime]);

  const onShowUniqueLabelsClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_show_unique_labels_clicked', {
      show_unique_labels: showUniqueLabels,
    });
    setShowUniqueLabels(!showUniqueLabels);
  }, [setShowUniqueLabels, showUniqueLabels]);

  const onSortOrderClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_sort_order_clicked', {
      order: sortOrder === LogsSortOrder.Ascending ? LogsSortOrder.Descending : LogsSortOrder.Ascending,
    });
    setSortOrder(sortOrder === LogsSortOrder.Ascending ? LogsSortOrder.Descending : LogsSortOrder.Ascending);
  }, [setSortOrder, sortOrder]);

  const onSetPrettifyJSONClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_prettify_json_clicked', {
      state: !prettifyJSON,
    });
    setPrettifyJSON(!prettifyJSON);
  }, [prettifyJSON, setPrettifyJSON]);

  const onSyntaxHightlightingClick = useCallback(() => {
    reportInteraction('logs_log_list_controls_syntax_clicked', {
      state: !syntaxHighlighting,
    });
    setSyntaxHighlighting(!syntaxHighlighting);
  }, [setSyntaxHighlighting, syntaxHighlighting]);

  const onSetUnwrappedColumnsClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      reportInteraction('logs_log_list_controls_unwrapped_columns_clicked', {
        state: !unwrappedColumns,
      });
      setUnwrappedColumns(!unwrappedColumns);
    },
    [setUnwrappedColumns, unwrappedColumns]
  );

  const onWrapLogMessageClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      reportInteraction('logs_log_list_controls_wrap_clicked', {
        state: !wrapLogMessage,
      });
      setWrapLogMessage(!wrapLogMessage);
    },
    [setWrapLogMessage, wrapLogMessage]
  );

  const deduplicationMenu = useMemo(
    () => (
      <Menu>
        {DEDUP_OPTIONS.map((option) => (
          <Menu.Item
            key={option}
            className={dedupStrategy === option ? menuItemActiveClassName : undefined}
            description={LogsDedupDescription[option]}
            label={capitalize(option)}
            onClick={() => {
              setDedupStrategy(option);
              reportInteraction('logs_log_list_controls_deduplication_clicked', {
                option,
              });
            }}
          />
        ))}
      </Menu>
    ),
    [dedupStrategy, setDedupStrategy]
  );

  const filterLevelsMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          key={'all'}
          className={filterLevels.length === 0 ? menuItemActiveClassName : undefined}
          label={t('logs.logs-controls.display-level-all', 'All levels')}
          onClick={() => onFilterLevelClick()}
        />
        {logLevels.map((level) => (
          <Menu.Item
            key={level}
            className={filterLevels.includes(level) ? menuItemActiveClassName : undefined}
            label={capitalize(level)}
            onClick={() => onFilterLevelClick(level)}
          />
        ))}
      </Menu>
    ),
    [filterLevels, logLevels, onFilterLevelClick]
  );

  const downloadMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          label={t('logs.logs-controls.download-logs.txt', 'txt')}
          onClick={() => {
            downloadLogs(DownloadFormat.Text);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.Text,
            });
          }}
        />
        <Menu.Item
          label={t('logs.logs-controls.download-logs.json', 'json')}
          onClick={() => {
            downloadLogs(DownloadFormat.Json);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.Json,
            });
          }}
        />
        <Menu.Item
          label={t('logs.logs-controls.download-logs.csv', 'csv')}
          onClick={() => {
            downloadLogs(DownloadFormat.CSV);
            reportInteraction('logs_log_list_controls_downloaded_logs', {
              format: DownloadFormat.CSV,
            });
          }}
        />
      </Menu>
    ),
    [downloadLogs]
  );

  const inDashboard = app === CoreApp.Dashboard || app === CoreApp.PanelEditor || app === CoreApp.PanelViewer;

  return (
    <div
      {...stylex.props(
        styles.navContainer,
        styles.navContainerWidth(controlsExpanded ? CONTROLS_WIDTH_EXPANDED : LOG_LIST_CONTROLS_WIDTH)
      )}
    >
      <>
        <LogListControlsOption
          expanded={controlsExpanded}
          name="arrow-from-right"
          xstyle={[controlButtonStyles.button, !controlsExpanded && styles.controlsCollapsedButton]}
          variant="secondary"
          onClick={onExpandControlsClick}
          label={
            controlsExpanded
              ? t('logs.logs-controls.label.collapse', 'Expanded')
              : t('logs.logs-controls.label.expand', 'Collapsed')
          }
          tooltip={
            controlsExpanded ? t('logs.logs-controls.collapse', 'Collapse') : t('logs.logs-controls.expand', 'Expand')
          }
          size="lg"
        />
        {visualisationType === 'logs' && (
          <LogListControlsOption
            expanded={controlsExpanded}
            name="arrow-down"
            {...getControlButtonProps(false)}
            variant="secondary"
            onClick={onScrollToBottomClick}
            tooltip={t('logs.logs-controls.scroll-bottom', 'Scroll to bottom')}
            size="lg"
          />
        )}
      </>
      {!inDashboard ? (
        <>
          <LogListControlsOption
            expanded={controlsExpanded}
            name={sortOrder === LogsSortOrder.Descending ? 'sort-amount-up' : 'sort-amount-down'}
            {...getControlButtonProps(false)}
            onClick={onSortOrderClick}
            label={
              sortOrder === LogsSortOrder.Descending
                ? t('logs.logs-controls.labels.newest-first', 'Newest logs first')
                : t('logs.logs-controls.labels.oldest-first', 'Oldest logs first')
            }
            tooltip={
              sortOrder === LogsSortOrder.Descending
                ? t('logs.logs-controls.newest-first', 'Sorted by newest logs first - Click to show oldest first')
                : t('logs.logs-controls.oldest-first', 'Sorted by oldest logs first - Click to show newest first')
            }
            size="lg"
          />
          {visualisationType === 'logs' && (
            <>
              <div {...stylex.props(styles.divider)} />
              {newLogsPanelEnabled && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name={'search'}
                  {...getControlButtonProps(Boolean(searchVisible))}
                  onClick={searchVisible ? hideSearch : showSearch}
                  label={
                    searchVisible
                      ? t('logs.logs-controls.labels.hide-search', 'Close search')
                      : t('logs.logs-controls.labels.show-search', 'Search logs')
                  }
                  tooltip={
                    searchVisible
                      ? t('logs.logs-controls.hide-search', 'Close search')
                      : t('logs.logs-controls.show-search', 'Search in logs result')
                  }
                  size="lg"
                />
              )}
              <Dropdown overlay={deduplicationMenu} placement="auto-end">
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name={'filter'}
                  {...getControlButtonProps(dedupStrategy !== LogsDedupStrategy.none)}
                  tooltip={t('logs.logs-controls.deduplication', 'Deduplication')}
                  size="lg"
                />
              </Dropdown>
              <Dropdown overlay={filterLevelsMenu} placement="auto-end">
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name={'gf-logs'}
                  {...getControlButtonProps(filterLevels && filterLevels.length > 0)}
                  label={t('logs.logs-controls.filter-levels', 'Filter levels')}
                  tooltip={t('logs.logs-controls.tooltip.filter-level', 'Filter logs result by level')}
                  size="lg"
                />
              </Dropdown>
              <div {...stylex.props(styles.divider)} />
              {newLogsPanelEnabled ? (
                <TimestampResolutionButton expanded={controlsExpanded} />
              ) : (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="clock-nine"
                  aria-pressed={showTime}
                  {...getControlButtonProps(showTime)}
                  onClick={onShowTimestampsClick}
                  tooltip={
                    showTime
                      ? t('logs.logs-controls.hide-timestamps', 'Hide timestamps')
                      : t('logs.logs-controls.show-timestamps', 'Show timestamps')
                  }
                  size="lg"
                />
              )}
              {/* When this is used in a Plugin context, app is unknown */}
              {showUniqueLabels !== undefined && app !== CoreApp.Unknown && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="tag-alt"
                  aria-pressed={showUniqueLabels}
                  {...getControlButtonProps(showUniqueLabels)}
                  onClick={onShowUniqueLabelsClick}
                  tooltip={
                    showUniqueLabels
                      ? t('logs.logs-controls.hide-unique-labels', 'Hide unique labels')
                      : t('logs.logs-controls.show-unique-labels', 'Show unique labels')
                  }
                  size="lg"
                />
              )}
              {newLogsPanelEnabled ? (
                <WrapLogMessageButton expanded={controlsExpanded} />
              ) : (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="wrap-text"
                  {...getControlButtonProps(wrapLogMessage)}
                  aria-pressed={wrapLogMessage}
                  onClick={onWrapLogMessageClick}
                  tooltip={
                    wrapLogMessage
                      ? t('logs.logs-controls.unwrap-lines', 'Unwrap lines')
                      : t('logs.logs-controls.wrap-lines', 'Wrap lines')
                  }
                  size="lg"
                />
              )}
              {newLogsPanelEnabled && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  disabled={wrapLogMessage}
                  name="columns"
                  aria-pressed={unwrappedColumns}
                  {...getControlButtonProps(unwrappedColumns)}
                  onClick={onSetUnwrappedColumnsClick}
                  label={
                    wrapLogMessage
                      ? t('logs.logs-controls.unwrapped-columns.disabled-label', 'Columns not supported')
                      : unwrappedColumns
                        ? t('logs.logs-controls.unwrapped-columns.disabled-text', 'Columns enabled')
                        : t('logs.logs-controls.unwrapped-columns.enabled-text', 'Columns disabled')
                  }
                  tooltip={
                    wrapLogMessage
                      ? t(
                          'logs.logs-controls.unwrapped-columns.not-supported',
                          'Columns are not supported with line wrapping enabled'
                        )
                      : unwrappedColumns
                        ? t('logs.logs-controls.unwrapped-columns.disable', 'Disable columns')
                        : t('logs.logs-controls.unwrapped-columns.enable', 'Enable columns')
                  }
                  size="lg"
                />
              )}
              {prettifyJSON !== undefined && !newLogsPanelEnabled && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="brackets-curly"
                  aria-pressed={prettifyJSON}
                  {...getControlButtonProps(prettifyJSON)}
                  onClick={onSetPrettifyJSONClick}
                  tooltip={
                    prettifyJSON
                      ? t('logs.logs-controls.disable-prettify-json', 'Collapse JSON logs')
                      : t('logs.logs-controls.prettify-json', 'Expand JSON logs')
                  }
                  size="lg"
                />
              )}
              {syntaxHighlighting !== undefined && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="brackets-curly"
                  {...getControlButtonProps(syntaxHighlighting)}
                  aria-pressed={syntaxHighlighting}
                  onClick={onSyntaxHightlightingClick}
                  label={
                    syntaxHighlighting
                      ? t('logs.logs-controls.label.disable-highlighting', 'Highlight text')
                      : t('logs.logs-controls.label.enable-highlighting', 'Plain text')
                  }
                  tooltip={
                    syntaxHighlighting
                      ? t('logs.logs-controls.tooltip.disable-highlighting', 'Disable highlighting')
                      : t('logs.logs-controls.tooltip.enable-highlighting', 'Enable highlighting')
                  }
                  size="lg"
                />
              )}
              {newLogsPanelEnabled && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="text-fields"
                  {...getControlButtonProps(fontSize === 'small')}
                  aria-pressed={Boolean(fontSize)}
                  onClick={onFontSizeClick}
                  label={
                    fontSize === 'default'
                      ? t('logs.logs-controls.labels.font-large', 'Large font')
                      : t('logs.logs-controls.labels.font-small', 'Small font')
                  }
                  tooltip={
                    fontSize === 'default'
                      ? t('logs.logs-controls.font-small', 'Set small font')
                      : t('logs.logs-controls.font-large', 'Set large font')
                  }
                  size="lg"
                />
              )}
              {hasUnescapedContent && (
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="enter"
                  aria-pressed={forceEscape}
                  {...getControlButtonProps(forceEscape)}
                  onClick={onForceEscapeClick}
                  label={
                    forceEscape
                      ? t('logs.logs-controls.remove-escaping', 'Remove escaping')
                      : t('logs.logs-controls.label.escape-newlines', 'Escape newlines')
                  }
                  tooltip={
                    forceEscape
                      ? t('logs.logs-controls.remove-escaping', 'Remove escaping')
                      : t(
                          'logs.logs-controls.escape-newlines',
                          'Fix incorrectly escaped newline and tab sequences in log lines'
                        )
                  }
                  size="lg"
                />
              )}
            </>
          )}
          {!config.exploreHideLogsDownload && (
            <>
              <div {...stylex.props(styles.divider)} />
              <Dropdown overlay={downloadMenu} placement="auto-end">
                <LogListControlsOption
                  expanded={controlsExpanded}
                  name="download-alt"
                  {...getControlButtonProps(false)}
                  label={t('logs.logs-controls.download', 'Download logs')}
                  tooltip={t('logs.logs-controls.tooltip.download', 'Download')}
                  size="lg"
                />
              </Dropdown>
            </>
          )}
        </>
      ) : (
        <>
          {newLogsPanelEnabled && (
            <LogListControlsOption
              expanded={controlsExpanded}
              name={'search'}
              {...getControlButtonProps(Boolean(searchVisible))}
              onClick={searchVisible ? hideSearch : showSearch}
              label={
                searchVisible
                  ? t('logs.logs-controls.labels.hide-search', 'Close search')
                  : t('logs.logs-controls.labels.show-search', 'Search logs')
              }
              tooltip={
                searchVisible
                  ? t('logs.logs-controls.hide-search', 'Close search')
                  : t('logs.logs-controls.show-search', 'Search in logs result')
              }
              size="lg"
            />
          )}
          <Dropdown overlay={filterLevelsMenu} placement="auto-end">
            <LogListControlsOption
              expanded={controlsExpanded}
              name={'gf-logs'}
              {...getControlButtonProps(filterLevels && filterLevels.length > 0)}
              label={t('logs.logs-controls.filter-levels', 'Filter levels')}
              tooltip={t('logs.logs-controls.tooltip.filter-level', 'Filter logs result by level')}
              size="lg"
            />
          </Dropdown>
          {visualisationType === 'logs' && hasUnescapedContent && (
            <LogListControlsOption
              expanded={controlsExpanded}
              name="enter"
              aria-pressed={forceEscape}
              {...getControlButtonProps(forceEscape)}
              onClick={onForceEscapeClick}
              label={
                forceEscape
                  ? t('logs.logs-controls.remove-escaping', 'Remove escaping')
                  : t('logs.logs-controls.label.escape-newlines', 'Escape newlines')
              }
              tooltip={
                forceEscape
                  ? t('logs.logs-controls.remove-escaping', 'Remove escaping')
                  : t(
                      'logs.logs-controls.escape-newlines',
                      'Fix incorrectly escaped newline and tab sequences in log lines'
                    )
              }
              size="lg"
            />
          )}
        </>
      )}
      {visualisationType === 'logs' && (
        <LogListControlsOption
          stickToBottom={true}
          expanded={controlsExpanded}
          name="arrow-up"
          data-testid="scrollToTop"
          xstyle={[controlButtonStyles.button, styles.scrollToTop]}
          variant="secondary"
          onClick={onScrollToTopClick}
          tooltip={t('logs.logs-controls.scroll-top', 'Scroll to top')}
          size="lg"
        />
      )}
    </div>
  );
};

interface LogSelectOptionProps {
  expanded: boolean;
}

const TimestampResolutionButton = ({ expanded }: LogSelectOptionProps) => {
  const { setTimestampResolution, setShowTime, showTime, timestampResolution } = useLogListContext();

  const hide = useCallback(() => {
    setShowTime(false);
    reportInteraction('logs_log_list_controls_show_time_clicked', {
      show_time: false,
    });
  }, [setShowTime]);

  const showMs = useCallback(() => {
    setShowTime(true);
    setTimestampResolution('ms');
    reportInteraction('logs_log_list_controls_show_time_clicked', {
      show_time: false,
      resolution: 'ms',
    });
  }, [setShowTime, setTimestampResolution]);

  const showNs = useCallback(() => {
    setShowTime(true);
    setTimestampResolution('ns');
    reportInteraction('logs_log_list_controls_show_time_clicked', {
      show_time: false,
      resolution: 'ns',
    });
  }, [setShowTime, setTimestampResolution]);

  const timestampMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          label={t('logs.logs-controls.timestamp.hide', 'Hide timestamps')}
          className={!showTime ? menuItemActiveClassName : undefined}
          onClick={hide}
        />
        <Menu.Item
          label={t('logs.logs-controls.timestamp.milliseconds', 'Show millisecond timestamps')}
          className={showTime && timestampResolution === 'ms' ? menuItemActiveClassName : undefined}
          onClick={showMs}
        />
        <Menu.Item
          label={t('logs.logs-controls.timestamp.nanoseconds', 'Show nanosecond timestamps')}
          className={showTime && timestampResolution === 'ns' ? menuItemActiveClassName : undefined}
          onClick={showNs}
        />
      </Menu>
    ),
    [hide, showMs, showNs, showTime, timestampResolution]
  );

  const labelText = !showTime
    ? t('logs.logs-controls.timestamp.label-hide', 'Hide timestamps')
    : timestampResolution === 'ms'
      ? t('logs.logs-controls.timestamp.label-ms', 'Display ms')
      : t('logs.logs-controls.timestamp.label-ns', 'Display ns');

  const customTagText =
    timestampResolution === 'ms'
      ? t('logs.logs-controls.resolution-ms', 'ms')
      : t('logs.logs-controls.resolution-ns', 'ns');

  return (
    <LogListControlsSelectOption
      expanded={expanded}
      name={'clock-nine'}
      isActive={showTime}
      dropdown={timestampMenu}
      tooltip={t('logs.logs-controls.timestamp.tooltip', 'Set timestamp format')}
      label={labelText}
      buttonAriaLabel={t('logs.logs-controls.timestamp.label', 'Log timestamps')}
      customTagText={customTagText}
    />
  );
};
const WrapLogMessageButton = ({ expanded }: LogSelectOptionProps) => {
  const { prettifyJSON, setPrettifyJSON, setWrapLogMessage, wrapLogMessage } = useLogListContext();

  /**
   * This component currently controls two internal states: line wrapping and JSON formatting.
   * The state transition is as follows:
   * - Line wrapping and JSON formatting disabled.
   * - Line wrapping enabled.
   * - Line wrapping and JSON formatting enabled.
   *
   * Line wrapping also controls JSON formatting, because with line wrapping disabled,
   * JSON formatting has no effect, so one is related with the other.
   */
  const disable = useCallback(() => {
    setWrapLogMessage(false);
    setPrettifyJSON(false);
    reportInteraction('logs_log_list_controls_wrap_clicked', {
      state: false,
      prettify: false,
    });
  }, [setPrettifyJSON, setWrapLogMessage]);

  const wrap = useCallback(() => {
    setWrapLogMessage(true);
    setPrettifyJSON(false);
    reportInteraction('logs_log_list_controls_wrap_clicked', {
      state: true,
      prettify: false,
    });
  }, [setPrettifyJSON, setWrapLogMessage]);

  const wrapAndPrettify = useCallback(() => {
    setWrapLogMessage(true);
    setPrettifyJSON(true);
    reportInteraction('logs_log_list_controls_wrap_clicked', {
      state: true,
      prettify: true,
    });
  }, [setPrettifyJSON, setWrapLogMessage]);

  const wrappingMenu = useMemo(
    () => (
      <Menu>
        <Menu.Item
          label={t('logs.logs-controls.line-wrapping.hide', 'Disable line wrapping')}
          className={!wrapLogMessage ? menuItemActiveClassName : undefined}
          onClick={disable}
        />
        <Menu.Item
          label={t('logs.logs-controls.line-wrapping.enable', 'Enable line wrapping')}
          className={wrapLogMessage && !prettifyJSON ? menuItemActiveClassName : undefined}
          onClick={wrap}
        />
        <Menu.Item
          label={t('logs.logs-controls.line-wrapping.enable-prettify', 'Enable line wrapping and prettify JSON')}
          className={wrapLogMessage && prettifyJSON ? menuItemActiveClassName : undefined}
          onClick={wrapAndPrettify}
        />
      </Menu>
    ),
    [disable, prettifyJSON, wrap, wrapAndPrettify, wrapLogMessage]
  );

  const wrapStateText = !wrapLogMessage
    ? t('logs.logs-controls.line-wrapping.state.hide', 'Wrap disabled')
    : wrapLogMessage && !prettifyJSON
      ? t('logs.logs-controls.line-wrapping.state.wrap', 'Wrap lines')
      : t('logs.logs-controls.line-wrapping.state.json', 'Wrap JSON');

  const tooltip = t('logs.logs-controls.line-wrapping.tooltip', 'Set line wrap');

  return (
    <LogListControlsSelectOption
      expanded={expanded}
      name={'wrap-text'}
      isActive={wrapLogMessage}
      dropdown={wrappingMenu}
      tooltip={tooltip}
      label={wrapStateText}
      buttonAriaLabel={tooltip}
      customTagText={prettifyJSON ? '+' : ''}
    />
  );
};

export const CONTROLS_WIDTH_EXPANDED = 176;

export function getControlButtonProps(active: boolean) {
  return {
    xstyle: [controlButtonStyles.button, active && styles.controlButtonActive],
  };
}

// Over IconButton's margin and colour. Its disabled colour still wins, like the Emotion override did.
export const controlButtonStyles = stylex.create({
  button: {
    height: spacing['--gf-spacing-x2'],
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: { default: colors['--gf-colors-text-secondary'], ':disabled': colors['--gf-colors-action-disabled-text'] },
  },
});

const styles = stylex.create({
  navContainer: {
    maxHeight: '100%',
    display: 'flex',
    flexGrow: '1',
    flexShrink: '0',
    flexBasis: 'auto',
    gap: spacing['--gf-spacing-x3'],
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    paddingLeft: spacing['--gf-spacing-x1'],
    borderLeftStyle: 'solid',
    borderLeftWidth: '1px',
    borderLeftColor: colors['--gf-colors-border-medium'],
    minWidth: spacing['--gf-spacing-x4'],
    backgroundColor: colors['--gf-colors-background-primary'],
  },
  navContainerWidth: (width: number) => ({
    width,
  }),
  controlsCollapsedButton: {
    transform: 'rotate(180deg)',
  },
  scrollToTop: {
    marginTop: 'auto',
  },
  divider: {
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderTopColor: colors['--gf-colors-border-medium'],
    height: 1,
    marginTop: `calc(${spacing['--gf-spacing-grid-size']} * -0.25)`,
    marginBottom: `calc(${spacing['--gf-spacing-grid-size']} * -1.75)`,
  },
  controlButtonActive: {
    '::after': {
      display: 'block',
      content: '" "',
      position: 'absolute',
      height: 2,
      borderRadius: shape['--gf-shape-radius-default'],
      bottom: `calc(${spacing['--gf-spacing-grid-size']} * -1)`,
      backgroundImage: colors['--gf-colors-gradients-brand-horizontal'],
      width: `calc(${spacing['--gf-spacing-grid-size']} * 2.25)`,
      opacity: 1,
    },
  },
  menuItemActive: {
    '::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: spacing['--gf-spacing-x0-5'],
      height: `calc(100% - ${spacing['--gf-spacing-x1']})`,
      width: '2px',
      backgroundColor: colors['--gf-colors-warning-main'],
    },
  },
});

const menuItemActiveClassName = stylex.props(styles.menuItemActive).className;
