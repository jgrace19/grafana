import { css } from '@emotion/css';

import { type GrafanaTheme2, type ThemeRichColor } from '@grafana/data';

import { type ButtonFill, type ButtonVariant } from '../../components/Button/Button';
import { getPropertiesForButtonSize } from '../../components/Forms/commonStyles';
import { type ComponentSize } from '../../types/size';

import { getButtonFocusStyles, getMouseFocusStyles } from './mixins';

// Frozen Emotion implementation of the Button styles, kept for plugins and not-yet-migrated components
// that consume these helpers. Button itself renders with StyleX. Keep visually in sync with Button.tsx.

export interface StyleProps {
  size: ComponentSize;
  variant: ButtonVariant;
  fill?: ButtonFill;
  iconOnly?: boolean;
  theme: GrafanaTheme2;
  fullWidth?: boolean;
  narrow?: boolean;
}

/** @deprecated Emotion compat. Use the `Button` component. */
export const getButtonStyles = (props: StyleProps) => {
  const { theme, variant, fill = 'solid', size, iconOnly, fullWidth } = props;
  const { height, padding, fontSize } = getPropertiesForButtonSize(size, theme);
  const variantStyles = getPropertiesForVariant(theme, variant, fill);
  const disabledStyles = getPropertiesForDisabled(theme, variant, fill);
  const focusStyle = getButtonFocusStyles(theme);
  const paddingMinusBorder = theme.spacing.gridSize * padding - 1;

  return {
    button: css({
      label: 'button',
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      fontSize: fontSize,
      fontWeight: theme.typography.fontWeightMedium,
      fontFamily: theme.typography.fontFamily,
      padding: `0 ${paddingMinusBorder}px`,
      height: theme.spacing(height),
      // Deduct border from line-height for perfect vertical centering on windows and linux
      lineHeight: `${theme.spacing.gridSize * height - 2}px`,
      verticalAlign: 'middle',
      cursor: 'pointer',
      borderRadius: theme.shape.radius.default,
      '&:focus': focusStyle,
      '&:focus-visible': focusStyle,
      '&:focus:not(:focus-visible)': getMouseFocusStyles(theme),
      ...(fullWidth && {
        flexGrow: 1,
        justifyContent: 'center',
      }),
      ...variantStyles,
      ':disabled': disabledStyles,
      '&[disabled]': disabledStyles,

      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        transition: theme.transitions.create(['background-color', 'border-color', 'color'], {
          duration: theme.transitions.duration.short,
        }),
      },
    }),
    disabled: css(disabledStyles, {
      '&:hover': css(disabledStyles),
    }),
    img: css({
      width: '16px',
      height: '16px',
      margin: theme.spacing(0, 1, 0, 0.5),
    }),
    icon: iconOnly
      ? css({
          // Important not to set margin bottom here as it would override internal icon bottom margin
          marginRight: theme.spacing(-padding / 2),
          marginLeft: theme.spacing(-padding / 2),
        })
      : undefined,
    content: css({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      height: '100%',
    }),
  };
};

export function getActiveButtonStyles(color: ThemeRichColor, fill: ButtonFill) {
  return {
    background: fill === 'solid' ? color.main : 'transparent',
  };
}

export function getButtonVariantStyles(theme: GrafanaTheme2, color: ThemeRichColor, fill: ButtonFill) {
  let outlineBorderColor = color.border;
  let borderColor = 'transparent';
  let hoverBorderColor = 'transparent';

  // Secondary button has some special rules as we lack the color token to
  // specify border color for normal button vs border color for outline button
  if (color.name === 'secondary') {
    borderColor = color.border;
    hoverBorderColor = theme.colors.emphasize(color.border, 0.25);
    outlineBorderColor = theme.colors.border.strong;
  }

  if (fill === 'outline') {
    return {
      background: 'transparent',
      color: color.text,
      border: `1px solid ${outlineBorderColor}`,

      '&:hover, &:focus': {
        background: color.transparent,
        borderColor: theme.colors.emphasize(outlineBorderColor, 0.25),
        color: color.text,
      },

      '&:active': {
        ...getActiveButtonStyles(color, fill),
      },
    };
  }

  if (fill === 'text') {
    return {
      background: 'transparent',
      color: color.text,
      border: '1px solid transparent',

      '&:hover, &:focus': {
        background: color.transparent,
        textDecoration: 'none',
        outline: 'none',
      },

      '&:active': {
        ...getActiveButtonStyles(color, fill),
      },
    };
  }

  return {
    background: color.main,
    color: color.contrastText,
    border: `1px solid ${borderColor}`,

    '&:hover': {
      background: color.shade,
      color: color.contrastText,
      boxShadow: theme.shadows.z1,
      borderColor: hoverBorderColor,
    },

    '&:focus': {
      background: color.shade,
      color: color.contrastText,
    },

    '&:active': {
      ...getActiveButtonStyles(color, fill),
    },
  };
}

function getPropertiesForDisabled(theme: GrafanaTheme2, variant: ButtonVariant, fill: ButtonFill) {
  const disabledStyles = {
    cursor: 'not-allowed',
    boxShadow: 'none',
    color: theme.colors.text.disabled,
    transition: 'none',
    background: theme.colors.action.disabledBackground,
  };

  if (fill === 'text') {
    return {
      ...disabledStyles,
      background: 'transparent',
      border: `1px solid transparent`,
    };
  }

  if (fill === 'outline') {
    return {
      ...disabledStyles,
      background: 'transparent',
      border: `1px solid ${theme.colors.border.weak}`,
    };
  }

  return {
    ...disabledStyles,
    background: theme.colors.action.disabledBackground,
    border: `1px solid transparent`,
  };
}

export function getPropertiesForVariant(theme: GrafanaTheme2, variant: ButtonVariant, fill: ButtonFill) {
  switch (variant) {
    case 'secondary':
      // The seconday button has some special handling as it's outline border is it's default color border
      return getButtonVariantStyles(theme, theme.colors.secondary, fill);

    case 'destructive':
      return getButtonVariantStyles(theme, theme.colors.error, fill);

    case 'success':
      return getButtonVariantStyles(theme, theme.colors.success, fill);

    case 'primary':
    default:
      return getButtonVariantStyles(theme, theme.colors.primary, fill);
  }
}

/** @deprecated Emotion compat. */
export const clearButtonStyles = (theme: GrafanaTheme2) => {
  return css({
    background: 'transparent',
    color: theme.colors.text.primary,
    border: 'none',
    padding: 0,
  });
};

export const clearLinkButtonStyles = (theme: GrafanaTheme2) => {
  return css({
    background: 'transparent',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
    color: 'inherit',
    height: '100%',
    cursor: 'context-menu',
    '&:hover': {
      background: 'transparent',
      color: 'inherit',
    },
  });
};
