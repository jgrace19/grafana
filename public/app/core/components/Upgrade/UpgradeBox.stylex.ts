import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const upgradeBoxStyles = stylex.create({
  box: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: grafanaTokens.shape_radius_default,
    background: grafanaTokens.colors_success_transparent,
    padding: themeSpacing(2),
    color: grafanaTokens.colors_success_text,
    fontSize: grafanaTokens.typography_body_fontSize,
    textAlign: 'left',
    lineHeight: '16px',
    margin: themeSpacingShorthand(0, 'auto', 3, 'auto'),
    maxWidth: '1440px',
    width: '100%',
  },
  boxSmall: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  text: {
    margin: 0,
  },
  button: {
    backgroundColor: grafanaTokens.colors_success_main,
    fontWeight: grafanaTokens.typography_fontWeightLight,
    color: 'white',
    ':hover': {
      backgroundColor: grafanaTokens.colors_success_main,
    },
    ':focus-visible': {
      boxShadow: 'none',
      color: grafanaTokens.colors_text_primary,
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: grafanaTokens.colors_primary_main,
    },
  },
  icon: {
    margin: themeSpacingShorthand(0.5, 1, 0.5, 0.5),
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  content: {
    width: '45%',
    marginRight: themeSpacing(4),
  },
  media: {
    width: '55%',
  },
  mediaImage: {
    width: '100%',
  },
  title: {
    color: grafanaTokens.colors_text_maxContrast,
  },
  description: {
    color: grafanaTokens.colors_text_primary,
    fontWeight: grafanaTokens.typography_fontWeightLight,
  },
  list: {
    listStyle: 'none',
    margin: themeSpacingShorthand(4, 0, 2, 0),
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    color: grafanaTokens.colors_text_primary,
    padding: themeSpacingShorthand(1, 0),
  },
  listIcon: {
    color: grafanaTokens.colors_success_main,
    marginRight: themeSpacing(1),
  },
  link: {
    marginLeft: themeSpacing(2),
  },
  caption: {
    fontWeight: grafanaTokens.typography_fontWeightLight,
    margin: themeSpacingShorthand(1, 0, 0),
  },
  containerVertical: {
    overflow: 'auto',
    height: '100%',
  },
  mediaVertical: {
    width: '100%',
    marginTop: themeSpacing(2),
  },
});
