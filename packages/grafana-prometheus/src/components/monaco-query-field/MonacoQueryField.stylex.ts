import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const monacoQueryFieldStyles = stylex.create({
  container: {
    borderRadius: grafanaTokens.shape_radius_default,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_medium,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    height: '100%',
    overflow: 'hidden',
  },
  placeholder: {
    '::after': {
      content: 'var(--prom-monaco-placeholder, "")',
      fontFamily: grafanaTokens.typography_fontFamilyMonospace,
      opacity: 0.6,
    },
  },
});
