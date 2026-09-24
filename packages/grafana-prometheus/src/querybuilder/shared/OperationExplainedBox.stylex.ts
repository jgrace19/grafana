import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationExplainedBoxStyles = stylex.create({
  box: {
    backgroundColor: grafanaTokens.colors_background_secondary,
    padding: grafanaTokens.spacing_x1,
    borderRadius: grafanaTokens.shape_radius_default,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: grafanaTokens.spacing_x1_5,
  },
  stepNumber: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    backgroundColor: grafanaTokens.colors_secondary_main,
    minWidth: grafanaTokens.spacing_x2_5,
    minHeight: grafanaTokens.spacing_x2_5,
    borderRadius: grafanaTokens.shape_radius_circle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
  },
  body: {
    color: grafanaTokens.colors_text_secondary,
  },
});
