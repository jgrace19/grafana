import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLProps } from 'react';

import { useTheme2 } from '../../themes/ThemeContext';
import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';

export interface Props extends Omit<HTMLProps<HTMLTextAreaElement>, 'size'> {
  /** Show an invalid state around the input */
  invalid?: boolean;
  /** @internal first-party StyleX overrides */
  xstyle?: stylex.StyleXStyles;
}

/**
 * Use for multi line inputs like descriptions.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-textarea--docs
 */
export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ invalid, className, style, xstyle, ...props }, ref) => {
    const theme = useTheme2();
    const colorMode = theme.isDark ? 'dark' : 'light';

    return (
      <textarea
        {...props}
        {...mergeStylexProps(
          stylex.props(styles.textarea, invalid ? invalidBorderStyles[colorMode] : borderStyles[colorMode], xstyle),
          { className, style }
        )}
        ref={ref}
      />
    );
  }
);

const autofillShadow = `inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px ${components['--gf-components-input-background']}`;

const styles = stylex.create({
  textarea: {
    display: 'block',
    width: '100%',
    paddingTop: `calc(${spacing['--gf-spacing-grid-size']} / 4)`,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: `calc(${spacing['--gf-spacing-grid-size']} / 4)`,
    paddingLeft: spacing['--gf-spacing-x1'],
    borderRadius: shape['--gf-shape-radius-default'],
    borderWidth: '1px',
    borderStyle: 'solid',
    lineHeight: typography['--gf-typography-body-line-height'],
    fontSize: typography['--gf-typography-size-md'],
    color: {
      default: components['--gf-components-input-text'],
      ':disabled': colors['--gf-colors-action-disabled-text'],
    },
    backgroundColor: {
      default: components['--gf-components-input-background'],
      ':is([readonly])': colors['--gf-colors-action-disabled-background'],
      ':disabled': colors['--gf-colors-action-disabled-background'],
    },
    cursor: { default: null, ':is([readonly])': 'not-allowed', ':disabled': 'not-allowed' },
    WebkitTextFillColor: { default: null, ':-webkit-autofill': components['--gf-components-input-text'] },
    boxShadow: {
      default: null,
      ':-webkit-autofill': autofillShadow,
      ':hover': { default: null, ':-webkit-autofill': autofillShadow },
      ':focus': {
        default: `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`,
        ':-webkit-autofill': `0 0 0 2px ${colors['--gf-colors-background-primary']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}, ${autofillShadow}`,
      },
    },
    // The focus ring's transparent outline comes after the shared input style's `outline: none`, so it wins.
    outlineStyle: { default: null, ':focus': 'dotted' },
    outlineWidth: { default: null, ':focus': '2px' },
    outlineColor: { default: null, ':focus': 'transparent' },
    outlineOffset: { default: null, ':focus': '2px' },
    transitionProperty: { default: null, ':focus': 'outline, outline-offset, box-shadow' },
    transitionDuration: { default: null, ':focus': { default: null, [motion.noPreferenceOrReduce]: '0.2s' } },
    transitionTimingFunction: {
      default: null,
      ':focus': { default: null, [motion.noPreferenceOrReduce]: 'cubic-bezier(0.19, 1, 0.22, 1)' },
    },
    '::placeholder': {
      color: colors['--gf-colors-text-disabled'],
      opacity: 1,
    },
  },
});

// Hover and the disabled hover colour come from the non-invalid input style, even for an invalid TextArea.
const borderStyles = stylex.create({
  dark: {
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':-webkit-autofill': '#2e2f35',
      ':hover': { default: components['--gf-components-input-border-hover'], ':-webkit-autofill': '#2e2f35' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': components['--gf-components-input-border-color'],
      },
    },
  },
  light: {
    borderColor: {
      default: components['--gf-components-input-border-color'],
      ':-webkit-autofill': '#bab4ca',
      ':hover': { default: components['--gf-components-input-border-hover'], ':-webkit-autofill': '#bab4ca' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': components['--gf-components-input-border-color'],
      },
    },
  },
});

const invalidBorderStyles = stylex.create({
  dark: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      ':-webkit-autofill': '#2e2f35',
      ':hover': { default: components['--gf-components-input-border-hover'], ':-webkit-autofill': '#2e2f35' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': components['--gf-components-input-border-color'],
      },
    },
  },
  light: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      ':-webkit-autofill': '#bab4ca',
      ':hover': { default: components['--gf-components-input-border-hover'], ':-webkit-autofill': '#bab4ca' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': components['--gf-components-input-border-color'],
      },
    },
  },
});

TextArea.displayName = 'TextArea';
