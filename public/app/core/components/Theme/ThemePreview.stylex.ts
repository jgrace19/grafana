import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const themePreviewStyles = stylex.create({
  breadcrumbs: {
    alignItems: 'center',
          color: grafanaTokens.colors_text_primary,
          display: 'flex',
          fontSize: Math.round(grafanaTokens.typography_fontSize / 3),
          gap: themeSpacing(0.25),
          lineHeight: Math.round(grafanaTokens.typography_body_lineHeight / 3),
          paddingLeft: themeSpacing(0.5),
  },
  breadcrumbSeparator: {
    height: themeSpacing(0.75),
          width: themeSpacing(0.75),
  },
  img: {
    height: themeSpacing(1),
          width: themeSpacing(1),
  },
  panel: {
    background: theme.components.panel.background,
          border: `1px solid ${theme.components.panel.borderColor}`,
          borderRadius: grafanaTokens.shape_radius_default,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
  },
  panelHeader: {
    alignItems: 'center',
          color: grafanaTokens.colors_text_primary,
          display: 'flex',
          fontSize: Math.round(grafanaTokens.typography_fontSize / 3),
          height: themeSpacing(2),
          lineHeight: Math.round(grafanaTokens.typography_body_lineHeight / 3),
          padding: themeSpacing(0.5),
  },
  formLabel: {
    color: grafanaTokens.colors_text_primary,
          fontSize: Math.round(grafanaTokens.typography_fontSize / 3),
          lineHeight: Math.round(grafanaTokens.typography_body_lineHeight / 3),
  },
  formInput: {
    background: theme.components.input.background,
          border: `1px solid ${grafanaTokens.colors_border_medium}`,
          borderRadius: grafanaTokens.shape_radius_default,
          height: themeSpacing(1),
          width: themeSpacing(6),
  },
  action: {
    borderRadius: grafanaTokens.shape_radius_default,
          height: themeSpacing(1),
          width: themeSpacing(2.5),
  },
  actionSecondary: {
    background: grafanaTokens.colors_secondary_main,
  },
  actionDanger: {
    background: grafanaTokens.colors_error_main,
  },
  actionPrimary: {
    background: grafanaTokens.colors_primary_main,
  },
});
