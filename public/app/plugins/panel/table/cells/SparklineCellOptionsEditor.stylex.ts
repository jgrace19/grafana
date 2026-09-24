import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const sparklineCellOptionsEditorStyles = stylex.create({
  field: {
    width: '100%',
        // @TODO don't show "scheme" option for custom gradient mode.
        // it needs thresholds to work, which are not supported
        // for area chart cell right now
        "[title='Use color scheme to define gradient']": {
          display: 'none',
        },
  },
});
