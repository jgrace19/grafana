import * as stylex from '@stylexjs/stylex';
import { mergeStylexClassName } from '@grafana/ui/unstable';
import { sectionFooterStyles } from './SectionFooter.stylex';
import * as React from 'react';


export function SectionFooter({ children }: React.PropsWithChildren<{}>) {

  return <div {...stylex.props(sectionFooterStyles.sectionFooter)}>{children && <div>{children}</div>}</div>;
}

