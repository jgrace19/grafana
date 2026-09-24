import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationsEditorRowStyles = stylex.create({
  rootWithOperations: {
    paddingTop: grafanaTokens.spacing_x1,
    paddingRight: grafanaTokens.spacing_x1,
    paddingBottom: grafanaTokens.spacing_x1,
    paddingLeft: grafanaTokens.spacing_x1,
    backgroundColor: grafanaTokens.colors_background_secondary,
    borderRadius: grafanaTokens.shape_radius_default,
  },
  rootEmpty: {
    paddingTop: grafanaTokens.spacing_x1,
    paddingRight: grafanaTokens.spacing_x1,
    paddingBottom: grafanaTokens.spacing_x0,
    paddingLeft: grafanaTokens.spacing_x1,
    backgroundColor: grafanaTokens.colors_background_secondary,
    borderRadius: grafanaTokens.shape_radius_default,
  },
});
