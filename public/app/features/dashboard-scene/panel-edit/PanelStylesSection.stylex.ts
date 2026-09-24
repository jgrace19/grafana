import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const panelStylesSectionStyles = stylex.create({
  thresholdBadge: {
    position: 'absolute',
        top: themeSpacing(1),
        right: themeSpacing(0.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: themeSpacing(2.5),
        height: themeSpacing(2.5),
        borderRadius: grafanaTokens.shape_radius_circle,
        background: grafanaTokens.colors_background_canvas,
        border: `1px solid ${grafanaTokens.colors_border_medium}`,
        color: grafanaTokens.colors_text_secondary,
        cursor: 'default',
        zIndex: 1,
  },
});
