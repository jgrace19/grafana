import { createElement } from 'react';
import * as React from 'react';

import { type GrafanaTheme2, type ThemeTypographyVariantTypes } from '@grafana/data';

import { mergeStylexClassName } from '../../themes/stylex/mergeClassNames';

import { textStyleProps } from './Text.stylex';
import { TruncatedText } from './TruncatedText';

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'li';
  variant?: keyof ThemeTypographyVariantTypes;
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: keyof GrafanaTheme2['colors']['text'] | 'error' | 'success' | 'warning' | 'info';
  truncate?: boolean;
  italic?: boolean;
  tabular?: boolean;
  textAlignment?: React.CSSProperties['textAlign'];
  className?: string;
  children: NonNullable<React.ReactNode>;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ element = 'span', variant, weight, color, truncate, italic, textAlignment, children, className, ...restProps }, ref) => {
    const styleProps = mergeStylexClassName(
      textStyleProps({ element, variant, weight, color, truncate, italic, textAlignment }),
      className
    );
    const childElement = (innerRef: React.ForwardedRef<HTMLElement> | undefined) =>
      createElement(element, { ...restProps, ...styleProps, style: undefined, ref: innerRef }, children);
    if (!truncate || element === 'span') return childElement(undefined);
    return <TruncatedText childElement={childElement} children={children} ref={ref} />;
  }
);

Text.displayName = 'Text';
