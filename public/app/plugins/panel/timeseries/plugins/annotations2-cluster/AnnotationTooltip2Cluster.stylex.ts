import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const annotationTooltip2ClusterStyles = stylex.create({
  zebra: {
    backgroundColor: grafanaTokens.colors_background_primary,
        paddingBottom: themeSpacing(1.5),
  },
  annotationWrapper: {
    paddingBottom: themeSpacing(1.5),
  },
  wrapper: {
    zIndex: grafanaTokens.zIndex_tooltip,
        whiteSpace: 'initial',
        borderRadius: grafanaTokens.shape_radius_default,
        background: grafanaTokens.colors_background_elevated,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        boxShadow: grafanaTokens.shadows_z3,
        userSelect: 'text',
        overflow: 'hidden',
  },
  hr: {
    borderTop: `1px solid ${grafanaTokens.colors_border_medium}`,
        width: '100%',
  },
});
