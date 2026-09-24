import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const monacoQueryFieldStyles = stylex.create({
  container: {
    borderRadius: grafanaTokens.shape_radius_default,
          border: `1px solid ${theme.components.input.borderColor}`,
          width: '100%',
          '.monaco-editor .suggest-widget': {
            minWidth: '50%',
          },
          overflow: 'hidden',
  },
  placeholder: {
    '::after': {
            content: `'${placeholder}'`,
            fontFamily: grafanaTokens.typography_fontFamilyMonospace,
            opacity: 0.3,
          },
  },
});
