import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import * as React from 'react';

import { mergeStylexProps } from '@grafana/ui/internal';
import { components, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  /** first-party StyleX overrides */
  xstyle?: StyleXStyles;
};

export const Well = ({ children, className, xstyle }: Props) => {
  return <div {...mergeStylexProps(stylex.props(styles.wrapper, xstyle), { className })}>{children}</div>;
};

const styles = stylex.create({
  wrapper: {
    backgroundColor: components['--gf-components-panel-background'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: components['--gf-components-input-border-color'],
    borderRadius: shape['--gf-shape-radius-default'],
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    fontFamily: typography['--gf-typography-font-family-monospace'],
  },
});
