import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const basicLogsToggleStyles = stylex.create({
  text: {
    fontSize: grafanaTokens.typography_body_fontSize,
          color: grafanaTokens.colors_text_secondary,
          fontSize: '11px',
          a: css({
            color: grafanaTokens.colors_text_link,
            textDecoration: 'underline',
            ':hover': {
              textDecoration: 'none',
            },
  },
});
