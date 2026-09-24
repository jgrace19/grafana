import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const textPanelStyles = stylex.create({
  codeEditorContainer: {
    '.monaco-editor .margin, .monaco-editor-background': {
          backgroundColor: grafanaTokens.colors_background_primary,
        },
  },
  containStrict: {
    contain: 'strict',
        height: '100%',
        display: 'flex',
  },
  markdownHtml: {
    height: '100%',
  },
});
