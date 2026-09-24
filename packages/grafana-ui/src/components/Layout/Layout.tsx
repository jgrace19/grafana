import * as stylex from '@stylexjs/stylex';
import { type HTMLProps } from 'react';
import * as React from 'react';

import { spacingValue } from './utils/responsiveStylex';

enum Orientation {
  Horizontal,
  Vertical,
}
type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg';
type Justify = 'flex-start' | 'flex-end' | 'space-between' | 'center';
type Align = 'normal' | 'flex-start' | 'flex-end' | 'center';

export interface LayoutProps extends Omit<HTMLProps<HTMLDivElement>, 'align' | 'children' | 'wrap'> {
  children: React.ReactNode[] | React.ReactNode;
  orientation?: Orientation;
  spacing?: Spacing;
  justify?: Justify;
  align?: Align;
  width?: string;
  wrap?: boolean;
}

export interface ContainerProps {
  padding?: Spacing;
  margin?: Spacing;
  grow?: number;
  shrink?: number;
}

/**
 * @deprecated use Stack component instead
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-deprecated-groups--docs
 */
export const Layout = ({
  children,
  orientation = Orientation.Horizontal,
  spacing = 'sm',
  justify = 'flex-start',
  align = 'normal',
  wrap = false,
  width = '100%',
  height = '100%',
  ...rest
}: LayoutProps) => {
  const isVertical = orientation === Orientation.Vertical;
  const isHorizontal = orientation === Orientation.Horizontal;
  const finalSpacing = spacing !== 'none' ? spacingValue(spacingToNumber[spacing]) : '0px';
  // compensate for last row margin when wrapped, horizontal layout
  const marginCompensation =
    (isHorizontal && !wrap) || isVertical ? '0px' : `calc(-1 * ${spacingValue(spacingToNumber[spacing])})`;
  const layoutProps = stylex.props(
    styles.layout,
    styles.layoutDynamic(isVertical ? 'column' : 'row', wrap ? 'wrap' : 'nowrap', justify, align, marginCompensation)
  );

  return (
    <div className={layoutProps.className} style={{ ...layoutProps.style, width, height }} {...rest}>
      {React.Children.toArray(children)
        .filter(Boolean)
        .map((child, index) => {
          return (
            <div
              {...stylex.props(
                styles.childWrapper,
                styles.childWrapperDynamic(
                  isHorizontal && !wrap ? '0px' : finalSpacing,
                  isVertical ? '0px' : null,
                  isHorizontal ? finalSpacing : '0px',
                  isHorizontal ? '0px' : null,
                  align
                )
              )}
              key={index}
            >
              {child}
            </div>
          );
        })}
    </div>
  );
};

/**
 * @deprecated use Stack component instead
 */
export const HorizontalGroup = ({
  children,
  spacing,
  justify,
  align = 'center',
  wrap,
  width,
  height,
}: Omit<LayoutProps, 'orientation'>) => (
  <Layout
    spacing={spacing}
    justify={justify}
    orientation={Orientation.Horizontal}
    align={align}
    width={width}
    height={height}
    wrap={wrap}
  >
    {children}
  </Layout>
);

/**
 * @deprecated use Stack component with the "column" direction instead
 */
export const VerticalGroup = ({
  children,
  spacing,
  justify,
  align,
  width,
  height,
}: Omit<LayoutProps, 'orientation' | 'wrap'>) => (
  <Layout
    spacing={spacing}
    justify={justify}
    orientation={Orientation.Vertical}
    align={align}
    width={width}
    height={height}
  >
    {children}
  </Layout>
);

export const Container = ({ children, padding, margin, grow, shrink }: React.PropsWithChildren<ContainerProps>) => {
  const paddingSize = padding && padding !== 'none' ? spacingValue(spacingToNumber[padding]) : '0px';
  const marginSize = margin && margin !== 'none' ? spacingValue(spacingToNumber[margin]) : '0px';

  return (
    <div
      {...stylex.props(
        styles.container(marginSize, paddingSize),
        grow !== undefined && styles.grow(grow),
        shrink !== undefined && styles.shrink(shrink)
      )}
    >
      {children}
    </div>
  );
};

const spacingToNumber: Record<Spacing, number> = {
  none: 0,
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
};

const styles = stylex.create({
  layout: {
    display: 'flex',
    height: '100%',
    maxWidth: '100%',
  },
  layoutDynamic: (direction: string, wrap: string, justify: string, align: string, marginBottom: string) => ({
    flexDirection: direction,
    flexWrap: wrap,
    justifyContent: justify,
    alignItems: align,
    marginBottom,
  }),
  childWrapper: {
    display: 'flex',
  },
  // A null :last-child margin keeps the default margin, like the Emotion `undefined`.
  childWrapperDynamic: (
    marginBottom: string,
    lastMarginBottom: string | null,
    marginRight: string,
    lastMarginRight: string | null,
    align: string
  ) => ({
    marginBottom: { default: marginBottom, ':last-child': lastMarginBottom },
    marginRight: { default: marginRight, ':last-child': lastMarginRight },
    alignItems: align,
  }),
  container: (margin: string, padding: string) => ({
    margin,
    padding,
  }),
  grow: (grow: number) => ({
    flexGrow: grow,
  }),
  shrink: (shrink: number) => ({
    flexShrink: shrink,
  }),
});
