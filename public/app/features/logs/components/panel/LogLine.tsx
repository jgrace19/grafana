import * as stylex from '@stylexjs/stylex';
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

import {
  findHighlightChunksInText,
  type GrafanaTheme2,
  LogLevel,
  LogsDedupStrategy,
  type TimeRange,
} from '@grafana/data';
import { t } from '@grafana/i18n';
import { Button, Icon, Tooltip } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { zIndex } from '@grafana/ui/stylex/constants.stylex';
import { colors, components, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { LogLabels } from '../LogLabels';
import { LogMessageAnsi } from '../LogMessageAnsi';
import { LOG_LINE_BODY_FIELD_NAME, OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME } from '../fieldSelector/logFields';

import { HighlightedLogRenderer } from './HighlightedLogRenderer';
import { useLogDetailsContext } from './LogDetailsContext';
import { InlineLogLineDetails } from './LogLineDetails';
import { LogLineMenu } from './LogLineMenu';
import { useLogIsPermalinked, useLogIsPinned, useLogListContext } from './LogListContext';
import { useLogListSearchContext } from './LogListSearchContext';
import { logLineVars } from './logLine.stylex';
import { getNormalizedFieldName, type LogListModel } from './processing';
import {
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
          {...stylex.props(
            logLineStyles.logLine,
            variant === 'infinite-scroll' && logLineStyles.infiniteScroll,
            detailsShown && logLineStyles.detailsDisplayed,
            isLogDetailsFocused && logLineStyles.currentLog,
            pinned && logLineStyles.pinnedLogLine,
            Boolean(permalinked) && logLineStyles.permalinkedLogLine,
            fontSize === 'small' ? logLineStyles.fontSizeSmall : logLineStyles.fontSizeDefault,
            enableLogDetails && logLineStyles.clickable
          )}
          onMouseEnter={handleMouseOver}
          onFocus={handleMouseOver}
          onClick={handleClick}
        >
          <LogLineMenu log={log} active={isLogDetailsFocused} />
          {dedupStrategy !== LogsDedupStrategy.none && (
            <div {...stylex.props(logLineStyles.duplicates)}>
              {log.duplicates && log.duplicates > 0 ? `${log.duplicates + 1}x` : null}
            </div>
          )}
          {hasLogsWithErrors && (
            <div {...stylex.props(logLineStyles.hasError)}>
              {log.hasError && (
                <Tooltip
                  content={t('logs.log-line.tooltip-error', 'Error: {{errorMessage}}', {
                    errorMessage: log.errorMessage,
                  })}
                  placement="right"
                  theme="error"
                >
                  <Icon
                    xstyle={logLineStyles.logIconError}
                    name="exclamation-triangle"
                    aria-label={t('logs.log-line.has-error', 'Has errors')}
                    size="xs"
                  />
                </Tooltip>
              )}
            </div>
          )}
          {hasSampledLogs && (
            <div {...stylex.props(logLineStyles.isSampled)}>
              {log.isSampled && (
                <Tooltip content={log.sampledMessage ?? ''} placement="right" theme="info">
                  <Icon
                    xstyle={logLineStyles.logIconInfo}
                    name="info-circle"
                    size="xs"
                    aria-label={t('logs.log-line.is-sampled', 'Is sampled')}
                  />
                </Tooltip>
              )}
            </div>
          )}
          <div
            {...mergeStylexProps(
              stylex.props(
                logLineStyles.fieldsWrapper,
                detailsShown && logLineStyles.detailsDisplayed,
                isLogDetailsFocused && logLineStyles.currentLog,
                wrapLogMessage ? logLineStyles.wrappedLogLine : logLineStyles.unwrappedLogLine,
                collapsed === true && logLineStyles.collapsedLogLine
              ),
              {
                style:
                  collapsed && virtualization
                    ? { maxHeight: `${virtualization.getTruncationLineCount() * virtualization.getLineHeight()}px` }
                    : undefined,
              }
            )}
          >
            <Log
              collapsed={collapsed}
              displayedFields={displayedFields}
              log={log}
              showLevel={showLevel}
              showTime={showTime}
              showUniqueLabels={showUniqueLabels}
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
              style={expandCollapseButtonStyle}
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
              style={expandCollapseButtonStyle}
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
  timestampResolution: LogLineTimestampResolution;
  wrapLogMessage: boolean;
}

const Log = memo(
  ({ displayedFields, log, showLevel, showTime, showUniqueLabels, timestampResolution, wrapLogMessage }: LogProps) => {
    const handleLabelsToggle = useCallback(
      (expanded: boolean) => {
        log.uniqueLabelsExpanded = expanded;
      },
      [log]
    );
    const fieldStyle = getFieldStyle(wrapLogMessage);
    return (
      <>
        {showTime && (
          <span
            {...mergeStylexProps(stylex.props(logLineStyles.timestamp, fieldStyle), {
              className: `level-${log.logLevel} field`,
            })}
          >
            {timestampResolution === 'ms' ? log.timestamp : log.timestampNs}{' '}
          </span>
        )}
        {
          // When logs are unwrapped, we want an empty column space to align with other log lines.
        }
        {showLevel && (log.displayLevel || !wrapLogMessage) && (
          <span
            {...mergeStylexProps(stylex.props(logLineStyles.level, getLevelStyle(log.logLevel), fieldStyle), {
              className: `level-${log.logLevel} field`,
            })}
          >
            {log.displayLevel}{' '}
          </span>
        )}
        {showUniqueLabels && log.uniqueLabels && (
          <span {...mergeStylexProps(stylex.props(fieldStyle), { className: 'field' })}>
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
          <DisplayedFields displayedFields={displayedFields} log={log} />
        ) : (
          <LogLineBody log={log} />
        )}
      </>
    );
  }
);
Log.displayName = 'Log';

const DisplayedFields = ({ displayedFields, log }: { displayedFields: string[]; log: LogListModel }) => {
  const { matchingUids, search } = useLogListSearchContext();
  const { isCustomGrammar, syntaxHighlighting, unwrappedColumns, wrapLogMessage } = useLogListContext();
  const fieldStyle = getFieldStyle(wrapLogMessage);

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
        return <LogLineBody log={log} key={field} />;
      }
      if (field === OTEL_LOG_LINE_ATTRIBUTES_FIELD_NAME && syntaxHighlighting) {
        const className = isCustomGrammar ? 'field prism-syntax-highlight' : 'field log-syntax-highlight';
        return (
          <span
            {...mergeStylexProps(stylex.props(fieldStyle), { className })}
            title={getNormalizedFieldName(field)}
            key={field}
          >
            <HighlightedLogRenderer tokens={log.highlightedLogAttributesTokens} colorTokens={!isCustomGrammar} />{' '}
          </span>
        );
      }

      const fieldValue = log.getDisplayedFieldValue(field);

      // With wrapped logs, or without unwrapped columns, we skip empty values so they don't appear as an empty space
      if ((wrapLogMessage || !unwrappedColumns) && !fieldValue) {
        return null;
      }

      return (
        <span
          {...mergeStylexProps(stylex.props(fieldStyle), { className: 'field' })}
          title={getNormalizedFieldName(field)}
          key={field}
        >
          {searchWords ? (
            <Highlighter
              textToHighlight={fieldValue}
              searchWords={searchWords}
              findChunks={findHighlightChunksInText}
              highlightClassName={matchHighlightClassName}
            />
          ) : (
            fieldValue
          )}{' '}
        </span>
      );
    })
    .filter((field) => field !== null);
};

const LogLineBody = ({ log }: { log: LogListModel }) => {
  const { isCustomGrammar, syntaxHighlighting, wrapLogMessage } = useLogListContext();
  const { matchingUids, search } = useLogListSearchContext();
  const fieldStyle = getFieldStyle(wrapLogMessage);

  const highlight = useMemo(() => {
    const searchWords = syntaxHighlighting && log.searchWords && log.searchWords[0] ? log.searchWords.slice() : [];
    if (search && matchingUids?.includes(log.uid)) {
      searchWords.push(search);
    }
    if (!searchWords.length) {
      return undefined;
    }
    return { searchWords, highlightClassName: matchHighlightClassName };
  }, [log.searchWords, log.uid, matchingUids, search, syntaxHighlighting]);

  if (log.hasAnsi) {
    return (
      <span
        {...mergeStylexProps(stylex.props(logLineStyles.noHighlighting, fieldStyle), {
          className: 'field no-highlighting log-line-body',
        })}
      >
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
        highlightClassName={matchHighlightClassName}
      />
    ) : (
      <span
        {...mergeStylexProps(stylex.props(logLineStyles.noHighlighting, fieldStyle), {
          className: 'field no-highlighting log-line-body',
        })}
      >
        {log.body}{' '}
      </span>
    );
  }

  if (isCustomGrammar) {
    return (
      <span
        {...mergeStylexProps(stylex.props(fieldStyle), { className: 'field prism-syntax-highlight log-line-body' })}
      >
        <HighlightedLogRenderer tokens={log.highlightedBodyTokens} />{' '}
      </span>
    );
  }

  return (
    <span
      {...mergeStylexProps(stylex.props(logLineStyles.logLineBody, fieldStyle), {
        className: 'field log-syntax-highlight log-line-body',
      })}
    >
      <HighlightedLogRenderer tokens={log.highlightedBodyTokens} colorTokens />{' '}
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

/**
 * Theme- and list-dependent values shared by every line of a list (see `logLineVars`). Apply the result to the
 * list root; every line below it reads the values through static styles.
 */
export function getLogLineVarStyles(
  theme: GrafanaTheme2,
  virtualization: LogLineVirtualization | undefined = undefined,
  displayedFields: string[] = []
) {
  const base = tinycolor(theme.colors.background.primary);

  let maxContrast = theme.isDark
    ? tinycolor(theme.colors.text.maxContrast).darken(10).toRgbString()
    : tinycolor(theme.colors.text.maxContrast).lighten(10).toRgbString();
  let colorDefault = theme.isDark
    ? theme.colors.text.primary
    : tinycolor(theme.colors.text.maxContrast).lighten(30).toRgbString();
  const contrast1 = tinycolor.readability(base, maxContrast);
  const contrast2 = tinycolor.readability(base, colorDefault);

  if (!displayedFields.length || (displayedFields.length === 1 && displayedFields.includes(LOG_LINE_BODY_FIELD_NAME))) {
    colorDefault = theme.colors.text.primary;
    maxContrast = theme.colors.text.primary;
  } else if (contrast1 < contrast2) {
    colorDefault = maxContrast;
    maxContrast = theme.colors.text.primary;
  }

  return varStyles.vars(
    colorDefault,
    maxContrast,
    tinycolor(theme.colors.background.canvas).darken(11).toRgbString(),
    tinycolor(theme.colors.background.canvas)
      .darken(theme.isDark ? 2 : 5)
      .toRgbString(),
    tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString(),
    `${virtualization?.getLineHeight() ?? DEFAULT_LINE_HEIGHT}px`,
    virtualization ? `${virtualization.getLineHeight() + virtualization.getPaddingBottom()}px` : 'auto'
  );
}

function getLevelStyle(level: LogLevel) {
  switch (level) {
    case LogLevel.critical:
      return levelStyles.critical;
    case LogLevel.error:
      return levelStyles.error;
    case LogLevel.warning:
      return levelStyles.warning;
    case LogLevel.info:
      return levelStyles.info;
    case LogLevel.debug:
      return levelStyles.debug;
    default:
      return null;
  }
}

function getFieldStyle(wrapLogMessage: boolean) {
  return wrapLogMessage ? logLineStyles.wrappedField : logLineStyles.unwrappedField;
}

const varStyles = stylex.create({
  vars: (
    defaultColor: string,
    bodyColor: string,
    hoverBackground: string,
    detailsBackground: string,
    highlightBackground: string,
    lineHeight: string,
    fieldsMinHeight: string
  ) => ({
    [logLineVars.defaultColor]: defaultColor,
    [logLineVars.bodyColor]: bodyColor,
    [logLineVars.hoverBackground]: hoverBackground,
    [logLineVars.detailsBackground]: detailsBackground,
    [logLineVars.highlightBackground]: highlightBackground,
    [logLineVars.lineHeight]: lineHeight,
    [logLineVars.fieldsMinHeight]: fieldsMinHeight,
  }),
});

// Must match FIELD_GAP_MULTIPLIER, which the virtualization uses to measure lines.
const fieldGap = `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`;
const linePaddingBottom = `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`;

export const logLineStyles = stylex.create({
  logLine: {
    color: logLineVars.defaultColor,
    display: 'flex',
    gap: spacing['--gf-spacing-x0-5'],
    flexDirection: 'row',
    fontFamily: typography['--gf-typography-font-family-monospace'],
    wordBreak: 'break-all',
    backgroundColor: { default: null, ':hover': logLineVars.hoverBackground },
  },
  infiniteScroll: {
    '::before': {
      borderTopColor: colors['--gf-colors-border-strong'],
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      content: '""',
      height: 0,
      left: 0,
      position: 'absolute',
      top: -3,
      width: '100%',
    },
  },
  logLineBody: {
    color: logLineVars.bodyColor,
  },
  noHighlighting: {
    color: colors['--gf-colors-text-primary'],
  },
  matchHighLight: {
    color: components['--gf-components-text-highlight-text'],
    backgroundColor: components['--gf-components-text-highlight-background'],
  },
  fontSizeSmall: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
  },
  fontSizeDefault: {
    fontSize: typography['--gf-typography-font-size'],
    lineHeight: typography['--gf-typography-body-line-height'],
  },
  detailsDisplayed: {
    backgroundColor: { default: logLineVars.detailsBackground, ':hover': logLineVars.hoverBackground },
  },
  currentLog: {
    backgroundColor: { default: logLineVars.hoverBackground, ':hover': logLineVars.hoverBackground },
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  pinnedLogLine: {
    backgroundColor: { default: logLineVars.highlightBackground, ':hover': logLineVars.hoverBackground },
  },
  permalinkedLogLine: {
    backgroundColor: { default: logLineVars.highlightBackground, ':hover': logLineVars.hoverBackground },
  },
  menuIcon: {
    height: logLineVars.lineHeight,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
  logLineMessage: {
    fontFamily: typography['--gf-typography-font-family'],
    justifyContent: 'center',
  },
  timestamp: {
    color: colors['--gf-colors-text-disabled'],
    display: 'inline-block',
  },
  duplicates: {
    flexShrink: 0,
    textAlign: 'center',
    width: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)`,
  },
  hasError: {
    flexShrink: 0,
    width: spacing['--gf-spacing-x2'],
  },
  isSampled: {
    flexShrink: 0,
    width: spacing['--gf-spacing-x2'],
  },
  logIconError: {
    color: colors['--gf-colors-warning-main'],
    position: 'relative',
    top: -1,
  },
  logIconInfo: {
    color: colors['--gf-colors-info-main'],
    position: 'relative',
    top: -1,
  },
  level: {
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
    textTransform: 'uppercase',
    display: 'inline-block',
  },
  loadMoreButton: {
    backgroundColor: 'transparent',
    borderStyle: 'none',
    display: 'inline',
  },
  loadMoreTopContainer: {
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: zIndex.navbarFixed,
  },
  loadMoreTopBackground: (backgroundColor: string) => ({
    backgroundColor,
  }),
  clickable: {
    cursor: 'pointer',
  },
  unwrappedLogLine: {
    display: 'grid',
    columnGap: fieldGap,
    gridTemplateColumns: logLineVars.gridTemplateColumns,
    whiteSpace: 'pre',
    paddingBottom: linePaddingBottom,
  },
  wrappedLogLine: {
    alignSelf: 'flex-start',
    paddingBottom: linePaddingBottom,
    whiteSpace: 'pre-wrap',
  },
  unwrappedField: {
    overflow: logLineVars.unwrappedFieldOverflow,
  },
  wrappedField: {
    marginRight: { default: fieldGap, ':last-child': 0 },
  },
  fieldsWrapper: {
    minHeight: logLineVars.fieldsMinHeight,
    backgroundColor: { default: null, ':hover': logLineVars.hoverBackground },
  },
  collapsedLogLine: {
    overflow: 'hidden',
  },
  expandCollapseControl: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const levelStyles = stylex.create({
  critical: { color: '#B877D9' },
  error: { color: colors['--gf-colors-error-text'] },
  warning: { color: '#FBAD37' },
  info: { color: '#6CCF8E' },
  debug: { color: '#6E9FFF' },
});

const matchHighlightClassName = stylex.props(logLineStyles.matchHighLight).className ?? '';

// Button has no xstyle and sets its own font weight and height, which a class from another stylex.props() call
// can't reliably override.
const expandCollapseButtonStyle: CSSProperties = {
  fontWeight: typography['--gf-typography-font-weight-light'],
  height: logLineVars.lineHeight,
  margin: 0,
};

function isLogLineClick(target: EventTarget) {
  const targetIsButton = target instanceof HTMLButtonElement || (target instanceof Element && target.closest('button'));
  return !targetIsButton;
}
