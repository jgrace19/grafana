import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const kQLPreviewStyles = stylex.create({
  codeBlock: {
    width: '100%',
          display: 'table',
          tableLayout: 'fixed',
  },
  code: {
    marginBottom: '4px',
  },
});
