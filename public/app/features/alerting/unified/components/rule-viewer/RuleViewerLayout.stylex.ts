import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const ruleViewerLayoutStyles = stylex.create({
  content: {
    height: '100%',
  },
  wrapper: {
    background: grafanaTokens.colors_background_primary,
    border: `1px solid ${grafanaTokens.colors_border_weak}`,
    borderRadius: grafanaTokens.shape_radius_default,
  },
});
