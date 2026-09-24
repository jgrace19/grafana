import * as stylex from '@stylexjs/stylex';
import { queryPatternStyles } from './QueryPattern.stylex';

import { RawQuery } from '@grafana/plugin-ui';
import { Button, Card } from '@grafana/ui';

import logqlGrammar from '../../syntax';
import { lokiQueryModeller } from '../LokiQueryModeller';
import { type LokiQueryPattern } from '../types';

type Props = {
  pattern: LokiQueryPattern;
  hasNewQueryOption: boolean;
  hasPreviousQuery: boolean;
  selectedPatternName: string | null;
  setSelectedPatternName: (name: string | null) => void;
  onPatternSelect: (pattern: LokiQueryPattern, selectAsNewQuery?: boolean) => void;
};

export const QueryPattern = (props: Props) => {
  const { pattern, onPatternSelect, hasNewQueryOption, hasPreviousQuery, selectedPatternName, setSelectedPatternName } =
    props;
  const lang = { grammar: logqlGrammar, name: 'logql' };

  return (
    <Card noMargin {...stylex.props(queryPatternStyles.card)}>
      <Card.Heading>{pattern.name}</Card.Heading>
      <div {...stylex.props(queryPatternStyles.rawQueryContainer)}>
        <RawQuery
          query={lokiQueryModeller.renderQuery({ labels: [], operations: pattern.operations })}
          language={lang}
          {...stylex.props(queryPatternStyles.rawQuery)}
        />
      </div>
      <Card.Actions>
        {selectedPatternName !== pattern.name ? (
          <Button
            size="sm"
            onClick={() => {
              if (hasPreviousQuery) {
                // If user has previous query, we need to confirm that they want to replace it
                setSelectedPatternName(pattern.name);
              } else {
                onPatternSelect(pattern);
              }
            }}
          >
            Use this query
          </Button>
        ) : (
          <>
            <div {...stylex.props(queryPatternStyles.spacing)}>
              {`If you would like to use this query, ${
                hasNewQueryOption
                  ? 'you can either replace your current query or create a new query'
                  : 'your current query will be replaced'
              }.`}
            </div>
            <Button size="sm" fill="outline" onClick={() => setSelectedPatternName(null)}>
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onPatternSelect(pattern);
              }}
            >
              Apply to query
            </Button>
            {hasNewQueryOption && (
              <Button
                size="sm"
                onClick={() => {
                  onPatternSelect(pattern, true);
                }}
              >
                Create new query
              </Button>
            )}
          </>
        )}
      </Card.Actions>
    </Card>
  );
};

;
