import { useBooleanFlagValue } from '@openfeature/react-sdk';
import * as stylex from '@stylexjs/stylex';
import { Resizable } from 're-resizable';
import { memo, startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type TimeRange } from '@grafana/data';
import { t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { getDragStyles, Icon, ScrollContainer, Tab, TabsBar, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, shadows, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { getFieldSelectorWidth } from '../fieldSelector/fieldSelectorUtils';

import { getDetailsScrollPosition, saveDetailsScrollPosition, useLogDetailsContext } from './LogDetailsContext';
import { LogLineDetailsComponent } from './LogLineDetailsComponent';
import { LogLineDetailsHeader } from './LogLineDetailsHeader';
import { useLogListContext } from './LogListContext';
import { type LogListModel } from './processing';
import { LOG_LIST_MIN_WIDTH } from './virtualization';

export interface Props {
  containerElement: HTMLDivElement;
  focusLogLine: (log: LogListModel) => void;
  logs: LogListModel[];
  timeRange: TimeRange;
  timeZone: string;
  showControls: boolean;
  showFieldSelector: boolean | undefined;
}

export type LogLineDetailsMode = 'inline' | 'sidebar';

export const LogLineDetails = memo(
  ({ containerElement, focusLogLine, logs, timeRange, timeZone, showControls, showFieldSelector }: Props) => {
    const { noInteractions, fontSize, logOptionsStorageKey } = useLogListContext();
    const { detailsWidth, setDetailsWidth } = useLogDetailsContext();
    const theme = useTheme2();
    // getDragStyles is a @grafana/ui Emotion helper; the resize handle it styles belongs to that package.
    const dragStyles = useMemo(() => getDragStyles(theme), [theme]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleResize = useCallback(() => {
      if (containerRef.current) {
        setDetailsWidth(containerRef.current.clientWidth);
      }
    }, [setDetailsWidth]);

    const reportResize = useCallback(() => {
      if (containerRef.current && !noInteractions) {
        reportInteraction('logs_log_line_details_sidebar_resized', {
          width: Math.round(containerRef.current.clientWidth),
        });
      }
    }, [noInteractions]);

    const maxWidth =
      containerElement.clientWidth -
      (showFieldSelector ? getFieldSelectorWidth(logOptionsStorageKey) : 0) -
      LOG_LIST_MIN_WIDTH;

    return (
      <Resizable
        onResize={handleResize}
        onResizeStop={reportResize}
        handleClasses={{ left: dragStyles.dragHandleVertical }}
        defaultSize={{ width: detailsWidth, height: containerElement.clientHeight }}
        size={{ width: detailsWidth, height: containerElement.clientHeight }}
        enable={{ left: true }}
        minWidth={40}
        maxWidth={maxWidth}
      >
        <div
          {...stylex.props(
            styles.container,
            showControls ? styles.containerWithControls : styles.containerRounded,
            fontSize === 'small' && styles.fontSizeSmall
          )}
          ref={containerRef}
        >
          <LogLineDetailsTabs focusLogLine={focusLogLine} logs={logs} timeRange={timeRange} timeZone={timeZone} />
        </div>
      </Resizable>
    );
  }
);
LogLineDetails.displayName = 'LogLineDetails';

const LogLineDetailsTabs = memo(
  ({ focusLogLine, logs, timeRange, timeZone }: Pick<Props, 'focusLogLine' | 'logs' | 'timeRange' | 'timeZone'>) => {
    const { app, noInteractions, wrapLogMessage } = useLogListContext();
    const { currentLog, setCurrentLog, showDetails, toggleDetails } = useLogDetailsContext();
    const [search, setSearch] = useState('');
    const inputRef = useRef('');

    useEffect(() => {
      // When wrapping is enabled and details is in sidebar mode, the logs panel width changes and the
      // user may lose focus of the log line, so we scroll to it.
      if (wrapLogMessage && currentLog) {
        focusLogLine(currentLog);
      }
      if (!noInteractions) {
        reportInteraction('logs_log_line_details_displayed', {
          mode: 'sidebar',
          app,
        });
      }
      // Once
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = useCallback((newSearch: string) => {
      inputRef.current = newSearch;
      startTransition(() => {
        setSearch(inputRef.current);
      });
    }, []);

    const tabs = useMemo(() => showDetails.slice().reverse(), [showDetails]);

    if (!currentLog) {
      return null;
    }

    return (
      <div {...stylex.props(styles.tabsWrapper)}>
        {showDetails.length > 1 && (
          <TabsBar>
            {tabs.map((log) => {
              return (
                <Tab
                  key={log.uid}
                  truncate
                  label={log.entry.substring(0, 25)}
                  active={currentLog.uid === log.uid}
                  onChangeTab={() => setCurrentLog(log)}
                  suffix={() => (
                    <Icon
                      name="times"
                      aria-label={t('logs.log-line-details.remove-log', 'Remove log')}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDetails(log);
                      }}
                    />
                  )}
                />
              );
            })}
          </TabsBar>
        )}
        <LogLineDetailsHeader focusLogLine={focusLogLine} log={currentLog} search={search} onSearch={handleSearch} />
        <ScrollContainer>
          <LogLineDetailsComponent
            log={currentLog}
            logs={logs}
            search={search}
            timeRange={timeRange}
            timeZone={timeZone}
          />
        </ScrollContainer>
      </div>
    );
  }
);
LogLineDetailsTabs.displayName = 'LogLineDetailsTabs';

export interface InlineLogLineDetailsProps {
  log: LogListModel;
  logs: LogListModel[];
  onResize(): void;
  timeRange: TimeRange;
  timeZone: string;
}

export const InlineLogLineDetails = memo(({ logs, log, onResize, timeRange, timeZone }: InlineLogLineDetailsProps) => {
  const { app, fontSize, noInteractions } = useLogListContext();
  const { detailsWidth } = useLogDetailsContext();
  const inlineLogDetailsNoScrolls = useBooleanFlagValue('inlineLogDetailsNoScrolls', false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState('');
  const inputRef = useRef('');
  const [autoScrolled, setAutoScrolled] = useState(false);

  useEffect(() => {
    if (!noInteractions) {
      reportInteraction('logs_log_line_details_displayed', {
        mode: 'inline',
        app,
      });
    }
  }, [app, noInteractions]);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [onResize]);

  const saveScroll = useCallback(() => {
    saveDetailsScrollPosition(log, scrollRef.current?.scrollTop ?? 0);
  }, [log]);

  const handleSearch = useCallback((newSearch: string) => {
    inputRef.current = newSearch;
    startTransition(() => {
      setSearch(inputRef.current);
    });
  }, []);

  // Keep scroll position when adding filters or using displayed fields
  // Remove after inlineLogDetailsNoScrolls is enabled by default
  useEffect(() => {
    if (!scrollRef.current || inlineLogDetailsNoScrolls || autoScrolled) {
      return;
    }
    if (scrollRef.current.scrollHeight === scrollRef.current.clientHeight) {
      return;
    }
    scrollRef.current.scrollTo(0, getDetailsScrollPosition(log));
    setAutoScrolled(true);
  }, [inlineLogDetailsNoScrolls, autoScrolled, log, scrollRef.current?.scrollHeight]);

  return (
    <div
      {...mergeStylexProps(
        stylex.props(styles.inlineWrapper, !inlineLogDetailsNoScrolls && styles.inlineWrapperHeight),
        { className: 'log-line-inline-details', style: { maxWidth: detailsWidth } }
      )}
    >
      <div {...stylex.props(styles.inlineContainer, fontSize === 'small' && styles.fontSizeSmall)}>
        <LogLineDetailsHeader log={log} search={search} onSearch={handleSearch} />
        {inlineLogDetailsNoScrolls ? (
          <div>
            <LogLineDetailsComponent log={log} logs={logs} search={search} timeRange={timeRange} timeZone={timeZone} />
          </div>
        ) : (
          <ScrollContainer ref={scrollRef} onScroll={saveScroll}>
            <LogLineDetailsComponent log={log} logs={logs} search={search} timeRange={timeRange} timeZone={timeZone} />
          </ScrollContainer>
        )}
      </div>
    </div>
  );
});
InlineLogLineDetails.displayName = 'InlineLogLineDetails';

export const LOG_LINE_DETAILS_HEIGHT = 45;

const styles = stylex.create({
  inlineWrapper: {
    gridColumnEnd: '-1',
    gridColumnStart: '1',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.5)`,
    paddingLeft: spacing['--gf-spacing-x2'],
    marginRight: 1,
  },
  inlineWrapperHeight: {
    height: `${LOG_LINE_DETAILS_HEIGHT}vh`,
  },
  inlineContainer: {
    backgroundColor: colors['--gf-colors-background-secondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  container: {
    backgroundColor: colors['--gf-colors-background-elevated'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    boxShadow: shadows['--gf-shadows-z3'],
    height: '100%',
  },
  containerWithControls: {
    borderRightStyle: 'none',
  },
  containerRounded: {
    borderBottomRightRadius: shape['--gf-shape-radius-default'],
    borderTopRightRadius: shape['--gf-shape-radius-default'],
  },
  fontSizeSmall: {
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
  },
  tabsWrapper: { height: '100%', display: 'flex', flexDirection: 'column' },
});
