import * as stylex from '@stylexjs/stylex';
import { last } from 'lodash';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

import { DiffTitle } from './DiffTitle';
import { DiffValues } from './DiffValues';
import { type Diff, getDiffText } from './utils';

type DiffGroupProps = {
  diffs: Diff[];
  title: string;
};

export const DiffGroup = ({ diffs, title }: DiffGroupProps) => {
  if (diffs.length === 1) {
    return (
      <div data-testid="diffGroup">
        <DiffTitle title={title} diff={diffs[0]} />
      </div>
    );
  }

  return (
    <div data-testid="diffGroup">
      <DiffTitle title={title} />
      <ul {...stylex.props(styles.list)}>
        {diffs.map((diff: Diff, idx: number) => {
          return (
            <li {...stylex.props(styles.listItem)} key={`${last(diff.path)}__${idx}`}>
              <span>{getDiffText(diff)}</span> <DiffValues diff={diff} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = stylex.create({
  list: {
    marginLeft: spacing['--gf-spacing-x4'],
  },
  listItem: {
    marginBottom: { default: spacing['--gf-spacing-x1'], ':last-child': 0 },
  },
});
