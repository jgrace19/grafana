import * as stylex from '@stylexjs/stylex';
import { forwardRef, type HTMLProps, type ReactNode, useContext } from 'react';
import { useMeasure } from 'react-use';

import { useTheme2 } from '../../themes/ThemeContext';
import { motion } from '../../themes/stylex/constants.stylex';
import { mergeStylexProps } from '../../themes/stylex/mergeStylexProps';
import { colors, components, shape, spacing, typography } from '../../themes/stylex/tokens.stylex';
import { spacingValue } from '../Layout/utils/responsiveStylex';
import { Spinner } from '../Spinner/Spinner';

import './Input.css';
import { AutoSizeInputContext } from './AutoSizeInputContext';
import { inputWrapperMarker } from './markers.stylex';

export interface Props extends Omit<HTMLProps<HTMLInputElement>, 'prefix' | 'size'> {
  /** Sets the width to a multiple of 8px. Should only be used with inline forms. Setting width of the container is preferred in other cases.*/
  width?: number;
  /** Show an invalid state around the input */
  invalid?: boolean;
  /** Show an icon as a prefix in the input */
  prefix?: ReactNode;
  /** Show an icon as a suffix in the input */
  suffix?: ReactNode;
  /** Show a loading indicator as a suffix in the input */
  loading?: boolean;
  /** Add a component as an addon before the input  */
  addonBefore?: ReactNode;
  /** Add a component as an addon after the input */
  addonAfter?: ReactNode;
}

/**
 * Used for regular text input. For an array of data or tree-structured data, consider using `Combobox` or `Cascader` respectively.
 *
 * https://developers.grafana.com/ui/latest/index.html?path=/docs/inputs-input--docs
 */
export const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    className,
    addonAfter,
    addonBefore,
    prefix,
    suffix: suffixProp,
    invalid,
    loading,
    width = 0,
    ...restProps
  } = props;
  /**
   * Prefix & suffix are positioned absolutely within inputWrapper. We use client rects below to apply correct padding to the input
   * when prefix/suffix is larger than default (28px = 16px(icon) + 12px(left/right paddings)).
   * Thanks to that prefix/suffix do not overflow the input element itself.
   */
  const [prefixRef, prefixRect] = useMeasure<HTMLDivElement>();
  const [suffixRef, suffixRect] = useMeasure<HTMLDivElement>();

  // Yes, this is gross - When Input is being wrapped by AutoSizeInput, add the suffix/prefix width to the overall width
  // so the text content is not clipped. The intention is to make all the input's text appear without overflow/clipping,
  // which isn't normally how width is used in this component.
  // This behaviour is not controlled via a prop so we can limit API surface, and remove this as a 'breaking change' later
  // if a better solution is found.
  const isInAutoSizeInput = useContext(AutoSizeInputContext);
  const accessoriesWidth = (prefixRect.width || 0) + (suffixRect.width || 0);
  const autoSizeWidth = isInAutoSizeInput && width ? width + accessoriesWidth / 8 : undefined;

  const theme = useTheme2();
  const suffix = suffixProp || (loading && <Spinner inline={true} />);
  const wrapperWidth = autoSizeWidth ? undefined : width;
  const colorMode = theme.isDark ? 'dark' : 'light';
  const hasAddonBefore = !!addonBefore;
  const hasAddonAfter = !!addonAfter;

  const inputProps = stylex.props(
    styles.input,
    invalid ? invalidBorderStyles[colorMode] : borderStyles[colorMode],
    hasAddonBefore && hasAddonAfter && styles.inputBetweenAddons,
    hasAddonBefore && !hasAddonAfter && styles.inputAfterAddon,
    !hasAddonBefore && hasAddonAfter && styles.inputBeforeAddon,
    restProps.type === 'number' && styles.numberInput
  );

  return (
    <div
      {...mergeStylexProps(
        stylex.props(
          styles.wrapper,
          inputWrapperMarker,
          wrapperWidth ? styles.width(spacingValue(wrapperWidth)) : null
        ),
        {
          className,
          // If the component is in an AutoSizeInput, set the width inline rather than through a dynamic style
          style: autoSizeWidth ? { width: theme.spacing(autoSizeWidth) } : undefined,
        }
      )}
      data-testid="input-wrapper"
    >
      {hasAddonBefore && (
        <div {...mergeStylexProps(stylex.props(styles.addon), { className: 'gf-input-addon' })}>{addonBefore}</div>
      )}
      <div {...stylex.props(styles.inputWrapper)}>
        {prefix && (
          <div {...stylex.props(styles.prefixSuffix, styles.prefix)} ref={prefixRef}>
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          className={inputProps.className}
          {...restProps}
          onWheel={
            restProps.type === 'number'
              ? (e) => {
                  e.currentTarget.blur();
                  restProps.onWheel?.(e);
                }
              : restProps.onWheel
          }
          style={{
            ...inputProps.style,
            paddingLeft: prefix ? prefixRect.width + 12 : undefined,
            paddingRight: suffix || loading ? suffixRect.width + 12 : undefined,
          }}
        />

        {suffix && (
          <div {...stylex.props(styles.prefixSuffix, styles.suffix)} ref={suffixRef}>
            {suffix}
          </div>
        )}
      </div>
      {hasAddonAfter && (
        <div {...mergeStylexProps(stylex.props(styles.addon), { className: 'gf-input-addon' })}>{addonAfter}</div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

const focusRing = `0 0 0 2px ${colors['--gf-colors-background-canvas']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}`;
/* Welcome to 2005. This is a HACK to get rid of Chrome's default autofill styling */
const autofillShadow = `inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px ${components['--gf-components-input-background']}`;
const autofillFocusShadow = `0 0 0 2px ${colors['--gf-colors-background-primary']}, 0 0 0px 4px ${colors['--gf-colors-primary-main']}, ${autofillShadow}`;

const styles = stylex.create({
  // Wraps inputWrapper and addons
  wrapper: {
    display: 'flex',
    width: '100%',
    height: `calc(${spacing['--gf-spacing-grid-size']} * ${components['--gf-components-height-md']})`,
    borderRadius: shape['--gf-shape-radius-default'],
  },
  width: (width: string) => ({ width }),
  // Wraps input and prefix/suffix
  inputWrapper: {
    position: 'relative',
    flexGrow: 1,
    /* we want input to be above addons, especially for focused state */
    zIndex: 1,
  },
  input: {
    position: 'relative',
    zIndex: 0,
    flexGrow: 1,
    height: '100%',
    width: '100%',
    paddingTop: 0,
    paddingRight: spacing['--gf-spacing-x1'],
    paddingBottom: 0,
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
    cursor: {
      default: null,
      ':is([readonly])': 'default',
      ':disabled': { default: 'not-allowed', ':is([readonly])': 'default' },
    },
    WebkitTextFillColor: { default: null, ':-webkit-autofill': components['--gf-components-input-text'] },
    boxShadow: {
      default: null,
      ':-webkit-autofill': autofillShadow,
      ':hover': { default: null, ':-webkit-autofill': autofillShadow },
      ':focus': { default: focusRing, ':-webkit-autofill': autofillFocusShadow },
    },
    outlineStyle: { default: null, ':focus': 'none' },
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
  inputAfterAddon: {
    borderLeftStyle: 'none',
    borderTopLeftRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
  inputBeforeAddon: {
    borderRightStyle: 'none',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
  },
  inputBetweenAddons: {
    borderRightStyle: 'none',
    borderTopRightRadius: 'unset',
    borderBottomRightRadius: 'unset',
    borderTopLeftRadius: 'unset',
    borderBottomLeftRadius: 'unset',
  },
  // only show number buttons on hover
  numberInput: {
    appearance: { default: null, [stylex.when.ancestor(':hover', inputWrapperMarker)]: 'textfield' },
    '::-webkit-inner-spin-button': {
      // The spin button's native appearance keyword, which the StyleX lint doesn't list.
      // eslint-disable-next-line @stylexjs/valid-styles
      WebkitAppearance: { default: null, [stylex.when.ancestor(':hover', inputWrapperMarker)]: 'inner-spin-button' },
      opacity: { default: null, [stylex.when.ancestor(':hover', inputWrapperMarker)]: 1 },
    },
    '::-webkit-outer-spin-button': {
      // The spin button's native appearance keyword, which the StyleX lint doesn't list.
      // eslint-disable-next-line @stylexjs/valid-styles
      WebkitAppearance: { default: null, [stylex.when.ancestor(':hover', inputWrapperMarker)]: 'inner-spin-button' },
      opacity: { default: null, [stylex.when.ancestor(':hover', inputWrapperMarker)]: 1 },
    },
  },
  addon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    position: 'relative',
  },
  prefixSuffix: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: typography['--gf-typography-size-md'],
    height: '100%',
    minWidth: '28px',
    color: colors['--gf-colors-text-secondary'],
  },
  prefix: {
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x0-5'],
  },
  suffix: {
    paddingLeft: spacing['--gf-spacing-x1'],
    paddingRight: spacing['--gf-spacing-x1'],
    right: 0,
  },
});

// Hover beats autofill; a disabled field keeps its disabled border except while hovered, where it shows the
// base colour. The autofill border has no alpha (the theme borders do), so it isn't a theme token.
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
      ':hover': { default: colors['--gf-colors-error-shade'], ':-webkit-autofill': '#2e2f35' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': colors['--gf-colors-error-border'],
      },
    },
  },
  light: {
    borderColor: {
      default: colors['--gf-colors-error-border'],
      ':-webkit-autofill': '#bab4ca',
      ':hover': { default: colors['--gf-colors-error-shade'], ':-webkit-autofill': '#bab4ca' },
      ':disabled': {
        default: colors['--gf-colors-action-disabled-background'],
        ':hover': colors['--gf-colors-error-border'],
      },
    },
  },
});

/**
 * Input's StyleX styles, for first-party components that look like an Input without rendering one (ScopesInput).
 * Pass the border style for the theme mode: `inputBorderStyles[theme.isDark ? 'dark' : 'light']`, or
 * `inputInvalidBorderStyles[...]` for the invalid state.
 *
 * @internal
 */
export { styles as inputStyles, borderStyles as inputBorderStyles, invalidBorderStyles as inputInvalidBorderStyles };
