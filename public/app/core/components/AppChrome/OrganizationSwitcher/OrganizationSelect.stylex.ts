import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const organizationSelectStyles = stylex.create({
  select: {
    borderWidth: 0,
    borderStyle: 'none',
    background: 'none',
    color: grafanaTokens.colors_text_secondary,
    ':hover': {
      color: grafanaTokens.colors_text_primary,
    },
  },
  prefixIconHover: {
    ':hover': {
      color: grafanaTokens.colors_text_primary,
    },
  },
});
