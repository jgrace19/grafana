import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const badgeSharedStyles = stylex.create({
  badgeColor: {
    background: grafanaTokens.colors_background_primary,
    borderColor: grafanaTokens.colors_border_strong,
    color: grafanaTokens.colors_text_secondary,
  },
});
