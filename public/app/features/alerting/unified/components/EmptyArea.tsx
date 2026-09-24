import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { emptyAreaStyles } from './EmptyArea.stylex';
import * as React from 'react';


export const EmptyArea = ({ children }: React.PropsWithChildren<{}>) => {

  return <div {...stylex.props(emptyAreaStyles.container)}>{children}</div>;
};

