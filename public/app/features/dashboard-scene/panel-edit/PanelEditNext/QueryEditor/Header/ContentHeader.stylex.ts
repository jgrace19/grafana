import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const contentHeaderStyles = stylex.create({
  dataSourcePickerWrapper: {
    // Target the Input component inside the picker
        input: {
          border: 'none',
          backgroundColor: grafanaTokens.colors_background_secondary,
        },
        // Remove borders from all nested divs
        '& > div, & div': {
          border: 'none',
        },
  },
});
