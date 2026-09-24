import * as stylex from '@stylexjs/stylex';
import { partition } from 'lodash';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useAsync } from 'react-use';

import {
  type DataQueryResponse,
  type DataSourceWithLogsContextSupport,
  type LogRowContextOptions,
  LogRowContextQueryDirection,
  type LogRowModel,
  LogsDedupStrategy,
  LogsSortOrder,
  dateTime,
  type TimeRange,
  LoadingState,
  store,
} from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { reportInteraction } from '@grafana/runtime';
import { type DataQuery, type TimeZone } from '@grafana/schema';
import { Button, Modal, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';
import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';
import { SETTINGS_KEYS } from 'app/features/explore/Logs/utils/logs';
import { splitOpen } from 'app/features/explore/state/main';
import { useDispatch } from 'app/types/store';

import { dataFrameToLogsModel } from '../../logsModel';
import { sortLogRows } from '../../utils';
import { LoadingIndicator } from '../LoadingIndicator';
import { LogRows } from '../LogRows';

import { LogContextButtons } from './LogContextButtons';
import './LogRowContextModal.css';

interface LogRowContextModalProps {
  row: LogRowModel;
  open: boolean;
  timeZone: TimeZone;
  onClose: () => void;
  getRowContext: (row: LogRowModel, options: LogRowContextOptions) => Promise<DataQueryResponse>;

  getRowContextQuery?: (
    row: LogRowModel,
    options?: LogRowContextOptions,
    cacheFilters?: boolean
  ) => Promise<DataQuery | null>;
  logsSortOrder: LogsSortOrder;
  runContextQuery?: () => void;
  getLogRowContextUi?: DataSourceWithLogsContextSupport['getLogRowContextUi'];
}

type Section = {
  loadingState: LoadingState;
  rows: LogRowModel[];
};
type Place = 'above' | 'below';
type Context = Record<Place, Section>;

const makeEmptyContext = (): Context => ({
  above: { loadingState: LoadingState.NotStarted, rows: [] },
  below: { loadingState: LoadingState.NotStarted, rows: [] },
});

const getLoadMoreDirection = (place: Place, sortOrder: LogsSortOrder): LogRowContextQueryDirection => {
  if (place === 'above' && sortOrder === LogsSortOrder.Descending) {
    return LogRowContextQueryDirection.Forward;
  }
  if (place === 'below' && sortOrder === LogsSortOrder.Ascending) {
    return LogRowContextQueryDirection.Forward;
  }

  return LogRowContextQueryDirection.Backward;
};

type LoadCounter = Record<Place, number>;

const normalizeLogRowRefId = (row: LogRowModel, counter: LoadCounter): LogRowModel => {
  // the datasoure plugins often create the context-query based on the row's dataframe's refId,
  // by appending something to it. for example:
  // - let's say the row's dataframe's refId is "query"
  // - the datasource plugin will take "query" and append "-context" to it, so it becomes "query-context".
  // - later we want to load even more lines, so we make a context query
  // - the datasource plugin does the same transform again, but now the source is "query-context",
  //   so the new refId becomes "query-context-context"
  // - next time it becomes "query-context-context-context", and so on.
  // we do not want refIds to grow unbounded.
  // to avoid this, we set the refId to a value that does not grow.
  // on the other hand, the refId is also used in generating the row's UID, so it is useful
  // when the refId is not always the exact same string, otherwise UID duplication can occur,
  // which may cause problems.
  // so we go with an approach where the refId always changes, but does not grow.
  return {
    ...row,
    dataFrame: {
      ...row.dataFrame,
      refId: `context_${counter.above}_${counter.below}`,
    },
  };
};

const containsRow = (rows: LogRowModel[], row: LogRowModel) => {
  return rows.some((r) => r.entry === row.entry && r.timeEpochNs === row.timeEpochNs);
};

const PAGE_SIZE = 100;

export const LogRowContextModal: React.FunctionComponent<LogRowContextModalProps> = ({
  row,
  open,
  logsSortOrder,
  timeZone,
  getLogRowContextUi,
  getRowContextQuery,
  onClose,
  getRowContext,
}) => {
  const scrollElement = useRef<HTMLDivElement | null>(null);
  const entryElement = useRef<HTMLTableRowElement | null>(null);
  // We can not use `entryElement` to scroll to the right element because it's
  // sticky. That's why we add another row and use this ref to scroll to that
  // first.
  const preEntryElement = useRef<HTMLTableRowElement | null>(null);

  const prevScrollHeightRef = useRef<number | null>(null);
  const prevClientHeightRef = useRef<number | null>(null);

  const aboveLoadingElement = useRef<HTMLDivElement | null>(null);
  const belowLoadingElement = useRef<HTMLDivElement | null>(null);

  const loadCountRef = useRef<LoadCounter>({ above: 0, below: 0 });

  const dispatch = useDispatch();
  const theme = useTheme2();

  const [sticky, setSticky] = useState(true);

  // we need to keep both the "above" and "below" rows
  // in the same react-state, to be able to atomically change both
  // at the same time.
  // we create the `setSection` convenience function to adjust any
  // part of it easily.
  const [context, setContext] = useState<Context>(makeEmptyContext());
  const setSection = (place: Place, fun: (s: Section) => Section) => {
    setContext((c) => {
      const newContext = { ...c };
      newContext[place] = fun(c[place]);
      return newContext;
    });
  };

  // this is used to "cancel" the ongoing load-more requests.
  // whenever we want to cancel them, we increment this number.
  // and when those requests return, we check if the number
  // is still the same as when we started. and if it is not the same,
  // we ignore the results.
  //
  // best would be to literally cancel those requests,
  // but right now there's no way with the current logs-context API.
  const generationRef = useRef(1);

  const [contextQuery, setContextQuery] = useState<DataQuery | null>(null);
  const [wrapLines, setWrapLines] = useState(
    store.getBool(SETTINGS_KEYS.logContextWrapLogMessage, store.getBool(SETTINGS_KEYS.wrapLogMessage, true))
  );
  const getFullTimeRange = useCallback(() => {
    const { below, above } = context;
    const allRows = sortLogRows([...below.rows, row, ...above.rows], LogsSortOrder.Ascending);
    const fromMs = allRows[0].timeEpochMs;
    let toMs = allRows[allRows.length - 1].timeEpochMs;
    // In case we have a lot of logs and from and to have same millisecond
    // we add 1 millisecond to toMs to make sure we have a range
    if (fromMs === toMs) {
      toMs += 1;
    }
    const from = dateTime(fromMs);
    const to = dateTime(toMs);

    const range: TimeRange = {
      from,
      to,
      raw: {
        from,
        to,
      },
    };
    return range;
  }, [context, row]);

  const updateContextQuery = useCallback(async () => {
    const contextQuery = getRowContextQuery ? await getRowContextQuery(row) : null;
    setContextQuery(contextQuery);
  }, [row, getRowContextQuery]);

  const updateResults = async () => {
    await updateContextQuery();
    setContext(makeEmptyContext());
    loadCountRef.current = { above: 0, below: 0 };
    generationRef.current += 1; // results from currently running loadMore calls will be ignored
  };

  const loadMore = async (place: Place, allRows: LogRowModel[]): Promise<LogRowModel[]> => {
    loadCountRef.current[place] += 1;
    const refRow = allRows.at(place === 'above' ? 0 : -1);
    if (refRow == null) {
      throw new Error('should never happen. the array always contains at least 1 item (the middle row)');
    }

    reportInteraction('grafana_explore_logs_log_context_load_more_called', {
      datasourceType: refRow.datasourceType,
      above: loadCountRef.current.above,
      below: loadCountRef.current.below,
    });

    const direction = getLoadMoreDirection(place, logsSortOrder);

    const result = await getRowContext(normalizeLogRowRefId(refRow, loadCountRef.current), {
      limit: PAGE_SIZE,
      direction,
    });
    const newRows = dataFrameToLogsModel(result.data).rows;

    if (logsSortOrder === LogsSortOrder.Ascending) {
      newRows.reverse();
    }

    const out = newRows.filter((r) => {
      return !containsRow(allRows, r);
    });

    return out;
  };

  useEffect(() => {
    if (open) {
      updateContextQuery();
    }
  }, [updateContextQuery, open]);

  const [displayedFields, setDisplayedFields] = useState<string[]>([]);

  const showField = (key: string) => {
    const index = displayedFields.indexOf(key);

    if (index === -1) {
      setDisplayedFields([...displayedFields, key]);
    }
  };

  const hideField = (key: string) => {
    const index = displayedFields.indexOf(key);

    if (index > -1) {
      displayedFields.splice(index, 1);
      setDisplayedFields([...displayedFields]);
    }
  };

  const maybeLoadMore = async (place: Place) => {
    const { below, above } = context;
    const section = context[place];
    if (section.loadingState === LoadingState.Loading) {
      return;
    }

    setSection(place, (section) => ({
      ...section,
      loadingState: LoadingState.Loading,
    }));

    const currentGen = generationRef.current;
    try {
      // we consider all the currently existing rows, even the original row,
      // this way this array of rows will never be empty
      const allRows = [...above.rows, row, ...below.rows];

      const newRows = (await loadMore(place, allRows)).map((r) =>
        // apply the original row's searchWords to all the rows for highlighting
        !r.searchWords || !r.searchWords?.length ? { ...r, searchWords: row.searchWords } : r
      );
      const [older, newer] = partition(newRows, (newRow) => newRow.timeEpochNs > row.timeEpochNs);
      const newAbove = logsSortOrder === LogsSortOrder.Ascending ? newer : older;
      const newBelow = logsSortOrder === LogsSortOrder.Ascending ? older : newer;

      if (currentGen === generationRef.current) {
        setContext((c) => {
          // we should only modify the row-arrays if necessary
          const sortedNewAbove =
            newAbove.length > 0 ? sortLogRows([...newAbove, ...c.above.rows], logsSortOrder) : c.above.rows;
          const sortedNewBelow =
            newBelow.length > 0 ? sortLogRows([...c.below.rows, ...newBelow], logsSortOrder) : c.below.rows;
          return {
            above: {
              rows: sortedNewAbove,
              loadingState:
                place === 'above'
                  ? newRows.length === 0
                    ? LoadingState.Done
                    : LoadingState.NotStarted
                  : c.above.loadingState,
            },
            below: {
              rows: sortedNewBelow,
              loadingState:
                place === 'below'
                  ? newRows.length === 0
                    ? LoadingState.Done
                    : LoadingState.NotStarted
                  : c.below.loadingState,
            },
          };
        });
      }
    } catch {
      setSection(place, (section) => ({
        rows: section.rows,
        loadingState: LoadingState.Error,
      }));
    }
  };

  const onScrollHit = async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
    for (const entry of entries) {
      // If the element is not intersecting, skip to the next one
      if (!entry.isIntersecting) {
        continue;
      }

      const targetElement = entry.target;

      if (targetElement === aboveLoadingElement.current) {
        maybeLoadMore('above');
      } else if (targetElement === belowLoadingElement.current) {
        maybeLoadMore('below');
      }
    }
  };

  useEffect(() => {
    const scroll = scrollElement.current;
    const aboveElem = aboveLoadingElement.current;
    const belowElem = belowLoadingElement.current;

    if (scroll == null) {
      // should not happen, but need to make typescript happy
      return;
    }

    const observer = new IntersectionObserver(onScrollHit, { root: scroll });

    if (aboveElem != null) {
      observer.observe(aboveElem);
    }

    if (belowElem != null) {
      observer.observe(belowElem);
    }

    return () => {
      observer.disconnect();
    };
  }); // on every render, why not

  const scrollToCenter = useCallback(() => {
    preEntryElement.current?.scrollIntoView({ block: 'center' });
    entryElement.current?.scrollIntoView({ block: 'center' });
  }, [preEntryElement, entryElement]);

  useLayoutEffect(() => {
    const scrollE = scrollElement.current;
    if (scrollE == null) {
      return;
    }

    const prevClientHeight = prevClientHeightRef.current;
    const currentClientHeight = scrollE.clientHeight;
    prevClientHeightRef.current = currentClientHeight;
    if (prevClientHeight !== currentClientHeight) {
      // height has changed, we scroll to the center
      scrollToCenter();
      return;
    }

    // if the newly loaded content is part of the initial load of `above` and `below`,
    // we scroll to center, to keep the chosen log-row centered
    if (loadCountRef.current.above <= 1 && loadCountRef.current.below <= 1) {
      scrollToCenter();
      return;
    }

    const prevScrollHeight = prevScrollHeightRef.current;
    const currentHeight = scrollE.scrollHeight;
    prevScrollHeightRef.current = currentHeight;
    if (prevScrollHeight != null) {
      const newScrollTop = scrollE.scrollTop + (currentHeight - prevScrollHeight);
      scrollE.scrollTop = newScrollTop;
    }
  }, [context.above.rows, scrollToCenter]);

  useAsync(updateContextQuery, [getRowContextQuery, row]);

  const loadingStateAbove = context.above.loadingState;
  const loadingStateBelow = context.below.loadingState;
  const timeRange = getFullTimeRange();

  return (
    <Modal
      isOpen={open}
      title={t('logs.log-row-context-modal.title-log-context', 'Log context')}
      contentXstyle={[styles.flexColumn, modalStyles.content]}
      xstyle={modalStyles.modal}
      onDismiss={onClose}
    >
      {getLogRowContextUi && <div {...stylex.props(styles.datasourceUi)}>{getLogRowContextUi(row, updateResults)}</div>}
      <div {...stylex.props(styles.flexRow, styles.paddingBottom)}>
        <div {...stylex.props(styles.flexRowEnd)}>
          <LogContextButtons
            wrapLines={wrapLines}
            onChangeWrapLines={setWrapLines}
            onScrollCenterClick={scrollToCenter}
          />
        </div>
      </div>
      <div ref={scrollElement} {...stylex.props(styles.logRowGroups)}>
        <table {...stylex.props(styles.logRowGroupsTable)}>
          <tbody>
            <tr>
              <td {...stylex.props(styles.loadingCell)}>
                {loadingStateAbove !== LoadingState.Done && loadingStateAbove !== LoadingState.Error && (
                  <div ref={aboveLoadingElement}>
                    <LoadingIndicator adjective="newer" />
                  </div>
                )}
                {loadingStateAbove === LoadingState.Error && (
                  <div>
                    <Trans i18nKey="logs.log-row-context-modal.error-loading-log-more-logs">
                      Error loading more logs.
                    </Trans>
                  </div>
                )}
                {loadingStateAbove === LoadingState.Done && (
                  <div>
                    <Trans i18nKey="logs.log-row-context-modal.no-more-logs-available">No more logs available.</Trans>
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <LogRows
                  logRows={context.above.rows}
                  dedupStrategy={LogsDedupStrategy.none}
                  showLabels={store.getBool(SETTINGS_KEYS.showLabels, false)}
                  showTime={store.getBool(SETTINGS_KEYS.showTime, true)}
                  wrapLogMessage={wrapLines}
                  prettifyLogMessage={store.getBool(SETTINGS_KEYS.prettifyLogMessage, false)}
                  enableLogDetails={true}
                  timeZone={timeZone}
                  displayedFields={displayedFields}
                  onClickShowField={showField}
                  onClickHideField={hideField}
                  scrollElement={null}
                  timeRange={timeRange}
                />
              </td>
            </tr>
            <tr ref={preEntryElement}></tr>
            <tr
              ref={entryElement}
              {...mergeStylexProps(
                stylex.props(
                  styles.entryBackground(theme.colors.emphasize(theme.colors.background.secondary)),
                  sticky && styles.sticky
                ),
                { className: 'gf-logs-context-entry' }
              )}
              data-testid="entry-row"
            >
              <td {...stylex.props(styles.entryCell)}>
                <LogRows
                  logRows={[row]}
                  dedupStrategy={LogsDedupStrategy.none}
                  showLabels={store.getBool(SETTINGS_KEYS.showLabels, false)}
                  showTime={store.getBool(SETTINGS_KEYS.showTime, true)}
                  wrapLogMessage={wrapLines}
                  prettifyLogMessage={store.getBool(SETTINGS_KEYS.prettifyLogMessage, false)}
                  enableLogDetails={true}
                  timeZone={timeZone}
                  displayedFields={displayedFields}
                  onClickShowField={showField}
                  onClickHideField={hideField}
                  onUnpinLine={() => setSticky(false)}
                  onPinLine={() => setSticky(true)}
                  pinnedLogs={sticky ? [row.uid] : undefined}
                  overflowingContent={true}
                  scrollElement={null}
                  timeRange={timeRange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <>
                  <LogRows
                    logRows={context.below.rows}
                    dedupStrategy={LogsDedupStrategy.none}
                    showLabels={store.getBool(SETTINGS_KEYS.showLabels, false)}
                    showTime={store.getBool(SETTINGS_KEYS.showTime, true)}
                    wrapLogMessage={wrapLines}
                    prettifyLogMessage={store.getBool(SETTINGS_KEYS.prettifyLogMessage, false)}
                    enableLogDetails={true}
                    timeZone={timeZone}
                    displayedFields={displayedFields}
                    onClickShowField={showField}
                    onClickHideField={hideField}
                    scrollElement={null}
                    timeRange={timeRange}
                  />
                </>
              </td>
            </tr>
            <tr>
              <td {...stylex.props(styles.loadingCell)}>
                {loadingStateBelow !== LoadingState.Done && loadingStateBelow !== LoadingState.Error && (
                  <div ref={belowLoadingElement}>
                    <LoadingIndicator adjective="older" />
                  </div>
                )}
                {loadingStateBelow === LoadingState.Error && (
                  <div>
                    <Trans i18nKey="logs.log-row-context-modal.error-loading-log-more-logs">
                      Error loading more logs.
                    </Trans>
                  </div>
                )}
                {loadingStateBelow === LoadingState.Done && (
                  <div>
                    <Trans i18nKey="logs.log-row-context-modal.no-more-logs-available">No more logs available.</Trans>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Modal.ButtonRow>
        {contextQuery?.datasource?.uid && (
          <Button
            variant="secondary"
            onClick={async () => {
              let rowId = row.uid;
              if (row.dataFrame.refId) {
                // the orignal row has the refid from the base query and not the refid from the context query, so we need to replace it.
                rowId = row.uid.replace(row.dataFrame.refId, contextQuery.refId);
              }

              dispatch(
                splitOpen({
                  queries: [contextQuery],
                  range: timeRange,
                  datasourceUid: contextQuery.datasource!.uid!,
                  panelsState: {
                    logs: {
                      id: rowId,
                    },
                  },
                })
              );
              onClose();
              reportInteraction('grafana_explore_logs_log_context_open_split_view_clicked', {
                datasourceType: row.datasourceType,
                logRowUid: row.uid,
              });
            }}
          >
            <Trans i18nKey="logs.log-row-context-modal.open-in-split-view">Open in split view</Trans>
          </Button>
        )}
      </Modal.ButtonRow>
    </Modal>
  );
};

const modalStyles = stylex.create({
  modal: {
    width: { default: '85vw', [bp.mdDown]: '100%' },
  },
  // Modal's own small-screen padding still wins.
  content: {
    paddingTop: { default: 0, [bp.smDown]: spacing['--gf-spacing-x1'] },
    paddingRight: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x2'] },
    paddingBottom: spacing['--gf-spacing-x3'],
    paddingLeft: { default: spacing['--gf-spacing-x3'], [bp.smDown]: spacing['--gf-spacing-x2'] },
  },
});

const styles = stylex.create({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  sticky: {
    position: 'sticky',
    zIndex: 1,
    top: '-1px',
    bottom: '-1px',
  },
  entryBackground: (backgroundColor: string) => ({
    backgroundColor,
  }),
  entryCell: {
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: 0,
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: 0,
  },
  datasourceUi: {
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 1.25)`,
    display: 'flex',
    alignItems: 'center',
  },
  logRowGroups: {
    overflow: 'auto',
    maxHeight: '75%',
    alignSelf: 'stretch',
    display: 'inline-block',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors['--gf-colors-border-weak'],
    borderRadius: shape['--gf-shape-radius-default'],
  },
  logRowGroupsTable: {
    minWidth: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowEnd: {
    marginLeft: 'auto',
  },
  paddingBottom: {
    paddingBottom: spacing['--gf-spacing-x1'],
  },
  loadingCell: {
    position: 'sticky',
    left: '50%',
    display: 'inline-block',
    transform: 'translateX(-50%)',
  },
});
