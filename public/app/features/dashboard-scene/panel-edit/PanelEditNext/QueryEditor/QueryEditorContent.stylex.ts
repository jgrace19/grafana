import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryEditorContentStyles = stylex.create({
  container: {
    display: 'flex',
        flexDirection: 'column',
        backgroundColor: grafanaTokens.colors_background_primary,
        border: `1px solid ${grafanaTokens.colors_border_weak}`,
        borderRadius: grafanaTokens.shape_radius_default,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
  },
});
