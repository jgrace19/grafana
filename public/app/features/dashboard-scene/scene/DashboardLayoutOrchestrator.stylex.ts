import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardLayoutOrchestratorStyles = stylex.create({
  preview: {
    position: 'fixed',
    background: grafanaTokens.colors_background_primary,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: grafanaTokens.colors_primary_main,
    borderRadius: grafanaTokens.shape_radius_default,
    boxShadow: grafanaTokens.shadows_z3,
    pointerEvents: 'none',
    zIndex: grafanaTokens.zIndex_tooltip,
    overflow: 'hidden',
    opacity: 0.9,
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    height: themeSpacing(4),
    padding: themeSpacingShorthand(0.5, 1, 0, 1.5),
    color: grafanaTokens.colors_text_primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: grafanaTokens.typography_h6_fontSize,
    lineHeight: grafanaTokens.typography_h6_lineHeight,
    fontWeight: grafanaTokens.typography_h6_fontWeight,
  },
});
