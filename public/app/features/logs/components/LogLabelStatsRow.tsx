import * as stylex from '@stylexjs/stylex';

import { mergeStylexProps } from '@grafana/ui/internal';
import { colors, spacing } from '@grafana/ui/stylex/tokens.stylex';

export interface Props {
  active?: boolean;
  count: number;
  proportion: number;
  value?: string;
}

export const LogLabelStatsRow = ({ active, count, proportion, value }: Props) => {
  const percent = `${Math.round(proportion * 100)}%`;
  const barStyle = { width: percent };

  return (
    <div {...stylex.props(styles.logsStatsRow, active && styles.logsStatsRowActive)}>
      <div {...stylex.props(styles.logsStatsRowLabel)}>
        <div {...stylex.props(styles.logsStatsRowValue)} title={value}>
          {value}
        </div>
        <div {...stylex.props(styles.logsStatsRowCount)}>{count}</div>
        <div {...stylex.props(styles.logsStatsRowPercent)}>{percent}</div>
      </div>
      <div {...stylex.props(styles.logsStatsRowBar)}>
        <div {...mergeStylexProps(stylex.props(styles.logsStatsRowInnerBar), { style: barStyle })} />
      </div>
    </div>
  );
};

LogLabelStatsRow.displayName = 'LogLabelStatsRow';

const statsRowMargin = `calc(${spacing['--gf-spacing-x2']} / 1.75)`;

const styles = stylex.create({
  logsStatsRow: {
    marginTop: statsRowMargin,
    marginRight: 0,
    marginBottom: statsRowMargin,
    marginLeft: 0,
  },
  logsStatsRowActive: {
    color: colors['--gf-colors-primary-text'],
    position: 'relative',
  },
  logsStatsRowLabel: {
    display: 'flex',
    marginBottom: '1px',
  },
  logsStatsRowValue: {
    flex: '1',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  logsStatsRowCount: {
    textAlign: 'right',
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
  },
  logsStatsRowPercent: {
    textAlign: 'right',
    marginLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.75)`,
    width: `calc(${spacing['--gf-spacing-grid-size']} * 4.5)`,
  },
  logsStatsRowBar: {
    height: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
    backgroundColor: colors['--gf-colors-text-disabled'],
  },
  logsStatsRowInnerBar: {
    height: spacing['--gf-spacing-x0-5'],
    overflow: 'hidden',
    backgroundColor: colors['--gf-colors-primary-main'],
  },
});
