import * as stylex from '@stylexjs/stylex';

import { Icon } from '@grafana/ui';
import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

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
      <Icon type="mono" name="circle" xstyle={opStyles[diff.op]} size="xs" />{' '}
      <span {...stylex.props(styles.embolden)}>{title}</span> <span>{getDiffText(diff, diff.path?.length > 1)}</span>{' '}
      <DiffValues diff={diff} />
    </>
  ) : (
    <div {...stylex.props(styles.withoutDiff)}>
      <Icon type="mono" name="circle" xstyle={opStyles.replace} size="xs" />{' '}
      <span {...stylex.props(styles.embolden)}>{title}</span> <span>{getDiffText(replaceDiff, false)}</span>
    </div>
  );
};

const styles = stylex.create({
  embolden: {
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  withoutDiff: {
    marginBottom: spacing['--gf-spacing-x1'],
  },
});

const opStyles = stylex.create({
  add: {
    color: colors['--gf-colors-success-main'],
  },
  replace: {
    color: colors['--gf-colors-warning-main'],
  },
  move: {
    color: colors['--gf-colors-warning-main'],
  },
  copy: {
    color: colors['--gf-colors-success-main'],
  },
  _get: {
    color: colors['--gf-colors-success-main'],
  },
  test: {
    color: colors['--gf-colors-success-main'],
  },
  remove: {
    color: colors['--gf-colors-error-main'],
  },
});
