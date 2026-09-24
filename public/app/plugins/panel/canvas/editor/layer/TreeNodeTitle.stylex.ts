import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../core/stylex/spacing';

export const treeNodeTitleStyles = stylex.create({
  actionButtonsWrapper: {
    display: 'flex',
        alignItems: 'flex-end',
  },
  actionIcon: {
    color: grafanaTokens.colors_text_secondary,
        cursor: 'pointer',
        ':hover': {
          color: grafanaTokens.colors_text_primary,
        },
  },
  textWrapper: {
    display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        overflow: 'hidden',
        marginRight: themeSpacing(1),
  },
  layerName: {
    fontWeight: grafanaTokens.typography_fontWeightMedium,
        color: grafanaTokens.colors_primary_text,
        cursor: 'pointer',
        overflow: 'hidden',
        marginLeft: themeSpacing(0.5),
  },
});
