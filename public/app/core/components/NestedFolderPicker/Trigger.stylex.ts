import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const triggerStyles = stylex.create({
  hasPrefix: {
    paddingLeft: 28,
  },
  clearIcon: {
    color: grafanaTokens.colors_text_secondary,
          cursor: 'pointer',
          ':hover': {
            color: grafanaTokens.colors_text_primary,
          },
          '&:focus:not(:focus-visible)': getMouseFocusStyles(theme),
          '&:focus-visible': getFocusStyles(theme),
  },
});
