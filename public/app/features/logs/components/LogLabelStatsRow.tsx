import clsx from 'clsx';

import { } from '@grafana/ui';


export interface Props {
  active?: boolean;
  count: number;
  proportion: number;
  value?: string;
}

export const LogLabelStatsRow = ({ active, count, proportion, value }: Props) => {
  const style = (getStyles);
  const percent = `${Math.round(proportion * 100)}%`;
  const barStyle = { width: percent };
  const className = active ? cx([style.logsStatsRow, style.logsStatsRowActive]) : cx([style.logsStatsRow]);

  return (
    <div className={className}>
      <div className={cx([style.logsStatsRowLabel])}>
        <div className={cx([style.logsStatsRowValue])} title={value}>
          {value}
        </div>
        <div className={cx([style.logsStatsRowCount])}>{count}</div>
        <div className={cx([style.logsStatsRowPercent])}>{percent}</div>
      </div>
      <div className={cx([style.logsStatsRowBar])}>
        <div className={cx([style.logsStatsRowInnerBar])} style={barStyle} />
      </div>
    </div>
  );
};

LogLabelStatsRow.displayName = 'LogLabelStatsRow';
