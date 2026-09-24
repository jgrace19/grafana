import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const constantsStyles = stylex.create({
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    padding: themeSpacingShorthand(0, 1),
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    fontSize: grafanaTokens.typography_size_md,
    backgroundColor: grafanaTokens.colors_background_secondary,
    height: grafanaTokens.spacing_x4,
    lineHeight: grafanaTokens.spacing_x4,
    marginRight: themeSpacing(0.5),
    borderRadius: grafanaTokens.shape_radius_default,
    border: 'none',
    width: '220px',
    color: grafanaTokens.colors_text_primary,
  },
  labelTransparent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    padding: themeSpacingShorthand(0, 1),
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    fontSize: grafanaTokens.typography_size_md,
    backgroundColor: 'transparent',
    height: grafanaTokens.spacing_x4,
    lineHeight: grafanaTokens.spacing_x4,
    marginRight: themeSpacing(0.5),
    borderRadius: grafanaTokens.shape_radius_default,
    border: 'none',
    width: '220px',
    color: grafanaTokens.colors_text_primary,
  },
});

export function inlineLabelStyleProps(transparent = false) {
  return stylex.props(transparent ? constantsStyles.labelTransparent : constantsStyles.label);
}
