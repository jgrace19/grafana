import { type CSSInterpolation } from '@emotion/serialize';

import { type GrafanaTheme2, type ThemeBreakpointsKey } from '@grafana/data';

import { type Responsive, type ResponsiveProp } from '../../components/Layout/utils/responsiveness';

function breakpointCSS<T>(
  theme: GrafanaTheme2,
  prop: Responsive<T>,
  getCSS: (val: T) => CSSInterpolation,
  key: ThemeBreakpointsKey
) {
  const value = prop[key];
  if (value !== undefined && value !== null) {
    return {
      [theme.breakpoints.up(key)]: getCSS(value),
    };
  }
  return;
}
/**
 * @deprecated Emotion compat for code that still builds Emotion styles. StyleX components use
 * `responsive()` from `Layout/utils/responsiveStyles`.
 *
 * Function that converts a ResponsiveProp object into CSS
 *
 * @param theme Grafana theme object
 * @param prop Prop as it is passed to the component
 * @param getCSS Function that returns the css block for the prop
 * @returns The CSS block repeated for each breakpoint
 *
 * @example To get the responsive css equivalent of `margin && { margin }`, you can write `getResponsiveStyle(theme, margin, (val) => { margin: val })`
 */
export function getResponsiveStyle<T>(
  theme: GrafanaTheme2,
  prop: ResponsiveProp<T> | undefined,
  getCSS: (val: T) => CSSInterpolation
): CSSInterpolation {
  if (prop === undefined || prop === null) {
    return null;
  }
  if (typeof prop !== 'object' || !('xs' in prop)) {
    return getCSS(prop);
  }

  return [
    breakpointCSS(theme, prop, getCSS, 'xs'),
    breakpointCSS(theme, prop, getCSS, 'sm'),
    breakpointCSS(theme, prop, getCSS, 'md'),
    breakpointCSS(theme, prop, getCSS, 'lg'),
    breakpointCSS(theme, prop, getCSS, 'xl'),
    breakpointCSS(theme, prop, getCSS, 'xxl'),
  ];
}
