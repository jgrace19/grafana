import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const flameGraphTooltipStyles = stylex.create({
  tooltipContainer: {
    overflow: 'hidden',
  },
  tooltipContent: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    width: '100%',
  },
  tooltipName: {
    marginTop: 0,
    wordBreak: 'break-all',
  },
  lastParagraph: {
    marginBottom: 0,
  },
  name: {
    marginBottom: '10px',
  },
  tooltipTable: {
    maxWidth: '400px',
  },
});
