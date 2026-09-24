import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardCodePaneStyles = stylex.create({
  wrapper: {
    display: 'flex',
        flexDirection: 'column',
        flex: '1 1 0',
        height: '100%',
  },
  content: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        padding: themeSpacing(1),
        gap: themeSpacing(1),
  },
  editorContainer: {
    flex: 1,
        minHeight: 0,
  },
  codeEditor: {
    height: '100%',
  },
  toolbar: {
    display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: '0 0 auto',
  },
  modal: {
    width: '90vw',
        height: '90vh',
        maxWidth: '90vw',
  },
  modalContent: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
  },
  modalEditorWrapper: {
    display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        gap: themeSpacing(1),
  },
});
