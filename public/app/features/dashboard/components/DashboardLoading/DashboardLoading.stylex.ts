import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const dashboardLoadingStyles = stylex.create({
  dashboardLoading: {
    height: '60vh',
          display: 'flex',
          opacity: '0%',
          alignItems: 'center',
          justifyContent: 'center',
                      animation: `${invisibleToVisible} 0s step-end ${slowStartThreshold} 1 normal forwards`,
          },
  },
  dashboardLoadingText: {
    fontSize: grafanaTokens.typography_h4_fontSize,
  },
});
