import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';
import { type ElementType, forwardRef, type PropsWithChildren } from 'react';
import * as React from 'react';

import { type GrafanaTheme2, type ThemeSpacingTokens, type ThemeShape, type ThemeShadows } from '@grafana/data';

import { type AlignItems, type Direction, type FlexProps, type JustifyContent } from '../types';
import { getSizeStyles, responsive, responsiveStyles, type SizeProps } from '../utils/responsiveStyles';
import { spacingValue } from '../utils/responsiveStylex';
import { type ResponsiveProp } from '../utils/responsiveness';

type Display = 'flex' | 'block' | 'inline' | 'inline-block' | 'none';
export type BackgroundColor = keyof GrafanaTheme2['colors']['background'] | 'error' | 'success' | 'warning' | 'info';
export type BorderStyle = 'solid' | 'dashed';
export type BorderColor = keyof GrafanaTheme2['colors']['border'] | 'error' | 'success' | 'warning' | 'info';
export type BorderRadius = keyof ThemeShape['radius'];
export type BoxShadow = keyof ThemeShadows;

export interface BoxProps extends FlexProps, SizeProps, Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  // Margin props
  /** Sets the property `margin` */
  margin?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the properties `margin-top` and `margin-bottom`. Higher priority than margin. */
  marginX?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the properties `margin-left` and `margin-right`. Higher priority than margin. */
  marginY?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `margin-top`. Higher priority than margin and marginY. */
  marginTop?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `margin-bottom`. Higher priority than margin and marginXY */
  marginBottom?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `margin-left`. Higher priority than margin and marginX. */
  marginLeft?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `margin-right`. Higher priority than margin and marginX. */
  marginRight?: ResponsiveProp<ThemeSpacingTokens>;

  // Padding props
  /** Sets the property `padding` */
  padding?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the properties `padding-top` and `padding-bottom`. Higher priority than padding. */
  paddingX?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the properties `padding-left` and `padding-right`. Higher priority than padding. */
  paddingY?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `padding-top`. Higher priority than padding and paddingY. */
  paddingTop?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `padding-bottom`. Higher priority than padding and paddingY. */
  paddingBottom?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `padding-left`. Higher priority than padding and paddingX. */
  paddingLeft?: ResponsiveProp<ThemeSpacingTokens>;
  /** Sets the property `padding-right`. Higher priority than padding and paddingX. */
  paddingRight?: ResponsiveProp<ThemeSpacingTokens>;

  // Border Props
  borderStyle?: ResponsiveProp<BorderStyle>;
  borderColor?: ResponsiveProp<BorderColor>;
  borderRadius?: ResponsiveProp<BorderRadius>;

  // Flex Props
  alignItems?: ResponsiveProp<AlignItems>;
  direction?: ResponsiveProp<Direction>;
  justifyContent?: ResponsiveProp<JustifyContent>;
  gap?: ResponsiveProp<ThemeSpacingTokens>;

  // Other props
  backgroundColor?: ResponsiveProp<BackgroundColor>;
  display?: ResponsiveProp<Display>;
  boxShadow?: ResponsiveProp<BoxShadow>;
  /** Sets the HTML element that will be rendered as a Box. Defaults to 'div' */
  element?: ElementType;
  position?: ResponsiveProp<Property.Position>;
}

/**
 * The Box Component is the most basic layout component. It can be used to build more complex components and layouts with properties that use our design tokens instead of using CSS.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-box--docs
 */
export const Box = forwardRef<HTMLElement, PropsWithChildren<BoxProps>>((props, ref) => {
  const {
    children,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    display,
    backgroundColor,
    grow,
    shrink,
    basis,
    flex,
    borderColor,
    borderStyle,
    borderRadius,
    direction,
    justifyContent,
    alignItems,
    boxShadow,
    element,
    gap,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    position,
    ...rest
  } = props;
  const Element = element ?? 'div';

  return (
    <Element
      ref={ref}
      {...stylex.props(
        responsive(responsiveStyles.margin, margin, spacingValue),
        responsive(responsiveStyles.marginLeft, marginX, spacingValue),
        responsive(responsiveStyles.marginRight, marginX, spacingValue),
        responsive(responsiveStyles.marginTop, marginY, spacingValue),
        responsive(responsiveStyles.marginBottom, marginY, spacingValue),
        responsive(responsiveStyles.marginTop, marginTop, spacingValue),
        responsive(responsiveStyles.marginBottom, marginBottom, spacingValue),
        responsive(responsiveStyles.marginLeft, marginLeft, spacingValue),
        responsive(responsiveStyles.marginRight, marginRight, spacingValue),
        responsive(responsiveStyles.padding, padding, spacingValue),
        responsive(responsiveStyles.paddingLeft, paddingX, spacingValue),
        responsive(responsiveStyles.paddingRight, paddingX, spacingValue),
        responsive(responsiveStyles.paddingTop, paddingY, spacingValue),
        responsive(responsiveStyles.paddingBottom, paddingY, spacingValue),
        responsive(responsiveStyles.paddingTop, paddingTop, spacingValue),
        responsive(responsiveStyles.paddingBottom, paddingBottom, spacingValue),
        responsive(responsiveStyles.paddingLeft, paddingLeft, spacingValue),
        responsive(responsiveStyles.paddingRight, paddingRight, spacingValue),
        responsive(responsiveStyles.display, display),
        responsive(responsiveStyles.backgroundColor, backgroundColor, backgroundColorValue),
        responsive(responsiveStyles.flexDirection, direction),
        responsive(responsiveStyles.flexGrow, grow),
        responsive(responsiveStyles.flexShrink, shrink),
        responsive(responsiveStyles.flexBasis, basis),
        responsive(responsiveStyles.flex, flex),
        responsive(responsiveStyles.borderStyle, borderStyle),
        responsive(responsiveStyles.borderColor, borderColor, borderColorValue),
        (borderStyle || borderColor) && styles.borderWidth,
        responsive(responsiveStyles.justifyContent, justifyContent),
        responsive(responsiveStyles.alignItems, alignItems),
        responsive(responsiveStyles.borderRadius, borderRadius, (radius) => `var(--gf-shape-radius-${radius})`),
        responsive(responsiveStyles.boxShadow, boxShadow, (shadow) => `var(--gf-shadows-${shadow})`),
        responsive(responsiveStyles.gap, gap, spacingValue),
        responsive(responsiveStyles.position, position),
        getSizeStyles({ width, minWidth, maxWidth, height, minHeight, maxHeight })
      )}
      {...rest}
    >
      {children}
    </Element>
  );
});

Box.displayName = 'Box';

const statusColors = new Set(['error', 'success', 'info', 'warning']);

// Token names are built at runtime so no token object has to ship in the JS bundle.
const borderColorValue = (color: BorderColor) =>
  statusColors.has(color) ? `var(--gf-colors-${color}-border-transparent)` : `var(--gf-colors-border-${color})`;

const backgroundColorValue = (color: BackgroundColor) =>
  statusColors.has(color) ? `var(--gf-colors-${color}-transparent)` : `var(--gf-colors-background-${color})`;

const styles = stylex.create({
  borderWidth: {
    borderWidth: '1px',
  },
});
