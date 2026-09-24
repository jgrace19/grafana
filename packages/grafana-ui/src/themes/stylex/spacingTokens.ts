import { type ThemeSpacingTokens } from '@grafana/data';

import { grafanaTokens } from './tokens.generated.stylex';

const spacingByToken: Record<ThemeSpacingTokens, string> = {
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

export function spacingToken(value: ThemeSpacingTokens): string {
  return spacingByToken[value];
}
