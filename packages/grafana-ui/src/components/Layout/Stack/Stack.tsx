import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type ThemeSpacingTokens } from '@grafana/data';

import { bp } from '../../../themes/stylex/constants.stylex';
import { type AlignItems, type Direction, type FlexProps, type JustifyContent, type Wrap } from '../types';
import { responsiveArgs, spacingValue } from '../utils/responsiveStylex';
import { type ResponsiveProp } from '../utils/responsiveness';
import { getSizeStyles } from '../utils/sizeStyles';
import { type SizeProps } from '../utils/styles';

interface StackProps extends FlexProps, SizeProps, Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  gap?: ResponsiveProp<ThemeSpacingTokens>;
  rowGap?: ResponsiveProp<ThemeSpacingTokens>;
  columnGap?: ResponsiveProp<ThemeSpacingTokens>;
  alignItems?: ResponsiveProp<AlignItems>;
  justifyContent?: ResponsiveProp<JustifyContent>;
  direction?: ResponsiveProp<Direction>;
  wrap?: ResponsiveProp<Wrap>;
  children?: React.ReactNode;
}

/**
 * The Stack component is a simple wrapper around the flexbox layout model that allows to easily create responsive and flexible layouts. It provides a simple and intuitive way to align and distribute items within a container either horizontally or vertically.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-stack--docs
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    gap = 1,
    rowGap,
    columnGap,
    alignItems,
    justifyContent,
    direction,
    wrap,
    children,
    grow,
    shrink,
    basis,
    flex,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      {...stylex.props(
        styles.flex,
        styles.flexDirection(...responsiveArgs(direction)),
        styles.flexWrap(...responsiveArgs(wrap, toFlexWrap)),
        styles.alignItems(...responsiveArgs(alignItems)),
        styles.justifyContent(...responsiveArgs(justifyContent)),
        styles.gap(...responsiveArgs(gap, spacingValue)),
        styles.rowGap(...responsiveArgs(rowGap, spacingValue)),
        styles.columnGap(...responsiveArgs(columnGap, spacingValue)),
        styles.flexGrow(...responsiveArgs(grow)),
        styles.flexShrink(...responsiveArgs(shrink)),
        styles.flexBasis(...responsiveArgs(basis)),
        styles.flexShorthand(...responsiveArgs(flex)),
        getSizeStyles({ width, minWidth, maxWidth, height, minHeight, maxHeight })
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

const toFlexWrap = (value: Wrap) => (typeof value === 'boolean' ? (value ? 'wrap' : 'nowrap') : value);

type S = string | undefined;
type N = number | undefined;
type SN = string | number | undefined;

const styles = stylex.create({
  flex: {
    display: 'flex',
  },
  flexDirection: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  flexWrap: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  alignItems: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  justifyContent: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  gap: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
    gap: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
  }),
  rowGap: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  columnGap: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  flexGrow: (base: N, xs: N, sm: N, md: N, lg: N, xl: N, xxl: N) => ({
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
  flexShrink: (base: N, xs: N, sm: N, md: N, lg: N, xl: N, xxl: N) => ({
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
  flexBasis: (base: S, xs: S, sm: S, md: S, lg: S, xl: S, xxl: S) => ({
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
  flexShorthand: (base: SN, xs: SN, sm: SN, md: SN, lg: SN, xl: SN, xxl: SN) => ({
    flex: { default: base, [bp.xsUp]: xs, [bp.smUp]: sm, [bp.mdUp]: md, [bp.lgUp]: lg, [bp.xlUp]: xl, [bp.xxlUp]: xxl },
  }),
});
