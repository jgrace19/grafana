import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, PureComponent } from 'react';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { type LogRowModel, dateTimeFormat, LogsSortOrder } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { type TimeZone } from '@grafana/schema';
import { Button, type Themeable2, useTheme2 } from '@grafana/ui';
import { mergeStylexProps } from '@grafana/ui/internal';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { LogMessageAnsi } from '../../logs/components/LogMessageAnsi';
import { getLogRowStyles } from '../../logs/components/getLogRowStyles';
import { sortLogRows } from '../../logs/utils';
import { ElapsedTime } from '../ElapsedTime';
import { filterLogRowsByIndex } from '../state/utils';

import { liveLogsVars } from './LiveLogs.stylex';

export interface Props extends Themeable2 {
  logRows?: LogRowModel[];
  timeZone: TimeZone;
  stopLive: () => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  clearedAtIndex: number | null;
  isPaused: boolean;
}

interface State {
  logRowsToRender?: LogRowModel[];
}

class LiveLogs extends PureComponent<Props, State> {
  private liveEndDiv: HTMLDivElement | null = null;
  private scrollContainerRef = React.createRef<HTMLTableSectionElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      logRowsToRender: props.logRows,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, state: State) {
    if (nextProps.isPaused && nextProps.clearedAtIndex) {
      return {
        logRowsToRender: filterLogRowsByIndex(nextProps.clearedAtIndex, state.logRowsToRender),
      };
    }

    if (nextProps.isPaused) {
      return null;
    }

    return {
      // We update what we show only if not paused. We keep any background subscriptions running and keep updating
      // our state, but we do not show the updates, this allows us start again showing correct result after resuming
      // without creating a gap in the log results.
      logRowsToRender: nextProps.logRows,
    };
  }

  /**
   * Handle pausing when user scrolls up so that we stop resetting his position to the bottom when new row arrives.
   * We do not need to throttle it here much, adding new rows should be throttled/buffered itself in the query epics
   * and after you pause we remove the handler and add it after you manually resume, so this should not be fired often.
   */
  onScroll = (event: React.SyntheticEvent) => {
    const { isPaused, onPause } = this.props;
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceFromBottom >= 5 && !isPaused) {
      onPause();
    }
  };

  rowsToRender = () => {
    const { isPaused } = this.props;
    let { logRowsToRender: rowsToRender = [] } = this.state;
    if (!isPaused) {
      // A perf optimisation here. Show just 100 rows when streaming and full length when the streaming is paused.
      rowsToRender = sortLogRows(rowsToRender, LogsSortOrder.Ascending).slice(-100);
    }
    return rowsToRender;
  };

  render() {
    const { theme, timeZone, onPause, onResume, onClear, isPaused } = this.props;
    const { logsRow, logsRowLocalTime, logsRowMessage } = getLogRowStyles(theme);
    const freshRowColor: CSSProperties & Record<string, string> = {
      '--gf-live-logs-fresh-row': tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString(),
    };

    return (
      <div>
        <table {...stylex.props(styles.fullWidth)}>
          <tbody
            onScroll={isPaused ? undefined : this.onScroll}
            {...mergeStylexProps(stylex.props(styles.logsRowsLive), { style: freshRowColor })}
            ref={this.scrollContainerRef}
          >
            {this.rowsToRender().map((row: LogRowModel) => {
              return (
                <tr {...mergeStylexProps(stylex.props(styles.logsRowFade), { className: logsRow })} key={row.uid}>
                  <td className={logsRowLocalTime}>{dateTimeFormat(row.timeEpochMs, { timeZone })}</td>
                  <td className={logsRowMessage}>{row.hasAnsi ? <LogMessageAnsi value={row.raw} /> : row.entry}</td>
                </tr>
              );
            })}
            <tr
              ref={(element) => {
                this.liveEndDiv = element;
                // This is triggered on every update so on every new row. It keeps the view scrolled at the bottom by
                // default.
                // As scrollTo is not implemented in JSDOM it needs to be part of the condition
                if (this.liveEndDiv && this.scrollContainerRef.current?.scrollTo && !isPaused) {
                  this.scrollContainerRef.current?.scrollTo(0, this.scrollContainerRef.current.scrollHeight);
                }
              }}
            />
          </tbody>
        </table>
        <div {...stylex.props(styles.logsRowsIndicator)}>
          <Button
            icon={isPaused ? 'play' : 'pause'}
            variant="secondary"
            onClick={isPaused ? onResume : onPause}
            className={stylex.props(styles.button).className}
          >
            {isPaused ? t('explore.live-logs.resume', 'Resume') : t('explore.live-logs.pause', 'Pause')}
          </Button>
          <Button
            icon="trash-alt"
            variant="secondary"
            onClick={onClear}
            className={stylex.props(styles.button).className}
          >
            <Trans i18nKey="explore.live-logs.clear-logs">Clear logs</Trans>
          </Button>
          <Button
            icon="square-shape"
            variant="secondary"
            onClick={this.props.stopLive}
            className={stylex.props(styles.button).className}
          >
            <Trans i18nKey="explore.live-logs.exit-live-mode">Exit live mode</Trans>
          </Button>
          {isPaused ||
            (this.rowsToRender().length > 0 && (
              <span>
                <Trans
                  i18nKey="explore.live-logs.last-line-received"
                  components={{ elapsedTime: <ElapsedTime resetKey={this.props.logRows} humanize={true} /> }}
                >
                  Last line received: {'<elapsedTime />'} ago
                </Trans>
              </span>
            ))}
        </div>
      </div>
    );
  }
}

export function LiveLogsWithTheme(props: Omit<Props, 'theme'>) {
  const theme = useTheme2();
  return <LiveLogs {...props} theme={theme} />;
}

const fade = stylex.keyframes({
  from: {
    backgroundColor: liveLogsVars['--gf-live-logs-fresh-row'],
  },
  to: {
    backgroundColor: 'transparent',
  },
});

const styles = stylex.create({
  logsRowsLive: {
    fontFamily: typography['--gf-typography-font-family-monospace'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '60vh',
    overflowY: 'scroll',
    marginTop: { default: null, ':first-child': 'auto' },
  },
  logsRowFade: {
    color: colors['--gf-colors-text-primary'],
    backgroundColor: liveLogsVars['--gf-live-logs-fresh-row'],
    animationName: { default: null, [motion.noPreferenceOrReduce]: fade },
    animationDuration: { default: null, [motion.noPreferenceOrReduce]: '1s' },
    animationTimingFunction: { default: null, [motion.noPreferenceOrReduce]: 'ease-out' },
    animationDelay: { default: null, [motion.noPreferenceOrReduce]: '1s' },
    animationIterationCount: { default: null, [motion.noPreferenceOrReduce]: 1 },
    animationDirection: { default: null, [motion.noPreferenceOrReduce]: 'normal' },
    animationFillMode: { default: null, [motion.noPreferenceOrReduce]: 'forwards' },
  },
  logsRowsIndicator: {
    fontSize: typography['--gf-typography-h6-font-size'],
    paddingTop: spacing['--gf-spacing-x1'],
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginRight: spacing['--gf-spacing-x1'],
  },
  fullWidth: {
    width: '100%',
  },
});
