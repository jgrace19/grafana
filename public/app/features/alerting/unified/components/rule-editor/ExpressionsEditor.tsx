import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';

import { type PanelData } from '@grafana/data';
import { spacing } from '@grafana/ui/stylex/tokens.stylex';
import { isExpressionQuery } from 'app/features/expressions/guards';
import { type ExpressionQuery } from 'app/features/expressions/types';
import { type AlertQuery } from 'app/types/unified-alerting-dto';

import { Expression } from '../expressions/Expression';

import { errorFromCurrentCondition, errorFromPreviewData, warningFromSeries } from './util';

interface Props {
  condition: string | null;
  onSetCondition: (refId: string) => void;
  panelData: Record<string, PanelData | undefined>;
  queries: AlertQuery[];
  onRemoveExpression: (refId: string) => void;
  onUpdateRefId: (oldRefId: string, newRefId: string) => void;
  onUpdateQueryExpression: (query: ExpressionQuery) => void;
}

export const ExpressionsEditor = ({
  condition,
  onSetCondition,
  queries,
  panelData,
  onUpdateRefId,
  onRemoveExpression,
  onUpdateQueryExpression,
}: Props) => {
  const expressionQueries = useMemo(() => {
    return queries.reduce((acc: ExpressionQuery[], query) => {
      if (isExpressionQuery(query.model)) {
        acc.push(query.model);
      }

      return acc;
    }, []);
  }, [queries]);
  return (
    <div {...stylex.props(styles.wrapper)}>
      {expressionQueries.map((query) => {
        const data = panelData[query.refId];

        const isAlertCondition = condition === query.refId;

        const errorFromCondition = data && isAlertCondition ? errorFromCurrentCondition(data) : undefined;
        const errorFromPreview = data ? errorFromPreviewData(data) : undefined;
        const error = errorFromPreview || errorFromCondition;

        const warning = data ? warningFromSeries(data.series) : undefined;

        return (
          <Expression
            key={query.refId}
            isAlertCondition={isAlertCondition}
            data={data}
            error={error}
            warning={warning}
            queries={queries}
            query={query}
            onSetCondition={onSetCondition}
            onRemoveExpression={onRemoveExpression}
            onUpdateRefId={onUpdateRefId}
            onChangeQuery={onUpdateQueryExpression}
          />
        );
      })}
    </div>
  );
};
const styles = stylex.create({
  wrapper: {
    display: 'flex',
    gap: spacing['--gf-spacing-x2'],
    alignContent: 'stretch',
    flexWrap: 'wrap',
  },
});
