import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const flameGraphMetadataStyles = stylex.create({
  metadataPill: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: grafanaTokens.colors_background_secondary,
    borderRadius: grafanaTokens.shape_radius_lg,
    paddingTop: grafanaTokens.spacing_x0_5,
    paddingBottom: grafanaTokens.spacing_x0_5,
    paddingLeft: grafanaTokens.spacing_x1,
    paddingRight: grafanaTokens.spacing_x1,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    lineHeight: grafanaTokens.typography_bodySmall_lineHeight,
    color: grafanaTokens.colors_text_secondary,
  },
  pillCloseButton: {
    verticalAlign: 'text-bottom',
    marginTop: grafanaTokens.spacing_x0,
    marginBottom: grafanaTokens.spacing_x0,
    marginLeft: grafanaTokens.spacing_x0_5,
    marginRight: grafanaTokens.spacing_x0_5,
  },
  metadata: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    marginBottom: '8px',
  },
  metadataPillName: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginLeft: grafanaTokens.spacing_x0_5,
  },
});
