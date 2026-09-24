import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const liveLogsStyles = stylex.create({
  logsRowsLive: {
    label: 'logs-rows-live',
          fontFamily: grafanaTokens.typography_fontFamilyMonospace,
          fontSize: grafanaTokens.typography_bodySmall_fontSize,
          display: 'flex',
          flexFlow: 'column nowrap',
          height: '60vh',
          overflowY: 'scroll',
          ':first-child': {
            marginTop: 'auto !important',
          },
  },
  logsRowFade: {
    label: 'logs-row-fresh',
          color: grafanaTokens.colors_text_primary,
          backgroundColor: tinycolor(grafanaTokens.colors_info_transparent).setAlpha(0.25).toString(),
          [theme.transitions.handleMotion('no-preference', 'reduce')]: {
            animation: `${fade} 1s ease-out 1s 1 normal forwards`,
          },
  },
  logsRowsIndicator: {
    fontSize: grafanaTokens.typography_h6_fontSize,
          paddingTop: themeSpacing(1),
          display: 'flex',
          alignItems: 'center',
  },
  button: {
    marginRight: themeSpacing(1),
  },
  fullWidth: {
    width: '100%',
  },
});
