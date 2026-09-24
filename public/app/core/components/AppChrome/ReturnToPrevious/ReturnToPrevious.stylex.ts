import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const returnToPreviousStyles = stylex.create({
  returnToPrevious: {
    label: 'return-to-previous',
        display: 'flex',
        justifyContent: 'center',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: grafanaTokens.zIndex_tooltip,
        position: 'fixed',
        bottom: theme.spacing.x4,
        boxShadow: grafanaTokens.shadows_z3,
  },
});
