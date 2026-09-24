import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const traceQLEditorStyles = stylex.create({
  queryField: {
    borderRadius: grafanaTokens.shape_radius_default,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_medium,
    flex: 1,
  },
  placeholder: {
    '::after': {
      content: 'var(--traceql-editor-placeholder, "")',
      fontFamily: grafanaTokens.typography_fontFamilyMonospace,
      opacity: 0.3,
    },
  },
});
