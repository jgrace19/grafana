import * as stylex from '@stylexjs/stylex';

import { grafanaTokens } from '@grafana/ui/unstable';

import { themeSpacing, themeSpacingShorthand } from '../../../core/stylex/spacing';

export const dashboardLinksControlsStyles = stylex.create({
  linksContainer: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: themeSpacing(1),
          marginRight: themeSpacing(1),
          marginBottom: themeSpacing(1),
          flexWrap: 'wrap',
          // Match variable/annotation alignment in the controls row
          alignSelf: 'flex-start',
  },
});
