import * as stylex from '@stylexjs/stylex';
import { isArray, isObject, isUndefined } from 'lodash';

import { Icon } from '@grafana/ui';
import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

import { type Diff } from './utils';

type DiffProps = {
  diff: Diff;
};

export const DiffValues = ({ diff }: DiffProps) => {
  const hasLeftValue =
    !isUndefined(diff.originalValue) && !isArray(diff.originalValue) && !isObject(diff.originalValue);
  const hasRightValue = !isUndefined(diff.value) && !isArray(diff.value) && !isObject(diff.value);

  return (
    <>
      {hasLeftValue && <span {...stylex.props(styles.value)}>{String(diff.originalValue)}</span>}
      {hasLeftValue && hasRightValue ? <Icon name="arrow-right" /> : null}
      {hasRightValue && <span {...stylex.props(styles.value)}>{String(diff.value)}</span>}
    </>
  );
};

const styles = stylex.create({
  value: {
    backgroundColor: colors['--gf-colors-action-hover'],
    borderRadius: shape['--gf-shape-radius-default'],
    color: colors['--gf-colors-text-primary'],
    fontSize: typography['--gf-typography-body-font-size'],
    marginTop: 0,
    marginRight: spacing['--gf-spacing-x0-5'],
    marginBottom: 0,
    marginLeft: spacing['--gf-spacing-x0-5'],
    paddingTop: spacing['--gf-spacing-x0-25'],
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: spacing['--gf-spacing-x0-25'],
    paddingLeft: spacing['--gf-spacing-x0-5'],
  },
});
