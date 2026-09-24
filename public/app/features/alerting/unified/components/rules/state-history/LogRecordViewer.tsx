import * as stylex from '@stylexjs/stylex';
import { formatDistanceToNowStrict } from 'date-fns';
import { groupBy, uniqueId } from 'lodash';
import { Fragment, memo, useEffect, useRef } from 'react';

import { AlertLabel } from '@grafana/alerting/unstable';
import { dateTimeFormat } from '@grafana/data';
import { Trans, t } from '@grafana/i18n';
import { Icon, Stack, TagList } from '@grafana/ui';
import { motion } from '@grafana/ui/stylex/constants.stylex';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
import { GrafanaAlertState, mapStateWithReasonToBaseState } from 'app/types/unified-alerting-dto';

import { AlertStateTag } from '../AlertStateTag';

import { ErrorMessageRow } from './ErrorMessageRow';
import { type LogRecord, omitLabels } from './common';
import { formatNumericValue } from './numberFormatter';

type LogRecordViewerProps = {
  records: LogRecord[];
  commonLabels: Array<[string, string]>;
};

type AdditionalLogRecordViewerProps = {
  onRecordsRendered?: (timestampRefs: Map<number, HTMLElement>) => void;
  onLabelClick?: (label: string) => void;
};

function groupRecordsByTimestamp(records: LogRecord[]) {
  // groupBy has been replaced by the reduce to avoid back and forth conversion of timestamp from number to string
  const groupedLines = records.reduce((acc, current) => {
    const tsGroup = acc.get(current.timestamp);
    if (tsGroup) {
      tsGroup.push(current);
    } else {
      acc.set(current.timestamp, [current]);
    }

    return acc;
  }, new Map<number, LogRecord[]>());

  return new Map([...groupedLines].sort((a, b) => b[0] - a[0]));
}

export const LogRecordViewerByTimestamp = memo(
  ({
    records,
    commonLabels,
    onLabelClick,
    onRecordsRendered,
  }: LogRecordViewerProps & AdditionalLogRecordViewerProps) => {
    const groupedLines = groupRecordsByTimestamp(records);

    const timestampRefs = useRef<Map<number, HTMLElement>>(new Map());
    useEffect(() => {
      onRecordsRendered && onRecordsRendered(timestampRefs.current);
    }, [onRecordsRendered, records]);

    return (
      <ul
        {...stylex.props(styles.logsScrollable)}
        aria-label={t(
          'alerting.log-record-viewer-by-timestamp.aria-label-state-history-by-timestamp',
          'State history by timestamp'
        )}
      >
        {Array.from(groupedLines.entries()).map(([key, records]) => {
          return (
            <li
              id={key.toString(10)}
              key={key}
              data-testid={key}
              ref={(element) => {
                if (element) {
                  timestampRefs.current.set(key, element);
                } else {
                  timestampRefs.current.delete(key);
                }
              }}
              {...stylex.props(styles.listItemWrapper)}
            >
              <Timestamp time={key} />
              {records.map(({ line }, idx) => {
                const id = line.fingerprint ?? `${key}-${idx}`;

                const isErrorRow =
                  mapStateWithReasonToBaseState(line.current) === GrafanaAlertState.Error && Boolean(line.error);
                return (
                  <Fragment key={id}>
                    <div {...stylex.props(styles.logsContainer)}>
                      <AlertStateTag state={line.previous} size="sm" muted />
                      <Icon name="arrow-right" size="sm" />
                      <AlertStateTag state={line.current} />
                      <Stack>{line.values && <AlertInstanceValues record={line.values} />}</Stack>
                      <div>
                        {line.labels && (
                          <TagList
                            tags={omitLabels(Object.entries(line.labels), commonLabels).map(
                              ([key, value]) => `${key}=${value}`
                            )}
                            onClick={onLabelClick}
                          />
                        )}
                      </div>
                    </div>
                    {isErrorRow && line.error && <ErrorMessageRow message={line.error} />}
                  </Fragment>
                );
              })}
            </li>
          );
        })}
      </ul>
    );
  }
);
LogRecordViewerByTimestamp.displayName = 'LogRecordViewerByTimestamp';

export function LogRecordViewerByInstance({ records, commonLabels }: LogRecordViewerProps) {
  const groupedLines = groupBy(records, (record: LogRecord) => {
    return JSON.stringify(record.line.labels);
  });

  return (
    <>
      {Object.entries(groupedLines).map(([key, records]) => {
        return (
          <Stack direction="column" key={key}>
            <h4>
              <TagList
                tags={omitLabels(Object.entries(records[0].line.labels ?? {}), commonLabels).map(
                  ([key, value]) => `${key}=${value}`
                )}
              />
            </h4>
            <div {...stylex.props(styles.logsContainer)}>
              {records.map(({ line, timestamp }) => (
                <div key={uniqueId()}>
                  <AlertStateTag state={line.previous} size="sm" muted />
                  <Icon name="arrow-right" size="sm" />
                  <AlertStateTag state={line.current} />
                  <Stack>{line.values && <AlertInstanceValues record={line.values} />}</Stack>
                  <div>{dateTimeFormat(timestamp)}</div>
                </div>
              ))}
            </div>
          </Stack>
        );
      })}
    </>
  );
}

interface TimestampProps {
  time: number; // epoch timestamp
}

const Timestamp = ({ time }: TimestampProps) => {
  const dateTime = new Date(time);
  return (
    <div {...stylex.props(styles.timestampWrapper)}>
      <Stack alignItems="center" gap={1}>
        <Icon name="clock-nine" size="sm" />
        <span {...stylex.props(styles.timestampText)}>{dateTimeFormat(dateTime)}</span>
        <small>
          <Trans i18nKey="alerting.timestamp.time-ago" values={{ time: formatDistanceToNowStrict(dateTime) }}>
            ({'{{time}}'} ago)
          </Trans>
        </small>
      </Stack>
    </div>
  );
};

const AlertInstanceValues = memo(({ record }: { record: Record<string, number> }) => {
  const values = Object.entries(record);

  return (
    <>
      {values.map(([key, value]) => (
        <AlertLabel key={key} labelKey={key} value={formatNumericValue(value)} />
      ))}
    </>
  );
});
AlertInstanceValues.displayName = 'AlertInstanceValues';

const styles = stylex.create({
  logsContainer: {
    display: 'grid',
    gridTemplateColumns: 'max-content max-content max-content auto max-content',
    rowGap: spacing['--gf-spacing-x2'],
    columnGap: spacing['--gf-spacing-x1'],
    alignItems: 'center',
  },
  logsScrollable: {
    height: '500px',
    overflow: 'scroll',
    flex: '1',
  },
  timestampWrapper: {
    color: colors['--gf-colors-text-secondary'],
  },
  timestampText: {
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  listItemWrapper: {
    backgroundColor: 'transparent',
    outlineWidth: '1px',
    outlineStyle: 'solid',
    outlineColor: 'transparent',
    paddingTop: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1-5'],
    paddingBottom: spacing['--gf-spacing-x1'],
    paddingLeft: spacing['--gf-spacing-x1-5'],
    transitionProperty: { default: null, [motion.noPreferenceOrReduce]: 'background, outline' },
    transitionDuration: { default: null, [motion.noPreferenceOrReduce]: '150ms' },
  },
});
