import { type ThemeSpacingTokens } from '@grafana/data';

import { grafanaTokens } from '@grafana/ui/unstable';

const SPACING_BY_TOKEN: Record<ThemeSpacingTokens, string> = {
  0: grafanaTokens.spacing_x0,
  0.25: grafanaTokens.spacing_x0_25,
  0.5: grafanaTokens.spacing_x0_5,
  1: grafanaTokens.spacing_x1,
  1.5: grafanaTokens.spacing_x1_5,
  2: grafanaTokens.spacing_x2,
  2.5: grafanaTokens.spacing_x2_5,
  3: grafanaTokens.spacing_x3,
  4: grafanaTokens.spacing_x4,
  5: grafanaTokens.spacing_x5,
  6: grafanaTokens.spacing_x6,
  8: grafanaTokens.spacing_x8,
  10: grafanaTokens.spacing_x10,
};

/** Maps theme.spacing(n) grid multiples and spacing tokens to CSS values / token vars. */
export function themeSpacing(value: number | string): string {
  if (typeof value === 'string') {
    return value;
  }
  if (Object.prototype.hasOwnProperty.call(SPACING_BY_TOKEN, value)) {
    return SPACING_BY_TOKEN[value as ThemeSpacingTokens];
  }
  return `${value * 8}px`;
}

/** Shorthand for 2-4 theme.spacing arguments. */
export function themeSpacingShorthand(...values: Array<number | string>): string {
  return values.map((v) => themeSpacing(v)).join(' ');
}
