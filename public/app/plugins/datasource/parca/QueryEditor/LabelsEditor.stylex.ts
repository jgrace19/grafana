import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

export const labelsEditorStyles = stylex.create({
  queryField: {
    flex: 1,
          // Not exactly sure but without this the editor doe not shrink after resizing (so you can make it bigger but not
          // smaller). At the same time this does not actually make the editor 100px because it has flex 1 so I assume
          // this should sort of act as a flex-basis (but flex-basis does not work for this). So yeah CSS magic.
          width: '100px',
  },
  wrapper: {
    display: 'flex',
          flex: 1,
          border: '1px solid rgba(36, 41, 46, 0.3)',
          borderRadius: grafanaTokens.shape_radius_default,
  },
});
