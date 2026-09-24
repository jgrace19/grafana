import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLAttributes } from 'react';
import * as React from 'react';

import { type ThemeSpacingTokens } from '@grafana/data';

import { type AlignItems } from '../types';
import { responsive, responsiveStyles } from '../utils/responsiveStyles';
import { spacingValue } from '../utils/responsiveStylex';
import { type ResponsiveProp } from '../utils/responsiveness';

interface GridPropsBase extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> {
  children: NonNullable<React.ReactNode>;
  /** Specifies the gutters between columns and rows. It is overwritten when a column or row gap has a value. */
  gap?: ResponsiveProp<ThemeSpacingTokens>;
  rowGap?: ResponsiveProp<ThemeSpacingTokens>;
  columnGap?: ResponsiveProp<ThemeSpacingTokens>;
  alignItems?: ResponsiveProp<AlignItems>;
}

interface PropsWithColumns extends GridPropsBase {
  /** Number of columns */
  columns?: ResponsiveProp<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>;
  minColumnWidth?: never;
}

interface PropsWithMinColumnWidth extends GridPropsBase {
  columns?: never;
  /** For a responsive layout, fit as many columns while maintaining this minimum column width.
   *  The real width will be calculated based on the theme spacing tokens: `theme.spacing(minColumnWidth)`
   */
  minColumnWidth?: ResponsiveProp<1 | 2 | 3 | 5 | 8 | 13 | 16 | 21 | 34 | 44 | 55 | 72 | 89 | 144>;
}

/** 'columns' and 'minColumnWidth' are mutually exclusive */
type GridProps = PropsWithColumns | PropsWithMinColumnWidth;

/**
 * The Grid component is a layout component that allows you to create a grid of columns and rows to organize content and elements. It is a wrapper around the [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) specification.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/layout-grid--docs
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const { alignItems, children, gap, rowGap, columnGap, columns, minColumnWidth, ...rest } = props;

  return (
    <div
      ref={ref}
      {...rest}
      {...stylex.props(
        styles.grid,
        responsive(responsiveStyles.gap, gap, spacingValue),
        responsive(responsiveStyles.rowGap, rowGap, spacingValue),
        responsive(responsiveStyles.columnGap, columnGap, spacingValue),
        minColumnWidth
          ? responsive(
              responsiveStyles.gridTemplateColumns,
              minColumnWidth,
              (width) => `repeat(auto-fill, minmax(${spacingValue(width)}, 1fr))`
            )
          : null,
        columns ? responsive(responsiveStyles.gridTemplateColumns, columns, (count) => `repeat(${count}, 1fr)`) : null,
        responsive(responsiveStyles.alignItems, alignItems)
      )}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

const styles = stylex.create({
  grid: {
    display: 'grid',
  },
});
