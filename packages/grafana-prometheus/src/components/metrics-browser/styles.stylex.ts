import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { stylexClassNames } from '../../stylex/classNames';

export const metricsBrowserStyles = stylex.create({
  wrapper: {
    backgroundColor: grafanaTokens.colors_background_secondary,
    padding: grafanaTokens.spacing_x1,
    width: '100%',
    borderRadius: grafanaTokens.shape_radius_default,
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  section: {
    position: 'relative',
  },
  sectionSpaced: {
    position: 'relative',
    marginTop: grafanaTokens.spacing_x2,
    marginBottom: grafanaTokens.spacing_x2,
  },
  valueListWrapper: {
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: grafanaTokens.colors_border_medium,
    marginTop: grafanaTokens.spacing_x1,
    marginBottom: grafanaTokens.spacing_x1,
    paddingTop: grafanaTokens.spacing_x1,
    paddingRight: 0,
    paddingBottom: grafanaTokens.spacing_x1,
    paddingLeft: grafanaTokens.spacing_x1,
  },
  valueList: {
    marginRight: grafanaTokens.spacing_x1,
    resize: 'horizontal',
  },
  list: {
    marginTop: grafanaTokens.spacing_x1,
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '200px',
    overflow: 'auto',
    alignContent: 'flex-start',
  },
  valueListArea: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: grafanaTokens.spacing_x1,
  },
  valueTitle: {
    marginLeft: `calc(-1 * ${grafanaTokens.spacing_x0_5})`,
    marginBottom: grafanaTokens.spacing_x1,
  },
  selector: {
    fontFamily: grafanaTokens.typography_fontFamilyMonospace,
    marginBottom: grafanaTokens.spacing_x1,
  },
  status: {
    padding: grafanaTokens.spacing_x0_5,
    color: grafanaTokens.colors_text_secondary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    right: 0,
    textAlign: 'right',
    opacity: 0,
    '@media (prefers-reduced-motion: no-preference)': {
      transitionProperty: 'opacity',
      transitionDuration: '100ms',
      transitionTimingFunction: 'linear',
    },
  },
  statusShowing: {
    opacity: 1,
  },
  error: {
    color: grafanaTokens.colors_error_main,
  },
  validationStatus: {
    padding: grafanaTokens.spacing_x0_5,
    marginBottom: grafanaTokens.spacing_x1,
    color: grafanaTokens.colors_text_maxContrast,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export const metricsBrowserClassNames = stylexClassNames(metricsBrowserStyles);
