import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const queryOptionGroupStyles = stylex.create({
  collapse: {
    backgroundColor: 'unset',
    borderWidth: 'unset',
    borderStyle: 'unset',
    marginBottom: 0,
  },
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    flexGrow: 1,
    overflow: 'hidden',
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_fontWeightMedium,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  description: {
    color: grafanaTokens.colors_text_secondary,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    fontWeight: grafanaTokens.typography_bodySmall_fontWeight,
    paddingLeft: grafanaTokens.spacing_x2,
    gap: grafanaTokens.spacing_x2,
    display: 'flex',
  },
  body: {
    display: 'flex',
    gap: grafanaTokens.spacing_x2,
    flexWrap: 'wrap',
  },
});
