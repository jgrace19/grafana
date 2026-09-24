import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const diffValuesStyles = stylex.create({
  root: {
    backgroundColor: grafanaTokens.colors_action_hover,
        borderRadius: grafanaTokens.shape_radius_default,
        color: grafanaTokens.colors_text_primary,
        fontSize: grafanaTokens.typography_body_fontSize,
        margin: themeSpacingShorthand(0, 0.5),
        padding: themeSpacingShorthand(0.25, 0.5),
  },
});
