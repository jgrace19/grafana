import { type GrafanaTheme2, type ThemeSpacingTokens } from '@grafana/data';

/**
 * Bridges the runtime `GrafanaTheme2` object to CSS custom properties that StyleX styles reference through
 * `tokens.stylex.ts`. Variable names mirror the theme path, e.g. `theme.colors.border.weak` →
 * `--grafana-colors-border-weak`. Values are always read from the active theme, so extra themes and theme options
 * (custom radius, grid size, typography, future `flags`) flow through without per-theme StyleX code.
 */

export type ThemeCssVariables = Record<`--grafana-${string}`, string>;

const RICH_COLORS = ['primary', 'secondary', 'info', 'error', 'success', 'warning'] as const;
const RICH_COLOR_FIELDS = [
  'main',
  'shade',
  'text',
  'border',
  'transparent',
  'borderTransparent',
  'contrastText',
] as const;
const TYPOGRAPHY_VARIANTS = ['body', 'bodySmall', 'code'] as const;
const TEXT_COLORS = ['primary', 'secondary', 'disabled', 'link', 'maxContrast'] as const;
const BACKGROUND_COLORS = ['canvas', 'primary', 'secondary', 'elevated'] as const;
const BORDER_COLORS = ['weak', 'medium', 'strong'] as const;
const GRADIENTS = ['brandHorizontal', 'brandVertical'] as const;
const ACTIONS = [
  'hover',
  'selected',
  'selectedBorder',
  'focus',
  'hoverOpacity',
  'disabledText',
  'disabledBackground',
  'disabledOpacity',
] as const;
const RADII = ['default', 'md', 'sm', 'lg', 'pill', 'circle'] as const;
const FONT_SIZES = ['base', 'xs', 'sm', 'md', 'lg'] as const;

export const THEME_SPACING_TOKENS: readonly ThemeSpacingTokens[] = [0, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

const kebab = (value: string) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

/** CSS variable name for a spacing token, e.g. `0.5` → `--grafana-spacing-0-5` (equal to `theme.spacing(0.5)`). */
export function getSpacingVariableName(token: ThemeSpacingTokens): `--grafana-spacing-${string}` {
  return `--grafana-spacing-${String(token).replace('.', '-')}`;
}

export function getThemeCssVariables(theme: GrafanaTheme2): ThemeCssVariables {
  const vars: ThemeCssVariables = {};
  const set = (path: string, value: string | number) => {
    vars[`--grafana-${path}`] = String(value);
  };

  const { colors, typography, shape, shadows, spacing } = theme;

  for (const name of RICH_COLORS) {
    for (const field of RICH_COLOR_FIELDS) {
      set(`colors-${name}-${kebab(field)}`, colors[name][field]);
    }
  }
  for (const key of TEXT_COLORS) {
    set(`colors-text-${kebab(key)}`, colors.text[key]);
  }
  for (const key of BACKGROUND_COLORS) {
    set(`colors-background-${key}`, colors.background[key]);
  }
  for (const key of BORDER_COLORS) {
    set(`colors-border-${key}`, colors.border[key]);
  }
  for (const key of GRADIENTS) {
    set(`colors-gradients-${kebab(key)}`, colors.gradients[key]);
  }
  for (const key of ACTIONS) {
    set(`colors-action-${kebab(key)}`, colors.action[key]);
  }
  set('v1-palette-gray98', theme.v1.palette.gray98);

  set('spacing-grid-size', `${spacing.gridSize}px`);
  for (const token of THEME_SPACING_TOKENS) {
    vars[getSpacingVariableName(token)] = spacing(token);
  }

  for (const key of RADII) {
    set(`shape-radius-${key}`, shape.radius[key]);
  }

  set('typography-font-family', typography.fontFamily);
  set('typography-font-family-monospace', typography.fontFamilyMonospace);
  set('typography-font-size', `${typography.fontSize}px`);
  set('typography-font-weight-light', typography.fontWeightLight);
  set('typography-font-weight-regular', typography.fontWeightRegular);
  set('typography-font-weight-medium', typography.fontWeightMedium);
  set('typography-font-weight-bold', typography.fontWeightBold);
  for (const key of FONT_SIZES) {
    set(`typography-size-${key}`, typography.size[key]);
  }
  for (const variant of TYPOGRAPHY_VARIANTS) {
    const { fontSize, fontWeight, lineHeight, fontFamily, letterSpacing = 'normal' } = typography[variant];
    const prefix = `typography-${kebab(variant)}`;
    set(`${prefix}-font-size`, fontSize);
    set(`${prefix}-font-weight`, fontWeight);
    set(`${prefix}-line-height`, lineHeight);
    set(`${prefix}-font-family`, fontFamily);
    set(`${prefix}-letter-spacing`, letterSpacing);
  }

  set('shadows-z1', shadows.z1);
  set('shadows-z2', shadows.z2);
  set('shadows-z3', shadows.z3);

  return vars;
}

export function getThemeCssText(theme: GrafanaTheme2, selector = 'body'): string {
  const declarations = Object.entries(getThemeCssVariables(theme))
    .map(([name, value]) => `${name}:${value};`)
    .join('');
  return `${selector}{${declarations}}`;
}
