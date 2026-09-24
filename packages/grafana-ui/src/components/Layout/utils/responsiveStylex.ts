import { type ResponsiveProp } from './responsiveness';

/** `[base, xs, sm, md, lg, xl, xxl]`, the arguments of a responsive StyleX dynamic style. */
export type ResponsiveArgs<V> = [
  V | undefined,
  V | undefined,
  V | undefined,
  V | undefined,
  V | undefined,
  V | undefined,
  V | undefined,
];

/**
 * Spreads a ResponsiveProp into the arguments of a dynamic style shaped like
 * `(base, xs, sm, md, lg, xl, xxl) => ({ prop: { default: base, [bp.xsUp]: xs, … } })`.
 * A plain value becomes `base`; a responsive object fills the breakpoint slots. Undefined slots emit no class,
 * which matches getResponsiveStyle (a breakpoint without a value inherits the previous one).
 */
export function responsiveArgs<T>(prop: ResponsiveProp<T> | undefined | null): ResponsiveArgs<T>;
export function responsiveArgs<T, V>(
  prop: ResponsiveProp<T> | undefined | null,
  map: (value: T) => V
): ResponsiveArgs<V>;
export function responsiveArgs<T, V>(
  prop: ResponsiveProp<T> | undefined | null,
  map?: (value: T) => V
): ResponsiveArgs<T | V> {
  const apply = (value: T | undefined | null) =>
    value === undefined || value === null ? undefined : map ? map(value) : value;

  if (prop === undefined || prop === null) {
    return [undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  }
  if (typeof prop !== 'object' || !('xs' in prop)) {
    return [apply(prop), undefined, undefined, undefined, undefined, undefined, undefined];
  }
  return [undefined, apply(prop.xs), apply(prop.sm), apply(prop.md), apply(prop.lg), apply(prop.xl), apply(prop.xxl)];
}

/**
 * Equivalent of `theme.spacing(value)` as a CSS value on the `--gf-spacing-grid-size` token. Built as a
 * string rather than read from the token objects, so no token object has to ship in the JS bundle.
 */
export function spacingValue(value: number | string): string {
  if (typeof value === 'string') {
    return value;
  }
  return `calc(var(--gf-spacing-grid-size) * ${value})`;
}
