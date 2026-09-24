import * as stylex from '@stylexjs/stylex';

import { type PanelData } from '@grafana/data';
import { colors } from '@grafana/ui/stylex/tokens.stylex';
import { type AlertQuery } from 'app/types/unified-alerting-dto';

import { QueryRows } from './QueryRows';

interface Props {
  panelData: Record<string, PanelData>;
  queries: AlertQuery[];
  expressions: AlertQuery[];
  onRunQueries: () => void;
  onChangeQueries: (queries: AlertQuery[]) => void;
  onDuplicateQuery: (query: AlertQuery) => void;
  condition: string | null;
  onSetCondition: (refId: string) => void;
}

export const QueryEditor = ({
  queries,
  expressions,
  panelData,
  onRunQueries,
  onChangeQueries,
  onDuplicateQuery,
  condition,
  onSetCondition,
}: Props) => {
  return (
    <div {...stylex.props(styles.container)}>
      <QueryRows
        data={panelData}
        queries={queries}
        expressions={expressions}
        onRunQueries={onRunQueries}
        onQueriesChange={onChangeQueries}
        onDuplicateQuery={onDuplicateQuery}
        condition={condition}
        onSetCondition={onSetCondition}
      />
    </div>
  );
};

const styles = stylex.create({
  container: {
    backgroundColor: colors['--gf-colors-background-primary'],
    height: '100%',
  },
});
