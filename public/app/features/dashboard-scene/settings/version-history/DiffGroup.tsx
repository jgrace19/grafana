import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { diffGroupStyles } from './DiffGroup.stylex';
import { last } from 'lodash';


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
      <div {...stylex.props(diffGroupStyles.container)} data-testid="diffGroup">
        <DiffTitle title={title} diff={diffs[0]} />
      </div>
    );
  }

  return (
    <div {...stylex.props(diffGroupStyles.container)} data-testid="diffGroup">
      <DiffTitle title={title} />
      <ul {...stylex.props(diffGroupStyles.list)}>
        {diffs.map((diff: Diff, idx: number) => {
          return (
            <li {...stylex.props(diffGroupStyles.listItem)} key={`${last(diff.path)}__${idx}`}>
              <span>{getDiffText(diff)}</span> <DiffValues diff={diff} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

