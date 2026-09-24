import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const nestedQueryStyles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: grafanaTokens.spacing_x0_5,
  },
  header: {
    paddingTop: grafanaTokens.spacing_x0_5,
    paddingRight: grafanaTokens.spacing_x0_5,
    paddingBottom: grafanaTokens.spacing_x0_5,
    paddingLeft: grafanaTokens.spacing_x1,
    gap: grafanaTokens.spacing_x1,
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    whiteSpace: 'nowrap',
  },
  body: {
    paddingLeft: grafanaTokens.spacing_x2,
  },
  vectorMatchInput: {
    marginLeft: -1,
  },
  vectorMatchWrapper: {
    display: 'flex',
  },
});
