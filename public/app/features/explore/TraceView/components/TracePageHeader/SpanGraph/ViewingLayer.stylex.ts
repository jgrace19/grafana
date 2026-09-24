import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const viewingLayerStyles = stylex.create({
  viewingLayerResetZoom: {
    label: 'ViewingLayerResetZoom',
        display: 'none',
        position: 'absolute',
        right: '1%',
        top: '10%',
        zIndex: 1,
  },
});
