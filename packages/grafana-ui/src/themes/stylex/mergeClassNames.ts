import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';

type StyleXProps = ReturnType<typeof stylex.props>;

/**
 * Merge StyleX props with an optional external className (Emotion or plain).
 * Emotion overrides remain unlayered and win over layered StyleX when specificity matches.
 */
export function mergeStylexClassName(stylexResult: StyleXProps, className?: string): StyleXProps {
  if (!className) {
    return stylexResult;
  }
  return {
    ...stylexResult,
    className: clsx(stylexResult.className, className),
  };
}
