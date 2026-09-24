import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { logLineStyles } from './LogLine.stylex';
import {
  type CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  useLayoutEffect,
} from 'react';
import Highlighter from 'react-highlight-words';
import { useIntersection } from 'react-use';
import tinycolor from 'tinycolor2';

import { findHighlightChunksInText, type GrafanaTheme2, LogsDedupStrategy, type TimeRange } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip } from '@grafana/ui';

import { LogLabels } from '../LogLabels';
import { LogMessageAnsi } from '../LogMessageAnsi';
import { LOG_LINE_BODY_FIELD_NAME, OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME } from '../fieldSelector/logFields';

import { HighlightedLogRenderer } from './HighlightedLogRenderer';
import { useLogDetailsContext } from './LogDetailsContext';
import { InlineLogLineDetails } from './LogLineDetails';
import { LogLineMenu } from './LogLineMenu';
import { useLogIsPermalinked, useLogIsPinned, useLogListContext } from './LogListContext';
import { useLogListSearchContext } from './LogListSearchContext';
import { getNormalizedFieldName, type LogListModel } from './processing';
import {
  FIELD_GAP_MULTIPLIER,
  getLogLineDOMHeight,
  type LogFieldDimension,
  type LogLineVirtualization,
  DEFAULT_LINE_HEIGHT,
} from './virtualization';

export interface Props {
  displayedFields: string[];
  index: number;
  log: LogListModel;
  logs: LogListModel[];
  showTime: boolean;
  style: CSSProperties;
  styles: LogLineStyles;
  timeRange: TimeRange;
  timeZone: string;
  onClick: (e: MouseEvent<HTMLElement>, log: LogListModel) => void;
  onOverflow?: (index: number, id: string, height?: number) => void;
  variant?: 'infinite-scroll';
  virtualization?: LogLineVirtualization;
  wrapLogMessage: boolean;
}

export const LogLine = ({
  displayedFields,
  index,
  log,
  logs,
  style,
  styles,
  onClick,
  onOverflow,
  showTime,
  timeRange,
  timeZone,
  variant,
  virtualization,
  wrapLogMessage,
}: Props) => {
  return (
    <div style={wrapLogMessage ? style : { ...style, width: 'max-content', minWidth: '100%' }}>
      <LogLineComponent
        displayedFields={displayedFields}
        height={style.height}
        index={index}
        log={log}
        logs={logs}
        styles={styles}
        onClick={onClick}
        onOverflow={onOverflow}
        showTime={showTime}
        timeRange={timeRange}
        timeZone={timeZone}
        variant={variant}
        virtualization={virtualization}
        wrapLogMessage={wrapLogMessage}
      />
    </div>
  );
};

interface LogLineComponentProps extends Omit<Props, 'style'> {
  height?: number | string;
}

const LogLineComponent = memo(
  ({
    displayedFields,
    height,
    index,
    log,
    logs,
    styles,
    onClick,
    onOverflow,
    showTime,
    timeRange,
    timeZone,
    variant,
    virtualization,
    wrapLogMessage,
  }: LogLineComponentProps) => {
    const {
      dedupStrategy,
      fontSize,
      hasLogsWithErrors,
      hasSampledLogs,
      showLevel,
      showUniqueLabels,
      timestampResolution,
      onLogLineHover,
    } = useLogListContext();
    const { currentLog, detailsDisplayed, detailsMode, enableLogDetails } = useLogDetailsContext();
    const [collapsed, setCollapsed] = useState<boolean | undefined>(
      wrapLogMessage && log.collapsed !== undefined ? log.collapsed : undefined
    );
    const logLineRef = useRef<HTMLDivElement | null>(null);
    const intersection = useIntersection(logLineRef, {});
    const pinned = useLogIsPinned(log);
    const permalinked = useLogIsPermalinked(log);

    const handleLogLineResize = useCallback(() => {
      if (!onOverflow || !logLineRef.current || !height) {
        return;
      }
      /*
       * We want to skip measurements when the element is not visible or part of a reused node
       * by react window, as it provides inaccurate measurements.
       */
      if (!intersection?.isIntersecting) {
        return;
      }
      const calculatedHeight = typeof height === 'number' ? height : undefined;
      const actualHeight = getLogLineDOMHeight(logLineRef.current, calculatedHeight);
      if (actualHeight) {
        onOverflow(index, log.uid, actualHeight);
      }
    }, [height, index, intersection?.isIntersecting, log.uid, onOverflow]);

    useLayoutEffect(() => {
      handleLogLineResize();
    }, [handleLogLineResize, detailsMode]);

    useLayoutEffect(() => {
      if (!logLineRef.current) {
        return;
      }
      let frameId: number;
      const handleResize = () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
        frameId = requestAnimationFrame(() => handleLogLineResize());
      };
      const observer = new ResizeObserver(handleResize);
      observer.observe(logLineRef.current);
      return () => {
        observer.disconnect();
        if (frameId) {
          cancelAnimationFrame(frameId);
        }
      };
    }, [handleLogLineResize]);

    // Sync collapsed from log when log identity or wrapLogMessage changes.
    // Critical for react-window: when a row is recycled for a different log, we must reset state from the new log.
    useEffect(() => {
      if (!wrapLogMessage) {
        setCollapsed(undefined);
      } else {
        setCollapsed(log.collapsed ?? undefined);
      }
    }, [log.uid, log.collapsed, wrapLogMessage]);

    const handleMouseOver = useCallback(() => onLogLineHover?.(log), [log, onLogLineHover]);

    const handleExpandCollapse = useCallback(() => {
      const newState = !collapsed;
      log.setCollapsedState(newState);
      setCollapsed(newState);
      onOverflow?.(index, log.uid);
    }, [collapsed, index, log, onOverflow]);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        if (isLogLineClick(e.target)) {
          onClick(e, log);
        }
      },
      [log, onClick]
    );

    const isLogDetailsFocused = currentLog?.uid === log.uid;
    const detailsShown = detailsDisplayed(log);

    return (
      <div ref={onOverflow ? logLineRef : undefined} data-log-index={index}>
        {/* A button element could be used but in Safari it prevents text selection. Fallback available for a11y in LogLineMenu  */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          className={`${mergeStylexClassName(stylex.props(logLineStyles.logLine), undefined).className} ${variant ?? ''} ${pinned ? mergeStylexClassName(stylex.props(logLineStyles.pinnedLogLine), undefined).className : ''} ${permalinked ? mergeStylexClassName(stylex.props(logLineStyles.permalinkedLogLine), undefined).className : ''} ${detailsShown ? mergeStylexClassName(stylex.props(logLineStyles.detailsDisplayed), undefined).className : ''} ${isLogDetailsFocused ? mergeStylexClassName(stylex.props(logLineStyles.currentLog), undefined).className : ''} ${fontSize === 'small' ? mergeStylexClassName(stylex.props(logLineStyles.fontSizeSmall), undefined).className : mergeStylexClassName(stylex.props(logLineStyles.fontSizeDefault), undefined).className} ${enableLogDetails ? mergeStylexClassName(stylex.props(logLineStyles.clickable), undefined).className : ''}`}
          onMouseEnter={handleMouseOver}
          onFocus={handleMouseOver}
          onClick={handleClick}
        >
          <LogLineMenu styles={styles} log={log} active={isLogDetailsFocused} />
          {dedupStrategy !== LogsDedupStrategy.none && (
            <div className={`${mergeStylexClassName(stylex.props(logLineStyles.duplicates), undefined).className}`}>
              {log.duplicates && log.duplicates > 0 ? `${log.duplicates + 1}x` : null}
            </div>
          )}
          {hasLogsWithErrors && (
            <div className={`${mergeStylexClassName(stylex.props(logLineStyles.hasError), undefined).className}`}>
              {log.hasError && (
                <Tooltip
                  content={t('logs.log-line.tooltip-error', 'Error: {{errorMessage}}', {
                    errorMessage: log.errorMessage,
                  })}
                  placement="right"
                  theme="error"
                >
                  <Icon
                    {...stylex.props(logLineStyles.logIconError)}
                    name="exclamation-triangle"
                    aria-label={t('logs.log-line.has-error', 'Has errors')}
                    size="xs"
                  />
                </Tooltip>
              )}
            </div>
          )}
          {hasSampledLogs && (
            <div className={`${mergeStylexClassName(stylex.props(logLineStyles.isSampled), undefined).className}`}>
              {log.isSampled && (
                <Tooltip content={log.sampledMessage ?? ''} placement="right" theme="info">
                  <Icon
                    {...stylex.props(logLineStyles.logIconInfo)}
                    name="info-circle"
                    size="xs"
                    aria-label={t('logs.log-line.is-sampled', 'Is sampled')}
                  />
                </Tooltip>
              )}
            </div>
          )}
          <div
            className={`${mergeStylexClassName(stylex.props(logLineStyles.fieldsWrapper), undefined).className} ${detailsShown ? mergeStylexClassName(stylex.props(logLineStyles.detailsDisplayed), undefined).className : ''} ${isLogDetailsFocused ? mergeStylexClassName(stylex.props(logLineStyles.currentLog), undefined).className : ''} ${wrapLogMessage ? mergeStylexClassName(stylex.props(logLineStyles.wrappedLogLine), undefined).className : `${mergeStylexClassName(stylex.props(logLineStyles.unwrappedLogLine), undefined).className} unwrapped-log-line`} ${collapsed === true ? mergeStylexClassName(stylex.props(logLineStyles.collapsedLogLine), undefined).className : ''}`}
            style={
              collapsed && virtualization
                ? { maxHeight: `${virtualization.getTruncationLineCount() * virtualization.getLineHeight()}px` }
                : undefined
            }
          >
            <Log
              collapsed={collapsed}
              displayedFields={displayedFields}
              log={log}
              showLevel={showLevel}
              showTime={showTime}
              showUniqueLabels={showUniqueLabels}
              styles={styles}
              timestampResolution={timestampResolution}
              wrapLogMessage={wrapLogMessage}
            />
          </div>
        </div>
        {collapsed === true && (
          <div {...stylex.props(logLineStyles.expandCollapseControl)}>
            <Button
              variant="primary"
              fill="text"
              size="sm"
              {...stylex.props(logLineStyles.expandCollapseControlButton)}
              onClick={handleExpandCollapse}
            >
              {t('logs.log-line.show-more', 'show more')}
            </Button>
          </div>
        )}
        {collapsed === false && (
          <div {...stylex.props(logLineStyles.expandCollapseControl)}>
            <Button
              variant="primary"
              fill="text"
              size="sm"
              {...stylex.props(logLineStyles.expandCollapseControlButton)}
              onClick={handleExpandCollapse}
            >
              {t('logs.log-line.show-less', 'show less')}
            </Button>
          </div>
        )}
        {detailsMode === 'inline' && detailsShown && (
          <InlineLogLineDetails
            logs={logs}
            log={log}
            onResize={handleLogLineResize}
            timeRange={timeRange}
            timeZone={timeZone}
          />
        )}
      </div>
    );
  }
);
LogLineComponent.displayName = 'LogLineComponent';

export type LogLineTimestampResolution = 'ms' | 'ns';

interface LogProps {
  collapsed?: boolean;
  displayedFields: string[];
  log: LogListModel;
  showLevel: boolean;
  showTime: boolean;
  showUniqueLabels?: boolean;
  styles: LogLineStyles;
  timestampResolution: LogLineTimestampResolution;
  wrapLogMessage: boolean;
}

const Log = memo(
  ({
    displayedFields,
    log,
    showLevel,
    showTime,
    showUniqueLabels,
    styles,
    timestampResolution,
    wrapLogMessage,
  }: LogProps) => {
    const handleLabelsToggle = useCallback(
      (expanded: boolean) => {
        log.uniqueLabelsExpanded = expanded;
      },
      [log]
    );
    return (
      <>
        {showTime && (
          <span className={`${mergeStylexClassName(stylex.props(logLineStyles.timestamp), undefined).className} level-${log.logLevel} field`}>
            {timestampResolution === 'ms' ? log.timestamp : log.timestampNs}{' '}
          </span>
        )}
        {
          // When logs are unwrapped, we want an empty column space to align with other log lines.
        }
        {showLevel && (log.displayLevel || !wrapLogMessage) && (
          <span className={`${mergeStylexClassName(stylex.props(logLineStyles.level), undefined).className} level-${log.logLevel} field`}>{log.displayLevel} </span>
        )}
        {showUniqueLabels && log.uniqueLabels && (
          <span className="field">
            <LogLabels
              addTooltip={true}
              displayAll={log.uniqueLabelsExpanded}
              displayMax={5}
              labels={log.uniqueLabels}
              onDisplayMaxToggle={handleLabelsToggle}
            />
          </span>
        )}
        {displayedFields.length > 0 ? (
          <DisplayedFields displayedFields={displayedFields} log={log} styles={styles} />
        ) : (
          <LogLineBody log={log} styles={styles} />
        )}
      </>
    );
  }
);
Log.displayName = 'Log';

const DisplayedFields = ({
  displayedFields,
  log,
  styles,
}: {
  displayedFields: string[];
  log: LogListModel;
  styles: LogLineStyles;
}) => {
  const { matchingUids, search } = useLogListSearchContext();
  const { isCustomGrammar, syntaxHighlighting, unwrappedColumns, wrapLogMessage } = useLogListContext();

  const searchWords = useMemo(() => {
    const searchWords = log.searchWords && log.searchWords[0] ? log.searchWords.slice() : [];
    if (search && matchingUids?.includes(log.uid)) {
      searchWords.push(search);
    }
    if (!searchWords.length) {
      return undefined;
    }
    return searchWords;
  }, [log.searchWords, log.uid, matchingUids, search]);

  return displayedFields
    .map((field) => {
      if (field === LOG_LINE_BODY_FIELD_NAME) {
        return <LogLineBody log={log} key={field} styles={styles} />;
      }
      if (field === OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME && syntaxHighlighting) {
        const className = isCustomGrammar ? 'field prism-syntax-highlight' : 'field log-syntax-highlight';
        return (
          <span className={className} title={getNormalizedFieldName(field)} key={field}>
            <HighlightedLogRenderer tokens={log.highlightedLogAttributesTokens} />{' '}
          </span>
        );
      }

      const fieldValue = log.getDisplayedFieldValue(field);

      // With wrapped logs, or without unwrapped columns, we skip empty values so they don't appear as an empty space
      if ((wrapLogMessage || !unwrappedColumns) && !fieldValue) {
        return null;
      }

      return (
        <span className="field" title={getNormalizedFieldName(field)} key={field}>
          {searchWords ? (
            <Highlighter
              textToHighlight={fieldValue}
              searchWords={searchWords}
              findChunks={findHighlightChunksInText}
              highlightClassName={mergeStylexClassName(stylex.props(logLineStyles.matchHighLight), undefined).className}
            />
          ) : (
            fieldValue
          )}{' '}
        </span>
      );
    })
    .filter((field) => field !== null);
};

const LogLineBody = ({ log, styles }: { log: LogListModel; styles: LogLineStyles }) => {
  const { isCustomGrammar, syntaxHighlighting } = useLogListContext();
  const { matchingUids, search } = useLogListSearchContext();

  const highlight = useMemo(() => {
    const searchWords = syntaxHighlighting && log.searchWords && log.searchWords[0] ? log.searchWords.slice() : [];
    if (search && matchingUids?.includes(log.uid)) {
      searchWords.push(search);
    }
    if (!searchWords.length) {
      return undefined;
    }
    return { searchWords, highlightClassName: mergeStylexClassName(stylex.props(logLineStyles.matchHighLight), undefined).className };
  }, [log.searchWords, log.uid, matchingUids, search, mergeStylexClassName(stylex.props(logLineStyles.matchHighLight), undefined).className, syntaxHighlighting]);

  if (log.hasAnsi) {
    return (
      <span className="field no-highlighting log-line-body">
        <LogMessageAnsi value={log.body} highlight={highlight} />{' '}
      </span>
    );
  }

  if (!syntaxHighlighting) {
    return highlight ? (
      <Highlighter
        textToHighlight={log.body}
        searchWords={highlight.searchWords}
        findChunks={findHighlightChunksInText}
        highlightClassName={mergeStylexClassName(stylex.props(logLineStyles.matchHighLight), undefined).className}
      />
    ) : (
      <span className="field no-highlighting log-line-body">{log.body} </span>
    );
  }

  const className = isCustomGrammar
    ? 'field prism-syntax-highlight log-line-body'
    : 'field log-syntax-highlight log-line-body';

  return (
    <span className={className}>
      <HighlightedLogRenderer tokens={log.highlightedBodyTokens} />{' '}
    </span>
  );
};

export function getGridTemplateColumns(
  dimensions: LogFieldDimension[],
  displayedFields: string[],
  unwrappedColumns: boolean
) {
  const columns = dimensions
    .map((dimension) =>
      dimension.width > 0 && (unwrappedColumns || dimension.internal) ? `${dimension.width}px` : 'max-content'
    )
    .join(' ');
  const logLineWidth = displayedFields.length > 0 ? '' : ' 1fr';
  return `${columns}${logLineWidth}`;
}

export type LogLineStyles = ReturnType<typeof getStyles>;
export 
function isLogLineClick(target: EventTarget) {
  const targetIsButton = target instanceof HTMLButtonElement || (target instanceof Element && target.closest('button'));
  return !targetIsButton;
}
