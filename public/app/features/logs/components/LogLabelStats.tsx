import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type LogLabelStatsModel } from '@grafana/data';
import { t } from '@grafana/i18n';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { LogLabelStatsRow } from './LogLabelStatsRow';

const STATS_ROW_LIMIT = 5;

interface Props {
  /** Replaces the default container styles. */
  xstyle?: stylex.StyleXStyles;
  stats: LogLabelStatsModel[];
  label: string;
  value: string;
  rowCount: number;
  isLabel?: boolean;
}

export const LogLabelStats = ({ xstyle, label, rowCount, stats, value, isLabel }: Props) => {
  const rows = useMemo(() => {
    const topRows = stats.slice(0, STATS_ROW_LIMIT);
    let activeRow = topRows.find((row) => row.value === value);
    let otherRows = stats.slice(STATS_ROW_LIMIT);
    const insertActiveRow = !activeRow;

    // Remove active row from other to show extra
    if (insertActiveRow) {
      activeRow = otherRows.find((row) => row.value === value);
      otherRows = otherRows.filter((row) => row.value !== value);
    }
    return { topRows, otherRows, insertActiveRow, activeRow };
  }, [stats, value]);

  const otherCount = useMemo(() => rows.otherRows.reduce((sum, row) => sum + row.count, 0), [rows.otherRows]);
  const topCount = useMemo(() => rows.topRows.reduce((sum, row) => sum + row.count, 0), [rows.topRows]);
  const total = topCount + otherCount;
  const otherProportion = otherCount / total;

  return (
    <div {...stylex.props(xstyle ?? styles.logsStats)} data-testid="logLabelStats">
      <div {...stylex.props(styles.logsStatsHeader)}>
        <div {...stylex.props(styles.logsStatsTitle)}>
          {isLabel
            ? t(
                'logs.un-themed-log-label-stats.label-log-stats',
                '{{label}}: {{total}} of {{rowCount}} rows have that label',
                {
                  label,
                  total,
                  rowCount,
                }
              )
            : t(
                'logs.un-themed-log-label-stats.field-log-stats',
                '{{label}}: {{total}} of {{rowCount}} rows have that field'
              )}
        </div>
      </div>
      <div {...stylex.props(styles.logsStatsBody)}>
        {rows.topRows.map((stat) => (
          <LogLabelStatsRow key={stat.value} {...stat} active={stat.value === value} />
        ))}
        {rows.insertActiveRow && rows.activeRow && (
          <LogLabelStatsRow key={rows.activeRow.value} {...rows.activeRow} active />
        )}
        {otherCount > 0 && (
          <LogLabelStatsRow key="__OTHERS__" count={otherCount} value="Other" proportion={otherProportion} />
        )}
      </div>
    </div>
  );
};

const styles = stylex.create({
  logsStats: {
    backgroundColor: 'inherit',
    color: colors['--gf-colors-text-primary'],
    wordBreak: 'break-all',
    width: 'fit-content',
    maxWidth: '100%',
  },
  logsStatsHeader: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors['--gf-colors-border-medium'],
    display: 'flex',
  },
  logsStatsTitle: {
    fontWeight: typography['--gf-typography-font-weight-medium'],
    paddingRight: spacing['--gf-spacing-x2'],
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  logsStatsBody: {
    paddingTop: '5px',
    paddingRight: '0px',
    paddingBottom: '5px',
    paddingLeft: '0px',
  },
});
