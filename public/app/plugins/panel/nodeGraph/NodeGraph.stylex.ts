import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const nodeGraphStyles = stylex.create({
  wrapper: {
    height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
  },
  svg: {
    height: '100%',
        width: '100%',
        overflow: 'visible',
        fontSize: '10px',
        cursor: 'move',
  },
  svgPanning: {
    userSelect: 'none',
  },
  noDataMsg: {
    height: '100%',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        fontSize: grafanaTokens.typography_h4_fontSize,
        color: grafanaTokens.colors_text_secondary,
  },
  mainGroup: {
    willChange: 'transform',
  },
  viewControls: {
    position: 'absolute',
        left: '2px',
        bottom: '3px',
        right: 0,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        pointerEvents: 'none',
  },
  layoutAlgorithm: {
    pointerEvents: 'all',
        position: 'absolute',
        top: '8px',
        right: '8px',
        zIndex: 1,
  },
  legend: {
    background: grafanaTokens.colors_background_secondary,
        boxShadow: grafanaTokens.shadows_z1,
        paddingBottom: '5px',
        marginRight: '10px',
  },
  viewControlsWrapper: {
    marginLeft: 'auto',
  },
  alert: {
    padding: '5px 8px',
        fontSize: '10px',
        textShadow: '0 1px 0 rgba(0, 0, 0, 0.2)',
        borderRadius: grafanaTokens.shape_radius_default,
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        background: grafanaTokens.colors_warning_main,
        color: grafanaTokens.colors_warning_contrastText,
  },
  loadingWrapper: {
    height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
  },
});
