import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const sidebarFooterStyles = stylex.create({
  footer: {
    marginTop: 'auto',
          background: themeColors.sidebarFooterBackground,
          padding: themeSpacingShorthand(0, 1.5),
          height: FOOTER_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: `0 0 ${grafanaTokens.shape_radius_default} ${grafanaTokens.shape_radius_default}`,
          borderTop: `1px solid ${grafanaTokens.colors_border_weak}`,
  },
  icon: {
    color: grafanaTokens.colors_text_secondary,
  },
});
