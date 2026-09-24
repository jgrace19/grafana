import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const annotationTooltip2Styles = stylex.create({
  wrapper: {
    zIndex: grafanaTokens.zIndex_tooltip,
        whiteSpace: 'initial',
        borderRadius: grafanaTokens.shape_radius_default,
        background: grafanaTokens.colors_background_elevated,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z3,
        userSelect: 'text',
  },
});
