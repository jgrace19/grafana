import * as stylex from '@stylexjs/stylex';

import { TagList } from '@grafana/ui';
import { type Matcher } from 'app/plugins/datasource/alertmanager/types';

import { matcherToOperator } from '../../utils/alertmanager';

type MatchersProps = { matchers: Matcher[] };

export const Matchers = ({ matchers }: MatchersProps) => {
  return (
    <div>
      <TagList
        {...stylex.props(matchersStyles.tags)}
        tags={matchers.map((matcher) => `${matcher.name}${matcherToOperator(matcher)}${matcher.value}`)}
      />
    </div>
  );
};

