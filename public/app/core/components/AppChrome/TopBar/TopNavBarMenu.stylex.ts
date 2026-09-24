import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../stylex/spacing';

export const topNavBarMenuStyles = stylex.create({
  header: {
    fontSize: grafanaTokens.typography_h5_fontSize,
          fontWeight: grafanaTokens.typography_h5_fontWeight,
          padding: themeSpacingShorthand(0.5, 1),
          whiteSpace: 'nowrap',
  },
  subTitle: {
    color: grafanaTokens.colors_text_secondary,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
  },
});
