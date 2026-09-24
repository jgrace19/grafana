import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const navLandingPageCardStyles = stylex.create({
  card: {
    gridTemplateRows: '1fr 0 2fr',
  },
  description: {
    WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        overflow: 'hidden',
  },
  primary: {
    border: `1px solid ${grafanaTokens.colors_primary_borderTransparent}`,
        backgroundColor: grafanaTokens.colors_primary_transparent,
        ':hover': {
          backgroundColor: grafanaTokens.colors_primary_transparent,
          borderColor: grafanaTokens.colors_primary_border,
        },
  },
  secondary: {
    border: `1px solid ${grafanaTokens.colors_secondary_borderTransparent}`,
        backgroundColor: grafanaTokens.colors_secondary_transparent,
        ':hover': {
          backgroundColor: grafanaTokens.colors_secondary_transparent,
          borderColor: grafanaTokens.colors_secondary_border,
        },
  },
  success: {
    border: `1px solid ${grafanaTokens.colors_success_borderTransparent}`,
        backgroundColor: grafanaTokens.colors_success_transparent,
        ':hover': {
          backgroundColor: grafanaTokens.colors_success_transparent,
          borderColor: grafanaTokens.colors_success_border,
        },
  },
  warning: {
    border: `1px solid ${grafanaTokens.colors_warning_borderTransparent}`,
        backgroundColor: grafanaTokens.colors_warning_transparent,
        ':hover': {
          backgroundColor: grafanaTokens.colors_warning_transparent,
          borderColor: grafanaTokens.colors_warning_border,
        },
  },
  error: {
    border: `1px solid ${grafanaTokens.colors_error_borderTransparent}`,
        backgroundColor: grafanaTokens.colors_error_transparent,
        ':hover': {
          backgroundColor: grafanaTokens.colors_error_transparent,
          borderColor: grafanaTokens.colors_error_border,
        },
  },
});
