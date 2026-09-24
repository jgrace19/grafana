import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const livePanelStyles = stylex.create({
  statusWrap: {
    margin: 'auto',
        position: 'absolute',
        top: 0,
        right: 0,
        background: theme.components.panel.background,
        padding: '10px',
        zIndex: grafanaTokens.zIndex_modal,
  },
});
