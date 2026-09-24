import { clsx } from 'clsx';
import { type CSSProperties } from 'react';

interface ClassNameAndStyle {
  className?: string;
  style?: CSSProperties;
}

/**
 * Merges `stylex.props(...)` output with a component's public `className` / `style` props.
 * Never spread `stylex.props()` next to a `className` prop: the spread overwrites it.
 *
 * @internal
 */
export function mergeStylexProps(sx: ClassNameAndStyle, own: ClassNameAndStyle): ClassNameAndStyle {
  return {
    className: clsx(sx.className, own.className) || undefined,
    style: own.style ? { ...sx.style, ...own.style } : sx.style,
  };
}
