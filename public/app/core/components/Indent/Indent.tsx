import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type ThemeSpacingTokens } from '@grafana/data';
import { type ResponsiveProp } from '@grafana/ui/internal';
import { bp } from '@grafana/ui/stylex/constants.stylex';

interface IndentProps {
  children?: React.ReactNode;
  level: number;
  spacing: ResponsiveProp<ThemeSpacingTokens>;
}

export function Indent({ children, spacing, level }: IndentProps) {
  return <span {...stylex.props(styles.indentor(...getPaddings(spacing, level)))}>{children}</span>;
}

type Padding = string | undefined;
type Paddings = [Padding, Padding, Padding, Padding, Padding, Padding, Padding];

/** `[base, xs, sm, md, lg, xl, xxl]` padding values; a breakpoint without a value inherits the previous one. */
function getPaddings(spacing: IndentProps['spacing'], level: number): Paddings {
  const toPadding = (value: ThemeSpacingTokens | undefined) =>
    value === undefined ? undefined : `calc(var(--gf-spacing-grid-size) * ${value * level})`;

  if (typeof spacing !== 'object' || !('xs' in spacing)) {
    return [toPadding(spacing), undefined, undefined, undefined, undefined, undefined, undefined];
  }
  return [
    undefined,
    toPadding(spacing.xs),
    toPadding(spacing.sm),
    toPadding(spacing.md),
    toPadding(spacing.lg),
    toPadding(spacing.xl),
    toPadding(spacing.xxl),
  ];
}

const styles = stylex.create({
  indentor: (base: Padding, xs: Padding, sm: Padding, md: Padding, lg: Padding, xl: Padding, xxl: Padding) => ({
    paddingLeft: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
});
