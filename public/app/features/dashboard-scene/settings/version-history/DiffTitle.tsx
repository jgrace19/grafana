import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { diffTitleStyles } from './DiffTitle.stylex';

import {Icon} from '@grafana/ui';

import { DiffValues } from './DiffValues';
import { type Diff, getDiffText } from './utils';

type DiffTitleProps = {
  diff?: Diff;
  title: string;
};

const replaceDiff: Diff = {
  op: 'replace',
  originalValue: undefined,
  path: [''],
  value: undefined,
  startLineNumber: 0,
  endLineNumber: 0,
};

export const DiffTitle = ({ diff, title }: DiffTitleProps) => {


  return diff ? (
    <>
      <Icon type="mono" name="circle" className={styles[diff.op]} size="xs" />{' '}
      <span {...stylex.props(diffTitleStyles.embolden)}>{title}</span> <span>{getDiffText(diff, diff.path?.length > 1)}</span>{' '}
      <DiffValues diff={diff} />
    </>
  ) : (
    <div {...stylex.props(diffTitleStyles.withoutDiff)}>
      <Icon type="mono" name="circle" {...stylex.props(diffTitleStyles.replace)} size="xs" />{' '}
      <span {...stylex.props(diffTitleStyles.embolden)}>{title}</span> <span>{getDiffText(replaceDiff, false)}</span>
    </div>
  );
};

