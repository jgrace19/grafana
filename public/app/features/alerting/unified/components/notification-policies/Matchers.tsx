import * as stylex from '@stylexjs/stylex';
import { take, takeRight, uniqueId } from 'lodash';
import { type FC } from 'react';

import { Stack, getTagColorsFromName } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';
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
            <div {...stylex.props(styles.metadata)}>{`and ${rest.length} more`}</div>
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
  const { color, borderColor } = getTagColorsFromName(matcher[0]);
  return (
    <div {...stylex.props(styles.matcherBase, styles.matcher(color, borderColor))}>
      {matcherFormatter[formatter](matcher)}
    </div>
  );
};

const styles = stylex.create({
  matcher: (color: string, borderColor: string) => ({
    color: '#fff',
    backgroundColor: color,
    borderColor,
  }),
  matcherBase: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.33)`,
    paddingRight: `calc(${spacing['--gf-spacing-grid-size']} * 0.66)`,
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.33)`,
    paddingLeft: `calc(${spacing['--gf-spacing-grid-size']} * 0.66)`,
    fontSize: typography['--gf-typography-body-small-font-size'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: `calc(${shape['--gf-shape-radius-default']} * 2)`,
    // Ensure we preserve whitespace, as otherwise it's not noticeable _at all_
    // when rendering the matcher, and is only noticeable when editing
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  metadata: {
    color: colors['--gf-colors-text-secondary'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
  },
});

export { Matchers };
