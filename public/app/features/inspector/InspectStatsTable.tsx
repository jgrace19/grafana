import * as stylex from '@stylexjs/stylex';

import {
  FieldType,
  formattedValueToString,
  getDisplayProcessor,
  type GrafanaTheme2,
  type QueryResultMetaStat,
  type TimeZone,
} from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface InspectStatsTableProps {
  timeZone: TimeZone;
  name: string;
  stats: QueryResultMetaStat[];
}

export const InspectStatsTable = ({ timeZone, name, stats }: InspectStatsTableProps) => {
  const theme = useTheme2();
  if (!stats || !stats.length) {
    return null;
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.heading)}>{name}</div>
      <table className="filter-table width-30">
        <tbody>
          {stats.map((stat, index) => {
            return (
              <tr key={`${stat.displayName}-${index}`}>
                <td>{stat.displayName}</td>
                <td {...stylex.props(styles.cell)}>{formatStat(stat, timeZone, theme)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

function formatStat(stat: QueryResultMetaStat, timeZone: TimeZone, theme: GrafanaTheme2): string {
  const display = getDisplayProcessor({
    field: {
      type: FieldType.number,
      config: stat,
    },
    theme,
    timeZone,
  });
  return formattedValueToString(display(stat.value));
}

const styles = stylex.create({
  heading: {
    fontSize: typography['--gf-typography-body-font-size'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  wrapper: {
    paddingBottom: spacing['--gf-spacing-x2'],
  },
  cell: {
    textAlign: 'right',
  },
});
