import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationInfoButtonStyles = stylex.create({
  docBox: {
    overflow: 'hidden',
    backgroundColor: grafanaTokens.colors_background_elevated,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_weak,
    boxShadow: grafanaTokens.shadows_z3,
    maxWidth: '600px',
    padding: grafanaTokens.spacing_x1,
    borderRadius: grafanaTokens.shape_radius_default,
    zIndex: grafanaTokens.zIndex_tooltip,
  },
  docBoxHeader: {
    fontSize: grafanaTokens.typography_h5_fontSize,
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
    paddingBottom: grafanaTokens.spacing_x1,
    display: 'flex',
    alignItems: 'center',
  },
  docBoxBody: {
    marginBottom: `calc(-1 * ${grafanaTokens.spacing_x1})`,
    color: grafanaTokens.colors_text_secondary,
  },
});
