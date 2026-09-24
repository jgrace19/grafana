import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const setBackgroundStyles = stylex.create({
  portalWrapper: {
    width: '315px',
        height: '445px',
        transform: `translate(${anchorPoint.x}px, ${anchorPoint.y - 200}px)`,
  },
});
