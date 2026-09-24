import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const useContextMenuStyles = stylex.create({
  label: {
    lineHeight: 1.25,
          color: grafanaTokens.colors_text_disabled,
          fontSize: grafanaTokens.typography_size_sm,
          fontWeight: grafanaTokens.typography_fontWeightMedium,
          paddingRight: themeSpacing(1),
  },
  value: {
    fontSize: grafanaTokens.typography_size_sm,
          fontWeight: grafanaTokens.typography_fontWeightMedium,
          color: grafanaTokens.colors_text_primary,
  },
});
