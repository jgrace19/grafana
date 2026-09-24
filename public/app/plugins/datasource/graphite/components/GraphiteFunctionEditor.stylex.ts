import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const graphiteFunctionEditorStyles = stylex.create({
  container: {
    backgroundColor: grafanaTokens.colors_background_secondary,
        borderRadius: grafanaTokens.shape_radius_default,
        marginRight: themeSpacing(0.5),
        padding: `0 ${themeSpacing(1)}`,
        height: `${theme.v1.spacing.formInputHeight}px`,
  },
  error: {
    border: `1px solid ${grafanaTokens.colors_error_main}`,
  },
  label: {
    padding: 0,
        margin: 0,
  },
  button: {
    padding: themeSpacing(0.5),
  },
});
