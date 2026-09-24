import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../core/stylex/spacing';

export const queryEditorBannerStyles = stylex.create({
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: themeSpacingShorthand(0, 2),
    height: themeSpacing(5),
    borderRadius: grafanaTokens.shape_radius_default,
    flexShrink: 0,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: themeSpacing(1.5),
    minWidth: 0,
  },
  title: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    whiteSpace: 'nowrap',
  },
  description: {
    color: grafanaTokens.colors_text_secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: themeSpacing(1),
    flexShrink: 0,
    marginLeft: themeSpacing(2),
  },
  closeButton: {
    color: grafanaTokens.colors_text_secondary,
    ':hover': {
      color: grafanaTokens.colors_text_primary,
    },
  },
});
