import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const feedbackLinkStyles = stylex.create({
  link: {
    color: grafanaTokens.colors_text_secondary,
    fontSize: grafanaTokens.typography_bodySmall_fontSize,
    ':hover': {
      color: grafanaTokens.colors_text_link,
    },
    marginTop: '-25px',
    marginRight: 0,
    marginBottom: '30px',
    marginLeft: 0,
  },
});
