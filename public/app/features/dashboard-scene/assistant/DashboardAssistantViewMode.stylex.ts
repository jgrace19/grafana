import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

const selectionBorderAnimation = stylex.keyframes({
  '0%': { '--border-angle': '0deg' },
    '100%': { '--border-angle': '360deg' },
});

export const dashboardAssistantViewModeStyles = stylex.create({
});
