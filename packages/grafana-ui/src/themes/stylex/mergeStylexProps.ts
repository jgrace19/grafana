import type * as stylex from '@stylexjs/stylex';
import { clsx } from 'clsx';
import type * as React from 'react';

type StylexProps = ReturnType<typeof stylex.props>;

/**
 * Combines `stylex.props(...)` with a consumer's `className` / `style` so existing component APIs keep working.
 * Consumer values are applied last, matching the previous `cx(styles.x, className)` override order.
 */
export function mergeStylexProps(
  { className, style }: StylexProps,
  consumerClassName?: string,
  consumerStyle?: React.CSSProperties
): { className: string | undefined; style: React.CSSProperties | undefined } {
  return {
    className: clsx(className, consumerClassName) || undefined,
    style: style || consumerStyle ? { ...style, ...consumerStyle } : undefined,
  };
}
