import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { diffValuesStyles } from './DiffValues.stylex';
import { isArray, isObject, isUndefined } from 'lodash';

import { Icon } from '@grafana/ui';

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
      {hasLeftValue && <span {...stylex.props(diffValuesStyles.root)}>{String(diff.originalValue)}</span>}
      {hasLeftValue && hasRightValue ? <Icon name="arrow-right" /> : null}
      {hasRightValue && <span {...stylex.props(diffValuesStyles.root)}>{String(diff.value)}</span>}
    </>
  );
};

