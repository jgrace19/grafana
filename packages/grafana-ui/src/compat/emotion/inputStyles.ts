import { css, cx } from '@emotion/css';

import { type GrafanaTheme2 } from '@grafana/data';

import { stylesFactory } from '../../themes/stylesFactory';

import { getFocusStyle, sharedInputStyle } from './commonStyles';

// Frozen Emotion implementation of the Input styles, kept for plugins and not-yet-migrated components that
// consume this helper. Input itself renders with StyleX. Keep visually in sync with Input.tsx.

interface StyleDeps {
  theme: GrafanaTheme2;
  invalid?: boolean;
  width?: number;
}

/** @deprecated Emotion compat. Use the `Input` component. */
export const getInputStyles = stylesFactory(({ theme, invalid = false, width }: StyleDeps) => {
  const prefixSuffixStaticWidth = '28px';
  const prefixSuffix = css({
    position: 'absolute',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
    fontSize: theme.typography.size.md,
    height: '100%',
    /* Min width specified for prefix/suffix classes used outside React component*/
    minWidth: prefixSuffixStaticWidth,
    color: theme.colors.text.secondary,
  });

  return {
    // Wraps inputWrapper and addons
    wrapper: cx(
      css({
        label: 'input-wrapper',
        display: 'flex',
        width: width ? theme.spacing(width) : '100%',
        height: theme.spacing(theme.components.height.md),
        borderRadius: theme.shape.radius.default,
        '&:hover': {
          '> .prefix, .suffix, .input': {
            borderColor: invalid ? theme.colors.error.border : theme.colors.primary.border,
          },

          // only show number buttons on hover
          "input[type='number']": {
            appearance: 'textfield',
          },

          "input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button": {
            // Need type assertion here due to the use of !important
            // see https://github.com/frenic/csstype/issues/114#issuecomment-697201978
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            WebkitAppearance: 'inner-spin-button !important' as 'inner-spin-button',
            opacity: 1,
          },
        },
      })
    ),
    // Wraps input and prefix/suffix
    inputWrapper: css({
      label: 'input-inputWrapper',
      position: 'relative',
      flexGrow: 1,
      /* we want input to be above addons, especially for focused state */
      zIndex: 1,

      /* when input rendered with addon before only*/
      '&:not(:first-child):last-child': {
        '> input': {
          borderLeft: 'none',
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },

      /* when input rendered with addon after only*/
      '&:first-child:not(:last-child)': {
        '> input': {
          borderRight: 'none',
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
        },
      },

      /* when rendered with addon before and after */
      '&:not(:first-child):not(:last-child)': {
        '> input': {
          borderRight: 'none',
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },

      input: {
        /* paddings specified for classes used outside React component */
        '&:not(:first-child)': {
          paddingLeft: prefixSuffixStaticWidth,
        },
        '&:not(:last-child)': {
          paddingRight: prefixSuffixStaticWidth,
        },
        '&[readonly]': {
          cursor: 'default',
        },
      },
    }),

    input: cx(
      getFocusStyle(theme),
      sharedInputStyle(theme, invalid),
      css({
        label: 'input-input',
        position: 'relative',
        zIndex: 0,
        flexGrow: 1,
        borderRadius: theme.shape.radius.default,
        height: '100%',
        width: '100%',
      })
    ),
    inputDisabled: css({
      backgroundColor: theme.colors.action.disabledBackground,
      color: theme.colors.action.disabledText,
      border: `1px solid ${theme.colors.action.disabledBackground}`,
      '&:focus': {
        boxShadow: 'none',
      },
    }),
    addon: css({
      label: 'input-addon',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 0,
      flexShrink: 0,
      position: 'relative',

      '&:first-child': {
        borderTopRightRadius: 'unset',
        borderBottomRightRadius: 'unset',
        '> :last-child': {
          borderTopRightRadius: 'unset',
          borderBottomRightRadius: 'unset',
        },
      },

      '&:last-child': {
        borderTopLeftRadius: 'unset',
        borderBottomLeftRadius: 'unset',
        '> :first-child': {
          borderTopLeftRadius: 'unset',
          borderBottomLeftRadius: 'unset',
        },
      },
      '> *:focus': {
        /* we want anything that has focus and is an addon to be above input */
        zIndex: 2,
      },
    }),
    prefix: cx(
      prefixSuffix,
      css({
        label: 'input-prefix',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(0.5),
        borderRight: 'none',
        borderTopRightRadius: 'unset',
        borderBottomRightRadius: 'unset',
      })
    ),
    suffix: cx(
      prefixSuffix,
      css({
        label: 'input-suffix',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        borderLeft: 'none',
        borderTopLeftRadius: 'unset',
        borderBottomLeftRadius: 'unset',
        right: 0,
      })
    ),
    loadingIndicator: css({
      '& + *': {
        marginLeft: theme.spacing(0.5),
      },
    }),
  };
});
