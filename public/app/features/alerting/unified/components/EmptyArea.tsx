import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors, shape, spacing } from '@grafana/ui/stylex/tokens.stylex';

export const EmptyArea = ({ children }: React.PropsWithChildren<{}>) => {
  return <div {...stylex.props(styles.container)}>{children}</div>;
};

const styles = stylex.create({
  container: {
    borderRadius: shape['--gf-shape-radius-lg'],
    backgroundColor: colors['--gf-colors-background-secondary'],
    color: colors['--gf-colors-text-secondary'],
    padding: spacing['--gf-spacing-x4'],
    textAlign: 'center',
  },
});
