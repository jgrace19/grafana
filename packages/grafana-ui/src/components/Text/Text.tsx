import * as stylex from '@stylexjs/stylex';
import { type Property } from 'csstype';
import { createElement } from 'react';
import * as React from 'react';

import { type GrafanaTheme2, type ThemeTypographyVariantTypes } from '@grafana/data';

import { colors, typography } from '../../themes/stylex/tokens.stylex';

import { TruncatedText } from './TruncatedText';

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className' | 'style'> {
  /** Defines what HTML element is defined underneath. "span" by default */
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p' | 'li';
  /** What typograpy variant should be used for the component. Only use if default variant for the defined element is not what is needed */
  variant?: keyof ThemeTypographyVariantTypes;
  /** Override the default weight for the used variant */
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  /** Color to use for text */
  color?: keyof GrafanaTheme2['colors']['text'] | 'error' | 'success' | 'warning' | 'info';
  /** Use to cut the text off with ellipsis if there isn't space to show all of it. On hover shows the rest of the text */
  truncate?: boolean;
  /** If true, show the text as italic. False by default */
  italic?: boolean;
  /** If true, numbers will have fixed width, useful for displaying tabular data. False by default */
  tabular?: boolean;
  /** Whether to align the text to left, center or right */
  textAlignment?: Property.TextAlign;
  children: NonNullable<React.ReactNode>;
}

/**
 * The Text component can be used to apply typography styles in a simple way, without the need of extra css.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/foundations-text--docs
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { element = 'span', variant, weight, color, truncate, italic, textAlignment, children, tabular, ...restProps },
    ref
  ) => {
    const defaultVariant = variant ?? elementVariant(element);
    const { className, style } = stylex.props(
      styles.text,
      defaultVariant && textVariantStyles[defaultVariant],
      color && textColorStyles[color],
      weight && textWeightStyles[weight],
      truncate && styles.truncate,
      italic && styles.italic,
      textAlignment && styles.textAlign(textAlignment),
      tabular && styles.tabular
    );

    const childElement = (ref: React.ForwardedRef<HTMLElement> | undefined) => {
      return createElement(
        element,
        {
          ...restProps,
          // Replaces any style prop, as before: Text doesn't accept style overrides.
          style,
          className,
          // When overflowing, the internalRef is passed to the tooltip, which forwards it to the child element
          ref,
        },
        children
      );
    };

    // A 'span' is an inline element, so it can't be truncated
    // and it should be wrapped in a parent element that will show the tooltip
    if (!truncate || element === 'span') {
      return childElement(undefined);
    }

    return (
      <TruncatedText
        childElement={childElement}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        ref={ref}
      />
    );
  }
);

Text.displayName = 'Text';

/** A span has no default variant so that it takes its parent's typography. */
function elementVariant(element: TextProps['element']): keyof ThemeTypographyVariantTypes | undefined {
  switch (element) {
    case 'span':
      return undefined;
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return element;
    default:
      return 'body';
  }
}

const styles = stylex.create({
  text: {
    margin: 0,
    padding: 0,
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  italic: {
    fontStyle: 'italic',
  },
  textAlign: (textAlign: Property.TextAlign) => ({
    textAlign,
  }),
  tabular: {
    fontFeatureSettings: '"tnum"',
  },
});

/** `theme.typography[variant]`. Shared with TextLink. */
export const textVariantStyles = stylex.create({
  h1: {
    fontFamily: typography['--gf-typography-h1-font-family'],
    fontWeight: typography['--gf-typography-h1-font-weight'],
    fontSize: typography['--gf-typography-h1-font-size'],
    lineHeight: typography['--gf-typography-h1-line-height'],
    letterSpacing: typography['--gf-typography-h1-letter-spacing'],
  },
  h2: {
    fontFamily: typography['--gf-typography-h2-font-family'],
    fontWeight: typography['--gf-typography-h2-font-weight'],
    fontSize: typography['--gf-typography-h2-font-size'],
    lineHeight: typography['--gf-typography-h2-line-height'],
    letterSpacing: typography['--gf-typography-h2-letter-spacing'],
  },
  h3: {
    fontFamily: typography['--gf-typography-h3-font-family'],
    fontWeight: typography['--gf-typography-h3-font-weight'],
    fontSize: typography['--gf-typography-h3-font-size'],
    lineHeight: typography['--gf-typography-h3-line-height'],
    letterSpacing: typography['--gf-typography-h3-letter-spacing'],
  },
  h4: {
    fontFamily: typography['--gf-typography-h4-font-family'],
    fontWeight: typography['--gf-typography-h4-font-weight'],
    fontSize: typography['--gf-typography-h4-font-size'],
    lineHeight: typography['--gf-typography-h4-line-height'],
    letterSpacing: typography['--gf-typography-h4-letter-spacing'],
  },
  h5: {
    fontFamily: typography['--gf-typography-h5-font-family'],
    fontWeight: typography['--gf-typography-h5-font-weight'],
    fontSize: typography['--gf-typography-h5-font-size'],
    lineHeight: typography['--gf-typography-h5-line-height'],
    letterSpacing: typography['--gf-typography-h5-letter-spacing'],
  },
  h6: {
    fontFamily: typography['--gf-typography-h6-font-family'],
    fontWeight: typography['--gf-typography-h6-font-weight'],
    fontSize: typography['--gf-typography-h6-font-size'],
    lineHeight: typography['--gf-typography-h6-line-height'],
    letterSpacing: typography['--gf-typography-h6-letter-spacing'],
  },
  body: {
    fontFamily: typography['--gf-typography-body-font-family'],
    fontWeight: typography['--gf-typography-body-font-weight'],
    fontSize: typography['--gf-typography-body-font-size'],
    lineHeight: typography['--gf-typography-body-line-height'],
    letterSpacing: typography['--gf-typography-body-letter-spacing'],
  },
  bodySmall: {
    fontFamily: typography['--gf-typography-body-small-font-family'],
    fontWeight: typography['--gf-typography-body-small-font-weight'],
    fontSize: typography['--gf-typography-body-small-font-size'],
    lineHeight: typography['--gf-typography-body-small-line-height'],
    letterSpacing: typography['--gf-typography-body-small-letter-spacing'],
  },
  code: {
    fontFamily: typography['--gf-typography-code-font-family'],
    fontWeight: typography['--gf-typography-code-font-weight'],
    fontSize: typography['--gf-typography-code-font-size'],
    lineHeight: typography['--gf-typography-code-line-height'],
    letterSpacing: typography['--gf-typography-code-letter-spacing'],
  },
});

/** Font weight overrides. Shared with TextLink. */
export const textWeightStyles = stylex.create({
  light: { fontWeight: typography['--gf-typography-font-weight-light'] },
  regular: { fontWeight: typography['--gf-typography-font-weight-regular'] },
  medium: { fontWeight: typography['--gf-typography-font-weight-medium'] },
  bold: { fontWeight: typography['--gf-typography-font-weight-bold'] },
});

/** `theme.colors.text[color]`, or `theme.colors[status].text`. Shared with TextLink. */
export const textColorStyles = stylex.create({
  primary: { color: colors['--gf-colors-text-primary'] },
  secondary: { color: colors['--gf-colors-text-secondary'] },
  disabled: { color: colors['--gf-colors-text-disabled'] },
  link: { color: colors['--gf-colors-text-link'] },
  maxContrast: { color: colors['--gf-colors-text-max-contrast'] },
  error: { color: colors['--gf-colors-error-text'] },
  success: { color: colors['--gf-colors-success-text'] },
  info: { color: colors['--gf-colors-info-text'] },
  warning: { color: colors['--gf-colors-warning-text'] },
});
