import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const canvasTooltipStyles = stylex.create({
  wrapper: {
    marginTop: '20px',
        background: grafanaTokens.colors_background_primary,
  },
  tooltipWrapper: {
    top: 0,
        left: 0,
        whiteSpace: 'pre',
        borderRadius: grafanaTokens.shape_radius_default,
        position: 'fixed',
        background: grafanaTokens.colors_background_primary,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z2,
        userSelect: 'text',
        padding: 0,
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  pinned: {
    boxShadow: grafanaTokens.shadows_z3,
  },
});
