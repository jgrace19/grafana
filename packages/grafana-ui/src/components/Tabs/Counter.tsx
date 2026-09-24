import * as stylex from '@stylexjs/stylex';

import { locale } from '@grafana/data';

import { colors, spacing, typography } from '../../themes/stylex/tokens.stylex';

type CounterVariant = 'primary' | 'secondary';
export interface CounterProps {
  value: number;
  variant?: CounterVariant;
}

export const Counter = ({ value, variant = 'secondary' }: CounterProps) => {
  return <span {...stylex.props(styles.counter, variantStyles[variant])}>{locale(value, 0).text}</span>;
};

const styles = stylex.create({
  counter: {
    marginLeft: spacing['--gf-spacing-grid-size'],
    borderRadius: `calc(${spacing['--gf-spacing-grid-size']} * 3)`,
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingRight: spacing['--gf-spacing-grid-size'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} * 0.25)`,
    paddingLeft: spacing['--gf-spacing-grid-size'],
    color: colors['--gf-colors-text-secondary'],
    fontWeight: typography['--gf-typography-font-weight-medium'],
    fontSize: typography['--gf-typography-size-sm'],
  },
});

const variantStyles = stylex.create({
  primary: {
    backgroundColor: colors['--gf-colors-primary-main'],
  },
  secondary: {
    backgroundColor: colors['--gf-colors-secondary-main'],
  },
});
