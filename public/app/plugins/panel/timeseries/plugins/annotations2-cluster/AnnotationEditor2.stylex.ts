import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationEditor2Styles = stylex.create({
  editor: {
    background: grafanaTokens.colors_background_elevated,
          border: `1px solid ${grafanaTokens.colors_border_weak}`,
          borderRadius: grafanaTokens.shape_radius_default,
          boxShadow: grafanaTokens.shadows_z3,
          userSelect: 'text',
          width: '460px',
  },
  content: {
    padding: themeSpacing(1),
  },
  header: {
    borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
          padding: themeSpacingShorthand(0.5, 1),
          fontWeight: grafanaTokens.typography_fontWeightBold,
          fontSize: grafanaTokens.typography_fontSize,
          color: grafanaTokens.colors_text_primary,
  },
  footer: {
    borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
          padding: themeSpacingShorthand(1, 1),
  },
  textarea: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
