import { mergeStylexClassName } from '@grafana/ui/unstable';
import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';


export interface Props {
  className?: string;
  leftActionsSeparator?: boolean;
}

export function NavToolbarSeparator({ className, leftActionsSeparator }: Props) {

  if (leftActionsSeparator) {
    return <div {...mergeStylexClassName(stylex.props(navToolbarSeparatorStyles.leftActionsSeparator, className, ), undefined)} />;
  }

  return <div {...mergeStylexClassName(stylex.props(navToolbarSeparatorStyles.line, className, ), undefined)} />;
}

