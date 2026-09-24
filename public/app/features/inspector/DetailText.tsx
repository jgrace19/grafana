import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { colors, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export const DetailText = ({ children }: React.PropsWithChildren<{}>) => {
  return <div {...stylex.props(styles.collapsedText)}>{children}</div>;
};

const styles = stylex.create({
  collapsedText: {
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x2'],
    paddingBottom: 0,
    paddingLeft: spacing['--gf-spacing-x2'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    color: colors['--gf-colors-text-secondary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
