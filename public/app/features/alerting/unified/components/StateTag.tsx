import * as stylex from '@stylexjs/stylex';
import { forwardRef } from 'react';
import * as React from 'react';

import { colors, shape, spacing, typography } from '@grafana/ui/stylex/tokens.stylex';

export type State = 'good' | 'bad' | 'warning' | 'neutral' | 'info';

type Props = React.PropsWithChildren<{
  state: State;
  size?: 'md' | 'sm';
  muted?: boolean;
}>;

export const StateTag = forwardRef<HTMLElement, Props>(({ children, state, size = 'md', muted = false }, ref) => {
  return (
    <span {...stylex.props(styles.common, stateStyles[state], sizeStyles[size], muted && styles.muted)} ref={ref}>
      {children || state}
    </span>
  );
});

StateTag.displayName = 'StateTag';

const styles = stylex.create({
  common: {
    display: 'inline-block',
    color: 'white',
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    fontSize: typography['--gf-typography-size-sm'],
    textTransform: 'capitalize',
    lineHeight: 1.2,
    textAlign: 'center',
    fontWeight: typography['--gf-typography-font-weight-bold'],
  },
  muted: {
    opacity: '0.5',
  },
});

const stateStyles = stylex.create({
  good: {
    backgroundColor: colors['--gf-colors-success-main'],
    borderColor: colors['--gf-colors-success-main'],
    color: colors['--gf-colors-success-contrast-text'],
  },
  warning: {
    backgroundColor: colors['--gf-colors-warning-main'],
    borderColor: colors['--gf-colors-warning-main'],
    color: colors['--gf-colors-warning-contrast-text'],
  },
  bad: {
    backgroundColor: colors['--gf-colors-error-main'],
    borderColor: colors['--gf-colors-error-main'],
    color: colors['--gf-colors-error-contrast-text'],
  },
  neutral: {
    backgroundColor: colors['--gf-colors-secondary-main'],
    borderColor: colors['--gf-colors-secondary-main'],
    color: colors['--gf-colors-secondary-contrast-text'],
  },
  info: {
    backgroundColor: colors['--gf-colors-primary-main'],
    borderColor: colors['--gf-colors-primary-main'],
    color: colors['--gf-colors-primary-contrast-text'],
  },
});

const sizeStyles = stylex.create({
  md: {
    paddingTop: spacing['--gf-spacing-x0-5'],
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: spacing['--gf-spacing-x0-5'],
    paddingLeft: spacing['--gf-spacing-x1'],
    minWidth: spacing['--gf-spacing-x8'],
  },
  sm: {
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.3)`,
    paddingRight: spacing['--gf-spacing-x0-5'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.3)`,
    paddingLeft: spacing['--gf-spacing-x0-5'],
    minWidth: '52px',
  },
});
