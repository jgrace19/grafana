import { TagList } from '@grafana/ui';
import { type Matcher } from 'app/plugins/datasource/alertmanager/types';

import { matcherToOperator } from '../../utils/alertmanager';

import './Matchers.css';

type MatchersProps = { matchers: Matcher[] };

export const Matchers = ({ matchers }: MatchersProps) => {
  return (
    <div>
      <TagList
        className="gf-alerting-silence-matchers"
        tags={matchers.map((matcher) => `${matcher.name}${matcherToOperator(matcher)}${matcher.value}`)}
      />
    </div>
  );
};
