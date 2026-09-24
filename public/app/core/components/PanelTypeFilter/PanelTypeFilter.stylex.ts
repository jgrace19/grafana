import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../stylex/spacing';

export const panelTypeFilterStyles = stylex.create({
  container: {
    label: 'container',
          position: 'relative',
          minWidth: '180px',
          flexGrow: 1,
  },
  clear: {
    label: 'clear',
          fontSize: themeSpacing(1.5),
          position: 'absolute',
          top: themeSpacing(-4.5),
          right: 0,
  },
});
