import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { wellStyles } from './Well.stylex';
import * as React from 'react';


type Props = React.HTMLAttributes<HTMLDivElement>;

export const Well = ({ children, className }: Props) => {
  return <div {...mergeStylexClassName(stylex.props(wellStyles.wrapper), className)}>{children}</div>;
};
