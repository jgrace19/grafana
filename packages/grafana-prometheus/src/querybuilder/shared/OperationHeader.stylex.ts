import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const operationHeaderStyles = stylex.create({
  header: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: grafanaTokens.colors_border_medium,
    paddingTop: grafanaTokens.spacing_x0_5,
    paddingRight: grafanaTokens.spacing_x0_5,
    paddingBottom: grafanaTokens.spacing_x0_5,
    paddingLeft: grafanaTokens.spacing_x1,
    display: 'flex',
    alignItems: 'center',
  },
  operationHeaderButtons: {
    opacity: 1,
  },
  selectWrapper: {
    paddingRight: grafanaTokens.spacing_x2,
  },
});
