import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardSchemaEditorStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        gap: themeSpacing(1),
  },
  formatToggleContainer: {
    flex: '0 0 auto',
  },
  formatLabel: {
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
        color: grafanaTokens.colors_text_secondary,
  },
  editorContainer: {
    flex: '1 1 0',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
  },
  codeEditorContainer: {
    flex: '1 1 0',
        minHeight: 0,
        overflow: 'visible',
  },
  loadingContainer: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        color: grafanaTokens.colors_text_secondary,
  },
});
