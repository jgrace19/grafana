import { css, cx, keyframes } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import tinycolor from 'tinycolor2';

import { type LogRowModel, dateTimeFormat, type GrafanaTheme2, LogsSortOrder } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { type TimeZone } from '@grafana/schema';
import { Button, useStyles2, useTheme2 } from '@grafana/ui';

import { LogMessageAnsi } from '../../logs/components/LogMessageAnsi';
import { getLogRowStyles } from '../../logs/components/getLogRowStyles';
import { sortLogRows } from '../../logs/utils';
import { ElapsedTime } from '../ElapsedTime';
import { filterLogRowsByIndex } from '../state/utils';

const getStyles = (theme: GrafanaTheme2) => {
  const fade = keyframes({
    from: {
      backgroundColor: tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString(),
    },
    to: {
      backgroundColor: 'transparent',
    },
  });

  return {
    logsRowsLive: css({
      label: 'logs-rows-live',
      fontFamily: theme.typography.fontFamilyMonospace,
      fontSize: theme.typography.bodySmall.fontSize,
      display: 'flex',
      flexFlow: 'column nowrap',
      height: '60vh',
      overflowY: 'scroll',
      ':first-child': {
        marginTop: 'auto !important',
      },
    }),
    logsRowFade: css({
      label: 'logs-row-fresh',
      color: theme.colors.text.primary,
      backgroundColor: tinycolor(theme.colors.info.transparent).setAlpha(0.25).toString(),
      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        animation: `${fade} 1s ease-out 1s 1 normal forwards`,
      },
    }),
    logsRowsIndicator: css({
      fontSize: theme.typography.h6.fontSize,
      paddingTop: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
    }),
    button: css({
      marginRight: theme.spacing(1),
    }),
    fullWidth: css({
      width: '100%',
    }),
  };
};

export interface Props {
  logRows?: LogRowModel[];
  timeZone: TimeZone;
  stopLive: () => void;
  onPause: () => void;
  onResume: () => void;
  onClear: () => void;
  clearedAtIndex: number | null;
  isPaused: boolean;
}

export function LiveLogs({ logRows, timeZone, stopLive, onPause, onResume, onClear, clearedAtIndex, isPaused }: Props) {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const [logRowsToRender, setLogRowsToRender] = useState<LogRowModel[] | undefined>(logRows);

  const scrollContainerRef = useRef<HTMLTableSectionElement>(null);
  const liveEndDivRef = useRef<HTMLTableRowElement | null>(null);

  // Update logRowsToRender based on isPaused and clearedAtIndex
  useEffect(() => {
    if (isPaused && clearedAtIndex) {
      setLogRowsToRender((prev) => filterLogRowsByIndex(clearedAtIndex, prev));
      return;
    }

    if (isPaused) {
      return;
    }

    setLogRowsToRender(logRows);
  }, [logRows, isPaused, clearedAtIndex]);

  // Scroll to bottom on new rows when not paused
  useEffect(() => {
    if (!isPaused && liveEndDivRef.current && scrollContainerRef.current?.scrollTo) {
      scrollContainerRef.current.scrollTo(0, scrollContainerRef.current.scrollHeight);
    }
  });

  const onScroll = (event: React.SyntheticEvent) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    if (distanceFromBottom >= 5 && !isPaused) {
      onPause();
    }
  };

  const rowsToRender = () => {
    let rows = logRowsToRender ?? [];
    if (!isPaused) {
      rows = sortLogRows(rows, LogsSortOrder.Ascending).slice(-100);
    }
    return rows;
  };

  const renderedRows = rowsToRender();
  const { logsRow, logsRowLocalTime, logsRowMessage } = getLogRowStyles(theme);

  return (
    <div>
      <table className={styles.fullWidth}>
        <tbody
          onScroll={isPaused ? undefined : onScroll}
          className={styles.logsRowsLive}
          ref={scrollContainerRef}
        >
          {renderedRows.map((row: LogRowModel) => {
            return (
              <tr className={cx(logsRow, styles.logsRowFade)} key={row.uid}>
                <td className={logsRowLocalTime}>{dateTimeFormat(row.timeEpochMs, { timeZone })}</td>
                <td className={logsRowMessage}>{row.hasAnsi ? <LogMessageAnsi value={row.raw} /> : row.entry}</td>
              </tr>
            );
          })}
          <tr ref={liveEndDivRef} />
        </tbody>
      </table>
      <div className={styles.logsRowsIndicator}>
        <Button
          icon={isPaused ? 'play' : 'pause'}
          variant="secondary"
          onClick={isPaused ? onResume : onPause}
          className={styles.button}
        >
          {isPaused ? t('explore.live-logs.resume', 'Resume') : t('explore.live-logs.pause', 'Pause')}
        </Button>
        <Button icon="trash-alt" variant="secondary" onClick={onClear} className={styles.button}>
          <Trans i18nKey="explore.live-logs.clear-logs">Clear logs</Trans>
        </Button>
        <Button icon="square-shape" variant="secondary" onClick={stopLive} className={styles.button}>
          <Trans i18nKey="explore.live-logs.exit-live-mode">Exit live mode</Trans>
        </Button>
        {isPaused ||
          (renderedRows.length > 0 && (
            <span>
              <Trans
                i18nKey="explore.live-logs.last-line-received"
                components={{ elapsedTime: <ElapsedTime resetKey={logRows} humanize={true} /> }}
              >
                Last line received: {'<elapsedTime />'} ago
              </Trans>
            </span>
          ))}
      </div>
    </div>
  );
}

export const LiveLogsWithTheme = LiveLogs;
