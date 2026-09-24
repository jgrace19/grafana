import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const newsStyles = stylex.create({
  container: {
    height: '100%',
  },
  item: {
    display: 'flex',
        padding: themeSpacing(1),
        position: 'relative',
        marginBottom: themeSpacing(0.5),
        marginRight: themeSpacing(1),
        borderBottom: `2px solid ${grafanaTokens.colors_border_weak}`,
        background: grafanaTokens.colors_background_primary,
        flexDirection: 'column',
        flexShrink: 0,
  },
  itemWide: {
    flexDirection: 'row',
  },
  body: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
  },
  socialImage: {
    display: 'flex',
        alignItems: 'center',
        marginBottom: themeSpacing(1),
        '> img': {
          width: '100%',
          borderRadius: `${grafanaTokens.shape_radius_default} ${grafanaTokens.shape_radius_default} 0 0`,
        },
  },
  socialImageWide: {
    marginRight: themeSpacing(2),
        marginBottom: 0,
        '> img': {
          width: '250px',
          borderRadius: grafanaTokens.shape_radius_default,
        },
  },
  title: {
    fontSize: grafanaTokens.typography_h3_fontSize,
        fontSize: '16px',
        marginBottom: themeSpacing(0.5),
  },
  content: {
    p: {
          marginBottom: themeSpacing(0.5),
          color: grafanaTokens.colors_text_primary,
        },
  },
  date: {
    marginBottom: themeSpacing(0.5),
        fontWeight: 500,
        borderRadius: `0 0 0 ${grafanaTokens.shape_radius_default}`,
        color: grafanaTokens.colors_text_secondary,
  },
});
