import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../../../../core/stylex/spacing';

export const fluxQueryEditorStyles = stylex.create({
  editorContainerStyles: {
    height: '200px',
        maxWidth: '100%',
        resize: 'vertical',
        overflow: 'auto',
        backgroundColor: theme.isDark ? grafanaTokens.colors_background_canvas : grafanaTokens.colors_background_primary,
        paddingBottom: themeSpacing(1),
  },
  editorActions: {
    marginTop: '6px',
  },
});
