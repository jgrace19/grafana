/**
 * Type that represents a prop that can be responsive.
 *
 * @example To turn a prop like `margin: number` responsive, change it to `margin: ResponsiveProp<number>`.
 */
export type ResponsiveProp<T> = T | Responsive<T>;

export type Responsive<T> = {
  xs: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
};
