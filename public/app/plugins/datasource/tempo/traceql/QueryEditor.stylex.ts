import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const queryEditorStyles = stylex.create({
  optionsContainer: {
    marginTop: '10px',
  },
  copyContainer: {
    backgroundColor: grafanaTokens.colors_background_secondary,
        padding: themeSpacingShorthand(0.5, 1),
        fontSize: grafanaTokens.typography_body_fontSize,
  },
});
