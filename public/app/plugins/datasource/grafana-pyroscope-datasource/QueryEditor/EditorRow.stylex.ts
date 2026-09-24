import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const editorRowStyles = stylex.create({
  root: {
    padding: themeSpacing(1),
          backgroundColor: grafanaTokens.colors_background_secondary,
          borderRadius: grafanaTokens.shape_radius_default,
  },
});
