import * as stylex from '@stylexjs/stylex';
import * as React from 'react';

import { type ThemeSpacingTokens } from '@grafana/data';

import { mergeStylexProps } from '../../../themes/stylex/mergeStylexProps';
import { type AlignItems, type Direction, type FlexProps, type JustifyContent, type Wrap } from '../types';
import { getSizeStyles, responsive, responsiveStyles, type SizeProps } from '../utils/responsiveStyles';
import { spacingValue } from '../utils/responsiveStylex';
import { type ResponsiveProp } from '../utils/responsiveness';

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
  // StackProps omits `style`, but callers may forward one at runtime; it must not replace the dynamic styles.
  const { style, ...domProps }: typeof rest & { style?: React.CSSProperties } = rest;

  return (
    <div
      ref={ref}
      {...mergeStylexProps(
        stylex.props(
          styles.flex,
          responsive(responsiveStyles.flexDirection, direction),
          responsive(responsiveStyles.flexWrap, wrap, toFlexWrap),
          responsive(responsiveStyles.alignItems, alignItems),
          responsive(responsiveStyles.justifyContent, justifyContent),
          responsive(responsiveStyles.gap, gap, spacingValue),
          responsive(responsiveStyles.rowGap, rowGap, spacingValue),
          responsive(responsiveStyles.columnGap, columnGap, spacingValue),
          responsive(responsiveStyles.flexGrow, grow),
          responsive(responsiveStyles.flexShrink, shrink),
          responsive(responsiveStyles.flexBasis, basis),
          responsive(responsiveStyles.flex, flex),
          getSizeStyles({ width, minWidth, maxWidth, height, minHeight, maxHeight })
        ),
        { style }
      )}
      {...domProps}
    >
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

const toFlexWrap = (value: Wrap) => (typeof value === 'boolean' ? (value ? 'wrap' : 'nowrap') : value);

const styles = stylex.create({
  flex: {
    display: 'flex',
  },
});
