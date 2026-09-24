import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../stylex/spacing';

export const adCardStyles = stylex.create({
  logo: {
    objectFit: 'contain',
        width: '47px',
        height: '47px',
  },
  header: {
    display: 'flex',
        alignItems: 'flex-start',
        gap: themeSpacing(2),
        paddingTop: themeSpacing(2),
        height: themeSpacing(8),
  },
  contentColumn: {
    flex: 1,
  },
  title: {
    marginBottom: themeSpacing(1),
        fontSize: grafanaTokens.typography_h4_fontSize,
        fontWeight: grafanaTokens.typography_h4_fontWeight,
        color: grafanaTokens.colors_text_primary,
  },
  description: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
        lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
  },
  itemsList: {
    display: 'grid',
        gridTemplateColumns: '1fr',
        gap: themeSpacing(0.5),
        [theme.breakpoints.up('xl')]: {
          gridTemplateColumns: '1fr 1fr',
          gap: themeSpacing(1),
        },
  },
  listItem: {
    display: 'flex',
        alignItems: 'flex-start',
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
        lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
        marginBottom: themeSpacing(0.5),
  },
  icon: {
    marginRight: themeSpacing(1),
        color: grafanaTokens.colors_success_main,
  },
  button: {
    padding: `0 ${themeSpacing(2)}`,
  },
  buttonIcon: {
    marginLeft: themeSpacing(1),
  },
  cardBody: {
    padding: `${themeSpacing(3)} ${themeSpacing(4)} ${themeSpacing(2.25)} ${themeSpacing(4)}`,
        backgroundColor: grafanaTokens.colors_background_secondary,
        borderRadius: grafanaTokens.shape_radius_lg,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        flex: 1,
  },
  preHeader: {
    display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
  },
});
