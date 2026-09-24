import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../../core/stylex/spacing';

export const markersLegendStyles = stylex.create({
  infoWrap: {
    display: 'flex',
        flexDirection: 'column',
        background: grafanaTokens.colors_background_secondary,
        // eslint-disable-next-line @grafana/no-border-radius-literal
        borderRadius: '1px',
        padding: themeSpacing(1),
        borderBottom: `2px solid ${grafanaTokens.colors_border_strong}`,
        minWidth: '150px',
  },
  layerName: {
    fontSize: grafanaTokens.typography_body_fontSize,
  },
  layerBody: {
    paddingLeft: '10px',
  },
  legend: {
    lineHeight: '18px',
        display: 'flex',
        flexDirection: 'column',
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        padding: '5px 10px 0',
        i: {
          width: '15px',
          height: '15px',
          float: 'left',
          marginRight: '8px',
          opacity: 0.7,
          borderRadius: grafanaTokens.shape_radius_circle,
        },
  },
  legendItem: {
    whiteSpace: 'nowrap',
  },
  fixedColorContainer: {
    minWidth: '80px',
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        paddingTop: '5px',
  },
  legendSymbol: {
    height: '18px',
        width: '18px',
        margin: 'auto',
  },
  colorScaleWrapper: {
    minWidth: '200px',
        fontSize: grafanaTokens.typography_bodySmall_fontSize,
        paddingTop: '10px',
  },
});
