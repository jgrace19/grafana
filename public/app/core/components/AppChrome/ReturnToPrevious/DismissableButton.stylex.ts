import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const dismissableButtonStyles = stylex.create({
  mainDismissableButton: {
    width: '100%',
        ['> span']: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '270px',
          display: 'inline-block',
        },
  },
  buttonGroup: {
    width: 'fit-content',
        backgroundColor: grafanaTokens.colors_background_secondary,
  },
});
