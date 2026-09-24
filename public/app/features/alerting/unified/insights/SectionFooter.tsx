import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { spacing } from '@grafana/ui/stylex/tokens.stylex';

export function SectionFooter({ children }: React.PropsWithChildren<{}>) {
  return <div {...stylex.props(styles.sectionFooter)}>{children && <div>{children}</div>}</div>;
}

const styles = stylex.create({
  sectionFooter: {
    marginBottom: spacing['--gf-spacing-x2'],
  },
});
