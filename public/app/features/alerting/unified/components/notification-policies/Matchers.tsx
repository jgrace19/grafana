import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { matchersStyles } from './Matchers.stylex';
import { take, takeRight, uniqueId } from 'lodash';
import { type FC } from 'react';

import { Stack, getTagColorsFromName } from '@grafana/ui';
import { type ObjectMatcher } from 'app/plugins/datasource/alertmanager/types';

import { type MatcherFormatter, matcherFormatter } from '../../utils/matchers';
import { PopupCard } from '../HoverCard';

type MatchersProps = { matchers: ObjectMatcher[]; formatter?: MatcherFormatter };

// renders the first N number of matchers
const Matchers: FC<MatchersProps> = ({ matchers, formatter = 'default' }) => {

  const NUM_MATCHERS = 5;

  const firstFew = take(matchers, NUM_MATCHERS);
  const rest = takeRight(matchers, matchers.length - NUM_MATCHERS);
  const hasMoreMatchers = rest.length > 0;

  return (
    <Stack direction="row" gap={1} alignItems="center" wrap="wrap" data-testid="label-matchers">
      {firstFew.map((matcher) => (
        <MatcherBadge key={uniqueId()} matcher={matcher} formatter={formatter} />
      ))}
      {hasMoreMatchers && (
        <PopupCard
          arrow
          placement="top"
          content={
            <Stack direction="column" gap={1} alignItems="start" justifyContent="start">
              {rest.map((matcher) => (
                <MatcherBadge key={uniqueId()} matcher={matcher} />
              ))}
            </Stack>
          }
        >
          <span>
            <div {...stylex.props(matchersStyles.metadata)}>{`and ${rest.length} more`}</div>
          </span>
        </PopupCard>
      )}
    </Stack>
  );
};

interface MatcherBadgeProps {
  matcher: ObjectMatcher;
  formatter?: MatcherFormatter;
}

export const MatcherBadge: FC<MatcherBadgeProps> = ({ matcher, formatter = 'default' }) => {

  return <div className={matchersStyles.matcher(matcher[0]).wrapper}>{matcherFormatter[formatter](matcher)}</div>;
};


export { Matchers };
