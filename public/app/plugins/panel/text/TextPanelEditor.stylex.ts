import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const textPanelEditorStyles = stylex.create({
  editorBox: {
    margin: themeSpacingShorthand(0.5, 0),
        width: '100%',
  },
});
