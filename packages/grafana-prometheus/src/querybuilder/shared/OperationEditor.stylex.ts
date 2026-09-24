import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationEditorStyles = stylex.create({
  card: {
    backgroundColor: grafanaTokens.colors_background_primary,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: grafanaTokens.colors_border_medium,
    cursor: 'grab',
    borderRadius: grafanaTokens.shape_radius_default,
    marginBottom: grafanaTokens.spacing_x1,
    position: 'relative',
    height: '100%',
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'all',
      transitionDuration: '0.5s',
      transitionTimingFunction: 'ease-in',
      transitionDelay: '0s',
    },
  },
  cardHighlight: {
    boxShadow: `0px 0px 4px 0px ${grafanaTokens.colors_primary_border}`,
    borderColor: grafanaTokens.colors_primary_border,
  },
  infoIcon: {
    marginLeft: grafanaTokens.spacing_x0_5,
    color: grafanaTokens.colors_text_secondary,
    ':hover': {
      color: grafanaTokens.colors_text_primary,
    },
  },
  body: {
    marginTop: grafanaTokens.spacing_x1,
    marginRight: grafanaTokens.spacing_x1,
    marginBottom: grafanaTokens.spacing_x0_5,
    marginLeft: grafanaTokens.spacing_x1,
    display: 'table',
  },
  paramRow: {
    display: 'table-row',
    verticalAlign: 'middle',
  },
  paramName: {
    display: 'table-cell',
    paddingTop: 0,
    paddingRight: grafanaTokens.spacing_x1,
    paddingBottom: 0,
    paddingLeft: 0,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    verticalAlign: 'middle',
    height: '32px',
  },
  paramValue: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  restParam: {
    paddingTop: 0,
    paddingRight: grafanaTokens.spacing_x1,
    paddingBottom: grafanaTokens.spacing_x1,
    paddingLeft: grafanaTokens.spacing_x1,
  },
  arrow: {
    position: 'absolute',
    top: '0',
    right: '-18px',
    display: 'flex',
  },
  arrowLine: {
    height: '2px',
    width: '8px',
    backgroundColor: grafanaTokens.colors_border_strong,
    position: 'relative',
    top: '14px',
  },
  arrowArrow: {
    width: 0,
    height: 0,
    borderTopWidth: '5px',
    borderTopStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomWidth: '5px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
    borderLeftWidth: '7px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_border_strong,
    position: 'relative',
    top: '10px',
  },
});
