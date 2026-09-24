import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { detailTextStyles } from './DetailText.stylex';
import * as React from 'react';



export const DetailText = ({ children }: React.PropsWithChildren<{}>) => {
  const collapsedTextStyles = (getStyles);
  return <div className={collapsedTextStyles}>{children}</div>;
};
