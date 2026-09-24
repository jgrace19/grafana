import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const stringsStyles = stylex.create({
  textInput: {
    marginBottom: '5px',
          ':hover': {
            border: `1px solid ${theme.components.input.borderHover}`,
          },
  },
  trashIcon: {
    color: grafanaTokens.colors_text_secondary,
          cursor: 'pointer',
    
          ':hover': {
            color: grafanaTokens.colors_text_primary,
          },
  },
});
