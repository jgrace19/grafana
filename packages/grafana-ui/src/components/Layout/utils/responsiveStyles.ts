import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';

import { bp } from '../../../themes/stylex/constants.stylex';

import { type ResponsiveArgs, responsiveArgs, spacingValue } from './responsiveStylex';
import { type ResponsiveProp } from './responsiveness';

export interface SizeProps {
  minWidth?: ResponsiveProp<Property.MinWidth<number>>;
  maxWidth?: ResponsiveProp<Property.MaxWidth<number>>;
  width?: ResponsiveProp<Property.Width<number>>;

  minHeight?: ResponsiveProp<Property.MinHeight<number>>;
  maxHeight?: ResponsiveProp<Property.MaxHeight<number>>;
  height?: ResponsiveProp<Property.Height<number>>;
}

type V = string | number | undefined;

/**
 * Applies a responsive dynamic style from `responsiveStyles` for a ResponsiveProp, or nothing when the prop
 * is unset. Skipping matters: a call with no values would unset the property for the whole `stylex.props()`
 * call and clobber an earlier alias (e.g. `marginX` before `marginLeft`).
 */
export function responsive<T, R>(
  style: (...args: ResponsiveArgs<V>) => R,
  prop: ResponsiveProp<T> | undefined
): R | null;
export function responsive<T, U extends V, R>(
  style: (...args: ResponsiveArgs<V>) => R,
  prop: ResponsiveProp<T> | undefined,
  map: (value: T) => U
): R | null;
export function responsive<T, U extends V, R>(
  style: (...args: ResponsiveArgs<V>) => R,
  prop: ResponsiveProp<T> | undefined,
  map?: (value: T) => U
): R | null {
  if (prop === undefined || prop === null) {
    return null;
  }
  const args: ResponsiveArgs<V> = map
    ? responsiveArgs(prop, map)
    : responsiveArgs(prop, (value) => (typeof value === 'number' || typeof value === 'string' ? value : undefined));
  return style(...args);
}

/** StyleX equivalent of getSizeStyles: every size prop goes through `theme.spacing()`. */
export function getSizeStyles({ width, minWidth, maxWidth, height, minHeight, maxHeight }: SizeProps) {
  return [
    responsive(responsiveStyles.width, width, spacingValue),
    responsive(responsiveStyles.minWidth, minWidth, spacingValue),
    responsive(responsiveStyles.maxWidth, maxWidth, spacingValue),
    responsive(responsiveStyles.height, height, spacingValue),
    responsive(responsiveStyles.minHeight, minHeight, spacingValue),
    responsive(responsiveStyles.maxHeight, maxHeight, spacingValue),
  ];
}

/**
 * One dynamic style per CSS property, shaped `(base, xs, sm, md, lg, xl, xxl)`: `base` is a plain value, the
 * others are `theme.breakpoints.up(key)` values. Shared by the layout primitives so they emit the same classes.
 */
export const responsiveStyles = stylex.create({
  display: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    display: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  position: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    position: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flexDirection: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flexDirection: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flexWrap: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flexWrap: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  alignItems: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    alignItems: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  justifyContent: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    justifyContent: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  gap: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    gap: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
  }),
  rowGap: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    rowGap: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  columnGap: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    columnGap: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  gridTemplateColumns: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    gridTemplateColumns: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flexGrow: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flexGrow: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flexShrink: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flexShrink: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flexBasis: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flexBasis: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  flex: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    flex: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
  }),
  margin: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    margin: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  marginTop: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    marginTop: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  marginBottom: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    marginBottom: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  marginLeft: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    marginLeft: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  marginRight: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    marginRight: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  padding: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    padding: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  paddingTop: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    paddingTop: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  paddingBottom: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    paddingBottom: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  paddingLeft: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
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
  paddingRight: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    paddingRight: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  backgroundColor: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    backgroundColor: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  borderStyle: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    borderStyle: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  borderColor: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    borderColor: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  borderRadius: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    borderRadius: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  boxShadow: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    boxShadow: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  width: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    width: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  minWidth: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    minWidth: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  maxWidth: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    maxWidth: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  height: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    height: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  minHeight: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    minHeight: {
      default: base,
      [bp.xsUp]: xs,
      [bp.smUp]: sm,
      [bp.mdUp]: md,
      [bp.lgUp]: lg,
      [bp.xlUp]: xl,
      [bp.xxlUp]: xxl,
    },
  }),
  maxHeight: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    maxHeight: {
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
