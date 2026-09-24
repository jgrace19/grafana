import * as stylex from '@stylexjs/stylex';

import { bp } from '../../../themes/stylex/constants.stylex';

import { responsiveArgs, spacingValue } from './responsiveStylex';
import { type SizeProps } from './styles';

/** StyleX equivalent of getSizeStyles: every size prop goes through `theme.spacing()`. */
export function getSizeStyles({ width, minWidth, maxWidth, height, minHeight, maxHeight }: SizeProps) {
  return [
    sizeStyles.width(...responsiveArgs(width, spacingValue)),
    sizeStyles.minWidth(...responsiveArgs(minWidth, spacingValue)),
    sizeStyles.maxWidth(...responsiveArgs(maxWidth, spacingValue)),
    sizeStyles.height(...responsiveArgs(height, spacingValue)),
    sizeStyles.minHeight(...responsiveArgs(minHeight, spacingValue)),
    sizeStyles.maxHeight(...responsiveArgs(maxHeight, spacingValue)),
  ];
}

type V = string | undefined;

const sizeStyles = stylex.create({
  width: (base: V, xs: V, sm: V, md: V, lg: V, xl: V, xxl: V) => ({
    width: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
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
    height: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
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
