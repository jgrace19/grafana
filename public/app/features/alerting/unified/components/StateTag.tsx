import clsx from 'clsx';
import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { stateTagStyles } from './StateTag.stylex';
import { forwardRef } from 'react';
import * as React from 'react';


export type State = 'good' | 'bad' | 'warning' | 'neutral' | 'info';

type Props = React.PropsWithChildren<{
  state: State;
  size?: 'md' | 'sm';
  muted?: boolean;
}>;

export const StateTag = forwardRef<HTMLElement, Props>(({ children, state, size = 'md', muted = false }, ref) => {

  return (
    <span className={cx(stateTagStyles.common, styles[state], styles[size], { [stateTagStyles.muted]: muted })} ref={ref}>
      {children || state}
    </span>
  );
});

StateTag.displayName = 'StateTag';

