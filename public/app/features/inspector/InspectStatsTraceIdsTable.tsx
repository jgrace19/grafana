import * as stylex from '@stylexjs/stylex';

import { spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

interface Props {
  name: string;
  traceIds: string[];
}

export const InspectStatsTraceIdsTable = ({ name, traceIds }: Props) => {
  if (traceIds.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.heading)}>{name}</div>
      <table className="filter-table width-30">
        <tbody>
          {traceIds.map((traceId, index) => {
            return (
              <tr key={`${traceId}-${index}`}>
                <td>{traceId}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles = stylex.create({
  heading: {
    fontSize: typography['--gf-typography-body-font-size'],
    marginBottom: spacing['--gf-spacing-x1'],
  },
  wrapper: {
    paddingBottom: spacing['--gf-spacing-x2'],
  },
});
