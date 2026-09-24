import * as stylex from '@stylexjs/stylex';
import { stackStyles } from './Stack.stylex';

import { type CSSProperties } from 'react';
import * as React from 'react';


interface StackProps {
  direction?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  wrap?: boolean;
  gap?: number;
  flexGrow?: CSSProperties['flexGrow'];
  children: React.ReactNode;
}

export function Stack(props: StackProps) {
  return <div {...stylex.props(stackStyles.root)}>{props.children}</div>;
}

