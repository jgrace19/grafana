import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const nestedFolderPickerStyles = stylex.create({
  button: {
    maxWidth: '100%',
  },
  error: {
    marginBottom: 0,
  },
  tableWrapper: {
    boxShadow: grafanaTokens.shadows_z3,
          position: 'relative',
          zIndex: grafanaTokens.zIndex_portal,
  },
  loader: {
    position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: grafanaTokens.zIndex_portal + 1,
          overflow: 'hidden', // loading bar overflows its container, so we need to clip it
  },
  search: {
    input: {
            cursor: 'default',
          },
  },
});
