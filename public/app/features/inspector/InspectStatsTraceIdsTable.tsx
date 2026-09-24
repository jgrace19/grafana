
import { } from '@grafana/ui';

interface Props {
  name: string;
  traceIds: string[];
}

export const InspectStatsTraceIdsTable = ({ name, traceIds }: Props) => {
  const styles = (getStyles);

  if (traceIds.length === 0) {
    return null;
  }

  return (
    <div {...stylex.props(inspectStatsTraceIdsTableStyles.wrapper)}>
      <div {...stylex.props(inspectStatsTraceIdsTableStyles.heading)}>{name}</div>
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

