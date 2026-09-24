import { type ThemeSpacingTokens } from '@grafana/data';

import { spacingToken } from './spacingTokens';

/** CSS custom property reference for a flattened Grafana theme path (e.g. `colors.text.primary`). */
export function cssVar(themePath: string): string {
  const kebab = themePath.replace(/\./g, '-');
  return `var(--grafana-${kebab})`;
}

/** Shorthand for theme.spacing() using generated spacing tokens. */
export function cssVarSpacing(...tokens: ThemeSpacingTokens[]): string {
  return tokens.map((token) => spacingToken(token)).join(' ');
}
