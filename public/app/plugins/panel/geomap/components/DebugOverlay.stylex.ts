import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const debugOverlayStyles = stylex.create({
  infoWrap: {
    color: grafanaTokens.colors_text_primary,
        background: tinycolor(theme.components.panel.background).setAlpha(0.7).toString(),
        borderRadius: grafanaTokens.shape_radius_default,
        padding: themeSpacing(1),
  },
});
