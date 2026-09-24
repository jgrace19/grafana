import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

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
  header: {
    padding: themeSpacingShorthand(0.5, 1),
        borderBottom: `1px solid ${grafanaTokens.colors_border_weak}`,
        fontWeight: grafanaTokens.typography_fontWeightBold,
        fontSize: grafanaTokens.typography_fontSize,
        color: grafanaTokens.colors_text_primary,
        display: 'flex',
  },
  meta: {
    display: 'flex',
        color: grafanaTokens.colors_text_primary,
        fontWeight: 400,
  },
  controls: {
    display: 'flex',
        '> :last-child': {
          marginLeft: 0,
        },
  },
  body: {
    padding: themeSpacing(1),
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
        fontWeight: 400,
        a: {
          color: grafanaTokens.colors_text_link,
          ':hover': {
            textDecoration: 'underline',
          },
        },
  },
  text: {
    paddingBottom: themeSpacing(1),
  },
  avatar: {
    borderRadius: grafanaTokens.shape_radius_circle,
        width: 16,
        height: 16,
        marginRight: themeSpacing(1),
  },
  alertState: {
    paddingRight: themeSpacing(1),
        fontWeight: grafanaTokens.typography_fontWeightMedium,
  },
});
